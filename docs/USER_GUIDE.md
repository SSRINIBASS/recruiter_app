# USER_GUIDE.md — TalentIQ User Guide

**Version:** 1.0
**Last Updated:** 2026-06-15

---

## Introduction

TalentIQ is an AI-powered recruitment tool that helps HR professionals manage candidates and job descriptions, and intelligently match the right candidates to the right positions. Upload a resume, and TalentIQ automatically extracts skills, experience, and education. Create a job description, and TalentIQ ranks all candidates by fit — complete with matched skills, skill gaps, and a plain-English explanation.

This guide is written for internal HR personnel / recruiters who will use TalentIQ as a daily tool.

---

## Getting Started

### No Account Required

TalentIQ is an internal tool — no login or account creation needed. Simply open the app URL in your desktop browser and start using it.

### Your First Upload

The fastest way to see TalentIQ in action:

1. Click **Candidates** in the left sidebar
2. Click the **Upload Resume** button
3. Drag and drop a PDF or DOCX resume file (or click to browse)
4. Wait a few seconds — TalentIQ will automatically extract the candidate's information using AI
5. You'll be taken to the candidate's detail page showing their skills, experience, education, and a professional summary

---

## Core Features

### Uploading Resumes

**What it does:** Accepts a PDF or DOCX resume file, stores it securely, and uses AI to extract structured candidate information (name, email, phone, skills, experience, education, summary).

**How to use it:**
1. Navigate to **Candidates** → **Upload Resume**
2. Drag a file into the upload area, or click to browse your files
3. Accepted formats: `.pdf` and `.docx` only
4. Click **Upload & Analyze**
5. The AI processes the resume in a few seconds
6. You'll see the candidate appear in the candidates list with an "Analyzed" status badge

**Tips:**
- Text-based PDFs work best. Scanned PDFs (images of text) cannot be processed.
- The AI extracts data automatically — you don't need to manually enter candidate details.

---

### Managing Candidates

**What it does:** View, browse, and manage all uploaded candidates in one place.

**How to use it:**
1. Click **Candidates** in the sidebar to see the full list
2. Each row shows: candidate name, email, status (Analyzed / Pending), and top match score
3. Click any candidate name to view their full detail page
4. On the detail page, you'll see:
   - **AI Analysis card:** skills, years of experience, education, professional summary
   - **Match history:** results from previous job matches
5. To delete a candidate, use the delete button on the detail page

---

### Creating Job Descriptions

**What it does:** Store job descriptions that candidates can be matched against.

**How to use it:**
1. Click **Job Descriptions** in the sidebar
2. Click **New Job Description**
3. Fill in:
   - **Title:** e.g., "Senior ML Engineer"
   - **Company:** e.g., "Acme Corp" (optional)
   - **Description:** Full job description text including required skills, experience, and responsibilities
4. Click **Create**

**Tips:**
- The more detailed the job description, the more accurate the AI matching will be.
- Include specific skill requirements (e.g., "3+ years of Python, experience with TensorFlow") for best results.

---

### Matching Candidates to Jobs

**What it does:** Compares a candidate's AI-analyzed profile against a job description and generates a match score (0–100), matched skills, skill gaps, and a fit analysis.

**How to use it — Single Match:**
1. Go to a candidate's detail page
2. Select a job description from the "Match to JD" dropdown
3. Click **Match**
4. The result appears inline: score, matched skills (green tags), gaps (gray tags), and fit analysis text

**How to use it — Bulk Match (Leaderboard):**
1. Go to a job description's detail page
2. Click **Match All Candidates**
3. TalentIQ matches every analyzed candidate against this JD
4. Results appear as a ranked leaderboard — top candidates first
5. Each leaderboard card shows: rank, score, matched/gap skills, and fit analysis

**Tips:**
- Candidates must be analyzed before they can be matched. The upload flow handles this automatically.
- You can re-match to get updated scores (e.g., if the AI model is updated).
- The #1 ranked candidate gets a subtle visual highlight for quick identification.

---

### Understanding Match Results

**Match Score (0–100):**
- **70–100 (Green):** Strong fit — candidate has most required skills
- **40–69 (Amber):** Moderate fit — candidate has some required skills but significant gaps
- **0–39 (Red):** Weak fit — candidate lacks most required skills

**Skill Tags:**
- **Green tags:** Skills the candidate has that the job requires (matching skills)
- **Gray tags:** Skills the job requires that the candidate lacks (skill gaps)

**Fit Analysis:** A 2–3 sentence AI explanation of why the candidate received their score — what fits well and what's missing.

---

### Dashboard

**What it does:** Gives you an at-a-glance overview of your recruitment pipeline.

**What you'll see:**
- **Total Candidates:** How many resumes have been uploaded
- **Active JDs:** How many job descriptions are in the system
- **Matches Run:** Total number of candidate-JD matches performed
- **Average Score:** Average match score across all matches
- **Recent Candidates:** A table showing the most recently uploaded candidates

---

## Troubleshooting

### My PDF uploaded but no data was extracted
The PDF might be a scanned image rather than a text-based document. Try uploading a DOCX version of the resume, or a PDF that was exported from a word processor (not scanned).

### The match score seems wrong
AI matching is based on keyword and context analysis. Ensure the job description includes specific, detailed requirements. Vague descriptions like "looking for a good engineer" will produce less accurate scores.

### The page is loading slowly on first visit
If the backend has been idle, it may take 30–60 seconds to warm up on the first request. Subsequent requests will be fast. This is a limitation of the free hosting tier.

### I uploaded the wrong file
Delete the candidate from their detail page and re-upload the correct resume.

---

## FAQ

**Q: Can I upload multiple resumes at once?**
A: Currently, resumes are uploaded one at a time. Bulk upload is a planned future feature.

**Q: Can I edit a candidate's information after upload?**
A: No — candidate data is extracted by AI from the resume. To update, delete and re-upload with the corrected resume.

**Q: What file formats are supported?**
A: PDF and DOCX files only.

**Q: Is my data secure?**
A: Resumes are stored in secure cloud storage (Supabase). The app does not share data externally. For production use, authentication should be added.

**Q: Can I use this on mobile?**
A: TalentIQ is designed for desktop use. Mobile access is not currently supported.

---

> 📝 **For Contributors:** Update this guide every time a user-facing feature is completed. Write from the user's perspective — describe what they control and experience, not how the system is built.
