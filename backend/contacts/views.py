import json
import re
import secrets
import uuid

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.db.models import Count, Q
from django.http import HttpRequest, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.utils.http import url_has_allowed_host_and_scheme
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods, require_POST

from .models import ContactRequest

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$")


def _authorised(request: HttpRequest) -> bool:
    token = request.headers.get("X-Api-Token", "")
    return secrets.compare_digest(token, settings.CONTACTS_API_TOKEN)


def _serialise(c: ContactRequest) -> dict:
    return {
        "id": str(c.id),
        "receivedAt": c.received_at.isoformat(),
        "name": c.name,
        "email": c.email,
        "company": c.company,
        "topic": c.topic,
        "message": c.message,
        "consent": c.consent,
        "locale": c.locale,
        "status": c.status,
    }


def _validate(data: dict) -> dict:
    """Same rules as the website (web/src/lib/contact.ts): the backend never trusts its caller."""
    errors = {}
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    message = str(data.get("message", "")).strip()
    if len(name) < 2:
        errors["name"] = "nameShort" if name else "nameRequired"
    if not email:
        errors["email"] = "emailRequired"
    elif not EMAIL_RE.match(email):
        errors["email"] = "emailInvalid"
    if data.get("topic") not in ContactRequest.Topic.values:
        errors["topic"] = "topicRequired"
    if len(message) < 10:
        errors["message"] = "messageShort" if message else "messageRequired"
    if data.get("consent") is not True:
        errors["consent"] = "consentRequired"
    return errors


@csrf_exempt  # machine-to-machine endpoint, protected by the shared token instead
@require_http_methods(["GET", "POST"])
def api_contacts(request: HttpRequest):
    """GET: list every request. POST: store a new one (called by the Next.js API)."""
    if not _authorised(request):
        return JsonResponse({"ok": False, "error": "unauthorised"}, status=401)

    if request.method == "GET":
        return JsonResponse({"ok": True, "contacts": [_serialise(c) for c in ContactRequest.objects.all()]})

    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"ok": False, "error": "invalid_json"}, status=400)

    errors = _validate(data)
    if errors:
        return JsonResponse({"ok": False, "error": "validation", "errors": errors}, status=422)

    try:
        pk = uuid.UUID(str(data.get("id")))
    except ValueError:
        pk = uuid.uuid4()

    contact, _created = ContactRequest.objects.update_or_create(
        id=pk,
        defaults={
            "received_at": parse_datetime(str(data.get("receivedAt", ""))) or timezone.now(),
            "name": data["name"].strip()[:120],
            "email": data["email"].strip()[:200],
            "company": str(data.get("company", "")).strip()[:120],
            "topic": data["topic"],
            "message": data["message"].strip()[:3000],
            "consent": True,
            "locale": "en" if data.get("locale") == "en" else "it",
        },
    )
    return JsonResponse({"ok": True, "id": str(contact.id)}, status=201)


@login_required
def dashboard(request: HttpRequest):
    """Human-friendly list of everyone who filled in the form."""
    contacts = ContactRequest.objects.all()

    q = request.GET.get("q", "").strip()
    topic = request.GET.get("topic", "")
    status = request.GET.get("status", "")
    if q:
        contacts = contacts.filter(
            Q(name__icontains=q) | Q(email__icontains=q) | Q(company__icontains=q) | Q(message__icontains=q)
        )
    if topic in ContactRequest.Topic.values:
        contacts = contacts.filter(topic=topic)
    if status in ContactRequest.Status.values:
        contacts = contacts.filter(status=status)

    totals = ContactRequest.objects.aggregate(
        all=Count("id"),
        new=Count("id", filter=Q(status=ContactRequest.Status.NEW)),
        handled=Count("id", filter=Q(status=ContactRequest.Status.HANDLED)),
    )

    return render(
        request,
        "contacts/dashboard.html",
        {
            "contacts": contacts,
            "totals": totals,
            "q": q,
            "topic": topic,
            "status": status,
            "topics": ContactRequest.Topic.choices,
            "statuses": ContactRequest.Status.choices,
        },
    )


@login_required
@require_POST
def toggle_status(request: HttpRequest, pk):
    contact = get_object_or_404(ContactRequest, pk=pk)
    contact.status = (
        ContactRequest.Status.NEW if contact.status == ContactRequest.Status.HANDLED else ContactRequest.Status.HANDLED
    )
    contact.save(update_fields=["status"])
    nxt = request.POST.get("next", "")
    if url_has_allowed_host_and_scheme(nxt, allowed_hosts={request.get_host()}):
        return redirect(nxt)
    return redirect("dashboard")
