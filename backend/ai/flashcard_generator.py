import json
import re


from langchain_core.messages import HumanMessage


def generate_flashcards(text):
    from .llm import llm

    prompt = f"""
You are an expert teacher.

Generate 5 flashcards.

Return ONLY JSON.

Format:

[
 {{
   "question":"...",
   "answer":"..."
 }}
]

Study Material:

{text[:6000]}
"""

    response = llm.invoke(
        [HumanMessage(content=prompt)]
    )

    content = response.content.strip()

    content = content.replace("```json", "")
    content = content.replace("```", "")

    content = re.sub(r"[\x00-\x1F\x7F]", "", content)

    return json.loads(content)