# BRAIN.md — TalentIQ Project Intelligence

> READ THIS FILE FIRST. Every session starts here.

## What This Project Is

TalentIQ is an AI-powered recruiter application that allows HR personnel to upload resumes (PDF/DOCX), extract structured candidate data using Google Gemini Flash 1.5, manage job descriptions, and match candidates to JDs with a ranked score and fit analysis. It is being built as a Deloitte final-round project submission for a fresher AI Engineer position — the app must demonstrate clean architecture, real AI integration, polished UI, and full deployment.

## Current Phase
 
**Phase:** Build Completed, Verified, & Documented (Local)
- **Previous phase:** Build & Polish Phase
- **Current focus:** Final handoff and demo presentation
- **Next immediate tasks:**
  1. Hand over to user for live manual verification/testing
  2. Deploy to production (Render/Vercel) if scheduled by the user

## What Has Been Built

The complete full-stack recruiter matching application has been implemented and compiled:
- **FastAPI Backend**: Fully operational on port `8000` with active SQLite database schema containing `claimed_only_skills`, multi-format parse engine (PDF/DOCX), local static storage fallback, and Gemini Flash 2.5/1.5 integration (with mock fallbacks).
- **Next.js 14 Frontend**: Fully compiled and running on port `3000` incorporating clean corporate styling, Day/Night theme toggle (saved to local storage, flash-prevented), sidebar layouts, resume file uploader with auto-analysis redirect, candidates/jobs details, and the leaderboard matching view.

## What Comes Next

1. **User Testing:**
   - Deliver the local environment access details to the user.
   - User does manual E2E validation (upload resumes, create JDs, run matching).
2. **Production Deployment (Optional/On-Demand):**
   - Deploy backend to Render.
   - Deploy frontend to Vercel.
   - Verify cloud DB & storage connections.

## Hard Constraints

- **No authentication** (except email lists / outreach details as mock data) — app is an internal HR tool for demo purposes
- **No gradients, no shadows, no animations** — the UI follows a clean corporate aesthetic (Notion/Linear style)
- **Gemini Flash 2.5/1.5 only** — must use `response_mime_type: "application/json"` for structured output
- **SQLAlchemy ORM required** — enables easy DB-agnostic switching between SQLite (local) and Postgres (production)
- **PDF and DOCX support required** — use pdfplumber for PDF, python-docx for DOCX
- **No multi-tenancy, no user auth, no real-email sending, no calendar** — explicitly out of scope
- **Desktop-first** — no mobile responsiveness required (HR tool)
- **Free tier hosting only** — Render (backend), Vercel (frontend), Supabase (DB + storage)

## Soft Constraints

- Two font weights only: 400 and 500
- No font sizes below 12px
- Single accent color (indigo #5B5BD6) used sparingly
- System sans-serif font (Geist via Next.js default)
- Auto-analyze resume immediately on upload (no separate step for user)

## Repo Map

```
recruiter_app/
├── .ai/                          — AI agent context files (BRAIN, PROGRESS, DECISIONS, ERRORS)
├── .context/                     — Coding conventions, gotchas, glossary
├── docs/                         — PRD, architecture, tech stack, design system, API contracts, user guide
├── frontend/                     — Next.js 14 app (App Router + Tailwind CSS)
│   ├── app/
│   │   ├── layout.tsx            — Root layout with sidebar
│   │   ├── page.tsx              — Dashboard
│   │   ├── candidates/
│   │   │   ├── page.tsx          — Candidate list
│   │   │   ├── upload/page.tsx   — Resume upload form
│   │   │   └── [id]/page.tsx     — Candidate detail
│   │   ├── jobs/
│   │   │   ├── page.tsx          — JD list
│   │   │   ├── new/page.tsx      — Create JD form
│   │   │   └── [id]/page.tsx     — JD detail + leaderboard
│   │   └── match/
│   │       └── [jdId]/page.tsx   — Full match leaderboard
│   ├── components/               — Reusable UI components
│   │   ├── Sidebar.tsx
│   │   ├── StatCard.tsx
│   │   ├── CandidateRow.tsx
│   │   ├── ScoreBar.tsx
│   │   ├── SkillTag.tsx
│   │   ├── MatchCard.tsx
│   │   ├── ResumeUpload.tsx
│   │   └── ShortlistModal.tsx
│   ├── lib/
│   │   └── api.ts                — All fetch calls to backend
│   └── tailwind.config.ts
├── backend/                      — Python FastAPI app
│   ├── main.py                   — App entry, CORS config, router registration
│   ├── database.py               — SQLAlchemy engine + session
│   ├── models.py                 — SQLAlchemy ORM models
│   ├── schemas.py                — Pydantic request/response schemas
│   ├── routes/
│   │   ├── candidates.py
│   │   ├── jobs.py
│   │   ├── analyze.py
│   │   └── match.py
│   ├── services/
│   │   ├── file_parser.py        — pdfplumber + python-docx text extraction
│   │   ├── storage.py            — Supabase Storage upload/download
│   │   └── gemini.py             — Gemini Flash API calls, prompt templates
│   ├── requirements.txt
│   └── .env                      — Environment vars (never committed)
├── ideation.md                   — Full ideation blueprint
├── Task.pdf                      — Deloitte brief
├── GENERATE_FRAMEWORK.md         — Framework generation prompt
├── CHANGELOG.md                  — Version history
└── README.md                     — Project documentation
```

## Key Files To Read For Context

1. `BRAIN.md` (this file) — always first
2. `.ai/PROGRESS.md` — current state of build
3. `.ai/DECISIONS.md` — what has been decided and why
4. `.ai/ERRORS.md` — what has failed and why
5. `.context/CONVENTIONS.md` — before writing any code
6. `docs/DESIGN_SYSTEM.md` — before building any UI

## Session End Protocol

At the end of every session, update:
- `PROGRESS.md` — mark completed tasks, update current focus
- `DECISIONS.md` — log any new technical decisions made
- `ERRORS.md` — log any errors encountered and their fixes
- `BRAIN.md` — update "Current Phase" and "What Has Been Built" sections
