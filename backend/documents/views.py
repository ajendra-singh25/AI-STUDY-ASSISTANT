
import logging
import threading

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

        # Process the uploaded PDF in the background.
        thread = threading.Thread(
            target=self.process_document,
            args=(document.id,),
            daemon=True,
        )
        thread.start()

        document_data = DocumentSerializer(
            document,
            context={"request": request},
        ).data

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
                "Processing PDF document %s.",
                document_id,
            )

            text = extract_text_from_pdf(document.pdf.path)

            if not text or not text.strip():
                logger.error(
                    "No extractable text found in document %s.",
                    document_id,
                )
                return

            chunks = create_vector_store(
                text,
                document.id,
            )

            logger.info(
                "Document %s processed into %s chunks.",
                document_id,
                chunks,
            )

        except Document.DoesNotExist:
            logger.exception(
                "Document %s does not exist.",
                document_id,
            )

        except Exception:
            logger.exception(
                "Background PDF processing failed for document %s.",
                document_id,
            )


class DocumentListView(generics.ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Document.objects.filter(
            user=self.request.user
        ).order_by("-id")


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
                "notes": total_pdfs,
                "quizzes": total_pdfs,
                "flashcards": total_pdfs,
                "chats": total_pdfs,
            }
        )
