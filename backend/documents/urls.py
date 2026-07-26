from django.urls import path
from .views import (
    DocumentUploadView,
    DocumentListView,
    DocumentDeleteView,
    DashboardStatsView,
)

urlpatterns = [
    path("upload/", DocumentUploadView.as_view()),
    path("list/", DocumentListView.as_view()),
    path("delete/<int:pk>/", DocumentDeleteView.as_view()),
    path("dashboard/", DashboardStatsView.as_view()),

    
]