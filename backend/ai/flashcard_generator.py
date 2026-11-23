
from .llm import client


def generate_flashcards(text):

    if not text or not text.strip():
        raise ValueError("Study material is empty.")

    prompt = f"""
Create exactly 10 professional study flashcards.

Rules:
- Each flashcard must have one question and one answer.
- Keep questions short and clear.
- Answers should be simple and easy to revise.
- Use only the supplied study material.
- Do not invent information.
- Format using Markdown.
- Number each flashcard.

Content:

{text}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=1200,
    )

    result = response.choices[0].message.content

    if not result:
        raise ValueError("Groq returned empty flashcards.")

    return result.strip()
