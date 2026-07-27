
from rest_framework.views import APIView
from rest_framework.response import Response
from .note_generator import generate_notes
from documents.models import Document
from .quiz_generator import generate_quiz
from .flashcard_generator import generate_flashcards
from .pdf_processor import extract_text_from_pdf
from django.http import JsonResponse
from .prompts import NOTES_PROMPT
from .rag import search_pdf

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

        question = request.GET.get("q")

        if not question:
            return Response({"error": "Please provide a question using ?q="}, status=400)

        docs = search_pdf(pk, question)

        context = "\n\n".join([doc.page_content for doc in docs])

        prompt = f"""
You are a professional AI Study Assistant.

Use ONLY the provided context to answer.

Instructions:
- Give a complete answer.
- Explain in simple language.
- Use bullet points whenever appropriate.
- If there are mathematical steps, solve them step-by-step.
- If the context contains a question, solve it completely.
- Do not invent information.
- If the answer is missing, reply exactly:
"I couldn't find the answer in the uploaded PDF."

======================
PDF Context
======================

{context}

======================
User Question
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
            ]
        )

        document = Document.objects.get(id=pk)

        return Response({
            "pdf": document.title,
            "question": question,
            "answer": response.choices[0].message.content,
            "sources": [doc.page_content for doc in docs]
        })
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