from django.contrib import admin

from .models import ContactRequest


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = ("received_at", "name", "email", "company", "topic", "locale", "status")
    list_filter = ("status", "topic", "locale")
    search_fields = ("name", "email", "company", "message")
    list_editable = ("status",)
    date_hierarchy = "received_at"
    readonly_fields = ("id", "received_at", "consent", "locale")
