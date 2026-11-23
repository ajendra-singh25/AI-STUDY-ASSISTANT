def generate_notes(text):

    from .llm import client, MODEL_NAME

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
        model=MODEL_NAME,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content

