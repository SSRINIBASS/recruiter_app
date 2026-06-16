import os
import uuid
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "resumes")

# Check if Supabase credentials are valid (i.e. not empty and not placeholders)
has_supabase = (
    SUPABASE_URL 
    and SUPABASE_KEY 
    and "your-supabase" not in SUPABASE_URL 
    and "your-supabase" not in SUPABASE_KEY
)

supabase_client: Client = None
if has_supabase:
    try:
        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Failed to initialize Supabase client: {e}. Falling back to local storage.")
        has_supabase = False

# Local storage setup
LOCAL_UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "resumes")
os.makedirs(LOCAL_UPLOAD_DIR, exist_ok=True)

def upload_resume(filename: str, file_bytes: bytes) -> str:
    """
    Uploads file to Supabase Storage if configured, or falls back to local storage.
    Returns the public URL of the uploaded resume.
    """
    # Create a unique filename to prevent collisions
    ext = filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{ext}"
    
    if has_supabase and supabase_client:
        try:
            # Determine mime type
            content_type = "application/pdf" if ext.lower() == "pdf" else "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            
            # Upload to Supabase Storage bucket
            response = supabase_client.storage.from_(SUPABASE_BUCKET).upload(
                path=unique_filename,
                file=file_bytes,
                file_options={"content-type": content_type}
            )
            
            # Get public URL
            public_url = supabase_client.storage.from_(SUPABASE_BUCKET).get_public_url(unique_filename)
            return public_url
        except Exception as e:
            print(f"Supabase upload error: {e}. Falling back to local storage.")
            # Fall through to local storage on error
    
    # Local Storage Fallback
    local_path = os.path.join(LOCAL_UPLOAD_DIR, unique_filename)
    with open(local_path, "wb") as f:
        f.write(file_bytes)
        
    # In local development, return path relative to static mount
    # e.g. /static/resumes/<uuid>.pdf
    # This URL will be serveable by FastAPI on the backend port.
    return f"/static/resumes/{unique_filename}"
