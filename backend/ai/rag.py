
import json
import logging
import math
import os
import re
from pathlib import Path
from types import SimpleNamespace

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent

configured_path = os.environ.get("VECTOR_DB_DIR")
VECTOR_DB_DIR = (
    Path(configured_path)
    if configured_path
    else BASE_DIR / "vector_db"
)

VECTOR_DB_DIR.mkdir(parents=True, exist_ok=True)


def get_vector_path(pdf_id):
    try:
        pdf_id = int(pdf_id)
    except (TypeError, ValueError):
        raise ValueError("Invalid PDF ID.")

    if pdf_id <= 0:
        raise ValueError("PDF ID must be a positive integer.")

    return VECTOR_DB_DIR / f"pdf_{pdf_id}.json"


def split_into_chunks(text, chunk_size=700, overlap=100):
    words = text.split()

    if not words:
        return []

    chunks = []
    start = 0

    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunk = " ".join(words[start:end])

        if chunk.strip():
            chunks.append(chunk)

        if end >= len(words):
            break

        start = end - overlap

    return chunks


def create_vector_store(text, pdf_id):
    if not isinstance(text, str) or not text.strip():
        raise ValueError("No readable text was found in the PDF.")

    path = get_vector_path(pdf_id)
    chunks = split_into_chunks(text)

    if not chunks:
        raise ValueError("Could not create searchable PDF chunks.")

    data = {
        "pdf_id": int(pdf_id),
        "chunks": chunks,
    }

    temp_path = path.with_suffix(".tmp")

    try:
        with open(temp_path, "w", encoding="utf-8") as file:
            json.dump(data, file, ensure_ascii=False)

        os.replace(temp_path, path)

    finally:
        if temp_path.exists():
            temp_path.unlink()

    logger.info(
        "Created lightweight search index for PDF %s with %s chunks",
        pdf_id,
        len(chunks),
    )

    return len(chunks)


def tokenize(text):
    return re.findall(r"\b[a-zA-Z0-9]+\b", text.lower())


def search_pdf(pdf_id, question, k=4):
    if not isinstance(question, str) or not question.strip():
        raise ValueError("Please enter a valid question.")

    path = get_vector_path(pdf_id)

    if not path.is_file():
        raise FileNotFoundError(
            f"Search index not found for PDF {pdf_id}."
        )

    try:
        k = max(1, min(int(k), 10))
    except (TypeError, ValueError):
        k = 4

    with open(path, "r", encoding="utf-8") as file:
        data = json.load(file)

    chunks = data.get("chunks", [])

    if not chunks:
        return []

    query_tokens = set(tokenize(question))

    if not query_tokens:
        return []

    tokenized_chunks = [tokenize(chunk) for chunk in chunks]
    total_chunks = len(chunks)

    document_frequency = {}

    for tokens in tokenized_chunks:
        for token in set(tokens):
            document_frequency[token] = (
                document_frequency.get(token, 0) + 1
            )

    average_length = (
        sum(len(tokens) for tokens in tokenized_chunks)
        / total_chunks
    )

    scored_chunks = []

    for index, tokens in enumerate(tokenized_chunks):
        if not tokens:
            continue

        frequencies = {}

        for token in tokens:
            frequencies[token] = frequencies.get(token, 0) + 1

        score = 0.0
        document_length = len(tokens)

        for term in query_tokens:
            frequency = frequencies.get(term, 0)

            if frequency == 0:
                continue

            df = document_frequency.get(term, 0)

            inverse_frequency = math.log(
                1 + (total_chunks - df + 0.5) / (df + 0.5)
            )

            numerator = frequency * 2.5

            denominator = frequency + 1.5 * (
                1 - 0.75
                + 0.75 * document_length / average_length
            )

            score += inverse_frequency * numerator / denominator

        if score > 0:
            scored_chunks.append((score, index))

    scored_chunks.sort(reverse=True)

    results = []

    for score, index in scored_chunks[:k]:
        results.append(
            SimpleNamespace(
                page_content=chunks[index],
                metadata={
                    "pdf_id": int(pdf_id),
                    "chunk_index": index,
                    "score": score,
                },
            )
        )

    return results
