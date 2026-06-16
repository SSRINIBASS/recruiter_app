# ARCHITECTURE.md — System Design

**Last Updated:** 2026-06-15

---

## System Overview

TalentIQ is a decoupled full-stack application with a Python FastAPI backend and Next.js 14 frontend. The backend serves REST APIs, handles file storage via Supabase Storage, text extraction via pdfplumber/python-docx, AI processing via Gemini Flash 1.5, and persists data in PostgreSQL via SQLAlchemy ORM. The frontend consumes the backend API and renders a clean corporate UI. No authentication layer — the app is an internal HR tool.

## Architecture Diagram

```
                    ┌─────────────────────────────────────────────────────┐
                    │                     BROWSER                        │
                    │              (Desktop — HR User)                   │
                    └──────────────────────┬──────────────────────────────┘
                                           │ HTTPS
                                           ▼
                    ┌─────────────────────────────────────────────────────┐
                    │             FRONTEND (Vercel)                       │
                    │         Next.js 14 — App Router                    │
                    │         Tailwind CSS                                │
                    │                                                     │
                    │   Pages:                                            │
                    │   /              Dashboard (stats + recent)         │
                    │   /candidates    List, Upload, Detail               │
                    │   /jobs          List, Create, Detail               │
                    │   /match/[jdId]  Ranked leaderboard                 │
                    │                                                     │
                    │   lib/api.ts     All fetch calls to backend         │
                    └──────────────────────┬──────────────────────────────┘
                                           │ HTTPS (REST API)
                                           │ NEXT_PUBLIC_API_URL
                                           ▼
                    ┌─────────────────────────────────────────────────────┐
                    │             BACKEND (Render)                        │
                    │         Python FastAPI + Uvicorn                    │
                    │         SQLAlchemy ORM                              │
                    │         CORS Middleware                             │
                    │                                                     │
                    │   Routes:                                           │
                    │   /candidates/*    CRUD + file upload               │
                    │   /jobs/*          CRUD                             │
                    │   /analyze/*       AI resume analysis               │
                    │   /match/*         Candidate-JD matching            │
                    │   /health          Health check                     │
                    │   /docs            Swagger UI (auto-generated)      │
                    │                                                     │
                    │   Services:                                         │
                    │   file_parser.py   PDF/DOCX → raw text              │
                    │   storage.py       Supabase Storage upload          │
                    │   gemini.py        Gemini Flash API calls           │
                    └────┬──────────────────┬────────────────┬────────────┘
                         │                  │                │
                         ▼                  ▼                ▼
              ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
              │  PostgreSQL   │   │   Supabase   │   │  Gemini Flash │
              │  (Supabase)   │   │   Storage    │   │    1.5        │
              │               │   │              │   │  (Google AI)  │
              │  Tables:      │   │  Bucket:     │   │               │
              │  candidates   │   │  "resumes"   │   │  Endpoints:   │
              │  job_desc     │   │              │   │  Analysis     │
              │  ai_analysis  │   │  Stores:     │   │  Matching     │
              │  match_records│   │  PDF/DOCX    │   │               │
              └──────────────┘   └──────────────┘   └──────────────┘
```

## Data Flow

### Flow A: Resume Upload → AI Analysis

```
1. HR uploads PDF/DOCX via frontend drag-drop form
2. Frontend sends multipart/form-data POST to /candidates/upload
3. Backend receives file:
   a. Saves file to Supabase Storage → gets public URL
   b. Extracts raw text (pdfplumber for PDF, python-docx for DOCX)
   c. Creates candidate record in PostgreSQL with resume_url
   d. Calls Gemini Flash with resume analysis prompt + extracted text
   e. Gemini returns structured JSON (name, email, phone, skills, experience_years, education, summary)
   f. Stores parsed result in ai_analysis table linked to candidate_id
4. Backend returns candidate + analysis data
5. Frontend renders candidate detail page with AI analysis card
```

### Flow B: Bulk JD Matching → Ranked Leaderboard

