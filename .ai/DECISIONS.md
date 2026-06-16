# DECISIONS.md — Decision Log

> Before making any architectural, library, or product decision: check this file.
> Before suggesting an alternative approach: check if it was already rejected here.

---

## Pre-project — Backend Framework: FastAPI

**Context:** Need a Python backend framework for REST APIs serving an AI-powered recruiter app.
**Options Considered:**
- FastAPI — Async support, auto-generated Swagger UI at `/docs`, modern Python, strong typing with Pydantic
- Flask — Lightweight, mature ecosystem, but no built-in async, no auto-docs
- Django — Full-featured, admin panel, but heavy for a focused API app, overkill for demo scope
**Decision:** FastAPI
**Reason:** Async support is ideal for AI API calls (Gemini). Auto-generated Swagger UI at `/docs` demonstrates engineering professionalism to Deloitte reviewers. Pydantic integration gives clean request/response validation. Projects a "modern AI engineer" image.
**Made By:** Human
**Reversibility:** Medium — would require rewriting all routes, schemas, and middleware
**Related Files Affected:** `backend/main.py`, `backend/routes/`, `backend/schemas.py`

---

## Pre-project — Frontend Framework: Next.js 14 (App Router)

**Context:** Need a frontend framework as specified in Deloitte brief (Next.js required).
**Options Considered:**
- Next.js 14 with App Router — Required by brief, server components, modern React
- Next.js with Pages Router — Older pattern, less impressive for submission
**Decision:** Next.js 14 with App Router
**Reason:** Required by Deloitte brief. App Router is the latest pattern, demonstrates up-to-date knowledge.
**Made By:** Human (constrained by brief)
**Reversibility:** Hard — fundamental frontend architecture
**Related Files Affected:** `frontend/app/`, all page components

---

## Pre-project — Database: PostgreSQL via Supabase

**Context:** Need a relational database (required by brief) with file storage capability.
**Options Considered:**
- Supabase (Postgres + Storage) — Managed, free tier, built-in file storage, REST API
- PlanetScale (MySQL) — Good free tier but MySQL, no built-in file storage
- Neon (Postgres) — Postgres but no file storage, would need separate S3
- Railway (Postgres) — Good but less generous free tier
**Decision:** Supabase
**Reason:** Managed Postgres + file storage in one platform. Free tier is sufficient for demo. Storage bucket for resumes eliminates need for separate file hosting. Direct Postgres connection works with SQLAlchemy.
**Made By:** Human
**Reversibility:** Medium — SQLAlchemy ORM makes DB swap easy, but storage service is Supabase-specific
**Related Files Affected:** `backend/database.py`, `backend/services/storage.py`, `.env`

---

## Pre-project — ORM: SQLAlchemy

**Context:** Need a database access layer for FastAPI.
**Options Considered:**
- SQLAlchemy — DB-agnostic, mature, well-documented, supports SQLite (local dev) → Postgres (prod) switching
- Tortoise ORM — Async-first, but less mature
- Raw SQL — No ORM overhead, but harder to maintain, not DB-agnostic
**Decision:** SQLAlchemy
**Reason:** DB-agnostic — switching from SQLite (local development) to Postgres (production) requires only a config change. Mature, well-documented, and clean codebase for submission review.
**Made By:** Human
**Reversibility:** Medium — would require rewriting all model definitions and queries
**Related Files Affected:** `backend/database.py`, `backend/models.py`

---

## Pre-project — AI Model: Gemini Flash 1.5 (Google AI Studio)

**Context:** Need an AI model for resume parsing and candidate-JD matching.
**Options Considered:**
- Gemini Flash 1.5 — Prior experience, generous free tier, supports `response_mime_type: "application/json"` for structured output
- OpenAI GPT-4 — Strong but expensive, no free tier for production use
- Claude (Anthropic) — Good but no built-in JSON mode at the time
**Decision:** Gemini Flash 1.5
**Reason:** Candidate has prior experience with Gemini. Generous free tier supports demo without cost. Critical feature: `response_mime_type: "application/json"` forces clean JSON output, eliminating parsing issues.
**Made By:** Human
**Reversibility:** Easy — AI provider is modular; swap by updating `services/gemini.py` only
**Related Files Affected:** `backend/services/gemini.py`, `.env`

---

## Pre-project — File Storage: Supabase Storage

**Context:** Need to store uploaded resume files (PDF/DOCX) with public URLs.
**Options Considered:**
- Supabase Storage — Already using Supabase for DB, free tier, public URLs
- AWS S3 — Industry standard but requires separate account and config
- Cloudinary — Good for images, less ideal for documents
**Decision:** Supabase Storage
**Reason:** Already using Supabase for database — consolidating services reduces complexity. Public read URLs make resume access simple. Bucket named "resumes" with public read, authenticated write.
**Made By:** Human
**Reversibility:** Easy — swap storage provider by updating `services/storage.py`
**Related Files Affected:** `backend/services/storage.py`, `.env`

