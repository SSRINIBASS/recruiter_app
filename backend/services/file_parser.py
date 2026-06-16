import io
import pdfplumber
import docx
from fastapi import HTTPException, status

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract raw text from PDF bytes using pdfplumber."""
    try:
        text_content = []
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text_content.append(page_text)
        
        extracted_text = "\n".join(text_content).strip()
        if not extracted_text:
            raise ValueError("No text could be extracted from PDF")
        return extracted_text
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to parse PDF resume: {str(e)}"
        )

def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract raw text from DOCX bytes using python-docx."""
    try:
        doc = docx.Document(io.BytesIO(file_bytes))
        text_content = []
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                text_content.append(paragraph.text)
        
        extracted_text = "\n".join(text_content).strip()
        if not extracted_text:
            raise ValueError("No text could be extracted from DOCX")
        return extracted_text
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to parse Word (DOCX) resume: {str(e)}"
        )

def parse_resume(filename: str, file_bytes: bytes) -> str:
    """
    Parses resume depending on its file extension.
    Raises HTTPException for unsupported formats or extraction failures.
    """
    ext = filename.split(".")[-1].lower()
    
    if ext == "pdf":
        return extract_text_from_pdf(file_bytes)
    elif ext == "docx":
        return extract_text_from_docx(file_bytes)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Only PDF and DOCX resumes are supported."
        )
