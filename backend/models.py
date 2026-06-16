import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON, UniqueConstraint
from sqlalchemy.orm import relationship
from .database import Base

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    resume_url = Column(String, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    # One-to-one relationship with AIAnalysis
    analysis = relationship("AIAnalysis", uselist=False, back_populates="candidate", cascade="all, delete-orphan")
    # One-to-many relationship with MatchRecord
    matches = relationship("MatchRecord", back_populates="candidate", cascade="all, delete-orphan")


class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    company = Column(String, nullable=True)
    description_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    # One-to-many relationship with MatchRecord
    matches = relationship("MatchRecord", back_populates="job_description", cascade="all, delete-orphan")


class AIAnalysis(Base):
    __tablename__ = "ai_analysis"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    candidate_id = Column(String(36), ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False, unique=True)
    skills = Column(JSON, nullable=False, default=list)  # Stored as JSON array of strings
    experience_years = Column(Integer, nullable=False, default=0)
    education = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    raw_response = Column(JSON, nullable=True)  # Full JSON response from Gemini
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    candidate = relationship("Candidate", back_populates="analysis")


class MatchRecord(Base):
    __tablename__ = "match_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    candidate_id = Column(String(36), ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    jd_id = Column(String(36), ForeignKey("job_descriptions.id", ondelete="CASCADE"), nullable=False)
    match_score = Column(Integer, nullable=False, default=0)  # 0 to 100
    matching_skills = Column(JSON, nullable=False, default=list)    # Skills proven by evidence
    claimed_only_skills = Column(JSON, nullable=False, default=list)  # Claimed but unproven skills
    skill_gaps = Column(JSON, nullable=False, default=list)          # Skills missing entirely
    fit_analysis = Column(Text, nullable=True)
    matched_at = Column(DateTime, default=datetime.utcnow)

    # Unique constraint on candidate_id and jd_id to allow upserts on re-matching
    __table_args__ = (
        UniqueConstraint("candidate_id", "jd_id", name="uq_candidate_jd"),
    )

    # Relationships
    candidate = relationship("Candidate", back_populates="matches")
    job_description = relationship("JobDescription", back_populates="matches")
