def generate_flashcards(text):

    from .llm import client

    prompt = f"""
Create professional flashcards.

Rules:
- One question
- One answer
- Easy to revise
- Markdown format

Content:

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