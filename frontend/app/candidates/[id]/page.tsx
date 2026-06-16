'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  IconChevronLeft, 
  IconMail, 
  IconPhone, 
  IconCalendar, 
  IconFileText,
  IconCpu,
  IconBriefcase,
  IconSparkles,
  IconLoader2,
  IconAlertCircle
} from '@tabler/icons-react';
import { api, Candidate, JobDescription } from '../../../lib/api';
import { SkillTag } from '../../../components/SkillTag';
import { ScoreBar } from '../../../components/ScoreBar';

export default function CandidateDetail() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [selectedJdId, setSelectedJdId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch candidate details and jobs list
      const [candData, jobsData] = await Promise.all([
        api.getCandidate(id),
        api.getJobs()
      ]);
      
      setCandidate(candData);
      setJobs(jobsData);
      
      if (jobsData.length > 0) {
        setSelectedJdId(jobsData[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load candidate profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const handleReAnalyze = async () => {
    if (!candidate) return;
    try {
      setAnalyzing(true);
      setError(null);
      await api.triggerAnalysis(candidate.id);
      // Reload candidate profile
      const updatedCand = await api.getCandidate(id);
      setCandidate(updatedCand);
    } catch (err: any) {
      setError(err.message || 'Failed to trigger re-analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRunMatch = async () => {
    if (!candidate || !selectedJdId) return;
    try {
      setMatching(true);
      setError(null);
      // Call single match API
      await api.matchSingle(candidate.id, selectedJdId);
      // Reload profile to reflect new match record
      const updatedCand = await api.getCandidate(id);
      setCandidate(updatedCand);
    } catch (err: any) {
      setError(err.message || 'Failed to evaluate match against Job Description');
    } finally {
      setMatching(false);
    }
  };

  // Format date utility
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <IconLoader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="space-y-6 max-w-xl mx-auto mt-12 text-center">
        <div className="p-4 bg-destructive-fill rounded-md border border-destructive-text/10 flex items-start gap-2 text-destructive-text text-sm font-medium">
          <IconAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error || 'Candidate profile not found'}</span>
        </div>
        <button 
          onClick={() => router.push('/candidates')}
          className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent/90"
        >
          Back to Candidates
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back button and page actions */}
      <div className="flex justify-between items-center">
        <Link
          href="/candidates"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-accent transition-colors"
        >
          <IconChevronLeft size={16} />
          <span>Back to Candidates</span>
        </Link>
        
        <div className="flex items-center gap-3">
          {candidate.resume_url && (
            <a
              href={
                candidate.resume_url.startsWith('/')
                  ? `http://localhost:8000${candidate.resume_url}`
                  : candidate.resume_url
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface-secondary text-text-secondary text-sm font-medium rounded-md hover:bg-accent-light/50 hover:text-accent-text transition-colors border border-subtle"
            >
              <IconFileText size={16} />
              <span>Download Resume</span>
            </a>
          )}
          
          <button
            onClick={handleReAnalyze}
            disabled={analyzing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {analyzing ? (
              <IconLoader2 size={16} className="animate-spin" />
            ) : (
              <IconCpu size={16} />
            )}
            <span>{analyzing ? 'Analyzing...' : 'Re-Analyze AI'}</span>
          </button>
        </div>
      </div>

      {/* Candidate Profile Header Card */}
      <div className="bg-surface-secondary rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-xl font-medium tracking-tight text-text-primary mb-2">
            {candidate.name}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
            <span className="flex items-center gap-1.5">
              <IconMail size={16} />
              {candidate.email || 'No email provided'}
            </span>
            <span className="flex items-center gap-1.5">
              <IconPhone size={16} />
              {candidate.phone || 'No phone number'}
            </span>
            <span className="flex items-center gap-1.5">
              <IconCalendar size={16} />
              Uploaded: {new Date(candidate.uploaded_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: AI Analysis Details and Fit Matching Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: AI Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-primary border border-subtle rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-subtle pb-4">
              <IconCpu className="text-accent w-5 h-5" />
              <h2 className="text-lg font-medium text-text-primary">AI Profile Insights</h2>
            </div>

            {candidate.analysis ? (
              <div className="space-y-6">
                {/* One sentence summary */}
                {candidate.analysis.summary && (
                  <div className="space-y-2">
                    <h3 className="text-xs uppercase font-medium text-text-secondary tracking-wider">
                      Professional Summary
                    </h3>
                    <p className="text-base text-text-primary leading-relaxed">
                      {candidate.analysis.summary}
                    </p>
                  </div>
                )}

                {/* Experience and Education */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-xs uppercase font-medium text-text-secondary tracking-wider">
                      Experience
                    </h3>
                    <p className="text-base text-text-primary font-medium">
                      {candidate.analysis.experience_years} {candidate.analysis.experience_years === 1 ? 'Year' : 'Years'}
                    </p>
                  </div>
                  
                  {candidate.analysis.education && (
                    <div className="space-y-2">
                      <h3 className="text-xs uppercase font-medium text-text-secondary tracking-wider">
                        Education
                      </h3>
                      <p className="text-base text-text-primary leading-relaxed">
                        {candidate.analysis.education}
                      </p>
                    </div>
                  )}
                </div>

                {/* Candidate Skills list */}
                <div className="space-y-2">
                  <h3 className="text-xs uppercase font-medium text-text-secondary tracking-wider">
                    Skills Detected ({candidate.analysis.skills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.analysis.skills.map((skill) => (
                      <SkillTag key={skill} skill={skill} variant="proven" />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-text-secondary">
                No AI analysis is available for this candidate. Click "Re-Analyze AI" to parse candidate details.
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Fit Matching triggering panel */}
        <div className="space-y-6">
          <div className="bg-surface-primary border border-subtle rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-subtle pb-4">
              <IconSparkles className="text-accent w-5 h-5" />
              <h2 className="text-lg font-medium text-text-primary">Run Fit Matching</h2>
            </div>

            {jobs.length === 0 ? (
              <div className="text-sm text-text-secondary text-center">
                Create a Job Description first to run candidate match evaluations.
                <div className="mt-4">
                  <Link 
                    href="/jobs" 
                    className="px-4 py-2 bg-accent text-white text-xs font-medium rounded-md hover:bg-accent/90"
                  >
                    Manage Job Descriptions
                  </Link>
                </div>
              </div>
            ) : !candidate.has_analysis ? (
              <p className="text-sm text-text-secondary">
                AI Analysis must be populated for the candidate before matching.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-secondary">
                    Select Job Description
                  </label>
                  <select
                    value={selectedJdId}
                    onChange={(e) => setSelectedJdId(e.target.value)}
                    className="w-full h-9 px-3 border border-subtle rounded-md text-base focus:outline-none focus:border-accent bg-surface-primary"
                  >
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title} {job.company ? `(${job.company})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleRunMatch}
                  disabled={matching || !selectedJdId}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  {matching ? (
                    <IconLoader2 size={16} className="animate-spin" />
                  ) : (
                    <IconSparkles size={16} />
                  )}
                  <span>{matching ? 'Evaluating Fit...' : 'Evaluate Fit Match'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Match History Leaderboard section */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-text-primary">Matching History</h2>
        
        <div className="bg-surface-primary border border-subtle rounded-lg overflow-hidden">
          {candidate.matches && candidate.matches.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">
              This candidate has not been matched to any Job Descriptions yet. Use the fit panel above to test alignment.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-subtle">
                <thead className="bg-surface-secondary">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Job Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Match Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Evaluation Date
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-surface-primary divide-y divide-subtle">
                  {candidate.matches?.map((match) => (
                    <tr key={match.id} className="hover:bg-surface-secondary/35 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/jobs/${match.jd_id}`}
                          className="text-base font-medium text-text-primary hover:text-accent transition-colors flex items-center gap-2"
                        >
                          <IconBriefcase size={16} className="text-text-secondary" />
                          <span>{match.jd_title}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap w-64">
                        <ScoreBar score={match.match_score} showBar={true} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-text-secondary">
                        {formatDate(match.matched_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">
                        <Link
                          href={`/jobs/${match.jd_id}`}
                          className="text-accent hover:text-accent-text font-medium transition-colors"
                        >
                          View Leaderboard
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
