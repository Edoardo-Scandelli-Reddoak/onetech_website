from django.contrib import admin
from django.urls import include, path

admin.site.site_header = "One Tech · Backoffice"
admin.site.site_title = "One Tech"
admin.site.index_title = "Gestione"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("contacts.urls")),
]
