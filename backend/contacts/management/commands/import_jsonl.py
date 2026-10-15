import json
import uuid
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from django.utils.dateparse import parse_datetime

from contacts.models import ContactRequest

DEFAULT = Path(__file__).resolve().parents[4] / "web" / "data" / "contact-requests.jsonl"


class Command(BaseCommand):
    help = "Import the requests the website saved to web/data/contact-requests.jsonl (idempotent)."

    def add_arguments(self, parser):
        parser.add_argument("path", nargs="?", default=str(DEFAULT))

    def handle(self, *args, **opts):
        path = Path(opts["path"])
        if not path.exists():
            raise CommandError(f"File not found: {path}")

        created = 0
        for line in path.read_text(encoding="utf8").splitlines():
            if not line.strip():
                continue
            row = json.loads(line)
            if "id" not in row:  # very first rows were written before ids existed
                row["id"] = str(uuid.uuid5(uuid.NAMESPACE_URL, row.get("receivedAt", "") + row.get("email", "")))
            _, was_created = ContactRequest.objects.get_or_create(
                id=row["id"],
                defaults={
                    "received_at": parse_datetime(row.get("receivedAt", "")) or timezone.now(),
                    "name": row.get("name", ""),
                    "email": row.get("email", ""),
                    "company": row.get("company", ""),
                    "topic": row.get("topic", ""),
                    "message": row.get("message", ""),
                    "consent": bool(row.get("consent")),
                    "locale": row.get("locale", "it"),
                },
            )
            created += was_created
        self.stdout.write(self.style.SUCCESS(f"Imported {created} new request(s)."))
