
from .llm import client, MODEL_NAME


def generate_quiz(text):

    if not text or not text.strip():
        raise ValueError("Study material is empty.")

    prompt = f"""
Create a professional multiple-choice quiz from the following study material.

Rules:
- Generate exactly 10 MCQs.
- Each question must have exactly four options.
- Clearly mention the correct answer after every question.
- Keep questions relevant to the supplied material.
- Do not invent facts.
- Use clean Markdown formatting.

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
        raise ValueError("Groq returned an empty quiz.")

    return result.strip()
