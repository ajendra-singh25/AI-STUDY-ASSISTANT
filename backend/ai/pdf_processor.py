
import fitz  # PyMuPDF
from pathlib import Path


def extract_text_from_pdf(pdf_source):
    """
    Extract text from a local PDF path or a file-like object.
    Supports both local storage and cloud storage.
    """

    if not pdf_source:
        raise ValueError("PDF file path is missing.")

    try:
        # Cloud storage or file-like object
        if hasattr(pdf_source, "read"):
            pdf_bytes = pdf_source.read()

            if hasattr(pdf_source, "seek"):
                pdf_source.seek(0)

            if not pdf_bytes:
                raise ValueError("The PDF file is empty.")

            pdf_document = fitz.open(
                stream=pdf_bytes,
                filetype="pdf",
            )

        # Local filesystem path
        else:
            pdf_path = Path(pdf_source)

            if not pdf_path.exists():
                raise FileNotFoundError(
                    f"PDF file not found: {pdf_path}"
                )

            if not pdf_path.is_file():
                raise ValueError(
                    "The provided path is not a file."
                )

            if pdf_path.suffix.lower() != ".pdf":
                raise ValueError(
                    "The provided file is not a PDF."
                )

            pdf_document = fitz.open(str(pdf_path))

        with pdf_document as document:

            if document.is_encrypted:
                raise ValueError(
                    "Password-protected PDFs are not supported."
                )

            if document.page_count == 0:
                raise ValueError(
                    "The PDF contains no pages."
                )

            extracted_pages = []

            for page_number, page in enumerate(
                document,
                start=1,
            ):
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
