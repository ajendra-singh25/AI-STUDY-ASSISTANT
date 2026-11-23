
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from . import views


urlpatterns = [
    # Django Admin
    path("admin/", admin.site.urls),

    # API Endpoints
    path("api/accounts/", include("accounts.urls")),
    path("api/documents/", include("documents.urls")),
    path("api/ai/", include("ai.urls")),

    # Homepage / Health Check
    path("", views.home, name="home"),
]


# Serve uploaded media files during local development only.
# Production media should be served through persistent storage.
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )
