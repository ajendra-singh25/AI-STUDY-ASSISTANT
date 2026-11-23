
import os
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq


# Load backend/.env reliably
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


# Groq API configuration
API_KEY = os.getenv("GROQ_API_KEY", "").strip()

if not API_KEY:
    raise RuntimeError(
        "GROQ_API_KEY is missing. "
        "Configure it in your backend .env file or Render environment variables."
    )


# Centralized model configuration
MODEL_NAME = os.getenv(
    "GROQ_MODEL",
    "openai/gpt-oss-120b",
).strip()


# Initialize Groq client
client = Groq(
    api_key=API_KEY,
    timeout=90.0,
    max_retries=1,
)
