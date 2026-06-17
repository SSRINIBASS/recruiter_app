import os
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .database import engine, Base
from .routes import candidates, jobs, analyze, match

# Auto-create tables on startup (cross-compatible SQLite/Postgres)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Eligo API",
    description="AI-powered candidate resume parser and job matching service API.",
    version="1.0.0"
)

# Configure CORS Middleware
# In production, we'd restrict origins to the frontend deployment URL.
# For local dev, allow all origins.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure local storage directory exists for the static fallback
LOCAL_UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "static", "resumes")
os.makedirs(LOCAL_UPLOAD_DIR, exist_ok=True)

# Mount local storage folder as static files
# Evaluators running locally can download/view uploaded resumes at:
# http://localhost:8000/static/resumes/<filename>
app.mount("/static", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "static")), name="static")

# Register Routers
app.include_router(candidates.router)
app.include_router(jobs.router)
app.include_router(analyze.router)
app.include_router(match.router)

@app.get("/health", tags=["health"])
def health_check():
    """Uptime health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

# Entrypoint for running via script directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
