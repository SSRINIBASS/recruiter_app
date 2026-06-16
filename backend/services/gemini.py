import os
import json
import re
import google.generativeai as genai
from fastapi import HTTPException, status
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Determine if Gemini API is configured
has_gemini = (
    GEMINI_API_KEY 
    and "your-gemini" not in GEMINI_API_KEY
)

if has_gemini:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("Warning: GEMINI_API_KEY not found or using placeholder. Running in MOCK AI mode.")

def clean_json_response(text: str) -> dict:
    """Helper to strip markdown blocks if they get returned despite the mime setting."""
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.endswith("```"):
        text = text[:-3]
    return json.loads(text.strip())

def generate_mock_analysis(resume_text: str) -> dict:
    """Generate mock candidate analysis based on regex and simple heuristics."""
    # Find email
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', resume_text)
    email = email_match.group(0) if email_match else "contact@example.com"
    
    # Find phone
    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', resume_text)
    phone = phone_match.group(0) if phone_match else "+1-555-0100"
    
    # Find name: take first line or look for common structures
    lines = [l.strip() for l in resume_text.split("\n") if l.strip()]
    name = lines[0] if lines else "Candidate Name"
    if len(name) > 50 or "@" in name:
        name = "John Doe"
        
    # Extract some skills based on keywords
    possible_skills = ["Python", "FastAPI", "SQL", "React", "Next.js", "Tailwind CSS", "JavaScript", 
                       "TypeScript", "HTML", "CSS", "Machine Learning", "Git", "Docker", "Kubernetes", "AWS"]
    found_skills = [skill for skill in possible_skills if skill.lower() in resume_text.lower()]
    if not found_skills:
        found_skills = ["Python", "FastAPI", "SQL", "Git"]
        
    # Heuristics for years of experience
    exp_matches = re.findall(r'(\d+)\+?\s*(years|yrs)\b', resume_text, re.IGNORECASE)
    experience_years = int(exp_matches[0][0]) if exp_matches else 3
    if experience_years > 25:
        experience_years = 5
        
    # Education
    edu = "B.Tech in Computer Science"
    if "university" in resume_text.lower() or "college" in resume_text.lower() or "iit" in resume_text.lower():
        edu_lines = [l for l in lines if "university" in l.lower() or "college" in l.lower() or "iit" in l.lower()]
        edu = edu_lines[0] if edu_lines else "B.Tech Computer Science, Graduate University"
    else:
        edu = "Bachelor of Science in Computer Science"

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "skills": found_skills,
        "experience_years": experience_years,
        "education": edu,
        "summary": f"Self-motivated software professional with experience in {', '.join(found_skills[:3])}."
    }

def analyze_resume_with_gemini(resume_text: str) -> dict:
    """
    Calls Gemini Flash 1.5 to parse candidate resume text.
    Falls back to mock parse if Gemini API is unconfigured or fails.
    """
    if not has_gemini:
        return generate_mock_analysis(resume_text)
        
    prompt = f"""You are a professional resume parser. Extract structured information only. Return valid JSON with no extra text, markdown, or explanation.

Parse this resume and return a JSON object with exactly these keys:
- name (string): candidate full name
- email (string): email address or null
- phone (string): phone number or null
- skills (array of strings): all technical and soft skills mentioned
- experience_years (integer): total years of work experience
- education (string): highest qualification and institution
- summary (string): one sentence professional summary
- projects (array of objects): each with keys "name" (string) and "description" (string, max 1 sentence). Include all personal, academic, and professional projects mentioned.
- achievements (array of strings): awards, honours, recognitions, competitions won, publications, notable accomplishments
- certifications (array of strings): all certifications, licences, and professional credentials mentioned

Resume text:
{resume_text}
"""
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        return clean_json_response(response.text)
    except Exception as e:
        print(f"Gemini API analysis failed: {e}. Falling back to Mock parser.")
        return generate_mock_analysis(resume_text)

