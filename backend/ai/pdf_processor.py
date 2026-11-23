
import fitz  # PyMuPDF
from pathlib import Path


def extract_text_from_pdf(pdf_path):
    """
    Extract text from all pages of a PDF file.
    Returns extracted text as a single string.
    """

    if not pdf_path:
        raise ValueError("PDF file path is missing.")

    pdf_path = Path(pdf_path)

    if not pdf_path.exists():
        raise FileNotFoundError(
            f"PDF file not found: {pdf_path}"
        )

    if not pdf_path.is_file():
        raise ValueError("The provided path is not a file.")

    if pdf_path.suffix.lower() != ".pdf":
        raise ValueError("The provided file is not a PDF.")

    try:
        extracted_pages = []

        with fitz.open(str(pdf_path)) as document:

            if document.is_encrypted:
                raise ValueError(
                    "Password-protected PDFs are not supported."
                )

            if document.page_count == 0:
                raise ValueError("The PDF contains no pages.")

            for page_number, page in enumerate(document, start=1):
                page_text = page.get_text("text")

                if page_text and page_text.strip():
                    extracted_pages.append(page_text.strip())

        text = "\n\n".join(extracted_pages).strip()

        if not text:
            raise ValueError(
                "No readable text found in the PDF. "
                "The PDF may contain scanned images."
            )

        return text

    except (FileNotFoundError, ValueError):
        raise

    except fitz.FileDataError as error:
        raise ValueError(
            "The PDF file is corrupted or invalid."
        ) from error

    except Exception as error:
        raise RuntimeError(
            f"Unable to extract text from PDF: {error}"
        ) from error
