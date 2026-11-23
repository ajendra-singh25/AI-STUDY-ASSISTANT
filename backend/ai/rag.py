
import shutil
from pathlib import Path
from functools import lru_cache

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter

BASE_DIR = Path(__file__).resolve().parent.parent

VECTOR_DB_DIR = BASE_DIR / "vector_db"
VECTOR_DB_DIR.mkdir(parents=True, exist_ok=True)


@lru_cache(maxsize=1)
def get_embeddings():
    return HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )


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

    embeddings = get_embeddings()

    vector_store = FAISS.from_texts(
        texts=chunks,
        embedding=embeddings,
    )

    pdf_vector_path = VECTOR_DB_DIR / f"pdf_{pdf_id}"

    if pdf_vector_path.exists():
        shutil.rmtree(pdf_vector_path)

    vector_store.save_local(str(pdf_vector_path))

    return len(chunks)


def search_pdf(pdf_id, question):
    if not question or not question.strip():
        raise ValueError("Question cannot be empty")

    pdf_vector_path = VECTOR_DB_DIR / f"pdf_{pdf_id}"

    if not pdf_vector_path.exists():
        raise FileNotFoundError(
            f"Vector store not found for PDF {pdf_id}"
        )

    embeddings = get_embeddings()

    vector_store = FAISS.load_local(
        str(pdf_vector_path),
        embeddings,
        allow_dangerous_deserialization=True,
    )

    return vector_store.similarity_search(question, k=4)
