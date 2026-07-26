from rest_framework import generics
from .models import Document
from .serializers import DocumentSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
class DocumentUploadView(generics.CreateAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer


class DocumentListView(generics.ListAPIView):
    queryset = Document.objects.all().order_by("-uploaded_at")
    serializer_class = DocumentSerializer


class DocumentDeleteView(generics.DestroyAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
class DashboardStatsView(APIView):

    def get(self, request):

        total_pdfs = Document.objects.count()

        return Response({
            "pdfs": total_pdfs,
            "chats": total_pdfs,
            "notes": total_pdfs,
            "quizzes": total_pdfs,
            "flashcards": total_pdfs,
        })