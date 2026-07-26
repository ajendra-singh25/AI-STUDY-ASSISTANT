import json
import re

from .llm import llm
from langchain_core.messages import HumanMessage


def generate_quiz(text):

    prompt = f"""
You are an expert teacher.

Generate exactly 10 multiple choice questions from the study material.

Return ONLY valid JSON.

Format:

[
  {{
    "question":"...",
    "options":[
      "...",
      "...",
      "...",
      "..."
    ],
    "answer":"..."
  }}
]

Rules:
- Exactly 10 questions
- Exactly 4 options
- One correct answer
- No explanations
- Return JSON only

Study Material:

{text[:12000]}
"""

    response = llm.invoke([HumanMessage(content=prompt)])

    content = response.content.strip()

    # Remove markdown if present
    content = content.replace("```json", "")
    content = content.replace("```", "")

    # Remove invisible control characters
    content = re.sub(r"[\x00-\x1F\x7F]", "", content)

    print(content)

    return json.loads(content)