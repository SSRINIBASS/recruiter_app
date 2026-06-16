import os
import requests
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Candidate, AIAnalysis
from ..schemas import AIAnalysisResponse
from ..services.file_parser import parse_resume
from ..services.gemini import analyze_resume_with_gemini

router = APIRouter(prefix="/analyze", tags=["analyze"])

@router.post("/{candidate_id}", response_model=AIAnalysisResponse)
def trigger_candidate_analysis(candidate_id: str, db: Session = Depends(get_db)):
    """
    Manually trigger or re-run Gemini analysis on a candidate's resume.
    Downloads the resume from storage, parses it, runs Gemini, and upserts the result.
    """
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Candidate not found"
        )
        
    if not candidate.resume_url:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Candidate has no resume uploaded"
        )

    # 1. Retrieve file bytes from URL or local storage
    filename = candidate.resume_url.split("/")[-1]
    file_bytes = b""
    
    if candidate.resume_url.startswith("/static/resumes/"):
        # Local storage resolution
        local_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "resumes")
        local_path = os.path.join(local_dir, filename)
        if not os.path.exists(local_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Local resume file not found on server disk at {local_path}"
            )
        try:
            with open(local_path, "rb") as f:
                file_bytes = f.read()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to read local resume file: {str(e)}"
            )
    else:
        # Remote storage resolution (Supabase)
        try:
            response = requests.get(candidate.resume_url, timeout=15)
            response.raise_for_status()
            file_bytes = response.content
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to download resume from Supabase: {str(e)}"
            )

    # 2. Parse text from the resume
    extracted_text = parse_resume(filename, file_bytes)

    # 3. Analyze resume text using Gemini Flash 1.5
    analysis_data = analyze_resume_with_gemini(extracted_text)

    # 4. Upsert AI Analysis record
    try:
        analysis = db.query(AIAnalysis).filter(AIAnalysis.candidate_id == candidate_id).first()
        
        if analysis:
            # Update existing
            analysis.skills = analysis_data.get("skills", [])
            analysis.experience_years = analysis_data.get("experience_years", 0)
            analysis.education = analysis_data.get("education")
            analysis.summary = analysis_data.get("summary")
            analysis.raw_response = analysis_data
        else:
            # Create new
            analysis = AIAnalysis(
                candidate_id=candidate_id,
                skills=analysis_data.get("skills", []),
                experience_years=analysis_data.get("experience_years", 0),
                education=analysis_data.get("education"),
                summary=analysis_data.get("summary"),
                raw_response=analysis_data
            )
            db.add(analysis)
            
        db.commit()
        db.refresh(analysis)
        return analysis
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save analysis to database: {str(e)}"
        )

@router.get("/{candidate_id}", response_model=AIAnalysisResponse)
def get_candidate_analysis(candidate_id: str, db: Session = Depends(get_db)):
    """Get the existing analysis for a candidate."""
    # Check if candidate exists first to return proper 404
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Candidate not found"
        )
        
    analysis = db.query(AIAnalysis).filter(AIAnalysis.candidate_id == candidate_id).first()
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="No AI analysis exists for this candidate"
        )
    return analysis
