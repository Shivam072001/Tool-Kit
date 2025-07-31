# python_services/metadata_handler/services.py

from PIL import Image
from PIL.ExifTags import TAGS
import fitz  # PyMuPDF

def extract_image_metadata(file):
    """Extracts EXIF metadata from an image file."""
    metadata = {}
    try:
        with Image.open(file) as img:
            exif_data = img._getexif()
            if exif_data:
                for tag_id, value in exif_data.items():
                    tag_name = TAGS.get(tag_id, tag_id)
                    # Decode bytes value if necessary
                    if isinstance(value, bytes):
                        try:
                            value = value.decode('utf-8', errors='ignore')
                        except UnicodeDecodeError:
                            value = repr(value)
                    metadata[str(tag_name)] = str(value)
    except Exception as e:
        metadata['Error'] = f"Could not process image file: {e}"
    return metadata

def extract_pdf_metadata(file):
    """Extracts metadata from a PDF file."""
    metadata = {}
    try:
        # PyMuPDF needs a file path or bytes, not a file-like object directly
        # So we read the content of the uploaded file
        file_bytes = file.read()
        with fitz.open(stream=file_bytes, filetype="pdf") as doc:
            pdf_meta = doc.metadata
            for key, value in pdf_meta.items():
                if value: # Only include non-empty values
                    metadata[key] = value
    except Exception as e:
        metadata['Error'] = f"Could not process PDF file: {e}"
    return metadata

def extract_metadata(file):
    """
    Controller function to determine file type and extract metadata.
    """
    content_type = file.content_type

    if content_type.startswith('image/'):
        return extract_image_metadata(file)
    elif content_type == 'application/pdf':
        return extract_pdf_metadata(file)
    else:
        return {"Error": f"Unsupported file type: {content_type}"}