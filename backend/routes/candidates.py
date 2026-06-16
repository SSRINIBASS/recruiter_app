from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Candidate, AIAnalysis, MatchRecord
from ..schemas import CandidateResponse, CandidateDetailResponse, UploadResponse
from ..services.file_parser import parse_resume
from ..services.storage import upload_resume
from ..services.gemini import analyze_resume_with_gemini

router = APIRouter(prefix="/candidates", tags=["candidates"])

@router.post("/upload", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_candidate_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Upload candidate resume (PDF or DOCX).
    Extracts text, uploads file to storage, runs Gemini analysis,
    creates candidate and analysis records in database.
    """
    filename = file.filename
    if not filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Filename is required"
        )
        
    # Read file bytes
    try:
        file_bytes = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error reading uploaded file: {str(e)}"
        )
        
    if not file_bytes:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Uploaded file is empty"
        )

    # 1. Parse text from the resume
    extracted_text = parse_resume(filename, file_bytes)

    # 2. Upload resume to storage (Supabase/Local fallback)
    resume_url = upload_resume(filename, file_bytes)

    # 3. Analyze resume text using Gemini Flash 1.5
    analysis_data = analyze_resume_with_gemini(extracted_text)

    # 4. Create database records in a single transaction
    try:
        # Create candidate
        candidate = Candidate(
            name=analysis_data.get("name", "Unknown Name"),
            email=analysis_data.get("email"),
            phone=analysis_data.get("phone"),
            resume_url=resume_url
        )
        db.add(candidate)
        db.flush()  # Populates candidate.id

        # Create AI Analysis linked to candidate
        ai_analysis = AIAnalysis(
            candidate_id=candidate.id,
            skills=analysis_data.get("skills", []),
            experience_years=analysis_data.get("experience_years", 0),
            education=analysis_data.get("education"),
            summary=analysis_data.get("summary"),
            raw_response=analysis_data  # Store full dict
        )
        db.add(ai_analysis)
        db.commit()
        db.refresh(candidate)
        
        # Format response
        response_obj = CandidateResponse.model_validate(candidate)
        response_obj.has_analysis = True
        
        return UploadResponse(
            id=response_obj.id,
            name=response_obj.name,
            email=response_obj.email,
            phone=response_obj.phone,
            resume_url=response_obj.resume_url,
            uploaded_at=response_obj.uploaded_at,
            has_analysis=True,
            analysis=ai_analysis
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save candidate to database: {str(e)}"
        )

@router.get("", response_model=list[CandidateResponse])
def list_candidates(db: Session = Depends(get_db)):
    """List all candidates with dynamic has_analysis flags."""
    candidates = db.query(Candidate).order_by(Candidate.uploaded_at.desc()).all()
    
    response = []
    for candidate in candidates:
        candidate_res = CandidateResponse.model_validate(candidate)
        candidate_res.has_analysis = candidate.analysis is not None
        response.append(candidate_res)
        
    return response

@router.get("/{id}", response_model=CandidateDetailResponse)
def get_candidate_detail(id: str, db: Session = Depends(get_db)):
    """Get single candidate detailed profile, including AI analysis and past matches."""
    candidate = db.query(Candidate).filter(Candidate.id == id).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Candidate not found"
        )
    
    # Map matched relations to include helper fields (jd_title, candidate_name)
    matches_mapped = []
    for match in candidate.matches:
        matches_mapped.append({
            "id": match.id,
            "candidate_id": match.candidate_id,
            "jd_id": match.jd_id,
            "jd_title": match.job_description.title if match.job_description else "Unknown Job",
            "candidate_name": candidate.name,
            "match_score": match.match_score,
            "matching_skills": match.matching_skills,
            "skill_gaps": match.skill_gaps,
            "fit_analysis": match.fit_analysis,
            "matched_at": match.matched_at
        })

    candidate_res = CandidateDetailResponse.model_validate(candidate)
    candidate_res.has_analysis = candidate.analysis is not None
    candidate_res.matches = matches_mapped
    return candidate_res

@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_candidate(id: str, db: Session = Depends(get_db)):
    """Delete a candidate and all cascaded analysis and matches."""
    candidate = db.query(Candidate).filter(Candidate.id == id).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Candidate not found"
        )
    
    try:
        db.delete(candidate)
        db.commit()
        return {"message": "Candidate deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete candidate: {str(e)}"
        )
