# TalentIQ — AI Recruitment & Candidate Matching Platform

TalentIQ is an AI-powered recruitment application that enables HR professionals and recruiters to upload candidate resumes (PDF/DOCX), automatically parse and extract structured profile data using Google Gemini Flash 1.5, write Job Descriptions (JDs), and perform bulk candidate-to-JD match score evaluations.

This project was built as a final-round technical demo for the Deloitte fresher AI Engineer position, showcasing clean architecture, real AI integration, and robust full-stack implementation.

---

## Key Features

- **Resume File Parsing**: Processes `.pdf` and `.docx` resume formats using stream parsers (`pdfplumber` and `python-docx`).
- **AI-Powered Profile Extraction**: Google Gemini Flash 1.5 automatically parses resumes upon upload to extract Candidate Name, Email, Phone, Skills List, Experience Years, Education, and a professional summary.
- **Job Description Management**: CRUD endpoints to create, read, and delete job descriptions.
- **Ranked Match Leaderboards**: Bulk matching compares all candidate profiles in the database against a JD to output an overall fit percentage (0-100), matching skills list, skill gaps (skills requested in JD but missing in candidate), and a fit analysis.
- **Robust Fail-Safe Design**:
  - **Mock AI Mode**: If `GEMINI_API_KEY` is not provided, the backend falls back to heuristic-based parsing and matching, ensuring that the entire application remains fully functional and testable.
  - **Local Storage Fallback**: If Supabase credentials are not provided, resumes are stored locally on the server disk under `backend/static/resumes/` and served as static resources, bypassing the need for cloud setup.

---

## Technology Stack

- **Backend**: Python FastAPI (ASGI web framework) + SQLAlchemy ORM + SQLite (development) / Supabase PostgreSQL (production).
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Tabler Icons.
- **AI Model**: Google Gemini Flash 1.5.

---

## Project Structure

```
recruiter_app/
├── .ai/                          — Project intelligence & progress logs
├── .context/                     — Coding conventions & glossary
├── docs/                         — Architecture & API contract documents
├── backend/                      — Python FastAPI server
│   ├── main.py                   — Web app entry point & CORS
│   ├── database.py               — SQLAlchemy configuration
│   ├── models.py                 — Database tables
│   ├── schemas.py                — Pydantic request/response models
│   ├── routes/                   — Candidates, Jobs, Match, and Analyze routes
│   └── services/                 — File parser, storage, and Gemini services
└── frontend/                     — Next.js React client
    ├── app/                      — Page layouts and dynamic route views
    ├── components/               — Reusable Notion/Linear design elements
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

Create a `.env` file (you can copy `.env.example` as a template):
```bash
cp .env.example .env
```
Update `.env` with your API keys:
- `DATABASE_URL`: Defaults to local SQLite (`sqlite:///./talentiq.db`). Keep this for easy local testing.
- `GEMINI_API_KEY`: Provide your Google AI Studio key to enable live Gemini parser/matching. If empty, the app runs in **Mock AI Mode**.
- `SUPABASE_URL` & `SUPABASE_KEY`: Provide to save resumes to Supabase Storage. If empty, the app runs in **Local Storage Fallback** saving files to disk.

Start the backend server:
```bash
python3 main.py
```
The backend will run on `http://localhost:8000`. You can access interactive Swagger documentation at `http://localhost:8000/docs`.

---

### 2. Frontend Setup (Next.js)

Open a new terminal and navigate to the `frontend/` directory:
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

---

## Testing & Verification

1. Open `http://localhost:3000` in your web browser.
2. Go to **Job Descriptions** and click **New Job Description**. Create a job with requirements (e.g. title: "Senior Python Developer", requirements: "Seeking Python, SQL, FastAPI, Git").
3. Go to **Upload Resume** and upload a candidate resume file (PDF or DOCX).
4. After upload, you will be automatically redirected to the parsed candidate detail profile where the AI insights display the parsed skills and summary.
5. In the right panel of the candidate profile, select the Job Description from the dropdown and click **Evaluate Fit Match** to run a single candidate match.
6. Alternatively, go to **Job Descriptions** -> select the Job Description -> click **Match All Candidates** to run bulk matching and view the ranked candidate leaderboard.
