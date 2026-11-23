
import logging
import threading

from django.db import close_old_connections, transaction

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

        document = serializer.save(user=request.user)

        # Start processing only after the database transaction commits.
        def start_processing():
            thread = threading.Thread(
                target=self.process_document,
                args=(document.id,),
                daemon=True,
            )
            thread.start()

        transaction.on_commit(start_processing)

        document_data = self.get_serializer(document).data

        return Response(
            {
                "message": (
                    "PDF uploaded successfully. "
                    "Document processing has started."
                ),
                "id": document.id,
                "title": document.title,
                "document": document_data,
            },
            status=status.HTTP_201_CREATED,
        )

    @staticmethod
    def process_document(document_id):
        # Ensure this thread uses fresh database connections.
        close_old_connections()

        try:
            from ai.pdf_processor import extract_text_from_pdf
            from ai.rag import create_vector_store

            document = Document.objects.get(id=document_id)

            if not document.pdf:
                logger.error(
                    "Document %s has no PDF file.",
                    document_id,
                )
                return

            logger.info(
                "Starting PDF processing for document %s.",
                document_id,
            )

            # This requires a storage backend that provides local file paths.
            try:
                pdf_path = document.pdf.path
            except (NotImplementedError, ValueError) as error:
                logger.exception(
                    "Local PDF path unavailable for document %s.",
                    document_id,
                )
                return

            text = extract_text_from_pdf(pdf_path)

            if not text or not text.strip():
                logger.error(
                    "No readable text found in document %s.",
                    document_id,
                )
                return

            chunks = create_vector_store(
                text,
                document.id,
            )

            logger.info(
                "Document %s successfully processed into %s chunks.",
                document_id,
                chunks,
            )

        except Document.DoesNotExist:
            logger.warning(
                "Document %s was deleted before processing.",
                document_id,
            )

        except Exception:
            logger.exception(
                "PDF processing failed for document %s.",
                document_id,
            )

        finally:
            close_old_connections()


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
