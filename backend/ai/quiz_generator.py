
from .llm import client, MODEL_NAME


def generate_quiz(text):
    """
    Generate exactly 10 multiple-choice questions
    from the supplied study material.
    """

    if not isinstance(text, str) or not text.strip():
        raise ValueError("Study material is empty or invalid.")

    prompt = f"""
Create a professional multiple-choice quiz from the
following study material.

Rules:
- Generate exactly 10 MCQs.
- Each question must have exactly four options.
- Use options A, B, C and D.
- Clearly mention the correct answer after every question.
- Keep questions relevant to the supplied material.
- Do not invent facts.
- Avoid repeated questions.
- Use clean Markdown formatting.
- Provide a short explanation for each correct answer.

Study Material:

{text}
"""

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert academic quiz generator. "
                    "Create accurate questions strictly from "
                    "the supplied study material."
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
        raise RuntimeError("Groq returned no quiz response.")

    result = response.choices[0].message.content

    if not result or not result.strip():
        raise RuntimeError("Groq returned an empty quiz.")

    return result.strip()
