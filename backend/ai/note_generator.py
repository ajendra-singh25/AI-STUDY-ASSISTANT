
from langchain_text_splitters import RecursiveCharacterTextSplitter

from .llm import client, MODEL_NAME


def generate_notes(text):
    """
    Generate study notes from PDF text.

    Large documents are divided into smaller sections
    to avoid excessively large Groq API requests.
    """

    if not isinstance(text, str) or not text.strip():
        raise ValueError("No valid text provided for note generation.")

    # Split large documents into manageable sections.
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=14000,
        chunk_overlap=300,
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    chunks = splitter.split_text(text.strip())

    if not chunks:
        raise ValueError("Could not extract usable content for notes.")

    generated_notes = []

    for index, chunk in enumerate(chunks, start=1):

        prompt = f"""
You are an expert academic study assistant.

Create concise, well-organized study notes from the
provided study material.

Requirements:
- Use clear Markdown headings.
- Use bullet points.
- Highlight important concepts and definitions.
- Include important facts and explanations.
- Keep the notes easy to understand and revise.
- Do not invent facts or add information absent from the material.
- Avoid unnecessary repetition.
- Preserve important technical terms.

This is section {index} of {len(chunks)}.

Study Material:

{chunk}
"""

        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You generate accurate, structured study notes "
                        "strictly grounded in the supplied study material."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            max_completion_tokens=1500,
        )

        if not response.choices:
            raise RuntimeError(
                f"Groq returned no response for section {index}."
            )

        content = response.choices[0].message.content

        if not content or not content.strip():
            raise RuntimeError(
                f"Empty notes generated for section {index}."
            )

        generated_notes.append(
            f"## Section {index}\n\n{content.strip()}"
        )

    return "\n\n".join(generated_notes)
