import os
from pathlib import Path

from dotenv import load_dotenv

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


def create_vector_store(text, pdf_id):
    if not text.strip():
        raise ValueError("No text was extracted from the PDF.")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
    )

    chunks = splitter.split_text(text)

    print("Number of chunks:", len(chunks))

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
    docs = vector_store.similarity_search(
    question,
    k=6,
)

    return docs