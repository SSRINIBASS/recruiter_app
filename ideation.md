# TalentIQ — AI-Powered Recruiter App: Complete Ideation Blueprint

## 1. Project Overview

**App name:** TalentIQ  
**Purpose:** End-to-end recruitment management tool that uploads resumes, extracts structured candidate data using AI, manages job descriptions, and matches candidates to JDs with a ranked score and fit analysis.  
**Submission context:** Deloitte final-round project for a fresher AI Engineer candidate. Must demonstrate clean architecture, real AI integration, polished UI, and full deployment.  
**Target user:** Internal HR / recruiter (no public access, no authentication required).

---

## 2. Core Requirements (from Deloitte brief)

| Requirement | Description |
|---|---|
| Resume upload | Support PDF and DOCX, extract text |
| Candidate management | Store and view candidate profiles |
| Job description management | Create and view JDs |
| Candidate-JD matching | Generate match score + fit analysis |
| AI processing | Analyze resume, extract structured info |
| Backend | Python (FastAPI chosen) with REST APIs |
| Frontend | Next.js |
| Database | Relational database |
| Output | Candidate data, resume analysis, match score + fit analysis |

---

## 3. Final Tech Stack

| Layer | Technology | Hosting Platform | Cost |
|---|---|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS | Vercel | Free |
| Backend | Python FastAPI + SQLAlchemy ORM | Render | Free tier |
| Database | PostgreSQL via Supabase | Supabase | Free tier |
| File storage | Supabase Storage | Supabase | Free tier |
| AI model | Gemini Flash 1.5 (Google AI Studio) | Google Cloud | Free tier |
| Domain | Candidate's personal domain | Vercel DNS | Domain cost only |

**Key decisions and rationale:**
- FastAPI chosen for async support, auto-generated Swagger UI at `/docs`, and modern AI-engineer image.
- Supabase chosen for managed Postgres + file storage in one platform, free tier sufficient for demo.
- Gemini Flash chosen because candidate has prior experience, it has a generous free tier, and supports `response_mime_type: "application/json"` for structured output.
- SQLAlchemy ORM used so switching from SQLite (local dev) to Postgres (production) requires only a config change.
- No authentication implemented — app is an internal HR tool for demo purposes. Auth can be added via Supabase Auth or NextAuth in production (mention this in README).

---

## 4. Data Models (Database Schema)

### 4.1 `candidates`
```
id            UUID        PRIMARY KEY
name          TEXT        NOT NULL
email         TEXT
phone         TEXT
resume_url    TEXT        (Supabase Storage public URL)
uploaded_at   TIMESTAMP   DEFAULT now()
```

### 4.2 `job_descriptions`
```
id                UUID        PRIMARY KEY
title             TEXT        NOT NULL
company           TEXT
description_text  TEXT        NOT NULL
created_at        TIMESTAMP   DEFAULT now()
```

### 4.3 `ai_analysis`
```
id                UUID        PRIMARY KEY
candidate_id      UUID        FOREIGN KEY → candidates.id
skills            JSONB       (array of strings)
experience_years  INTEGER
education         TEXT
summary           TEXT        (one-sentence professional summary)
raw_response      JSONB       (full Gemini response stored for debugging)
created_at        TIMESTAMP   DEFAULT now()
```

### 4.4 `match_records`
```
id              UUID        PRIMARY KEY
candidate_id    UUID        FOREIGN KEY → candidates.id
jd_id           UUID        FOREIGN KEY → job_descriptions.id
match_score     INTEGER     (0–100)
matching_skills JSONB       (array of matched skill strings)
skill_gaps      JSONB       (array of missing skill strings)
fit_analysis    TEXT        (2–3 sentence AI-generated explanation)
matched_at      TIMESTAMP   DEFAULT now()
```

---

## 5. API Endpoints (FastAPI Backend)

### Candidates
```
POST   /candidates/upload        Upload resume (PDF/DOCX), parse text, store candidate + file
GET    /candidates               List all candidates
GET    /candidates/{id}          Get single candidate with AI analysis
DELETE /candidates/{id}          Delete candidate
```

### Job Descriptions
```
POST   /jobs                     Create new job description
GET    /jobs                     List all job descriptions
GET    /jobs/{id}                Get single JD
DELETE /jobs/{id}                Delete JD
```

### AI Analysis
```
POST   /analyze/{candidate_id}   Trigger Gemini analysis on candidate resume, store result
GET    /analyze/{candidate_id}   Get existing analysis for candidate
```

