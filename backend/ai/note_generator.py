
from groq import RateLimitError, APIConnectionError

from .llm import client, MODEL_NAME


def generate_notes(text):
    """
    Generate concise study notes using one Groq API request.
    The input is limited to reduce token usage and avoid
    repeated TPM rate-limit errors.
    """

    if not isinstance(text, str) or not text.strip():
        raise ValueError("No valid text provided for note generation.")

    # Limit the input to keep the request within free-tier token limits.
    max_input_chars = 12000
    study_material = text.strip()[:max_input_chars]

    prompt = f"""
Create concise, well-organized academic study notes
from the following PDF material.

Requirements:
- Use clear Markdown headings.
- Use bullet points and numbered lists where useful.
- Explain important concepts in simple language.
- Include key definitions, facts, and formulas.
- Highlight important technical terms.
- Avoid repetition and unnecessary explanations.
- Do not invent facts or use information outside the material.
- Prioritize the most important examination topics.

PDF STUDY MATERIAL:

{study_material}
"""

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an academic study assistant. "
                        "Generate accurate, concise notes strictly "
                        "from the supplied PDF material."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.2,
            max_completion_tokens=1200,
        )

        if not response.choices:
            raise RuntimeError("The AI returned no response.")

        notes = response.choices[0].message.content

        if not notes or not notes.strip():
            raise RuntimeError("The AI returned empty notes.")

        return notes.strip()

    except RateLimitError as error:
        raise RuntimeError(
            "Groq rate limit reached. Please wait one minute "
            "before generating notes again."
        ) from error

    except APIConnectionError as error:
        raise RuntimeError(
            "Unable to connect to Groq. Check your internet "
            "connection and try again."
        ) from error
