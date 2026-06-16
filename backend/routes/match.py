from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Candidate, JobDescription, AIAnalysis, MatchRecord
from ..schemas import MatchRecordResponse, BulkMatchResponse, OutreachRequest, OutreachEmailResponse, BulkOutreachResponse
from ..services.gemini import match_candidate_to_jd, generate_outreach_email

router = APIRouter(prefix="/match", tags=["match"])

# ----------------- BULK ROUTES (Declared First to Avoid Param Collision) -----------------

@router.post("/bulk/{jd_id}", response_model=BulkMatchResponse)
def match_bulk_candidates(jd_id: str, db: Session = Depends(get_db)):
    """
    Match all candidates with existing analyses to a job description.
    Runs matching for each and returns the ranked list sorted by score descending.
    """
    jd = db.query(JobDescription).filter(JobDescription.id == jd_id).first()
    if not jd:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job description not found")

    # Fetch all candidates that have an AI analysis record
    candidates = db.query(Candidate).join(AIAnalysis).all()
    if not candidates:
        return BulkMatchResponse(
            jd_id=jd.id,
            jd_title=jd.title,
            total_candidates=0,
            matches=[]
        )

    matches_list = []
    
    # Run matching for each candidate
    for candidate in candidates:
        analysis = candidate.analysis
        if not analysis:
            continue
            
        analysis_dict = {
            "skills": analysis.skills,
            "experience_years": analysis.experience_years,
            "education": analysis.education,
            "summary": analysis.summary,
            # Pull richer fields from raw_response if available
            "projects": (analysis.raw_response or {}).get("projects", []),
            "achievements": (analysis.raw_response or {}).get("achievements", []),
            "certifications": (analysis.raw_response or {}).get("certifications", []),
        }
        
        # Run match comparison
        match_data = match_candidate_to_jd(analysis_dict, jd.description_text)
        
        # Upsert
        try:
            record = db.query(MatchRecord).filter(
                MatchRecord.candidate_id == candidate.id,
                MatchRecord.jd_id == jd.id
            ).first()
            
            if record:
                record.match_score = match_data.get("match_score", 0)
                record.matching_skills = match_data.get("matching_skills", [])
                record.claimed_only_skills = match_data.get("claimed_only_skills", [])
                record.skill_gaps = match_data.get("skill_gaps", [])
                record.fit_analysis = match_data.get("fit_analysis")
            else:
                record = MatchRecord(
                    candidate_id=candidate.id,
                    jd_id=jd.id,
                    match_score=match_data.get("match_score", 0),
                    matching_skills=match_data.get("matching_skills", []),
                    claimed_only_skills=match_data.get("claimed_only_skills", []),
                    skill_gaps=match_data.get("skill_gaps", []),
                    fit_analysis=match_data.get("fit_analysis")
                )
                db.add(record)
                
            db.commit()
            db.refresh(record)
            
            matches_list.append(MatchRecordResponse(
                id=record.id,
                candidate_id=record.candidate_id,
                jd_id=record.jd_id,
                jd_title=jd.title,
                candidate_name=candidate.name,
                match_score=record.match_score,
                matching_skills=record.matching_skills,
                claimed_only_skills=record.claimed_only_skills or [],
                skill_gaps=record.skill_gaps,
                fit_analysis=record.fit_analysis,
                matched_at=record.matched_at
            ))
        except Exception as e:
            db.rollback()
            print(f"Failed to upsert bulk match record for candidate {candidate.name}: {e}")
            continue

    # Sort matches by score descending
    matches_list.sort(key=lambda m: m.match_score, reverse=True)

    return BulkMatchResponse(
        jd_id=jd.id,
        jd_title=jd.title,
        total_candidates=len(matches_list),
        matches=matches_list
    )

@router.get("/bulk/{jd_id}", response_model=BulkMatchResponse)
def get_bulk_matches_for_jd(jd_id: str, db: Session = Depends(get_db)):
    """Get all existing match records for a job description, sorted by score descending."""
    jd = db.query(JobDescription).filter(JobDescription.id == jd_id).first()
    if not jd:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job description not found")
        
    records = db.query(MatchRecord).filter(MatchRecord.jd_id == jd_id).all()
    
    matches_list = []
    for record in records:
        matches_list.append(MatchRecordResponse(
            id=record.id,
            candidate_id=record.candidate_id,
            jd_id=record.jd_id,
            jd_title=jd.title,
            candidate_name=record.candidate.name if record.candidate else "Unknown Candidate",
            match_score=record.match_score,
            matching_skills=record.matching_skills,
            skill_gaps=record.skill_gaps,
            fit_analysis=record.fit_analysis,
            matched_at=record.matched_at
        ))
        
    # Sort matches by score descending
    matches_list.sort(key=lambda m: m.match_score, reverse=True)
    
    return BulkMatchResponse(
        jd_id=jd.id,
        jd_title=jd.title,
        total_candidates=len(matches_list),
        matches=matches_list
    )

# ----------------- OUTREACH ROUTE (Declared before parametric routes) -----------------

