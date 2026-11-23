
from .llm import client, MODEL_NAME


def generate_flashcards(text):
    """
    Generate exactly 10 flashcards from supplied study material.
    """

    if not isinstance(text, str) or not text.strip():
        raise ValueError("Study material is empty or invalid.")

    prompt = f"""
Create exactly 10 professional flashcards from the
following study material.

Rules:
- Generate exactly 10 flashcards.
- Each card must have one question and one answer.
- Keep questions clear and answers concise.
- Make answers easy to understand and revise.
- Use only the supplied study material.
- Do not invent facts.
- Avoid duplicate or repetitive cards.
- Cover different important concepts.
- Format clearly using Markdown.

Use this format:

## Flashcard 1
**Question:** [Question]

**Answer:** [Answer]

Study Material:

{text}
"""

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert academic flashcard generator. "
                    "Create accurate, concise study flashcards using "
                    "only the supplied material."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0.3,
        max_completion_tokens=2000,
    )

    if not response.choices:
        raise RuntimeError("Groq returned no flashcard response.")

    result = response.choices[0].message.content

    if not result or not result.strip():
        raise RuntimeError("Groq returned an empty flashcard response.")

    return result.strip()