---

## Pre-project — No Authentication

**Context:** Whether to implement user auth for the recruiter app.
**Options Considered:**
- Supabase Auth — Easy integration with existing Supabase setup
- NextAuth.js — Popular Next.js auth library
- No auth — Simplest, fastest, appropriate for demo scope
**Decision:** No authentication
**Reason:** App is an internal HR tool for demo purposes. Auth adds complexity without demonstrating AI engineering skills (the focus of the submission). Auth can be added later via Supabase Auth or NextAuth — this will be noted in the README.
**Made By:** Human
**Reversibility:** Easy — add Supabase Auth or NextAuth later
**Related Files Affected:** All routes (no auth middleware needed)

---

## Pre-project — UI Design: Clean Corporate (Notion/Linear Aesthetic)

**Context:** Need a visual design direction for the frontend.
**Options Considered:**
- Clean corporate (Notion/Linear style) — Flat surfaces, tight borders, generous whitespace, fast rendering
- Bold/expressive — More visually striking but risks looking unprofessional for HR tool
- Material Design — Google-standard but generic
**Decision:** Clean corporate with single indigo accent
**Reason:** HR users need fast, scannable interfaces. No gradients, shadows, or animations — fast to render for daily use. Single indigo accent (#5B5BD6) provides visual identity without complexity.
**Made By:** Human
**Reversibility:** Easy — CSS/Tailwind token changes only
**Related Files Affected:** `docs/DESIGN_SYSTEM.md`, `frontend/tailwind.config.ts`, all frontend components

---

## Pre-project — CSS Framework: Tailwind CSS

**Context:** Need a CSS approach for the Next.js frontend.
**Options Considered:**
- Tailwind CSS — Utility-first, fast iteration, widely adopted, works well with Next.js
- Vanilla CSS — Full control but slower development
- Styled Components — CSS-in-JS, but server components compatibility issues
**Decision:** Tailwind CSS
**Reason:** Fast iteration speed critical for 2-day build timeline. Utility-first approach maps cleanly to the design system tokens. Standard pairing with Next.js.
**Made By:** Human
**Reversibility:** Hard — would require rewriting all component styles
**Related Files Affected:** `frontend/tailwind.config.ts`, all `.tsx` files

---

## Pre-project — Deployment: Render (Backend) + Vercel (Frontend)

**Context:** Need hosting for both backend and frontend, free tier required.
**Options Considered:**
- Render + Vercel — Standard pairing, both have free tiers, Vercel optimal for Next.js
- Railway — Good but less generous free tier
- AWS — Overkill for demo project
**Decision:** Render for backend, Vercel for frontend
**Reason:** Vercel is the canonical Next.js host. Render has a free tier for Python web services. Both support environment variables and custom domains.
**Made By:** Human
**Reversibility:** Easy — standard deployment, can migrate to any cloud provider
**Related Files Affected:** Deployment config, environment variables

---

## Pre-project — File Parsing: pdfplumber + python-docx

**Context:** Need to extract raw text from uploaded resume files before sending to Gemini.
**Options Considered:**
- pdfplumber + python-docx — Dedicated libraries, clean text extraction
- PyPDF2 — Older, less reliable text extraction
- Apache Tika — Heavy JVM dependency, overkill for two file types
**Decision:** pdfplumber for PDF, python-docx for DOCX
**Reason:** Both are lightweight, focused libraries. pdfplumber handles complex PDF layouts well. python-docx is the standard for .docx parsing. Together they cover both required file types.
**Made By:** Human
**Reversibility:** Easy — swap parsing library in `services/file_parser.py`
**Related Files Affected:** `backend/services/file_parser.py`, `backend/requirements.txt`

---

## Build Phase — Resilient Fallback Architecture (Local Storage & Heuristics Mock AI)

**Context:** Evaluators running the application locally might not immediately configure correct cloud credentials (Supabase database/storage or Google Gemini API keys).
**Options Considered:**
- Fail on missing keys — Raise errors and refuse execution if environment variables are not populated.
- Resilient fallback execution — If credentials are unconfigured or placeholder strings are present:
  - Store uploaded resumes locally in a static folder and serve them via FastAPI static mounts.
  - Parse and match resumes using regex heuristics and mock data templates instead of failing on Gemini API requests.
**Decision:** Resilient fallback execution
**Reason:** Ensures a 100% successful local onboarding experience for reviewers. Evaluators can run, test, upload, and rank candidates immediately upon cloning the repository without setting up Supabase buckets or Google AI Studio accounts. It projects robust production-level software engineering discipline.
**Made By:** AI Agent & Human Pair Programming
**Reversibility:** Easy — Can force strict validation by removing fallbacks in `services/storage.py` and `services/gemini.py`.
**Related Files Affected:** `backend/services/storage.py`, `backend/services/gemini.py`, `backend/main.py`

---

## 2026-06-15 — Revert Shortlist & AI Email Outreach Feature

**Context:** The user requested the implementation of a "Shortlist" feature to select top K candidates and draft outreach emails with sender signatures. After implementation, the user requested to revert the changes to keep the focus strictly on the core candidate-JD matching features.
**Options Considered:**
- Keep the shortlist outreach feature — Adds more complexity and requires extra UI panels, simulated outboxes, and email schemas.
- Revert the shortlist outreach feature — Restores the application to the baseline state.
**Decision:** Revert the shortlist outreach feature
**Reason:** User preference to stick to the baseline recruiter matching functionality and avoid unnecessary components or schemas not part of the core evaluation criteria.
**Made By:** Both (User requested rollback, Agent executed code cleanup)
**Reversibility:** Easy — features were fully removed.
**Related Files Affected:** `backend/schemas.py`, `backend/routes/match.py`, `backend/services/gemini.py`, `frontend/lib/api.ts`, `frontend/app/jobs/[id]/page.tsx`, `docs/PRD.md`, deleted `frontend/components/EmailReviewModal.tsx`

---

## 2026-06-16 — Restore Shortlist & AI Email Outreach

**Context:** The user requested to bring back candidate shortlisting (selecting top K candidates) and generating AI-personalized outreach emails to reach out to candidates.
**Options Considered:**
- Do not restore — Sticking to the decision of keeping code footprint minimal.
- Restore outreach features — Implement a lightweight, modular flow that stores settings locally without bloated DB tables.
**Decision:** Restore outreach features via a custom modal (`ShortlistModal`)
**Reason:** Recruiters need to action the leaderboard rankings directly. Restoring this with local storage integration for the recruiter's name keeps the codebase clean and modular.
**Made By:** Both
**Reversibility:** Easy — Can hide button and modal if not needed.
**Related Files Affected:** `backend/routes/match.py`, `backend/services/gemini.py`, `frontend/lib/api.ts`, `frontend/app/jobs/[id]/page.tsx`, `frontend/components/ShortlistModal.tsx`

---

## 2026-06-16 — Evidence-Based "Proof of Work" Matching Rubric

**Context:** Recruiters found that candidates list skills on resumes without proving real-world experience, leading to inflated match scores. We needed to evaluate candidates strictly based on evidence.
**Options Considered:**
- Standard keyword-matching — Grade candidates simply by the presence of keywords in the resume.
- Strict "Proof of Work" rubric — Evaluate if each required skill is supported by matching projects, achievements, or experience descriptions in the candidate profile:
  - Proven (Lists skill + has project/work evidence): Full points.
  - Claimed Only (Lists skill, no evidence): Capped at partial credit (max 50% weight).
  - Missing: Penalty.
**Decision:** Strict "Proof of Work" rubric with separate DB columns
**Reason:** Forces Gemini to score candidates based on verifiable evidence. Capping unproven claims prevents profile inflation, sorting candidates honestly on the leaderboard.
**Made By:** Both
**Reversibility:** Medium — Requires reverting DB schemas, match routes, and UI badges back to binary matching state.
**Related Files Affected:** `backend/models.py`, `backend/routes/match.py`, `backend/services/gemini.py`, `frontend/components/MatchCard.tsx`, `frontend/components/SkillTag.tsx`, `frontend/lib/api.ts`

---

## 2026-06-16 — AI Model Swap: gemini-2.5-flash

**Context:** The backend returned a `404` error trying to access `models/gemini-1.5-flash` in this environment's generative AI registry.
**Options Considered:**
- Stay on gemini-1.5-flash — Debug local environment issues or update python packages.
- Swap model to gemini-2.5-flash — Switch the model name parameter to `gemini-2.5-flash`, which is present in the active models list of our API key.
**Decision:** Swap model to `gemini-2.5-flash`
**Reason:** Restores the AI services instantly. `gemini-2.5-flash` is newer, backward-compatible, and fully active in this environment, preventing downtime.
**Made By:** Agent
**Reversibility:** Easy — String replacement in `services/gemini.py`.
**Related Files Affected:** `backend/services/gemini.py`

---

## 2026-06-16 — Day/Night Theme Toggle

**Context:** Recruiters requested a manual light/dark mode toggle button to customize their interface contrast.
**Options Considered:**
- System-only fallback — Leave theme styling bound entirely to `@media (prefers-color-scheme: dark)`.
- Class-based toggle with localStorage state — Add a toggle button in the sidebar that applies `.dark`/`.light` classes, persists settings, and checks them via a head-blocking script to prevent flashes.
**Decision:** Class-based toggle with localStorage state & head-blocking flash prevention
**Reason:** Gives users full control over the UI style. Synchronizing it in layout `<head>` avoids color flashes during client hydration.
**Made By:** Both
**Reversibility:** Easy — Remove sidebar toggle button and head script.
**Related Files Affected:** `frontend/components/Sidebar.tsx`, `frontend/app/layout.tsx`, `frontend/app/globals.css`



