from django.urls import path

from . import views

urlpatterns = [
    path("", views.dashboard, name="dashboard"),
    path("contacts/<uuid:pk>/toggle/", views.toggle_status, name="toggle_status"),
    path("api/contacts/", views.api_contacts, name="api_contacts"),
]
