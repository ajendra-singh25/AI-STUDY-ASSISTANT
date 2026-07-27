


def generate_notes(text):
    from .llm import llm

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

    response = llm.invoke(prompt)

    return response.content