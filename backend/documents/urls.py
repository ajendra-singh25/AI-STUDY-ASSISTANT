
from django.urls import path

from .views import (
    DocumentUploadView,
    DocumentListView,
    DocumentDeleteView,
    DashboardStatsView,
)

urlpatterns = [
    path(
        "upload/",
        DocumentUploadView.as_view(),
        name="document-upload",
    ),
    path(
        "list/",
        DocumentListView.as_view(),
        name="document-list",
    ),
    path(
        "delete/<int:pk>/",
        DocumentDeleteView.as_view(),
        name="document-delete",
    ),
    path(
        "dashboard/",
        DashboardStatsView.as_view(),
        name="documents-dashboard",
    ),
]
