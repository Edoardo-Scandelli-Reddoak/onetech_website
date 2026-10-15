import uuid

from django.db import models


class ContactRequest(models.Model):
    """A request sent from the contact form on the One Tech website."""

    class Topic(models.TextChoices):
        DEMO = "demo", "Demo di un prodotto"
        CUSTOM = "custom", "Progetto su misura"
        PARTNERSHIP = "partnership", "Partnership"
        OTHER = "other", "Altro"

    class Status(models.TextChoices):
        NEW = "new", "Da gestire"
        HANDLED = "handled", "Gestito"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    received_at = models.DateTimeField("ricevuta il")
    name = models.CharField("nome e cognome", max_length=120)
    email = models.EmailField("email", max_length=200)
    company = models.CharField("azienda", max_length=120, blank=True)
    topic = models.CharField("argomento", max_length=20, choices=Topic.choices)
    message = models.TextField("messaggio", max_length=3000)
    consent = models.BooleanField("consenso privacy", default=False)
    locale = models.CharField("lingua", max_length=2, default="it")
    status = models.CharField("stato", max_length=10, choices=Status.choices, default=Status.NEW)

    class Meta:
        ordering = ["-received_at"]
        verbose_name = "richiesta di contatto"
        verbose_name_plural = "richieste di contatto"

    def __str__(self):
        return f"{self.name} <{self.email}>"