```
1. HR opens a JD detail page, clicks "Match all candidates"
2. Frontend sends POST to /match/bulk/{jd_id}
3. Backend:
   a. Fetches all candidates that have existing ai_analysis records
   b. For each candidate: sends ai_analysis JSON + JD text to Gemini match prompt
   c. Gemini returns match_score, matching_skills, skill_gaps, fit_analysis for each
   d. Upserts match_record in PostgreSQL for each candidate-JD pair
   e. Returns all match records sorted by match_score DESC
4. Frontend renders ranked leaderboard cards with score bars, skill tags, fit analysis
```

### Flow C: Single Candidate Match

```
1. HR on candidate detail page selects a JD from dropdown
2. Frontend sends POST to /match/{candidate_id}/{jd_id}
3. Backend runs single Gemini match call, stores result in match_records
4. Frontend shows match result inline on candidate page
```

---

## Folder Structure

```
recruiter_app/
├── .ai/                              — AI agent project intelligence
│   ├── BRAIN.md                      — Project mental model (read first every session)
│   ├── PROGRESS.md                   — Build tracker and task list
│   ├── DECISIONS.md                  — Decision log with full reasoning
│   └── ERRORS.md                     — Failure log and lessons learned
├── .context/                         — Coding conventions and project knowledge
│   ├── CONVENTIONS.md                — Coding patterns and standards
│   ├── GOTCHAS.md                    — Known traps and fragile areas
│   └── GLOSSARY.md                   — Domain terminology definitions
├── docs/                             — Project documentation
│   ├── PRD.md                        — Product requirements
│   ├── ARCHITECTURE.md               — This file — system design
│   ├── TECH_STACK.md                 — Technology decisions
│   ├── DESIGN_SYSTEM.md              — UI visual rules and tokens
│   ├── API_CONTRACTS.md              — Endpoint request/response shapes
│   └── USER_GUIDE.md                 — End-user documentation
├── frontend/                         — Next.js 14 app
│   ├── app/
│   │   ├── layout.tsx                — Root layout with sidebar navigation
│   │   ├── page.tsx                  — Dashboard (stats + recent candidates)
│   │   ├── candidates/
│   │   │   ├── page.tsx              — Candidate list (searchable table)
│   │   │   ├── upload/
│   │   │   │   └── page.tsx          — Resume upload (drag-drop)
│   │   │   └── [id]/
│   │   │       └── page.tsx          — Candidate detail (AI analysis + matches)
│   │   ├── jobs/
│   │   │   ├── page.tsx              — JD list
│   │   │   ├── new/
│   │   │   │   └── page.tsx          — Create JD form
│   │   │   └── [id]/
│   │   │       └── page.tsx          — JD detail + "Match all" + leaderboard
│   │   └── match/
│   │       └── [jdId]/
│   │           └── page.tsx          — Full match leaderboard
│   ├── components/
│   │   ├── Sidebar.tsx               — Left nav with links and icons
│   │   ├── StatCard.tsx              — Dashboard stat card
│   │   ├── CandidateRow.tsx          — Table row for candidate list
│   │   ├── ScoreBar.tsx              — Reusable match score bar
│   │   ├── SkillTag.tsx              — Matched (green) / gap (gray) pill
│   │   ├── MatchCard.tsx             — Leaderboard row card
│   │   └── ResumeUpload.tsx          — Drag-drop file input
│   ├── lib/
│   │   └── api.ts                    — All fetch calls to backend API
│   └── tailwind.config.ts            — Tailwind with design system tokens
├── backend/                          — Python FastAPI app
│   ├── main.py                       — App entry, CORS, router registration
│   ├── database.py                   — SQLAlchemy engine + session factory
│   ├── models.py                     — SQLAlchemy ORM models (4 tables)
│   ├── schemas.py                    — Pydantic request/response schemas
│   ├── routes/
│   │   ├── candidates.py             — /candidates endpoints
│   │   ├── jobs.py                   — /jobs endpoints
│   │   ├── analyze.py                — /analyze endpoints
│   │   └── match.py                  — /match endpoints
│   ├── services/
│   │   ├── file_parser.py            — pdfplumber + python-docx text extraction
│   │   ├── storage.py                — Supabase Storage upload/URL generation
│   │   └── gemini.py                 — Gemini Flash API calls + prompt templates
│   ├── requirements.txt              — Python dependencies
│   └── .env                          — Environment variables (never committed)
├── ideation.md                       — Full ideation blueprint
├── CHANGELOG.md                      — Version history
└── README.md                         — Project documentation for evaluators
```

