# API_CONTRACTS.md — Endpoint Definitions

**Last Updated:** 2026-06-15

> Before building a frontend data call: define the contract here first.
> Before changing an endpoint: update this file, then update the implementation.
> Contracts are law — both sides of the call must match exactly.

---

## Conventions

- All dates: ISO 8601 (`2026-06-16T14:30:00Z`)
- All IDs: string UUID (v4)
- Error format: `{ "detail": "string" }` (FastAPI default)
- Auth: None — no authentication required
- Base URL: `${NEXT_PUBLIC_API_URL}` (e.g., `https://talentiq-backend.onrender.com`)
- Content-Type: `application/json` for all responses; `multipart/form-data` for file uploads

---

## Health Endpoint

### GET /health

Health check for uptime monitoring.

**Request:** No body, no params

**Response 200:**
```json
{
  "status": "healthy",
  "timestamp": "2026-06-16T14:30:00Z"
}
```

---

## Candidate Endpoints

### POST /candidates/upload

Upload a resume file (PDF/DOCX). Backend extracts text, creates candidate, stores file in Supabase Storage, and auto-triggers Gemini analysis.

**Request:** `multipart/form-data`
```
file: File (required) — PDF or DOCX file
```

**Response 201:**
```json
{
  "id": "uuid-string",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0100",
  "resume_url": "https://xxxx.supabase.co/storage/v1/object/public/resumes/uuid.pdf",
  "uploaded_at": "2026-06-16T14:30:00Z",
  "analysis": {
    "id": "uuid-string",
    "skills": ["Python", "FastAPI", "SQL", "Machine Learning"],
    "experience_years": 3,
    "education": "B.Tech Computer Science, IIT Delhi",
    "summary": "Full-stack developer with 3 years of experience in Python and ML."
  }
}
```

**Errors:**
- `400` — Invalid file type (not PDF or DOCX)
- `422` — File could not be parsed (corrupted or empty)
- `500` — Gemini API or Supabase Storage failure

---

### GET /candidates

List all candidates.

**Request:** No body, no params

**Response 200:**
```json
[
  {
    "id": "uuid-string",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0100",
    "resume_url": "https://...",
    "uploaded_at": "2026-06-16T14:30:00Z",
    "has_analysis": true
  }
]
```

---

### GET /candidates/{id}

Get single candidate with AI analysis and match history.

**Path params:** `id` — UUID string

**Response 200:**
```json
{
  "id": "uuid-string",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0100",
  "resume_url": "https://...",
  "uploaded_at": "2026-06-16T14:30:00Z",
  "analysis": {
    "id": "uuid-string",
    "skills": ["Python", "FastAPI", "SQL", "Machine Learning"],
    "experience_years": 3,
    "education": "B.Tech Computer Science, IIT Delhi",
    "summary": "Full-stack developer with 3 years of experience in Python and ML.",
    "created_at": "2026-06-16T14:30:00Z"
  },
  "matches": [
    {
      "id": "uuid-string",
      "jd_id": "uuid-string",
      "jd_title": "ML Engineer",
      "match_score": 82,
      "matching_skills": ["Python", "Machine Learning"],
      "skill_gaps": ["TensorFlow", "Kubernetes"],
      "fit_analysis": "Strong Python and ML background. Lacks specific framework experience.",
      "matched_at": "2026-06-16T15:00:00Z"
    }
  ]
}
```

**Errors:**
- `404` — Candidate not found

---

### DELETE /candidates/{id}

Delete candidate and all associated analysis and match records (cascade).

**Path params:** `id` — UUID string

**Response 200:**
```json
{
  "message": "Candidate deleted successfully"
}
```

**Errors:**
- `404` — Candidate not found

---

## Job Description Endpoints

### POST /jobs

Create a new job description.

**Request:**
```json
{
  "title": "Senior ML Engineer",
  "company": "Acme Corp",
  "description_text": "We are looking for a Senior ML Engineer with 5+ years of experience..."
}
```

**Response 201:**
```json
{
  "id": "uuid-string",
  "title": "Senior ML Engineer",
  "company": "Acme Corp",
  "description_text": "We are looking for...",
  "created_at": "2026-06-16T14:30:00Z"
}
```

**Errors:**
- `422` — Missing required fields (title, description_text)

---

### GET /jobs

List all job descriptions.

**Request:** No body, no params

**Response 200:**
```json
[
  {
    "id": "uuid-string",
    "title": "Senior ML Engineer",
    "company": "Acme Corp",
    "description_text": "We are looking for...",
    "created_at": "2026-06-16T14:30:00Z"
  }
]
```

---

### GET /jobs/{id}

Get single job description.

**Path params:** `id` — UUID string

**Response 200:**
```json
{
  "id": "uuid-string",
  "title": "Senior ML Engineer",
  "company": "Acme Corp",
  "description_text": "We are looking for...",
  "created_at": "2026-06-16T14:30:00Z"
}
```

**Errors:**
- `404` — Job description not found

---

### DELETE /jobs/{id}

Delete job description and all associated match records (cascade).

**Path params:** `id` — UUID string

**Response 200:**
```json
{
  "message": "Job description deleted successfully"
}
```

**Errors:**
- `404` — Job description not found

---

## AI Analysis Endpoints

### POST /analyze/{candidate_id}

Trigger Gemini analysis on a candidate's resume. Creates or overwrites the ai_analysis record.

**Path params:** `candidate_id` — UUID string

**Response 200:**
```json
{
  "id": "uuid-string",
  "candidate_id": "uuid-string",
  "skills": ["Python", "FastAPI", "SQL", "Machine Learning"],
  "experience_years": 3,
  "education": "B.Tech Computer Science, IIT Delhi",
  "summary": "Full-stack developer with 3 years of experience in Python and ML.",
  "created_at": "2026-06-16T14:30:00Z"
}
```

