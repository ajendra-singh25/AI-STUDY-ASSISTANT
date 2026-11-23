
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("GROQ_API_KEY is missing.")

client = Groq(
    api_key=api_key,
    timeout=60.0,
    max_retries=1,
)

# Keep the model configurable through Render environment variables.
MODEL_NAME = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
