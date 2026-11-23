
from django.urls import path

from .views import (
    ExtractPDFTextView,
    SearchPDFView,
    GenerateNotesView,
    GenerateQuizView,
    GenerateFlashcardsView,
    DashboardStatsView,
)

urlpatterns = [
    path(
        "extract/<int:pk>/",
        ExtractPDFTextView.as_view(),
        name="extract-pdf",
    ),
    path(
        "search/<int:pk>/",
        SearchPDFView.as_view(),
        name="search-pdf",
    ),
    path(
        "notes/<int:pk>/",
        GenerateNotesView.as_view(),
        name="generate-notes",
    ),
    path(
        "quiz/<int:pk>/",
        GenerateQuizView.as_view(),
        name="generate-quiz",
    ),
    path(
        "flashcards/<int:pk>/",
        GenerateFlashcardsView.as_view(),
        name="generate-flashcards",
    ),
    path(
        "dashboard/",
        DashboardStatsView.as_view(),
        name="dashboard-stats",
    ),
]