### Matching
```
POST   /match/{candidate_id}/{jd_id}    Match single candidate to single JD
POST   /match/bulk/{jd_id}             Match ALL candidates to a JD, return ranked list
GET    /match/{candidate_id}/{jd_id}    Get existing match result
GET    /match/bulk/{jd_id}             Get all match results for a JD, sorted by score desc
```

### Meta
```
GET    /docs        Auto-generated Swagger UI (FastAPI built-in)
GET    /health      Health check endpoint
```

---

## 6. AI Integration (Gemini Flash 1.5)

### 6.1 Resume Analysis Prompt
Called once per candidate after upload. Stores result in `ai_analysis` table.

```
System: You are a professional resume parser. Extract structured information only. Return valid JSON with no extra text, markdown, or explanation.

User: Parse this resume and return a JSON object with exactly these keys:
- name (string): candidate full name
- email (string): email address or null
- phone (string): phone number or null
- skills (array of strings): all technical and soft skills mentioned
- experience_years (integer): total years of work experience
- education (string): highest qualification and institution
- summary (string): one sentence professional summary

Resume text:
{extracted_resume_text}
```

**API config:** Set `response_mime_type: "application/json"` in Gemini call to force clean JSON output.

### 6.2 Candidate-JD Match Prompt
Called on demand (single or bulk). Stores result in `match_records` table.

```
System: You are an expert technical recruiter. Evaluate candidate fit objectively. Return valid JSON only, no extra text.

User: Given this candidate profile and job description, evaluate fit.

Candidate profile:
{ai_analysis JSON}

Job description:
{job_description_text}

Return a JSON object with exactly these keys:
- match_score (integer 0-100): overall fit score
- matching_skills (array of strings): skills candidate has that JD requires
- skill_gaps (array of strings): skills JD requires that candidate lacks
- fit_analysis (string): 2-3 sentences explaining the score, what fits well, and what is missing
```

### 6.3 File Parsing Layer (before AI)
```
PDF files  → pdfplumber library → extract raw text
DOCX files → python-docx library → extract raw text
Both return: plain string of resume text passed to Gemini prompt
```

---

## 7. Frontend Pages (Next.js 14 App Router)

| Route | Page | Key features |
|---|---|---|
| `/` | Dashboard | Stats cards (total candidates, active JDs, matches run, avg score), recent candidates table with inline score bars |
| `/candidates` | Candidate list | Searchable table, avatar initials, status badge, top match score, upload button |
| `/candidates/upload` | Upload resume | Drag-and-drop or file picker (PDF/DOCX), triggers upload + auto-analyze on submit |
| `/candidates/[id]` | Candidate detail | AI analysis card (skills, experience, education, summary), match history, "Match to JD" dropdown |
| `/jobs` | JD list | Cards or table of all job descriptions, "New JD" button |
| `/jobs/new` | Create JD | Form: title, company, description textarea, submit |
| `/jobs/[id]` | JD detail | JD metadata, "Match all candidates" button, ranked leaderboard below |
| `/match/[jdId]` | Match leaderboard | Ranked candidate cards with score bar, matched/gap skill tags, fit analysis text, "View profile" link |

---

## 8. UI Design System

### 8.1 Visual Identity
- **App name:** TalentIQ
- **Style:** Clean corporate (Notion/Linear aesthetic) — flat surfaces, tight borders, generous whitespace
- **Personality:** Subtle uniqueness via a single indigo accent color used sparingly; everything else neutral
- **Performance principle:** No gradients, no shadows, no animations — fast to render for HR daily use

### 8.2 Color Palette
```
Accent (indigo):    #5B5BD6   — used on active nav, primary buttons, score bars, AI badges only
Accent light:       #EEEDFE   — badge backgrounds, hover states
Accent text:        #3C3489   — text on accent-light backgrounds

Surface primary:    white / near-black (CSS variable, auto dark mode)
Surface secondary:  very light gray (CSS variable)
Border:             0.5px, 15% opacity black (CSS variable)

Score high (green): fill #E1F5EE, text #085041
Score medium (amber): fill #FAEEDA, text #633806
Score low (red):    fill #FCEBEB, text #791F1F

Status analyzed:    green badge
Status pending:     amber badge
```

### 8.3 Typography
```
Font:         System sans-serif (Geist via Next.js default)
Data text:    14px, weight 400
Meta/labels:  13px, weight 400
Tags/chips:   11px, weight 500
Headings:     16px, weight 500 (page titles only)
No font sizes below 12px
Two weights only: 400 and 500
```