@router.post("/outreach", response_model=BulkOutreachResponse)
def generate_bulk_outreach(
    request: OutreachRequest,
    db: Session = Depends(get_db)
):
    """
    Generate personalised outreach emails for a shortlisted set of candidates.
    Accepts a list of candidate IDs + the job description ID + recruiter's sender name.
    Returns a ready-to-copy email for each candidate.
    """
    jd = db.query(JobDescription).filter(JobDescription.id == request.jd_id).first()
    if not jd:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job description not found")

    if not request.sender_name or not request.sender_name.strip():
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="sender_name is required")

    if not request.candidate_ids:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="candidate_ids list cannot be empty")

    emails = []
    for candidate_id in request.candidate_ids:
        candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
        if not candidate:
            continue  # Skip unknown IDs gracefully

        # Try to find an existing match record for fit_analysis context
        match_record = db.query(MatchRecord).filter(
            MatchRecord.candidate_id == candidate_id,
            MatchRecord.jd_id == request.jd_id
        ).first()
        fit_analysis = match_record.fit_analysis if match_record else None

        email_data = generate_outreach_email(
            candidate_name=candidate.name,
            jd_title=jd.title,
            company=jd.company,
            fit_analysis=fit_analysis,
            sender_name=request.sender_name.strip(),
        )

        emails.append(OutreachEmailResponse(
            candidate_id=candidate.id,
            candidate_name=candidate.name,
            candidate_email=candidate.email,
            subject=email_data.get("subject", f"Opportunity: {jd.title}"),
            body=email_data.get("body", ""),
        ))

    return BulkOutreachResponse(emails=emails)


# ----------------- SINGLE ROUTES (Declared Last) -----------------

@router.post("/{candidate_id}/{jd_id}", response_model=MatchRecordResponse)
def match_single_candidate(candidate_id: str, jd_id: str, db: Session = Depends(get_db)):
    """
    Match a single candidate to a job description.
    Runs analysis and updates or inserts (upsert) the match record.
    """
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
        
    jd = db.query(JobDescription).filter(JobDescription.id == jd_id).first()
    if not jd:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job description not found")
        
    analysis = db.query(AIAnalysis).filter(AIAnalysis.candidate_id == candidate_id).first()
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, 
            detail="Candidate has no AI analysis. Please analyze candidate resume first."
        )

    # 1. Prepare analysis dict for prompt input
    analysis_dict = {
        "skills": analysis.skills,
        "experience_years": analysis.experience_years,
        "education": analysis.education,
        "summary": analysis.summary,
        # Pull richer fields from raw_response if available
        "projects": (analysis.raw_response or {}).get("projects", []),
        "achievements": (analysis.raw_response or {}).get("achievements", []),
        "certifications": (analysis.raw_response or {}).get("certifications", []),
    }

    # 2. Run Gemini matching service
    match_data = match_candidate_to_jd(analysis_dict, jd.description_text)

    # 3. Upsert Match Record (standard SQLAlchemy compatible upsert)
    try:
        record = db.query(MatchRecord).filter(
            MatchRecord.candidate_id == candidate_id, 
            MatchRecord.jd_id == jd_id
        ).first()

        if record:
            record.match_score = match_data.get("match_score", 0)
            record.matching_skills = match_data.get("matching_skills", [])
            record.claimed_only_skills = match_data.get("claimed_only_skills", [])
            record.skill_gaps = match_data.get("skill_gaps", [])
            record.fit_analysis = match_data.get("fit_analysis")
        else:
            record = MatchRecord(
                candidate_id=candidate_id,
                jd_id=jd_id,
                match_score=match_data.get("match_score", 0),
                matching_skills=match_data.get("matching_skills", []),
                claimed_only_skills=match_data.get("claimed_only_skills", []),
                skill_gaps=match_data.get("skill_gaps", []),
                fit_analysis=match_data.get("fit_analysis")
            )
            db.add(record)

        db.commit()
        db.refresh(record)

        # Build response with populated relation names
        return MatchRecordResponse(
            id=record.id,
            candidate_id=record.candidate_id,
            jd_id=record.jd_id,
            jd_title=jd.title,
            candidate_name=candidate.name,
            match_score=record.match_score,
            matching_skills=record.matching_skills,
            claimed_only_skills=record.claimed_only_skills or [],
            skill_gaps=record.skill_gaps,
            fit_analysis=record.fit_analysis,
            matched_at=record.matched_at
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save match record: {str(e)}"
        )

@router.get("/{candidate_id}/{jd_id}", response_model=MatchRecordResponse)
def get_single_match(candidate_id: str, jd_id: str, db: Session = Depends(get_db)):
    """Get an existing match record for a candidate-JD pair."""
    record = db.query(MatchRecord).filter(
        MatchRecord.candidate_id == candidate_id, 
        MatchRecord.jd_id == jd_id
    ).first()
    
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Match record not found"
        )
        
    return MatchRecordResponse(
        id=record.id,
        candidate_id=record.candidate_id,
        jd_id=record.jd_id,
        jd_title=record.job_description.title if record.job_description else "Unknown Job",
        candidate_name=record.candidate.name if record.candidate else "Unknown Candidate",
        match_score=record.match_score,
        matching_skills=record.matching_skills,
        skill_gaps=record.skill_gaps,
        fit_analysis=record.fit_analysis,
        matched_at=record.matched_at
    )
