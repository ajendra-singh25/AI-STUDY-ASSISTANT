
from rest_framework.views import APIView
from rest_framework.response import Response
from .note_generator import generate_notes
from documents.models import Document
from .quiz_generator import generate_quiz
from .flashcard_generator import generate_flashcards
from .pdf_processor import extract_text_from_pdf
from django.http import JsonResponse
from .prompts import NOTES_PROMPT


class ExtractPDFTextView(APIView):

    def get(self, request, pk):
        from .rag import create_vector_store

        document = Document.objects.get(id=pk)

        text = extract_text_from_pdf(document.pdf.path)

        print("=" * 50)
        print("PDF PATH:", document.pdf.path)
        print("TEXT LENGTH:", len(text))
        print("FIRST 500 CHARACTERS:")
        print(text[:500])
        print("=" * 50)

        chunks = create_vector_store(text, document.id)

        return Response({
            "title": document.title,
            "chunks_created": chunks,
            "message": "Vector Database Created Successfully"
        })


class SearchPDFView(APIView):

    def get(self, request, pk):
        from .rag import search_pdf
        from .llm import client

        question = request.GET.get("q", "").strip()

        if not question:
            return Response(
                {"error": "Please provide a question using ?q="},
                status=400
            )

        try:

            document = Document.objects.get(id=pk)

            docs = search_pdf(
                document.id,
                question
            )

            if not docs:
                return Response({
                    "pdf": document.title,
                    "question": question,
                    "answer": "I couldn't find the answer in the uploaded PDF.",
                    "sources": []
                })

            context = "\n\n".join(
                doc.page_content
                for doc in docs
            )

            prompt = f"""
You are a professional AI Study Assistant.

Use ONLY the provided context to answer.

Instructions:
- Give a complete answer.
- Explain in simple language.
- Use bullet points whenever appropriate.
- If there are mathematical steps, solve them step-by-step.
- Do not invent information.
- If the answer is missing, reply exactly:
"I couldn't find the answer in the uploaded PDF."

======================
PDF CONTEXT
======================

{context}

======================
USER QUESTION
======================

{question}
"""

            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.2,
                max_tokens=800,
            )

            return Response({
                "pdf": document.title,
                "question": question,
                "answer": response.choices[0].message.content,
                "sources": [
                    doc.page_content
                    for doc in docs
                ]
            })

        except Document.DoesNotExist:

            return Response(
                {"error": "Document not found."},
                status=404
            )

        except FileNotFoundError as e:

            return Response(
                {
                    "error": str(e),
                    "code": "VECTOR_STORE_NOT_FOUND"
                },
                status=404
            )

        except Exception as e:

            print(
                f"AI SEARCH ERROR for PDF {pk}: {repr(e)}"
            )

            return Response(
                {
                    "error": "AI search failed.",
                    "details": str(e)
                },
                status=500
            )
class GenerateNotesView(APIView):

    def get(self, request, pk):
        from .rag import search_pdf
        from .llm import client

        document = Document.objects.get(id=pk)

        docs = search_pdf(
            document.id,
            "Generate complete study notes from this document."
        )

        context = "\n\n".join(
            [doc.page_content for doc in docs]
        )

        prompt = f"""
You are an expert study assistant.

Using ONLY the following document, generate professional study notes.

Instructions:

- Use headings.
- Use bullet points.
- Explain concepts simply.
- Highlight important definitions.
- Mention formulas if available.
- Include examples whenever possible.
- Format beautifully in Markdown.
- Do not invent information.

DOCUMENT

{context}
"""

        response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {
            "role": "user",
            "content": prompt
        }
    ]
)

        return Response({
            "title": document.title,
            "notes": response.choices[0].message.content
        })
class GenerateQuizView(APIView):

    def get(self, request, pk):

        document = Document.objects.get(id=pk)

        text = extract_text_from_pdf(document.pdf.path)

        quiz = generate_quiz(text[:12000])

        return Response({
            "title": document.title,
            "quiz": quiz
        })
class GenerateFlashcardsView(APIView):

    def get(self, request, pk):

        document = Document.objects.get(id=pk)

        text = extract_text_from_pdf(document.pdf.path)

        flashcards = generate_flashcards(text[:12000])

        return Response({
            "title": document.title,
            "flashcards": flashcards
        })
class DashboardStatsView(APIView):

    def get(self, request):

        total_pdfs = Document.objects.count()

        data = {
            "pdfs": total_pdfs,
            "notes": total_pdfs,
            "quizzes": total_pdfs,
            "flashcards": total_pdfs,
            "chats": total_pdfs,
        }

        return Response(data)