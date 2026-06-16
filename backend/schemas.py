from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, EmailStr

# ----------------- BASE SCHEMAS -----------------

class AIAnalysisBase(BaseModel):
    skills: List[str]
    experience_years: int
    education: Optional[str] = None
    summary: Optional[str] = None

class CandidateBase(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    resume_url: Optional[str] = None

class JobDescriptionBase(BaseModel):
    title: str
    company: Optional[str] = None
    description_text: str

class MatchRecordBase(BaseModel):
    candidate_id: str
    jd_id: str
    match_score: int
    matching_skills: List[str]
    claimed_only_skills: List[str] = []
    skill_gaps: List[str]
    fit_analysis: Optional[str] = None

# ----------------- CREATE/CREATE IN DB SCHEMAS -----------------

class CandidateCreate(CandidateBase):
    pass

class JobDescriptionCreate(JobDescriptionBase):
    pass

# ----------------- RESPONSE SCHEMAS -----------------

class AIAnalysisResponse(AIAnalysisBase):
    id: str
    candidate_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CandidateResponse(CandidateBase):
    id: str
    uploaded_at: datetime
    has_analysis: bool = False

    model_config = ConfigDict(from_attributes=True)

class JobDescriptionResponse(JobDescriptionBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class MatchRecordResponse(BaseModel):
    id: str
    candidate_id: str
    jd_id: str
    jd_title: Optional[str] = None
    candidate_name: Optional[str] = None
    match_score: int
    matching_skills: List[str]
    claimed_only_skills: List[str] = []
    skill_gaps: List[str]
    fit_analysis: Optional[str] = None
    matched_at: datetime

    model_config = ConfigDict(from_attributes=True)

# ----------------- COMPOSITE RESPONSES -----------------

class CandidateDetailResponse(CandidateResponse):
    analysis: Optional[AIAnalysisResponse] = None
    matches: List[MatchRecordResponse] = []

    model_config = ConfigDict(from_attributes=True)

class BulkMatchResponse(BaseModel):
    jd_id: str
    jd_title: str
    total_candidates: int
    matches: List[MatchRecordResponse]

    model_config = ConfigDict(from_attributes=True)

class UploadResponse(CandidateResponse):
    analysis: Optional[AIAnalysisResponse] = None

    model_config = ConfigDict(from_attributes=True)

class HealthResponse(BaseModel):
    status: str
    timestamp: datetime


# ----------------- OUTREACH SCHEMAS -----------------

class OutreachRequest(BaseModel):
    candidate_ids: List[str]
    jd_id: str
    sender_name: str

class OutreachEmailResponse(BaseModel):
    candidate_id: str
    candidate_name: str
    candidate_email: Optional[str] = None
    subject: str
    body: str

class BulkOutreachResponse(BaseModel):
    emails: List[OutreachEmailResponse]
