from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import JobDescription
from ..schemas import JobDescriptionCreate, JobDescriptionResponse

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.post("", response_model=JobDescriptionResponse, status_code=status.HTTP_201_CREATED)
def create_job_description(payload: JobDescriptionCreate, db: Session = Depends(get_db)):
    """Create a new job description."""
    try:
        jd = JobDescription(
            title=payload.title,
            company=payload.company,
            description_text=payload.description_text
        )
        db.add(jd)
        db.commit()
        db.refresh(jd)
        return jd
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create job description: {str(e)}"
        )

@router.get("", response_model=list[JobDescriptionResponse])
def list_job_descriptions(db: Session = Depends(get_db)):
    """List all job descriptions."""
    jds = db.query(JobDescription).order_by(JobDescription.created_at.desc()).all()
    return jds

@router.get("/{id}", response_model=JobDescriptionResponse)
def get_job_description(id: str, db: Session = Depends(get_db)):
    """Get details of a single job description."""
    jd = db.query(JobDescription).filter(JobDescription.id == id).first()
    if not jd:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Job description not found"
        )
    return jd

@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_job_description(id: str, db: Session = Depends(get_db)):
    """Delete a job description and all associated match records."""
    jd = db.query(JobDescription).filter(JobDescription.id == id).first()
    if not jd:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Job description not found"
        )
    
    try:
        db.delete(jd)
        db.commit()
        return {"message": "Job description deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete job description: {str(e)}"
        )
