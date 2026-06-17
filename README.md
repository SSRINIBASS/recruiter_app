# Eligo — Enterprise AI Recruiter & Candidate Matching Platform

Eligo is a state-of-the-art full-stack AI recruitment platform. It enables HR professionals to upload candidate resumes (PDF/DOCX), parse structured profiles using Google Gemini Flash, define Job Descriptions (JDs), evaluate candidate fit using an evidence-based matching rubric, and automatically generate branded interview outreach emails.

This application showcases clean architecture, modern UI design patterns, resilient mock fallbacks, and real AI integrations.

---

## Key Features

* **Resume File Parsing:** Processes `.pdf` and `.docx` resume formats using stream parsers (`pdfplumber` and `python-docx`).
* **AI-Powered Profile Extraction:** Google Gemini automatically parses resumes upon upload to extract Candidate Name, Email, Phone, Skills List, Experience Years, Education, and a professional summary.
* **Evidence-Based "Proof of Work" Rubric:**
  * Evaluates candidates by cross-referencing claimed skills against concrete project descriptions, achievements, and certifications.
  * Strict scoring parameters cap matching scores for claimed-only skills (max 50-60%) while highlighting verified expertise.
  * Interactive UI tags color-code skills as *Proven* (green), *Claimed Only* (amber), or *Gaps* (gray).
* **Ranked Match Leaderboards:** 
  * Bulk matching compares all candidate profiles in the database against a JD to output an overall fit percentage (0-100), matching skills list, skill gaps, and a fit analysis.
  * Upgraded leaderboard cards highlight the `#1` candidate with a "Top Fit Match" pulsing gradient badge.
  * Score bars utilize vibrant progress gradients (emerald-teal for high, amber-orange for mid, and rose-red for low alignment).
* **Personalized Outreach Engine:**
  * Shortlist candidates and generate invitation emails following the official **Eligo Interview Invitation Template**.
  * Dynamic variables map first name, contact details, and top skills.
  * Inserts clear `[TO BE FILLED]` placeholders for logistics (interview round, format, date, time) to let recruiters easily customize details before sending.
* **Resilient Fail-Safe Design:**
  * **Mock AI Mode:** If `GEMINI_API_KEY` is not provided, the backend falls back to heuristic-based parsing and matching, keeping the entire application functional.
  * **Local Storage Fallback:** If Supabase credentials are not provided, resumes are stored locally on the server disk under `backend/static/resumes/` and served as static resources.

---

## Visual Design & Aesthetics

Eligo is designed with a premium, enterprise-ready look, utilizing:
* **Custom Typography:** Paired Google Fonts (`Plus Jakarta Sans` for the UI and `Playfair Display` for serif headings) to match the brand wordmark.
* **Ambient Glowing Accents:** Subtle radial gradients (`.ambient-glow-top` and `.ambient-glow-bottom`) add depth behind dashboards.
* **Glassmorphism Panels:** Semi-transparent, blurred surfaces for sidebars, cards, and modal backdrops.
* **Micro-Animations:** Fluid hover lifts, glowing card borders, and pulsing state indicators for an interactive experience.
* **Theme Support:** Clean, class-based Day/Night theme toggles persisted in localStorage with Flash of Unstyled Content (FOUC) prevention.

---

## Technology Stack

* **Backend:** Python FastAPI (ASGI web framework) + SQLAlchemy ORM + SQLite (development) / Supabase PostgreSQL (production) + Google Gemini Flash.
* **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Tabler Icons.

---

## Project Structure

This repository is optimized for production; all non-production metadata, journals, templates, and raw docs are ignored in Git to keep the codebase clean.

```
recruiter_app/
├── backend/                      — Python FastAPI server
│   ├── main.py                   — Web app entry point & CORS
│   ├── database.py               — SQLAlchemy configuration
│   ├── models.py                 — Database tables
│   ├── schemas.py                — Pydantic request/response models
│   ├── routes/                   — Candidates, Jobs, Match, and Analyze routes
│   └── services/                 — File parser, storage, and Gemini services
└── frontend/                     — Next.js React client
    ├── app/                      — Page layouts and dynamic route views
    ├── components/               — Premium UI elements (Sidebar, MatchCard, etc.)
    ├── public/                   — SVG/PNG Brand Kit logo assets
    └── lib/api.ts                — Axios-like Fetch client matching contracts
```

---

## Installation & Setup

### 1. Backend Setup (FastAPI)

Navigate to the `backend/` directory:
```bash
cd backend
```

Create a virtual environment and activate it:
```bash
python3 -m venv venv
source venv/bin/activate
```

Install backend dependencies:
```bash
pip install -r requirements.txt
```

Create a `.env` file (you can copy `.env.example` as a template) and add your `GEMINI_API_KEY`:
```bash
cp .env.example .env
```
* `DATABASE_URL`: Defaults to local SQLite (`sqlite:///./eligo.db`). Keep this for easy local testing.

Start the backend server as a module from the root directory:
```bash
# From the project root recruiter_app/
backend/venv/bin/python -m backend.main
```
The backend will run on `http://localhost:8000`. You can access interactive Swagger documentation at `http://localhost:8000/docs`.

### 2. Frontend Setup (Next.js)

Navigate to the `frontend/` directory:
```bash
cd frontend
```

Install frontend packages:
```bash
npm install
```

Configure `.env.local` pointing to the backend API:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

Start the Next.js development server:
```bash
npm run dev
```
The frontend will run on `http://localhost:3000`.
