def generate_notes(text):

    from .llm import client

    prompt = f"""
You are an expert study assistant.

Create concise, well-organized study notes from the following content.

Requirements:
- Use headings.
- Use bullet points.
- Highlight important concepts.
- Keep the notes easy to revise.
- Do not add information not present in the text.

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

