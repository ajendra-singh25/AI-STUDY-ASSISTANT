
from .llm import client, MODEL_NAME


def generate_flashcards(text):
    if not text or not text.strip():
        raise ValueError("No study material provided.")

    prompt = f"""
Create exactly 10 professional flashcards from the study material.

Rules:
- Each card must have one question and one answer.
- Keep answers concise and easy to revise.
- Use only the supplied study material.
- Format clearly using Markdown.

Study Material:
{text}
"""

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=1200,
    )

    result = response.choices[0].message.content

    if not result:
        raise ValueError("The AI returned an empty response.")

    return result
