'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  IconUsers, 
  IconBriefcase, 
  IconChartBar, 
  IconCpu, 
  IconPlus,
  IconLoader2 
} from '@tabler/icons-react';
import { api, Candidate, JobDescription } from '../lib/api';
import { StatCard } from '../components/StatCard';

export default function Dashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [avgScore, setAvgScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        // Fetch candidates and jobs in parallel
        const [candidatesData, jobsData] = await Promise.all([
          api.getCandidates(),
          api.getJobs()
        ]);

        setCandidates(candidatesData);
        setJobs(jobsData);

        // Fetch all matches to calculate the average score
        let totalScore = 0;
        let matchCount = 0;
        
        // Loop through jobs to aggregate match scores
        await Promise.all(
          jobsData.map(async (job) => {
            try {
              const matchesRes = await api.getBulkMatches(job.id);
              if (matchesRes.matches && matchesRes.matches.length > 0) {
                matchesRes.matches.forEach((m) => {
                  totalScore += m.match_score;
                  matchCount++;
                });
              }
            } catch {
              // Ignore failure for individual JDs
            }
          })
        );

        setAvgScore(matchCount > 0 ? Math.round(totalScore / matchCount) : 0);
      } catch (err) {
        console.error('Dashboard loading error:', err);
        setError('Failed to load dashboard data. Please check if the backend is running.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const analyzedCandidatesCount = candidates.filter((c) => c.has_analysis).length;
  const recentCandidates = candidates.slice(0, 5);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <IconLoader2 className="w-8 h-8 text-accent animate-spin" />
        <p className="text-sm text-text-secondary mt-2">Loading metrics and candidates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-destructive-fill border border-destructive-text/10 rounded-lg max-w-xl mx-auto mt-12 text-center">
        <h2 className="text-base font-medium text-destructive-text mb-2">Connection Error</h2>
        <p className="text-sm text-text-secondary mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent/90"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex justify-between items-center border-b border-subtle pb-6">
        <div>
          <h1 className="text-xl font-medium tracking-tight text-text-primary">Recruitment Dashboard</h1>
          <p className="text-sm text-text-secondary">Overview of candidates, job descriptions, and matches.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href="/candidates/upload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent/90 transition-colors"
          >
            <IconPlus size={16} />
            <span>Upload Resume</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Candidates"
          value={candidates.length}
          subtitle="Resumes in database"
          icon={IconUsers}
        />
        <StatCard
          label="Job Descriptions"
          value={jobs.length}
          subtitle="Active job postings"
          icon={IconBriefcase}
        />
        <StatCard
          label="Resumes Analyzed"
          value={analyzedCandidatesCount}
          subtitle={`${candidates.length > 0 ? Math.round((analyzedCandidatesCount / candidates.length) * 100) : 0}% completion rate`}
          icon={IconCpu}
        />
        <StatCard
          label="Avg Match Score"
          value={avgScore > 0 ? `${avgScore}%` : 'N/A'}
          subtitle="Across all job matches"
          icon={IconChartBar}
        />
      </div>

      {/* Recent Candidates */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-text-primary">Recent Candidates</h2>
          <Link 
            href="/candidates" 
            className="text-sm font-medium text-accent hover:text-accent-text transition-colors"
          >
            View all candidates
          </Link>
        </div>

        <div className="bg-surface-primary rounded-lg border border-subtle overflow-hidden">
          {recentCandidates.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">
              No candidates uploaded yet. Drop a resume file to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-subtle">
                <thead className="bg-surface-secondary">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Candidate Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Uploaded Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-surface-primary divide-y divide-subtle">
                  {recentCandidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-surface-secondary/35 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link 
                          href={`/candidates/${candidate.id}`}
                          className="text-base font-medium text-text-primary hover:text-accent transition-colors"
                        >
                          {candidate.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-text-secondary">
                        {candidate.email || 'No email'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-text-secondary">
                        {new Date(candidate.uploaded_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {candidate.has_analysis ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-score-high-fill text-score-high-text">
                            Analyzed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-score-mid-fill text-score-mid-text">
                            Pending
                          </span>
                        )}
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
