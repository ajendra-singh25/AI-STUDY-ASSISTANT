
import logging
import time

from groq import RateLimitError

from .llm import client, MODEL_NAME

logger = logging.getLogger(__name__)


def generate_flashcards(text):
    """
    Generate exactly 10 concise flashcards from study material.
    Retry once if Groq temporarily reaches its rate limit.
    """

    if not isinstance(text, str) or not text.strip():
        raise ValueError("Study material is empty or invalid.")

    # Limit input size to reduce token consumption.
    study_material = text[:5000]

    prompt = f"""
Create exactly 10 flashcards from the study material below.

Rules:
- Exactly 10 cards.
- One question and one concise answer per card.
- Use only the supplied material.
- Avoid repeated questions.
- Cover important concepts.
- Keep each answer under 40 words.

Format:

## Flashcard 1
**Question:** Question here
**Answer:** Answer here

Continue until Flashcard 10.

Study Material:
{study_material}
"""

    for attempt in range(2):
        try:
            response = client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an academic flashcard generator. "
                            "Create accurate and concise flashcards "
                            "using only the supplied study material."
                        ),
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
                temperature=0.3,
                max_completion_tokens=1200,
            )

            if not response.choices:
                raise RuntimeError(
                    "Groq returned no flashcard response."
                )

            result = response.choices[0].message.content

            if not result or not result.strip():
                raise RuntimeError(
                    "Groq returned an empty flashcard response."
                )

            return result.strip()

        except RateLimitError:
            if attempt == 0:
                logger.warning(
                    "Groq rate limit reached. Retrying flashcard generation."
                )
                time.sleep(25)
            else:
                logger.exception(
                    "Groq rate limit persisted after retry."
                )
                raise

    raise RuntimeError("Flashcard generation failed.")