## Database Schema

```
candidates
  - id:           UUID (PK, auto-generated)
  - name:         TEXT (NOT NULL)
  - email:        TEXT (nullable)
  - phone:        TEXT (nullable)
  - resume_url:   TEXT (Supabase Storage public URL)
  - uploaded_at:  TIMESTAMP (DEFAULT now())

job_descriptions
  - id:               UUID (PK, auto-generated)
  - title:            TEXT (NOT NULL)
  - company:          TEXT (nullable)
  - description_text: TEXT (NOT NULL)
  - created_at:       TIMESTAMP (DEFAULT now())

ai_analysis
  - id:               UUID (PK, auto-generated)
  - candidate_id:     UUID (FK → candidates.id, ON DELETE CASCADE)
  - skills:           JSONB (array of strings)
  - experience_years: INTEGER
  - education:        TEXT
  - summary:          TEXT (one-sentence professional summary)
  - raw_response:     JSONB (full Gemini response for debugging)
  - created_at:       TIMESTAMP (DEFAULT now())

match_records
  - id:               UUID (PK, auto-generated)
  - candidate_id:     UUID (FK → candidates.id, ON DELETE CASCADE)
  - jd_id:            UUID (FK → job_descriptions.id, ON DELETE CASCADE)
  - match_score:      INTEGER (0–100)
  - matching_skills:  JSONB (array of matched skill strings)
  - skill_gaps:       JSONB (array of missing skill strings)
  - fit_analysis:     TEXT (2–3 sentence AI explanation)
  - matched_at:       TIMESTAMP (DEFAULT now())

Relationships:
  - candidates 1 ←→ 1 ai_analysis (one analysis per candidate)
  - candidates 1 ←→ N match_records (matched to many JDs)
  - job_descriptions 1 ←→ N match_records (many candidates matched)
  - match_records has UNIQUE constraint on (candidate_id, jd_id) — upsert on re-match
```

## Third-Party Integrations

| Service | Purpose | Integration Point | Auth Method |
|---------|---------|-------------------|-------------|
| Supabase Postgres | Primary database | `backend/database.py` via SQLAlchemy | Connection string (DATABASE_URL) |
| Supabase Storage | Resume file storage | `backend/services/storage.py` | Service role key (SUPABASE_KEY) |
| Google Gemini Flash 1.5 | Resume analysis + JD matching | `backend/services/gemini.py` | API key (GEMINI_API_KEY) |

## Key Architectural Decisions

- **Decoupled frontend/backend** — separate deployments allow independent scaling and development
- **SQLAlchemy ORM** — DB-agnostic, SQLite for local dev, Postgres for production (config change only)
- **Auto-analyze on upload** — resume analysis is triggered automatically during upload, not as a separate user action
- **Structured JSON from Gemini** — using `response_mime_type: "application/json"` eliminates parsing issues
- **Upsert on re-match** — matching the same candidate-JD pair again updates the existing record

See `.ai/DECISIONS.md` for full decision log with alternatives considered.

## What This Architecture Does NOT Support

- **Multi-user / multi-tenant** — no user isolation, all data shared
- **Real-time updates** — no WebSocket or polling; data refreshes on page load
- **Horizontal scaling** — single backend instance on Render free tier
- **File versioning** — re-uploading a resume creates a new candidate, doesn't update existing
- **Async job queue** — bulk matching runs synchronously (acceptable for demo volume)
