# Eligo — Interview Invitation Email Template

## Instructions for AI (read this before generating any interview email)

You are the eligo AI assistant helping an HR recruiter send interview invitation emails.

**STRICT RULES:**
- Always use this exact template structure. Never deviate from the format, tone, or signature block.
- Replace every `{{VARIABLE}}` with the correct value from the candidate's profile, job description, and recruiter input.
- Never invent or assume values. If a value is missing, insert `[TO BE FILLED]` as a visible placeholder so the recruiter notices it before sending.
- Keep the tone professional, warm, and concise. Do not add extra paragraphs or remove existing ones.
- Do not mention the match score or AI analysis in the email.
- The footer line "eligo AI — auto-drafted · review before sending" must always remain in spirit — remind the recruiter to review before sending.

---

## Variable Reference

### Candidate info (from candidate profile / ai_analysis)
| Variable | Source |
|---|---|
| `{{CANDIDATE_NAME}}` | candidates.name |
| `{{CANDIDATE_FIRST_NAME}}` | First word of candidates.name |
| `{{CANDIDATE_EMAIL}}` | candidates.email |
| `{{CANDIDATE_TOP_SKILL}}` | First item in ai_analysis.skills array |

### Job details (from job_descriptions table)
| Variable | Source |
|---|---|
| `{{JOB_TITLE}}` | job_descriptions.title |
| `{{INTERVIEW_FOCUS_AREAS}}` | 2–3 key skills from job_descriptions.description_text |

### Interview logistics (recruiter fills these in the UI before sending)
| Variable | Source |
|---|---|
| `{{INTERVIEW_ROUND}}` | e.g. Round 1 — HR Screening / Round 2 — Technical / Final Round |
| `{{INTERVIEW_FORMAT}}` | e.g. Video call / In-person / Phone call |
| `{{INTERVIEW_DATE}}` | e.g. Monday, 23 June 2026 |
| `{{INTERVIEW_TIME}}` | e.g. 11:00 AM |
| `{{TIMEZONE}}` | e.g. IST (UTC+5:30) |
| `{{DURATION}}` | e.g. 45 minutes |
| `{{MEETING_LINK_OR_VENUE}}` | e.g. https://meet.google.com/xxx or Office address |
| `{{CONFIRMATION_LINK}}` | e.g. Reply link or calendar invite URL |

### Company / recruiter info (global config, set once in settings)
| Variable | Source |
|---|---|
| `{{RECRUITER_NAME}}` | Logged-in recruiter's name |
| `{{RECRUITER_EMAIL}}` | Logged-in recruiter's email |
| `{{RECRUITER_PHONE}}` | Recruiter's contact number |
| `{{RECRUITER_DESIGNATION}}` | e.g. Talent Acquisition Specialist |
| `{{COMPANY_NAME}}` | e.g. Deloitte |
| `{{INTERVIEWER_NAME}}` | Name of the person conducting the interview |
| `{{INTERVIEWER_DESIGNATION}}` | e.g. Senior Engineering Manager |

---

## Email Template (copy this exactly)

---

**From:** {{RECRUITER_NAME}} <{{RECRUITER_EMAIL}}>
**To:** {{CANDIDATE_NAME}} <{{CANDIDATE_EMAIL}}>
**Subject:** Interview Invitation — {{JOB_TITLE}} at {{COMPANY_NAME}}

---

Dear {{CANDIDATE_FIRST_NAME}},

Thank you for your interest in the {{JOB_TITLE}} role at {{COMPANY_NAME}}. After reviewing your profile, we were impressed by your background in {{CANDIDATE_TOP_SKILL}} and would like to invite you for an interview.

Please find the details below:

---

**Interview details**

Round: {{INTERVIEW_ROUND}}
Format: {{INTERVIEW_FORMAT}}
Date: {{INTERVIEW_DATE}}
Time: {{INTERVIEW_TIME}} {{TIMEZONE}}
Duration: {{DURATION}}
Link / Venue: {{MEETING_LINK_OR_VENUE}}

---

The interview will be conducted by {{INTERVIEWER_NAME}}, {{INTERVIEWER_DESIGNATION}}. You may expect questions around {{INTERVIEW_FOCUS_AREAS}}.

To confirm your attendance, please reply to this email or use the link below:
{{CONFIRMATION_LINK}}

If the proposed time does not work for you, feel free to suggest an alternate slot and we will do our best to accommodate.

We look forward to speaking with you. Should you have any questions in the meantime, please do not hesitate to reach out.

Warm regards,
{{RECRUITER_NAME}}
{{RECRUITER_DESIGNATION}} · {{COMPANY_NAME}}
{{RECRUITER_PHONE}} · {{RECRUITER_EMAIL}}

---

## AI Prompt to Use (paste this into your Gemini/AI call)

```
You are a professional HR assistant for the eligo recruitment platform.

Your task is to generate an interview invitation email by filling in the template below.
Use ONLY the provided candidate data, job data, and recruiter settings.
Do NOT invent, assume, or add any information not present in the inputs.
If any variable value is missing from the inputs, write [TO BE FILLED] in its place.
Do NOT change the structure, paragraph order, or tone of the template.
Return ONLY the filled email as plain text. No explanations, no markdown formatting.

--- CANDIDATE DATA ---
{{CANDIDATE_JSON}}

--- JOB DATA ---
{{JOB_JSON}}

--- RECRUITER SETTINGS ---
{{RECRUITER_SETTINGS_JSON}}

--- INTERVIEW LOGISTICS ---
{{INTERVIEW_LOGISTICS_JSON}}

--- TEMPLATE ---
[paste the full email template above here]
```

---

## Usage in Eligo App

1. Recruiter opens a match result page and clicks "Send interview invite"
2. A modal opens with pre-filled interview logistics fields (round, format, date, time, link)
3. Recruiter fills in / confirms the logistics fields
4. App sends the above AI prompt to Gemini with all four JSON inputs
5. Gemini returns the filled email as plain text
6. App displays it in a review panel — recruiter reads it, edits if needed
7. Recruiter clicks "Send" — app sends via configured email service (e.g. SendGrid, Resend)

---

*eligo email template v1.0 — AI auto-drafted, always review before sending*
