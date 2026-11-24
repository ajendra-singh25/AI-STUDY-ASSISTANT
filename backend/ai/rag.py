
import os
import shutil
import tempfile
import logging
from pathlib import Path
from functools import lru_cache

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter


logger = logging.getLogger(__name__)

# --------------------------------------------------
# PATH CONFIGURATION
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

configured_path = os.environ.get("VECTOR_DB_DIR")

if configured_path:
    configured_vector_dir = Path(configured_path)
else:
    configured_vector_dir = BASE_DIR / "vector_db"


def initialize_vector_directory():
    """
    Initialize FAISS storage.

    Prefer the configured directory (for example, a Render
    persistent disk). If it is unavailable, use local storage.
    """

    try:
        configured_vector_dir.mkdir(parents=True, exist_ok=True)

        # Verify that the directory is writable.
        test_file = configured_vector_dir / ".write_test"
        test_file.touch()
        test_file.unlink()

        logger.info(
            "FAISS storage directory: %s",
            configured_vector_dir,
        )

        return configured_vector_dir

    except OSError as error:
        fallback_dir = BASE_DIR / "vector_db"

        logger.warning(
            "Configured FAISS directory %s is unavailable: %s",
            configured_vector_dir,
            error,
        )

        fallback_dir.mkdir(parents=True, exist_ok=True)

        logger.warning(
            "Using fallback FAISS directory: %s. "
            "This storage may be temporary on Render.",
            fallback_dir,
        )

        return fallback_dir


VECTOR_DB_DIR = initialize_vector_directory()


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

    temp_dir = Path(
        tempfile.mkdtemp(
            prefix=f"pdf_{int(pdf_id)}_",
            dir=str(VECTOR_DB_DIR),
        )
    )

    backup_path = VECTOR_DB_DIR / f"pdf_{int(pdf_id)}_backup"

    try:
        vector_store.save_local(str(temp_dir))

        if backup_path.exists():
            shutil.rmtree(backup_path)

        if pdf_vector_path.exists():
            os.replace(pdf_vector_path, backup_path)

        try:
            os.replace(temp_dir, pdf_vector_path)

        except Exception:
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
    Search the FAISS index and return relevant chunks.
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
