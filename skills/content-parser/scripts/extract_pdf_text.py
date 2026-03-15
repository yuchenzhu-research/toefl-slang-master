#!/usr/bin/env python3

import argparse
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path


def clean_pdf_text(text: str) -> str:
    if not text:
        return ""

    normalized = text.replace("\r\n", "\n").replace("\r", "\n")
    normalized = re.sub(r"[ \t]+\n", "\n", normalized)
    normalized = re.sub(r"\n{3,}", "\n\n", normalized)
    normalized = re.sub(r"([a-zA-Z])-?\n([a-zA-Z])", r"\1\2", normalized)
    normalized = re.sub(r"[ \t]{2,}", " ", normalized)
    return normalized.strip()


def extract_with_pypdf(pdf_path: Path):
    try:
        import pypdf  # type: ignore
    except ImportError:
        return None

    reader = pypdf.PdfReader(str(pdf_path))
    pages = []
    for page in reader.pages:
        pages.append(page.extract_text() or "")
    return {"text": "\n\n".join(pages), "page_count": len(reader.pages), "engine": "pypdf"}


def extract_with_pdftotext(pdf_path: Path):
    if shutil.which("pdftotext") is None:
        return None

    result = subprocess.run(
        ["pdftotext", str(pdf_path), "-"],
        capture_output=True,
        text=True,
        timeout=60,
        check=False,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or "pdftotext failed")

    return {"text": result.stdout, "page_count": None, "engine": "pdftotext"}


def extract_with_basic_stream_parse(pdf_path: Path):
    raw_bytes = pdf_path.read_bytes()
    raw_text = raw_bytes.decode("latin-1", errors="ignore")
    stream_blocks = re.findall(r"stream\r?\n(.*?)\r?\nendstream", raw_text, re.DOTALL)
    if not stream_blocks:
        return None

    extracted_parts = []
    for block in stream_blocks:
        for match in re.findall(r"\((.*?)\)\s*Tj", block, re.DOTALL):
            cleaned = match.replace("\\(", "(").replace("\\)", ")").replace("\\n", " ")
            cleaned = cleaned.replace("\\r", " ").replace("\\t", " ").replace("\\\\", "\\")
            if cleaned.strip():
                extracted_parts.append(cleaned.strip())

    if not extracted_parts:
        return None

    return {
        "text": "\n".join(extracted_parts),
        "page_count": None,
        "engine": "basic-text-stream",
    }


def extract_pdf_text(pdf_path: Path):
    extracted = extract_with_pypdf(pdf_path)
    if extracted is not None:
        return extracted

    extracted = extract_with_pdftotext(pdf_path)
    if extracted is not None:
        return extracted

    extracted = extract_with_basic_stream_parse(pdf_path)
    if extracted is not None:
        return extracted

    raise RuntimeError("Neither pypdf nor pdftotext is available for PDF extraction.")


def main():
    parser = argparse.ArgumentParser(description="Extract cleaned text from a PDF file.")
    parser.add_argument("pdf_path", help="Path to the PDF file")
    parser.add_argument("--json", action="store_true", help="Emit JSON metadata and text")
    parser.add_argument("--max-chars", type=int, default=12000, help="Maximum number of characters to emit")
    args = parser.parse_args()

    pdf_path = Path(args.pdf_path).expanduser().resolve()
    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    extracted = extract_pdf_text(pdf_path)
    cleaned = clean_pdf_text(extracted["text"])
    if not cleaned:
        raise RuntimeError("PDF extraction completed but no text was recovered.")

    truncated = False
    output_text = cleaned
    if args.max_chars > 0 and len(cleaned) > args.max_chars:
        output_text = cleaned[: args.max_chars].rstrip()
        truncated = True

    payload = {
        "title": pdf_path.stem,
        "path": str(pdf_path),
        "sourceType": "pdf",
        "engine": extracted["engine"],
        "pageCount": extracted["page_count"],
        "charCount": len(output_text),
        "truncated": truncated,
        "text": output_text,
        "warnings": ["Source text was truncated before prompt assembly."] if truncated else [],
    }

    if args.json:
        print(json.dumps(payload, ensure_ascii=False))
        return

    print(output_text)


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
