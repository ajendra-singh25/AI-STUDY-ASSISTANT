import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter

embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small",
    api_key=os.getenv("OPENAI_API_KEY"),
)


def create_vector_store(text, pdf_id):

    if not text.strip():
        raise ValueError("No text extracted")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
    )

    chunks = splitter.split_text(text)

    vector_store = FAISS.from_texts(
        texts=chunks,
        embedding=embeddings,
    )

    os.makedirs("vector_db", exist_ok=True)

    vector_store.save_local(f"vector_db/pdf_{pdf_id}")

    return len(chunks)


def search_pdf(pdf_id, question):

    vector_store = FAISS.load_local(
        f"vector_db/pdf_{pdf_id}",
        embeddings,
        allow_dangerous_deserialization=True,
    )

    return vector_store.similarity_search(
        question,
        k=6,
    )