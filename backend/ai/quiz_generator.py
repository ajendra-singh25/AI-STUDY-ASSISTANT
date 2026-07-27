def generate_quiz(text):

    from .llm import client

    prompt = f"""
Create a professional multiple-choice quiz from the following study material.

Rules:
- Generate 10 MCQs.
- Four options each.
- Mention the correct answer after every question.
- Use Markdown formatting.

Study Material:

{text}
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

    return response.choices[0].message.content