### 8.4 Component Patterns

**Sidebar navigation:**
- Logo mark (indigo square with briefcase icon) + app name
- Nav items with Tabler outline icons
- Active state: indigo text + indigo-light background
- Section dividers with uppercase 11px labels

**Stat cards (dashboard, 4-column grid):**
- Light gray background, no border, 10px radius
- 11px uppercase label, 22px weight-500 number, 11px delta below

**Candidate/data table rows:**
- Avatar: 28–32px circle, indigo-light background, initials in indigo-text color
- Inline score bar: 4px height track, indigo fill, score number right-aligned
- Status badge: pill shape, semantic color fill

**Match leaderboard cards:**
- Rank number left (#1, #2…)
- Avatar + name + role + fit analysis text
- Skill tags: green pill for matched skills, gray pill for gaps
- Score: large number + small bar
- Top-ranked card gets 1px indigo border accent (only visual distinction)
- "View profile" button: indigo-light background, indigo text

**Buttons:**
- Primary: indigo background, white text, 8px radius
- Secondary: indigo-light background, indigo text, no border
- Destructive: red-light background, red text

---

## 9. Project Folder Structure

```
talentiq/
├── frontend/                          ← Next.js 14 app
│   ├── app/
│   │   ├── layout.tsx                 (root layout with sidebar)
│   │   ├── page.tsx                   (dashboard)
│   │   ├── candidates/
│   │   │   ├── page.tsx               (candidate list)
│   │   │   ├── upload/
│   │   │   │   └── page.tsx           (resume upload form)
│   │   │   └── [id]/
│   │   │       └── page.tsx           (candidate detail)
│   │   ├── jobs/
│   │   │   ├── page.tsx               (JD list)
│   │   │   ├── new/
│   │   │   │   └── page.tsx           (create JD form)
│   │   │   └── [id]/
│   │   │       └── page.tsx           (JD detail + leaderboard)
│   │   └── match/
│   │       └── [jdId]/
│   │           └── page.tsx           (full match leaderboard)
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── StatCard.tsx
│   │   ├── CandidateRow.tsx
│   │   ├── ScoreBar.tsx               (reusable score bar component)
│   │   ├── SkillTag.tsx               (matched/gap pill)
│   │   ├── MatchCard.tsx              (leaderboard row card)
│   │   └── ResumeUpload.tsx           (drag-drop file input)
│   ├── lib/
│   │   └── api.ts                     (all fetch calls to backend)
│   └── tailwind.config.ts
│
└── backend/                           ← FastAPI app
    ├── main.py                        (app entry, CORS config, router registration)
    ├── database.py                    (SQLAlchemy engine + session)
    ├── models.py                      (SQLAlchemy ORM models)
    ├── schemas.py                     (Pydantic request/response schemas)
    ├── routes/
    │   ├── candidates.py
    │   ├── jobs.py
    │   ├── analyze.py
    │   └── match.py
    ├── services/
    │   ├── file_parser.py             (pdfplumber + python-docx text extraction)
    │   ├── storage.py                 (Supabase Storage upload/download)
    │   └── gemini.py                  (Gemini Flash API calls, prompt templates)
    ├── requirements.txt
    └── .env                           (env vars — never committed)
```

---

## 10. Environment Variables

### Backend `.env`
```
DATABASE_URL=postgresql://...supabase...
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=your_service_role_key
SUPABASE_BUCKET=resumes
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend `.env.local`
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

## 11. Deployment Configuration

### Backend → Render
- Service type: Web Service
- Runtime: Python 3.11
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Environment variables: set all backend `.env` values in Render dashboard
- Free tier note: service spins down after inactivity; add a `/health` endpoint for uptime pinging

### Frontend → Vercel
- Connect GitHub repo, set root directory to `/frontend`
- Environment variable: `NEXT_PUBLIC_API_URL` pointing to Render backend URL
- Custom domain: add personal domain in Vercel dashboard → update domain registrar DNS to Vercel nameservers

### Database + Storage → Supabase
- Create project → get `DATABASE_URL` from Settings → Database
- Create storage bucket named `resumes` (public read, authenticated write)
- Run SQLAlchemy migrations or use Supabase SQL editor to create tables manually on first deploy

---

## 12. Key Flows (End-to-End)

### Flow A: Resume Upload → AI Analysis
```
1. HR uploads PDF/DOCX via frontend form
2. Frontend sends multipart/form-data POST to /candidates/upload
3. Backend:
   a. Saves file to Supabase Storage → gets public URL
   b. Extracts text (pdfplumber or python-docx)
   c. Creates candidate record in DB with resume_url
   d. Calls Gemini Flash with analysis prompt + extracted text
   e. Parses JSON response
   f. Stores result in ai_analysis table linked to candidate
4. Frontend shows candidate detail page with AI analysis card
```

### Flow B: Bulk JD Matching → Ranked Leaderboard
```
1. HR opens a JD page, clicks "Match all candidates"
2. Frontend sends POST to /match/bulk/{jd_id}
3. Backend:
   a. Fetches all candidates with existing ai_analysis
   b. For each candidate: sends ai_analysis JSON + JD text to Gemini
   c. Parses match_score, matching_skills, skill_gaps, fit_analysis
   d. Upserts match_record in DB
   e. Returns all match records sorted by match_score DESC
4. Frontend renders ranked leaderboard cards
```

### Flow C: Single Candidate Match
```
1. HR on candidate detail page selects a JD from dropdown
2. Frontend sends POST to /match/{candidate_id}/{jd_id}
3. Backend runs single Gemini match call, stores result
4. Frontend shows match result inline on candidate page
```

---

## 13. What Impresses Deloitte (Checklist)

| Feature | Why it impresses |
|---|---|
| Swagger UI at `/docs` | Shows engineering professionalism; live API docs |
| Structured JSON from Gemini | Shows AI engineering skill, not just API calling |
| Ranked leaderboard with score bars + skill tags | Visually demonstrates product thinking |
| Green matched / gray gap skill pills | HR can scan candidates in 2 seconds — shows UX empathy |
| File parsing layer (PDF + DOCX) | Handles real-world data, not just text input |
| Supabase Storage for files | Production-grade file handling |
| SQLAlchemy ORM | Clean, maintainable code; DB-agnostic |
| Clean README with architecture diagram | Shows communication and documentation skills |
| Deployed on custom domain | Full production deployment, not just localhost |

---

## 14. README Must-Haves

The project README should include:
1. App name, one-line description, and screenshot of dashboard + leaderboard
2. Architecture diagram (Frontend → Backend → DB/Storage/AI)
3. Tech stack table
4. Local development setup (clone, install, env vars, run)
5. Deployment steps (Render + Vercel + Supabase)
6. API endpoint reference (or link to `/docs`)
7. Note: "Authentication can be added via Supabase Auth / NextAuth.js for production use"
8. Note: "AI provider is modular — swap Gemini for OpenAI or Claude by updating `services/gemini.py`"

---

## 15. Build Order (2-day execution plan)

### Day 1 — Backend + AI (priority)
- [ ] Init FastAPI project, connect Supabase Postgres via SQLAlchemy
- [ ] Create all 4 ORM models + run migrations
- [ ] Implement file upload → Supabase Storage → text extraction
- [ ] Implement Gemini analysis service (Prompt A)
- [ ] Build `/candidates` and `/analyze` routes
- [ ] Implement Gemini match service (Prompt B)
- [ ] Build `/jobs` and `/match` routes (single + bulk)
- [ ] Test all endpoints via Swagger `/docs`
- [ ] Deploy backend to Render

### Day 2 — Frontend + Deploy
- [ ] Init Next.js 14 app with Tailwind, set up folder structure
- [ ] Build Sidebar layout component
- [ ] Dashboard page (stat cards + recent candidates table)
- [ ] Candidates list + upload page (with loading state during AI analysis)
- [ ] Candidate detail page (AI analysis card + match dropdown)
- [ ] JD list + create JD page
- [ ] JD detail page with "Match all" button → leaderboard
- [ ] ScoreBar, SkillTag, MatchCard components
- [ ] Deploy frontend to Vercel, connect custom domain
- [ ] Write README

---

## 16. Out of Scope (explicitly excluded)

- User authentication / login
- Email notifications
- Calendar / interview scheduling
- Multi-tenancy
- Resume editing or candidate profile editing post-upload
- Bulk resume upload (multiple files at once)
- Advanced filtering / sorting beyond match score
- Mobile responsiveness (desktop-first for HR tool)

These can be mentioned in README as "future enhancements."

---

*Blueprint version: 1.0 — prepared for AI agent parsing and developer handoff*
