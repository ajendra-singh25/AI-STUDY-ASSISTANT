
from .llm import client, MODEL_NAME


def generate_flashcards(text):

    if not text or not text.strip():
        raise ValueError("Study material is empty.")

    prompt = f"""
Create exactly 10 professional flashcards from the following study material.

Rules:
- Each card must have one question and one answer.
- Keep answers concise and easy to revise.
- Use only the supplied study material.
- Do not invent facts.
- Format clearly using Markdown.

Study Material:

{text}
"""

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=1500,
    )

    result = response.choices[0].message.content

    if not result:
        raise ValueError("Groq returned an empty flashcard response.")

    return result.strip()