def generate_mock_match(candidate_skills: list, experience_years: int, jd_text: str) -> dict:
    """Generate a mock match result by checking skill overlap."""
    # Find words from jd_text that might be skills
    possible_skills = ["Python", "FastAPI", "SQL", "React", "Next.js", "Tailwind CSS", "JavaScript", 
                       "TypeScript", "HTML", "CSS", "Machine Learning", "Git", "Docker", "Kubernetes", "AWS", "TensorFlow", "PyTorch"]
    
    jd_skills = [s for s in possible_skills if s.lower() in jd_text.lower()]
    if not jd_skills:
        # Default fallback if no skills found in description
        jd_skills = ["Python", "FastAPI", "SQL"]
        
    candidate_skills_lower = [s.lower() for s in candidate_skills]
    
    matching_skills = [s for s in jd_skills if s.lower() in candidate_skills_lower]
    skill_gaps = [s for s in jd_skills if s.lower() not in candidate_skills_lower]
    
    # Calculate simple score
    if not jd_skills:
        score = 70
    else:
        score = int((len(matching_skills) / len(jd_skills)) * 80) + min(experience_years * 4, 20)
        
    score = max(0, min(100, score))  # bound between 0 and 100
    
    # Generate simple explanation
    fit_analysis = f"Candidate has {experience_years} years of experience. "
    if score >= 75:
        fit_analysis += f"Excellent match showing strong overlap in core requirements: {', '.join(matching_skills[:3])}."
    elif score >= 50:
        fit_analysis += f"Decent match with skills in {', '.join(matching_skills[:2])}. However, they need to bridge gaps in: {', '.join(skill_gaps[:2])}."
    else:
        fit_analysis += f"Low alignment. Missing critical skills required for the role, specifically: {', '.join(skill_gaps[:3])}."
        
    return {
        "match_score": score,
        "matching_skills": matching_skills,
        "skill_gaps": skill_gaps,
        "fit_analysis": fit_analysis
    }

def generate_outreach_email(
    candidate_name: str,
    jd_title: str,
    company: str | None,
    fit_analysis: str | None,
    sender_name: str,
) -> dict:
    """
    Generate a personalised recruiter outreach email for a shortlisted candidate.
    Falls back to a professional static template when Gemini is unavailable.
    Returns { "subject": str, "body": str }
    """
    company_str = company or "our company"

    if not has_gemini:
        subject = f"Exciting Opportunity: {jd_title} at {company_str}"
        body = (
            f"Hi {candidate_name},\n\n"
            f"I hope this message finds you well. My name is {sender_name} and I'm reaching out regarding "
            f"an exciting opportunity for the role of {jd_title} at {company_str}.\n\n"
            f"Based on your profile, I believe you would be an excellent fit for this position. "
            f"{fit_analysis or 'Your background aligns well with what we are looking for.'}\n\n"
            f"I'd love to set up a quick call to tell you more about the role and learn about your career "
            f"goals. Please let me know if you're open to a conversation — I'm flexible on timing.\n\n"
            f"Looking forward to hearing from you!\n\n"
            f"Best regards,\n{sender_name}"
        )
        return {"subject": subject, "body": body}

    prompt = f"""You are a professional technical recruiter writing a warm, personalised outreach email to a shortlisted candidate.

Write a concise, friendly recruiter outreach email. Do NOT use placeholder text like [Your Name]. Use the exact values provided.

Details:
- Candidate name: {candidate_name}
- Role: {jd_title}
- Company: {company_str}
- Why they're a good fit: {fit_analysis or 'Strong alignment with the role requirements.'}
- Sender name (recruiter): {sender_name}

Return valid JSON only with exactly these keys:
- subject (string): a compelling email subject line
- body (string): the full email body, using \\n for newlines. Start with "Hi {candidate_name}," and end with "Best regards,\\n{sender_name}". Keep it under 200 words. Do NOT use markdown formatting.
"""
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        return clean_json_response(response.text)
    except Exception as e:
        print(f"Gemini outreach generation failed: {e}. Falling back to template.")
        subject = f"Exciting Opportunity: {jd_title} at {company_str}"
        body = (
            f"Hi {candidate_name},\n\n"
            f"I hope this message finds you well. My name is {sender_name} and I'm reaching out regarding "
            f"an exciting opportunity for the role of {jd_title} at {company_str}.\n\n"
            f"{fit_analysis or 'Your background aligns strongly with what we are looking for.'}\n\n"
            f"I'd love to set up a quick call to discuss this role further. Please let me know your availability.\n\n"
            f"Best regards,\n{sender_name}"
        )
        return {"subject": subject, "body": body}


