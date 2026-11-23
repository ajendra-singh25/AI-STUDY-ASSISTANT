
import logging

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from documents.models import Document

from .llm import client, MODEL_NAME
from .note_generator import generate_notes
from .quiz_generator import generate_quiz
from .flashcard_generator import generate_flashcards
from .pdf_processor import extract_text_from_pdf

logger = logging.getLogger(__name__)


# --------------------------------------------------
# COMMON HELPERS
# --------------------------------------------------

def get_user_document(request, pk):
    """
    Return a document only if it belongs to the logged-in user.
    """
    return Document.objects.get(
        id=pk,
        user=request.user,
    )


def extract_document_text(document):
    """
    Extract readable text from an uploaded PDF.
    """
    if not document.pdf:
        raise ValueError("No PDF file is associated with this document.")

    return extract_text_from_pdf(document.pdf.path)


# --------------------------------------------------
# EXTRACT PDF TEXT AND CREATE VECTOR STORE
# --------------------------------------------------

class ExtractPDFTextView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        from .rag import create_vector_store

        try:
            document = get_user_document(request, pk)

            text = extract_document_text(document)

            if not text or not text.strip():
                return Response(
                    {"error": "No readable text found in this PDF."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            chunks = create_vector_store(text, document.id)

            return Response({
                "title": document.title,
                "chunks_created": chunks,
                "message": "Vector Database Created Successfully",
            })

        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        except FileNotFoundError:
            logger.exception(
                "PDF file not found for document %s",
                pk,
            )
            return Response(
                {"error": "PDF file not found. Please upload it again."},
                status=status.HTTP_404_NOT_FOUND,
            )

        except ValueError as error:
            return Response(
                {"error": str(error)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception:
            logger.exception(
                "PDF extraction or vector-store creation failed for document %s",
                pk,
            )
            return Response(
                {"error": "PDF processing failed. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# --------------------------------------------------
# SEARCH PDF USING RAG
# --------------------------------------------------

class SearchPDFView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        from .rag import search_pdf

        question = request.query_params.get("q", "").strip()

        if not question:
            return Response(
                {"error": "Please provide a question using ?q="},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            document = get_user_document(request, pk)

            docs = search_pdf(
                document.id,
                question,
                k=4,
            )

            if not docs:
                return Response({
                    "pdf": document.title,
                    "question": question,
                    "answer": (
                        "I couldn't find the answer in the uploaded PDF."
                    ),
                    "sources": [],
                })

            context = "\n\n".join(
                doc.page_content for doc in docs
            )

            prompt = f"""
You are a professional AI Study Assistant.

Use ONLY the provided PDF context to answer the question.

Instructions:
- Give a complete and accurate answer.
- Explain concepts in simple language.
- Use bullet points whenever appropriate.
- Explain mathematical steps clearly.
- Do not invent information.
- If the answer is missing from the context, reply exactly:
"I couldn't find the answer in the uploaded PDF."

PDF CONTEXT:
{context}

USER QUESTION:
{question}
"""

            response = client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an accurate academic assistant. "
                            "Answer only from the supplied PDF context."
                        ),
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
                temperature=0.2,
                max_completion_tokens=800,
            )

            if not response.choices:
                raise RuntimeError("The AI returned no response.")

            answer = response.choices[0].message.content

            if not answer or not answer.strip():
                raise RuntimeError("The AI returned an empty answer.")

            return Response({
                "pdf": document.title,
                "question": question,
                "answer": answer.strip(),
                "sources": [
                    doc.page_content for doc in docs
                ],
            })

        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        except FileNotFoundError:
            logger.exception(
                "Vector store missing for PDF %s",
                pk,
            )
            return Response(
                {
                    "error": (
                        "PDF vector database not found. "
                        "Process the PDF again."
                    ),
                    "code": "VECTOR_STORE_NOT_FOUND",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        except Exception:
            logger.exception("AI search failed for PDF %s", pk)
            return Response(
                {"error": "AI search failed. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# --------------------------------------------------
# GENERATE STUDY NOTES
# --------------------------------------------------

class GenerateNotesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            document = get_user_document(request, pk)

            text = extract_document_text(document)

            if not text or not text.strip():
                return Response(
                    {"error": "No readable text found in this PDF."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            notes = generate_notes(text)

            if not notes or not notes.strip():
                return Response(
                    {"error": "Note generation returned an empty result."},
                    status=status.HTTP_502_BAD_GATEWAY,
                )

            return Response({
                "title": document.title,
                "notes": notes.strip(),
            })

        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        except FileNotFoundError:
            logger.exception(
                "PDF file not found for notes, document %s",
                pk,
            )
            return Response(
                {"error": "PDF file not found. Please upload it again."},
                status=status.HTTP_404_NOT_FOUND,
            )

        except ValueError as error:
            return Response(
                {"error": str(error)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception:
            logger.exception("Note generation failed for PDF %s", pk)
            return Response(
                {"error": "Note generation failed. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# --------------------------------------------------
# GENERATE QUIZ
# --------------------------------------------------

class GenerateQuizView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            document = get_user_document(request, pk)

            text = extract_document_text(document)

            if not text or not text.strip():
                return Response(
                    {"error": "No readable text found in this PDF."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            quiz = generate_quiz(text[:12000])

            if not quiz or not quiz.strip():
                return Response(
                    {"error": "Quiz generation returned an empty result."},
                    status=status.HTTP_502_BAD_GATEWAY,
                )

            return Response({
                "title": document.title,
                "quiz": quiz.strip(),
            })

        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        except FileNotFoundError:
            logger.exception(
                "PDF file not found for quiz, document %s",
                pk,
            )
            return Response(
                {"error": "PDF file not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        except ValueError as error:
            return Response(
                {"error": str(error)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception:
            logger.exception("Quiz generation failed for PDF %s", pk)
            return Response(
                {"error": "Quiz generation failed. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# --------------------------------------------------
# GENERATE FLASHCARDS
# --------------------------------------------------

class GenerateFlashcardsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            document = get_user_document(request, pk)

            text = extract_document_text(document)

            if not text or not text.strip():
                return Response(
                    {"error": "No readable text found in this PDF."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            flashcards = generate_flashcards(text[:12000])

            if not flashcards or not flashcards.strip():
                return Response(
                    {
                        "error": (
                            "Flashcard generation returned an empty result."
                        )
                    },
                    status=status.HTTP_502_BAD_GATEWAY,
                )

            return Response({
                "title": document.title,
                "flashcards": flashcards.strip(),
            })

        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        except FileNotFoundError:
            logger.exception(
                "PDF file not found for flashcards, document %s",
                pk,
            )
            return Response(
                {"error": "PDF file not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        except ValueError as error:
            return Response(
                {"error": str(error)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception:
            logger.exception(
                "Flashcard generation failed for PDF %s",
                pk,
            )
            return Response(
                {
                    "error": (
                        "Flashcard generation failed. Please try again."
                    )
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# --------------------------------------------------
# DASHBOARD STATISTICS
# --------------------------------------------------

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total_pdfs = Document.objects.filter(
            user=request.user
        ).count()

        return Response({
            "pdfs": total_pdfs,
            "notes": 0,
            "quizzes": 0,
            "flashcards": 0,
            "chats": 0,
        })
