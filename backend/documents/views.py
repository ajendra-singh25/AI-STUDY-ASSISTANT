import threading

from rest_framework import generics, permissions, status
from rest_framework.response import Response

from .models import Document
from .serializers import DocumentSerializer


class DocumentUploadView(generics.CreateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        document = serializer.save(user=request.user)

        # Process PDF after upload in a background thread
        thread = threading.Thread(
            target=self.process_document,
            args=(document.id,),
            daemon=True
        )
        thread.start()

        return Response(
            {
                "message": "PDF uploaded successfully. Processing started.",
                "document": serializer.data
            },
            status=status.HTTP_201_CREATED
        )

    def process_document(self, document_id):
        try:
            from ai.pdf_processor import extract_text_from_pdf
            from ai.rag import create_vector_store

            document = Document.objects.get(id=document_id)

            if not document.pdf:
                print(f"PDF {document_id}: PDF file not found")
                return

            pdf_path = document.pdf.path

            print(f"PDF {document_id}: Processing started")
            print(f"PDF PATH: {pdf_path}")

            text = extract_text_from_pdf(pdf_path)

            if not text or not text.strip():
                print(f"PDF {document_id}: No text extracted")
                return

            print(
                f"PDF {document_id}: "
                f"Extracted {len(text)} characters"
            )

            chunks = create_vector_store(
                text,
                document.id
            )

            print(
                f"PDF {document_id}: "
                f"Vector store created successfully "
                f"with {chunks} chunks"
            )

        except Document.DoesNotExist:
            print(f"PDF {document_id}: Document does not exist")

        except Exception as e:
            print(
                f"PDF {document_id}: "
                f"Background processing failed: {e}"
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

        return Response({
            "pdfs": total_pdfs,
            "notes": total_pdfs,
            "quizzes": total_pdfs,
            "flashcards": total_pdfs,
            "chats": total_pdfs,
        })