def match_candidate_to_jd(candidate_analysis: dict, jd_text: str) -> dict:
    """
    Calls Gemini Flash 1.5 to match a candidate's profile to a JD.
    Falls back to mock matching if Gemini is not configured or fails.
    Uses all available candidate signals: skills, experience, education,
    projects, achievements, and certifications.

    Scoring philosophy:
      - Skills PROVEN by matching projects/work/achievements  → full points
      - Skills CLAIMED but without supporting evidence        → partial credit only
      - Required skills entirely missing                      → penalised gap
    """
    if not has_gemini:
        return generate_mock_match(
            candidate_analysis.get("skills", []),
            candidate_analysis.get("experience_years", 0),
            jd_text
        )

    # Build a rich candidate profile string for the prompt
    projects = candidate_analysis.get("projects", [])
    projects_str = ""
    if projects:
        if isinstance(projects[0], dict):
            projects_str = "\n".join(f"  - {p.get('name','')}: {p.get('description','')}" for p in projects)
        else:
            projects_str = "\n".join(f"  - {p}" for p in projects)

    achievements = candidate_analysis.get("achievements", [])
    achievements_str = "\n".join(f"  - {a}" for a in achievements) if achievements else "  None listed"

    certifications = candidate_analysis.get("certifications", [])
    certifications_str = ", ".join(certifications) if certifications else "None listed"

    prompt = f"""You are an expert technical recruiter performing a rigorous, evidence-based candidate evaluation. Return valid JSON only, no extra text.

## Scoring Rubric (apply strictly)

For each skill or requirement in the job description, score the candidate as follows:

1. PROVEN (full points): The candidate lists the skill AND there is clear evidence of it in at least one project, past role description, or measurable achievement that is relevant to the JD requirements.
2. CLAIMED ONLY (partial credit, max 50% of that skill's weight): The candidate lists the skill in their skills section but there is NO supporting project, work experience, or achievement that demonstrates it.
3. MISSING (penalty): The JD requires the skill and the candidate shows no evidence of it at all.

The overall match_score must reflect this rubric:
- A candidate who has proven all required skills through concrete work scores 85-100.
- A candidate who claims all required skills but has no supporting projects/work scores at most 50-60.
- Relevant projects that directly match JD requirements can raise a score even if the skill is not explicitly listed.

## Candidate Profile

- Claimed skills: {', '.join(candidate_analysis.get('skills', []))}
- Years of experience: {candidate_analysis.get('experience_years', 0)}
- Education: {candidate_analysis.get('education', 'Not specified')}
- Summary: {candidate_analysis.get('summary', 'Not specified')}
- Projects (proof of work):
{projects_str if projects_str else '  None listed'}
- Achievements & recognitions:
{achievements_str}
- Certifications: {certifications_str}

## Job Description

{jd_text}

## Required JSON Output

Return a JSON object with exactly these keys:
- match_score (integer 0-100): evidence-weighted holistic fit score using the rubric above
- matching_skills (array of strings): skills the candidate has that the JD requires — include ONLY skills backed by proof of work (projects/experience/achievements); do NOT include skills that are merely claimed
- claimed_only_skills (array of strings): skills the candidate lists that the JD needs but that have NO supporting project or work evidence — these were given only partial credit
- skill_gaps (array of strings): skills the JD requires that the candidate has no evidence of at all
- fit_analysis (string): 3-5 sentences explaining the score. Explicitly call out (a) which required skills are proven by concrete work, (b) which are claimed-only without evidence, and (c) what is missing. Be specific — name the relevant projects or achievements.
"""
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        result = clean_json_response(response.text)
        # Ensure claimed_only_skills is always present (backwards compat)
        result.setdefault("claimed_only_skills", [])
        return result
    except Exception as e:
        print(f"Gemini API match failed: {e}. Falling back to Mock matcher.")
        return generate_mock_match(
            candidate_analysis.get("skills", []), 
            candidate_analysis.get("experience_years", 0), 
            jd_text
        )
