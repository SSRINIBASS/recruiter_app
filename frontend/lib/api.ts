const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export type Candidate = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  resume_url: string | null;
  uploaded_at: string;
  has_analysis: boolean;
  analysis?: AIAnalysis;
  matches?: MatchRecord[];
};

export type JobDescription = {
  id: string;
  title: string;
  company: string | null;
  description_text: string;
  created_at: string;
};

export type AIAnalysis = {
  id: string;
  candidate_id: string;
  skills: string[];
  experience_years: number;
  education: string | null;
  summary: string | null;
  created_at: string;
};

export type MatchRecord = {
  id: string;
  candidate_id: string;
  jd_id: string;
  jd_title?: string;
  candidate_name?: string;
  match_score: number;
  matching_skills: string[];
  claimed_only_skills: string[];
  skill_gaps: string[];
  fit_analysis: string | null;
  matched_at: string;
};

export type BulkMatchResponse = {
  jd_id: string;
  jd_title: string;
  total_candidates: number;
  matches: MatchRecord[];
};

export type OutreachEmailResponse = {
  candidate_id: string;
  candidate_name: string;
  candidate_email: string | null;
  subject: string;
  body: string;
};

export type BulkOutreachResponse = {
  emails: OutreachEmailResponse[];
};

export type HealthResponse = {
  status: string;
  timestamp: string;
};

export const api = {
  async getHealth(): Promise<HealthResponse> {
    const res = await fetch(`${API_URL}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  // Candidates
  async getCandidates(): Promise<Candidate[]> {
    const res = await fetch(`${API_URL}/candidates`);
    if (!res.ok) throw new Error('Failed to fetch candidates');
    return res.json();
  },

  async getCandidate(id: string): Promise<Candidate> {
    const res = await fetch(`${API_URL}/candidates/${id}`);
    if (!res.ok) {
      if (res.status === 404) throw new Error('Candidate not found');
      throw new Error('Failed to fetch candidate details');
    }
    return res.json();
  },

  async uploadCandidate(file: File): Promise<Candidate> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_URL}/candidates/upload`, {
      method: 'POST',
      body: formData,
      // Note: do not set Content-Type header when sending FormData,
      // the browser will set it with the correct boundary parameter automatically.
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to upload resume');
    }
    return res.json();
  },

  async deleteCandidate(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_URL}/candidates/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete candidate');
    return res.json();
  },

  // Job Descriptions
  async getJobs(): Promise<JobDescription[]> {
    const res = await fetch(`${API_URL}/jobs`);
    if (!res.ok) throw new Error('Failed to fetch job descriptions');
    return res.json();
  },

  async getJob(id: string): Promise<JobDescription> {
    const res = await fetch(`${API_URL}/jobs/${id}`);
    if (!res.ok) {
      if (res.status === 404) throw new Error('Job description not found');
      throw new Error('Failed to fetch job description');
    }
    return res.json();
  },

  async createJob(title: string, company: string | null, descriptionText: string): Promise<JobDescription> {
    const res = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        company: company || null,
        description_text: descriptionText,
      }),
    });
    if (!res.ok) throw new Error('Failed to create job description');
    return res.json();
  },

  async deleteJob(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_URL}/jobs/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete job description');
    return res.json();
  },

  // AI Analysis
  async triggerAnalysis(candidateId: string): Promise<AIAnalysis> {
    const res = await fetch(`${API_URL}/analyze/${candidateId}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to trigger AI analysis');
    return res.json();
  },

  async getAnalysis(candidateId: string): Promise<AIAnalysis> {
    const res = await fetch(`${API_URL}/analyze/${candidateId}`);
    if (!res.ok) throw new Error('Failed to fetch AI analysis');
    return res.json();
  },

  // Matching
  async matchSingle(candidateId: string, jdId: string): Promise<MatchRecord> {
    const res = await fetch(`${API_URL}/match/${candidateId}/${jdId}`, {
      method: 'POST',
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to match candidate');
    }
    return res.json();
  },

  async matchBulk(jdId: string): Promise<BulkMatchResponse> {
    const res = await fetch(`${API_URL}/match/bulk/${jdId}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to match all candidates');
    return res.json();
  },

  async getBulkMatches(jdId: string): Promise<BulkMatchResponse> {
    const res = await fetch(`${API_URL}/match/bulk/${jdId}`);
    if (!res.ok) throw new Error('Failed to fetch match leaderboard');
    return res.json();
  },

  async getSingleMatch(candidateId: string, jdId: string): Promise<MatchRecord> {
    const res = await fetch(`${API_URL}/match/${candidateId}/${jdId}`);
    if (!res.ok) throw new Error('Failed to fetch candidate-JD match record');
    return res.json();
  },

  async generateOutreachEmails(
    candidateIds: string[],
    jdId: string,
    senderName: string
  ): Promise<BulkOutreachResponse> {
    const res = await fetch(`${API_URL}/match/outreach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidate_ids: candidateIds,
        jd_id: jdId,
        sender_name: senderName,
      }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to generate outreach emails');
    }
    return res.json();
  },
};
