# PRD.md — Product Requirements Document

**Product:** TalentIQ
**Version:** 1.0
**Last Updated:** 2026-06-15
**Status:** Approved

---

## Problem Statement

Recruiters and HR professionals manually review resumes, cross-reference skills against job descriptions, and rank candidates — a time-consuming process prone to inconsistency and bias. Existing enterprise ATS tools are expensive, complex, and not designed for quick AI-powered candidate-JD matching with transparent skill gap analysis.

TalentIQ solves this by providing an end-to-end pipeline: upload a resume, get AI-extracted structured candidate data, create job descriptions, and match candidates to JDs with ranked scores, matched/missing skill tags, and AI-generated fit analysis — all in a clean, scannable interface.

## Target Users

### Primary User
**Who:** Internal HR personnel / recruiter at a mid-size company
**Their situation:** Reviewing a batch of resumes for one or more open positions. Working at a desktop in an office setting.
**Their goal:** Quickly identify the best-fit candidates for a specific job description, with clear reasoning for each ranking.
**Their frustration with alternatives:** Manual resume review is slow and inconsistent. Enterprise ATS tools are over-engineered for a simple "upload → analyze → match" workflow.

### Secondary User
**Who:** Deloitte technical evaluators reviewing this submission
**Their situation:** Assessing the candidate's ability to build a full-stack AI-integrated application with clean architecture.
**Their goal:** Verify real AI integration (not mocked), clean code structure, production deployment, and product thinking.

---

## User Stories

### Must Have (v1 launch blockers)
- As a recruiter, I want to upload a resume (PDF or DOCX) so that the system extracts and stores candidate information automatically
- As a recruiter, I want to view a list of all uploaded candidates so that I can see who is in the system
- As a recruiter, I want to view a single candidate's AI-analyzed profile (skills, experience, education, summary) so that I can quickly understand their qualifications
- As a recruiter, I want to create a job description with title, company, and description text so that I can define open positions
- As a recruiter, I want to view a list of all job descriptions so that I can manage open positions
- As a recruiter, I want to match a single candidate to a specific job description so that I can see their fit score and analysis
- As a recruiter, I want to match ALL candidates to a job description at once so that I can see a ranked leaderboard
- As a recruiter, I want to see matched skills (green tags) and skill gaps (gray tags) for each match so that I can scan fit at a glance
- As a recruiter, I want to see a fit analysis (2–3 sentences) explaining the match score so that I understand why a candidate was ranked where they are
- As a recruiter, I want to delete candidates and job descriptions so that I can keep the system clean

### Should Have (v1 if time allows)
- As a recruiter, I want to search and filter the candidate list so that I can find specific candidates quickly
- As a recruiter, I want to see dashboard statistics (total candidates, active JDs, matches run, average score) so that I have an overview of system state

### Won't Have (explicitly out of scope)
- User authentication / login — reason: internal HR tool, demo scope
- Email notifications — reason: not part of core matching flow
- Calendar / interview scheduling — reason: beyond AI matching scope
- Multi-tenancy — reason: single-user demo
- Resume editing post-upload — reason: complexity vs demo value
- Bulk resume upload (multiple files at once) — reason: single upload sufficient for demo
- Advanced filtering / sorting beyond match score — reason: future enhancement
- Mobile responsiveness — reason: desktop-first HR tool

---

## Success Metrics

- **Functional completeness:** All Must Have user stories implemented and working end-to-end
- **AI quality:** Gemini analysis returns structured, accurate candidate data with consistent JSON formatting
- **Match accuracy:** Match scores and fit analysis are reasonable and differentiate between strong/weak fits
- **Deployment:** App accessible via custom domain (frontend) and public URL (backend Swagger /docs)
- **Evaluator impression:** Clean architecture, real AI integration, polished UI — clearly demonstrates product and engineering thinking

---

## Assumptions

- Gemini Flash 1.5 free tier will handle the demo workload without rate limiting
- Supabase free tier storage and database will be sufficient for demo data volume
- Render free tier backend will respond within acceptable latency for demo
- Resumes will be in English and contain standard sections (experience, education, skills)
- PDF and DOCX files will be well-formatted enough for text extraction (not scanned images)

## Open Questions

- None currently — all decisions have been made in ideation phase

## Competitive Context

TalentIQ is not competing with enterprise ATS tools. It is a focused demo application that demonstrates:
- Real AI integration with structured output (not mocked)
- Clean full-stack architecture (FastAPI + Next.js + Postgres)
- Product thinking (ranked leaderboard, skill gap visualization)
- Production deployment (not just localhost)

Reference products studied for UI/UX patterns: Notion (clean layout), Linear (navigation patterns), Lever/Greenhouse (recruiter-specific workflows)