**Errors:**
- `404` — Candidate not found
- `422` — Resume text could not be extracted
- `500` — Gemini API failure

---

### GET /analyze/{candidate_id}

Get existing analysis for a candidate.

**Path params:** `candidate_id` — UUID string

**Response 200:**
```json
{
  "id": "uuid-string",
  "candidate_id": "uuid-string",
  "skills": ["Python", "FastAPI", "SQL", "Machine Learning"],
  "experience_years": 3,
  "education": "B.Tech Computer Science, IIT Delhi",
  "summary": "Full-stack developer with 3 years of experience in Python and ML.",
  "created_at": "2026-06-16T14:30:00Z"
}
```

**Errors:**
- `404` — Candidate not found or no analysis exists

---

## Match Endpoints

### POST /match/{candidate_id}/{jd_id}

Match a single candidate to a single job description. Creates or updates (upsert) the match record.

**Path params:**
- `candidate_id` — UUID string
- `jd_id` — UUID string

**Response 200:**
```json
{
  "id": "uuid-string",
  "candidate_id": "uuid-string",
  "jd_id": "uuid-string",
  "match_score": 82,
  "matching_skills": ["Python", "Machine Learning", "SQL"],
  "skill_gaps": ["TensorFlow", "Kubernetes", "Docker"],
  "fit_analysis": "Strong Python and ML background with solid SQL skills. Lacks specific framework experience with TensorFlow and containerization knowledge.",
  "matched_at": "2026-06-16T15:00:00Z"
}
```

**Errors:**
- `404` — Candidate or JD not found
- `422` — Candidate has no AI analysis (must be analyzed first)
- `500` — Gemini API failure

---

### POST /match/bulk/{jd_id}

Match ALL candidates (with existing analysis) to a job description. Returns ranked list.

**Path params:** `jd_id` — UUID string

**Response 200:**
```json
{
  "jd_id": "uuid-string",
  "jd_title": "Senior ML Engineer",
  "total_candidates": 5,
  "matches": [
    {
      "id": "uuid-string",
      "candidate_id": "uuid-string",
      "candidate_name": "Jane Smith",
      "match_score": 92,
      "matching_skills": ["Python", "TensorFlow", "ML", "Docker"],
      "skill_gaps": ["Kubernetes"],
      "fit_analysis": "Excellent fit with strong ML framework experience...",
      "matched_at": "2026-06-16T15:00:00Z"
    },
    {
      "id": "uuid-string",
      "candidate_id": "uuid-string",
      "candidate_name": "John Doe",
      "match_score": 74,
      "matching_skills": ["Python", "SQL"],
      "skill_gaps": ["TensorFlow", "Docker", "Kubernetes"],
      "fit_analysis": "Good Python base but lacks specific ML framework experience...",
      "matched_at": "2026-06-16T15:00:00Z"
    }
  ]
}
```

**Errors:**
- `404` — JD not found
- `500` — Gemini API failure during batch processing

---

### GET /match/{candidate_id}/{jd_id}

Get existing match result for a specific candidate-JD pair.

**Path params:**
- `candidate_id` — UUID string
- `jd_id` — UUID string

**Response 200:**
```json
{
  "id": "uuid-string",
  "candidate_id": "uuid-string",
  "jd_id": "uuid-string",
  "match_score": 82,
  "matching_skills": ["Python", "Machine Learning"],
  "skill_gaps": ["TensorFlow", "Kubernetes"],
  "fit_analysis": "Strong Python and ML background...",
  "matched_at": "2026-06-16T15:00:00Z"
}
```

**Errors:**
- `404` — Match record not found

---

### GET /match/bulk/{jd_id}

Get all match results for a JD, sorted by match_score descending.

**Path params:** `jd_id` — UUID string

**Response 200:**
```json
{
  "jd_id": "uuid-string",
  "jd_title": "Senior ML Engineer",
  "total_candidates": 5,
  "matches": [
    {
      "id": "uuid-string",
      "candidate_id": "uuid-string",
      "candidate_name": "Jane Smith",
      "match_score": 92,
      "matching_skills": ["Python", "TensorFlow", "ML"],
      "skill_gaps": ["Kubernetes"],
      "fit_analysis": "Excellent fit...",
      "matched_at": "2026-06-16T15:00:00Z"
    }
  ]
}
```

**Errors:**
- `404` — JD not found

---

## Swagger UI

### GET /docs

Auto-generated interactive API documentation (FastAPI built-in). Available in both local development and production deployment.

---

## Shared Types

```typescript
// Frontend TypeScript types — defined in frontend/types/

type Candidate = {
  id: string
  name: string
  email: string | null
  phone: string | null
  resume_url: string | null
  uploaded_at: string  // ISO 8601
  has_analysis?: boolean
  analysis?: AIAnalysis
  matches?: MatchRecord[]
}

type JobDescription = {
  id: string
  title: string
  company: string | null
  description_text: string
  created_at: string  // ISO 8601
}

type AIAnalysis = {
  id: string
  candidate_id: string
  skills: string[]
  experience_years: number
  education: string
  summary: string
  created_at: string  // ISO 8601
}

type MatchRecord = {
  id: string
  candidate_id: string
  jd_id: string
  jd_title?: string
  candidate_name?: string
  match_score: number  // 0–100
  matching_skills: string[]
  skill_gaps: string[]
  fit_analysis: string
  matched_at: string  // ISO 8601
}

type BulkMatchResponse = {
  jd_id: string
  jd_title: string
  total_candidates: number
  matches: MatchRecord[]
}
```
