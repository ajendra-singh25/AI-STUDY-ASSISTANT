import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY is not configured")


embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small",
    api_key=OPENAI_API_KEY,
)


VECTOR_DB_DIR = BASE_DIR / "vector_db"
VECTOR_DB_DIR.mkdir(exist_ok=True)


def create_vector_store(text, pdf_id):

    if not text or not text.strip():
        raise ValueError("No text extracted from PDF")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=700,
        chunk_overlap=100,
    )

    chunks = splitter.split_text(text)

    if not chunks:
        raise ValueError("No chunks created from PDF")

    vector_store = FAISS.from_texts(
        texts=chunks,
        embedding=embeddings,
    )

    pdf_vector_path = VECTOR_DB_DIR / f"pdf_{pdf_id}"

    vector_store.save_local(str(pdf_vector_path))

    return len(chunks)


def search_pdf(pdf_id, question):

    if not question or not question.strip():
        raise ValueError("Question cannot be empty")

    pdf_vector_path = VECTOR_DB_DIR / f"pdf_{pdf_id}"

    if not pdf_vector_path.exists():
        raise FileNotFoundError(
            f"Vector database not found for PDF {pdf_id}. "
            f"Please process the PDF first."
        )

    vector_store = FAISS.load_local(
        str(pdf_vector_path),
        embeddings,
        allow_dangerous_deserialization=True,
    )

    return vector_store.similarity_search(
        question,
        k=4,
    )