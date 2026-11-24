
import logging

from django.utils import timezone

from rest_framework import generics, permissions, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from .models import Document
from .serializers import DocumentSerializer

logger = logging.getLogger(__name__)


class DocumentUploadView(generics.CreateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        document = serializer.save(
            user=request.user,
            processing_status="pending",
            processing_error="",
            chunks_created=0,
            processed_at=None,
        )

        self.process_document(document)

        document.refresh_from_db()

        return Response(
            {
                "message": (
                    "PDF uploaded successfully. "
                    + (
                        "Processing completed successfully."
                        if document.processing_status == "ready"
                        else (
                            "Processing failed: "
                            + document.processing_error
                            if document.processing_status == "failed"
                            else "Processing is still pending."
                        )
                    )
                ),
                "id": document.id,
                "title": document.title,
                "document": self.get_serializer(document).data,
            },
            status=status.HTTP_201_CREATED,
        )

    @staticmethod
    def process_document(document):
        try:
            from ai.pdf_processor import extract_text_from_pdf
            from ai.rag import create_vector_store

            document.processing_status = "processing"
            document.processing_error = ""
            document.save(
                update_fields=[
                    "processing_status",
                    "processing_error",
                ]
            )

            logger.info(
                "Starting processing for document %s",
                document.id,
            )

            if not document.pdf:
                raise ValueError("No PDF file is attached.")

            document.pdf.open("rb")

            try:
               text = extract_text_from_pdf(document.pdf.file)
            finally:
               document.pdf.close()

            if not text or not text.strip():
                raise ValueError(
                    "No readable text was found in the PDF."
                )

            chunks = create_vector_store(
                text,
                document.id,
            )

            if isinstance(chunks, int):
                chunks_created = chunks
            elif chunks is not None:
                chunks_created = len(chunks)
            else:
                chunks_created = 0

            document.processing_status = "ready"
            document.processing_error = ""
            document.chunks_created = chunks_created
            document.processed_at = timezone.now()

            document.save(
                update_fields=[
                    "processing_status",
                    "processing_error",
                    "chunks_created",
                    "processed_at",
                ]
            )

            logger.info(
                "Document %s processed successfully. Chunks: %s",
                document.id,
                chunks_created,
            )

        except Exception as error:
            logger.exception(
                "Processing failed for document %s",
                document.id,
            )

            document.processing_status = "failed"
            document.processing_error = str(error)[:2000]
            document.processed_at = timezone.now()

            document.save(
                update_fields=[
                    "processing_status",
                    "processing_error",
                    "processed_at",
                ]
            )


class DocumentListView(generics.ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Document.objects.filter(
            user=self.request.user
        ).order_by("-uploaded_at")


class DocumentDeleteView(generics.DestroyAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Document.objects.filter(
            user=self.request.user
        )


class DashboardStatsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total_pdfs = Document.objects.filter(
            user=request.user
        ).count()

        return Response(
            {
                "pdfs": total_pdfs,
                "notes": 0,
                "quizzes": 0,
                "flashcards": 0,
                "chats": 0,
            }
        )
