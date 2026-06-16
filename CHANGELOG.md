# CHANGELOG.md

All notable changes to TalentIQ.
Format: [Keep a Changelog](https://keepachangelog.com/) — newest entries at top.

---

## [1.1.0] — 2026-06-16
### Added
- Evidence-based "Proof of Work" candidate-JD matching rubric:
  - Proven skills (green badges), Claimed-only skills (amber/orange badges), and Gaps (dashed gray badges).
  - `claimed_only_skills` JSON column added to SQLite database schema.
- Day/Night Theme Toggle button in the Sidebar component:
  - Stores user contrast preferences in `localStorage`.
  - Head-blocking inline script added in `layout.tsx` to prevent theme visual flashes (FOUC).
- Restored Candidates Shortlist & AI Email Outreach feature:
  - Added backend `/match/outreach` endpoint to generate personalized templates.
  - Integrated `ShortlistModal` on the leaderboard views to review, customize, and copy drafts.
  - Automatically loads sender signature credentials from settings.

### Changed
- Enforced strict evidence constraints inside the Gemini matching prompt (capping claimed-only candidates at 50-60 overall).
- Upgraded the AI service model parameter from `gemini-1.5-flash` to `gemini-2.5-flash` to resolve 404 name conflicts.
- Executed database re-analysis to parse candidate profiles with separate `projects`, `achievements`, and `certifications` arrays.

### Fixed
- Next.js development server static chunk 404 crashes resolved by cleaning `.next` compilation folder.
- ESLint JSX and typescript type warnings during compilation.

---

## [1.0.0] — 2026-06-15
### Added
- Complete FastAPI backend in Python:
  - SQLite database integration with ORM model definitions.
  - Parsers for PDF (`pdfplumber`) and Word (`python-docx`) resumes.
  - Supabase Storage upload with static folder fallback for local testing.
  - Gemini Flash 1.5 parsing and candidate-JD fit match scoring service (with Mock AI fallbacks).
  - API routers for Candidate uploads, Job Descriptions, AI Analysis, and Matching.
- Complete Next.js 14 frontend:
  - Custom colors and typography design tokens configured in Tailwind.
  - Reusable visual components: Sidebar, StatCard, ScoreBar, SkillTag, CandidateRow, MatchCard, ResumeUpload.
  - Page views: Dashboard, Candidates List, Resume Upload, Candidate Profile Details, Job Description List, Create Job, Job Leaderboards.
- Helper scripts for mock DOCX resume generation.
- Full local setup instructions in root README.md.

---

## [0.1.0] — 2026-06-15
### Added
- Project initialized
- Complete ideation blueprint (`ideation.md`)
- 14 framework files generated:
  - `.ai/BRAIN.md` — project intelligence
  - `.ai/PROGRESS.md` — build tracker
  - `.ai/DECISIONS.md` — decision log (11 pre-project decisions recorded)
  - `.ai/ERRORS.md` — failure log template
  - `docs/PRD.md` — product requirements
  - `docs/ARCHITECTURE.md` — system design with ASCII diagram
  - `docs/TECH_STACK.md` — technology registry
  - `docs/DESIGN_SYSTEM.md` — visual tokens and component rules
  - `docs/API_CONTRACTS.md` — endpoint definitions with request/response shapes
  - `.context/CONVENTIONS.md` — coding standards for frontend and backend
  - `.context/GOTCHAS.md` — known traps for Next.js, FastAPI, Supabase, Gemini, etc.
  - `.context/GLOSSARY.md` — domain terminology
  - `docs/USER_GUIDE.md` — end-user documentation
  - `CHANGELOG.md` — this file
- Journal layer generated (3 files):
  - `journal/ASSUMPTION_TRACKER.md` — 15 assumptions extracted from framework files
  - `journal/LEARNING_JOURNAL.md` — Day 0 entry capturing pre-build belief state
  - `journal/INTERVIEW_PREP.md` — initial interview prep with 15 Q&A pairs and verbal briefing

---

> **For AI Agents:** Update this file at the end of any session where meaningful progress was made.
> Use versions: 0.x.0 for pre-launch milestones, 1.0.0 for launch, 1.x.0 for post-launch features.
> Categories: Added / Changed / Fixed / Removed / Security
