
import os
import shutil
import tempfile
from pathlib import Path
from functools import lru_cache

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter


# --------------------------------------------------
# PATH CONFIGURATION
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

VECTOR_DB_DIR = Path(
    os.environ.get(
        "VECTOR_DB_DIR",
        str(BASE_DIR / "vector_db"),
    )
)

VECTOR_DB_DIR.mkdir(parents=True, exist_ok=True)


# --------------------------------------------------
# EMBEDDING MODEL
# --------------------------------------------------

EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


@lru_cache(maxsize=1)
def get_embeddings():
    """
    Load the embedding model once and reuse it.
    CPU is used for compatibility with Render.
    """
    return HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL_NAME,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )


# --------------------------------------------------
# VALIDATE PDF ID
# --------------------------------------------------

def get_vector_path(pdf_id):
    """
    Generate a safe FAISS directory path for a PDF.
    """
    try:
        pdf_id = int(pdf_id)
    except (TypeError, ValueError):
        raise ValueError("Invalid PDF ID.")

    if pdf_id <= 0:
        raise ValueError("PDF ID must be a positive integer.")

    return VECTOR_DB_DIR / f"pdf_{pdf_id}"


# --------------------------------------------------
# CREATE FAISS VECTOR STORE
# --------------------------------------------------

def create_vector_store(text, pdf_id):
    """
    Split PDF text into chunks, generate embeddings,
    and save the FAISS index for the given PDF.
    """

    if not isinstance(text, str) or not text.strip():
        raise ValueError("No valid text extracted from PDF.")

    pdf_vector_path = get_vector_path(pdf_id)

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=700,
        chunk_overlap=100,
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    chunks = splitter.split_text(text)

    if not chunks:
        raise ValueError("No text chunks could be generated.")

    embeddings = get_embeddings()

    vector_store = FAISS.from_texts(
        texts=chunks,
        embedding=embeddings,
        metadatas=[
            {"pdf_id": int(pdf_id), "chunk_index": index}
            for index in range(len(chunks))
        ],
    )

    # Save the new index in a temporary directory first.
    temp_dir = Path(
        tempfile.mkdtemp(
            prefix=f"pdf_{int(pdf_id)}_",
            dir=str(VECTOR_DB_DIR),
        )
    )

    backup_path = VECTOR_DB_DIR / f"pdf_{int(pdf_id)}_backup"

    try:
        vector_store.save_local(str(temp_dir))

        # Preserve the previous index until the new one is ready.
        if backup_path.exists():
            shutil.rmtree(backup_path)

        if pdf_vector_path.exists():
            os.replace(pdf_vector_path, backup_path)

        try:
            os.replace(temp_dir, pdf_vector_path)
        except Exception:
            # Restore the previous index if replacement fails.
            if backup_path.exists() and not pdf_vector_path.exists():
                os.replace(backup_path, pdf_vector_path)
            raise

        if backup_path.exists():
            shutil.rmtree(backup_path)

    finally:
        if temp_dir.exists():
            shutil.rmtree(temp_dir, ignore_errors=True)

    return len(chunks)


# --------------------------------------------------
# SEARCH PDF
# --------------------------------------------------

def search_pdf(pdf_id, question, k=4):
    """
    Search the FAISS index and return the most relevant
    document chunks for a question.
    """

    if not isinstance(question, str) or not question.strip():
        raise ValueError("Question cannot be empty.")

    pdf_vector_path = get_vector_path(pdf_id)

    if not pdf_vector_path.is_dir():
        raise FileNotFoundError(
            f"Vector store not found for PDF {pdf_id}. "
            "The PDF may need to be processed again."
        )

    try:
        k = max(1, min(int(k), 10))
    except (TypeError, ValueError):
        k = 4

    embeddings = get_embeddings()

    vector_store = FAISS.load_local(
        str(pdf_vector_path),
        embeddings,
        allow_dangerous_deserialization=True,
    )

    return vector_store.similarity_search(
        question.strip(),
        k=k,
    )
