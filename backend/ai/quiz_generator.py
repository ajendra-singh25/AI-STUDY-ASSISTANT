
from .llm import client, MODEL_NAME


def generate_quiz(text):
    """
    Generate exactly 10 multiple-choice questions
    in a format compatible with the Quiz.jsx parser.
    """

    if not isinstance(text, str) or not text.strip():
        raise ValueError("Study material is empty or invalid.")

    study_material = text[:10000]

    prompt = f"""
Create exactly 10 multiple-choice questions using ONLY
the study material provided below.

STRICT FORMATTING RULES:
1. Number questions from 1 to 10.
2. Every question must have exactly four options.
3. Use exactly A., B., C. and D. for options.
4. Write the correct answer as a single letter (A, B, C or D).
5. Include a short explanation after each answer.
6. Do not use Markdown tables.
7. Do not use code blocks.
8. Do not add introductory or concluding text.
9. Do not repeat questions.
10. Do not invent facts outside the study material.

FOLLOW THIS EXACT FORMAT:

1. Write the first question here?
A. First option
B. Second option
C. Third option
D. Fourth option
Correct Answer: B
Explanation: Brief explanation of why B is correct.

2. Write the second question here?
A. First option
B. Second option
C. Third option
D. Fourth option
Correct Answer: A
Explanation: Brief explanation.

Continue in exactly the same format until question 10.

STUDY MATERIAL:
{study_material}
"""

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert academic quiz generator. "
                    "Follow the requested question format exactly. "
                    "Generate accurate questions strictly from "
                    "the supplied study material."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0.2,
        max_completion_tokens=2500,
    )

    if not response.choices:
        raise RuntimeError("Groq returned no quiz response.")

    result = response.choices[0].message.content

    if not result or not result.strip():
        raise RuntimeError("Groq returned an empty quiz.")

    return result.strip()
