from django.urls import path
from .views import ExtractPDFTextView, SearchPDFView, GenerateNotesView,GenerateQuizView,GenerateFlashcardsView,DashboardStatsView

urlpatterns = [
    path("extract/<int:pk>/", ExtractPDFTextView.as_view()),
    path("search/<int:pk>/", SearchPDFView.as_view()),
    path("notes/<int:pk>/", GenerateNotesView.as_view()),
    path("quiz/<int:pk>/",GenerateQuizView.as_view(),),
    path(
    "flashcards/<int:pk>/",
    GenerateFlashcardsView.as_view(),
),
path("dashboard/", DashboardStatsView.as_view()),
path(
    "notes/<int:pk>/",
    GenerateNotesView.as_view()
),
]