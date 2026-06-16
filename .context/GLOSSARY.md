# GLOSSARY.md — Domain Terminology

**Last Updated:** 2026-06-15

> These are the canonical terms for this project.
> Use these exact terms in: code (variable names, function names), UI labels, documentation, and all communication.
> If a synonym exists, pick one and stick to it — list the others as aliases.

---

## Core Entities

### Candidate
**Definition:** A person whose resume has been uploaded to the system. Represents a potential job applicant.
**Used in:** Code (`Candidate` model, `/candidates` routes) / UI (candidate list, candidate detail page)
**Aliases (DO NOT USE):** Applicant, Jobseeker, User, Profile
**Example:** John Doe, whose resume (PDF) was uploaded on June 15, and whose AI analysis shows 3 years of Python experience.

### Job Description (JD)
**Definition:** A text document describing an open position, including title, company, and required qualifications/skills.
**Used in:** Code (`JobDescription` model, `/jobs` routes) / UI (JD list, JD detail page)
**Aliases (DO NOT USE):** Job posting, Job listing, Position, Role (except in fit analysis text where "role" is acceptable as natural language)
**Example:** "Senior ML Engineer at Acme Corp — requires 5+ years of Python, TensorFlow, and Kubernetes experience."

### AI Analysis
**Definition:** The structured data extracted from a candidate's resume by Gemini Flash. Contains skills, experience_years, education, and summary.
**Used in:** Code (`AIAnalysis` model, `/analyze` routes) / UI (analysis card on candidate detail page)
**Aliases (DO NOT USE):** Resume parsing result, Extraction, Profile data
**Example:** `{ skills: ["Python", "FastAPI"], experience_years: 3, education: "B.Tech CS, IIT Delhi", summary: "..." }`

### Match Record
**Definition:** The result of comparing a single candidate's AI analysis against a single job description. Contains match_score, matching_skills, skill_gaps, and fit_analysis.
**Used in:** Code (`MatchRecord` model, `/match` routes) / UI (leaderboard cards, match history on candidate detail)
**Aliases (DO NOT USE):** Score, Ranking, Comparison, Evaluation
**Example:** Candidate John matched to "ML Engineer" JD with score 82, matching skills ["Python", "ML"], gaps ["TensorFlow"].

### Resume
**Definition:** The uploaded file (PDF or DOCX) containing a candidate's professional history. Stored in Supabase Storage.
**Used in:** Code (`resume_url` field) / UI (upload form, download link)
**Aliases (DO NOT USE):** CV, Document, File (use "resume" or "resume file" specifically)
**Example:** `john_doe_resume.pdf` stored at `https://xxxx.supabase.co/storage/v1/object/public/resumes/uuid.pdf`

---

## Actions & States

### Upload
**Definition:** The act of submitting a resume file (PDF/DOCX) to the system via the upload form.
**Opposite:** Delete (candidate deletion removes the record; file may remain in storage)

### Analyze
**Definition:** The process of sending extracted resume text to Gemini Flash and receiving structured candidate data. Happens automatically on upload.
**Opposite:** N/A (analysis is not reversible, only re-runnable)

### Match
**Definition:** The process of comparing a candidate's AI analysis against a job description to produce a score and fit analysis.
**Opposite:** N/A (matches can be re-run to update, but not "unmatched")

### Bulk Match
**Definition:** Matching ALL candidates with existing AI analysis against a single job description in one operation. Produces a ranked leaderboard.
**Opposite:** N/A

### Analyzed (status)
**Definition:** The candidate's resume has been successfully processed by Gemini and structured data is available.
**Opposite:** Pending — the candidate exists but analysis has not completed (or failed)

### Pending (status)
**Definition:** The candidate exists in the system but does not yet have a completed AI analysis.
**Opposite:** Analyzed

---

## Scores & Metrics

### Match Score
**Definition:** An integer from 0 to 100 representing how well a candidate fits a job description, as evaluated by Gemini.
**Used in:** Code (`match_score` field) / UI (score bars, leaderboard ranking)
**Score ranges:**
- High (≥ 70): green styling
- Medium (40–69): amber styling
- Low (< 40): red styling

### Matching Skills
**Definition:** An array of skill strings that the candidate has AND the job description requires.
**Used in:** Code (`matching_skills` JSONB field) / UI (green skill pills)

### Skill Gaps
**Definition:** An array of skill strings that the job description requires but the candidate lacks.
**Used in:** Code (`skill_gaps` JSONB field) / UI (gray skill pills)

### Fit Analysis
**Definition:** A 2–3 sentence AI-generated text explaining the match score — what fits well and what is missing.
**Used in:** Code (`fit_analysis` text field) / UI (text below match card)

---

## Technical Terms (Project-Specific)

### Leaderboard
**Definition:** The ranked list of candidates for a specific JD, sorted by match_score descending. Displayed as cards with score bars and skill tags.
**Used in:** UI (`/match/[jdId]` page, `/jobs/[id]` page)

### Score Bar
**Definition:** A thin (4px height) horizontal bar visualizing the match score. Track color is surface-secondary, fill color is indigo accent.
**Used in:** UI component (`ScoreBar.tsx`)

### Skill Tag
**Definition:** A small pill-shaped badge showing a skill name. Green for matching skills, gray for skill gaps.
**Used in:** UI component (`SkillTag.tsx`)

### Stat Card
**Definition:** A dashboard card showing a single metric (e.g., total candidates, active JDs). Light gray background, uppercase label, large number.
**Used in:** UI component (`StatCard.tsx`)

---

## Terms We Deliberately Avoid

| Avoid | Use Instead | Reason |
|-------|-------------|--------|
| Applicant | Candidate | "Candidate" is the project's canonical term |
| CV | Resume | Consistency — "resume" used throughout |
| Job posting | Job Description (JD) | "JD" is the standard abbreviation in this domain |
| Score | Match Score | "Score" alone is ambiguous — always qualify as "match score" |
| Profile | Candidate (or AI Analysis) | "Profile" is vague — be specific about which entity |
| User | Recruiter (or HR) | "User" is too generic — specify the role |
| Ranking | Leaderboard | "Leaderboard" is the UI concept; "ranking" is informal |
