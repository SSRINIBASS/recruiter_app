'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  IconChevronLeft, 
  IconTrophy, 
  IconSparkles,
  IconLoader2, 
  IconAlertCircle 
} from '@tabler/icons-react';
import { api, JobDescription, MatchRecord } from '../../../lib/api';
import { MatchCard } from '../../../components/MatchCard';

export default function MatchLeaderboard() {
  const params = useParams();
  const jdId = params.jdId as string;
  const router = useRouter();

  const [job, setJob] = useState<JobDescription | null>(null);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const jobData = await api.getJob(jdId);
      setJob(jobData);
      
      const matchesData = await api.getBulkMatches(jdId);
      setMatches(matchesData.matches || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load leaderboard match records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jdId) {
      loadLeaderboard();
    }
  }, [jdId]);

  const handleMatchAll = async () => {
    if (!job) return;
    try {
      setMatching(true);
      setError(null);
      const res = await api.matchBulk(job.id);
      setMatches(res.matches || []);
    } catch (err: any) {
      setError(err.message || 'Failed to perform match evaluation.');
    } finally {
      setMatching(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <IconLoader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="space-y-6 max-w-xl mx-auto mt-12 text-center">
        <div className="p-4 bg-destructive-fill rounded-md border border-destructive-text/10 flex items-start gap-2 text-destructive-text text-sm font-medium">
          <IconAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error || 'Job description or matches not found'}</span>
        </div>
        <button 
          onClick={() => router.push('/jobs')}
          className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent/90"
        >
          View Job Descriptions
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header and Back Link */}
      <div className="flex justify-between items-center">
        <Link
          href={`/jobs/${jdId}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-accent transition-colors"
        >
          <IconChevronLeft size={16} />
          <span>Back to Job Details</span>
        </Link>

        <button
          onClick={handleMatchAll}
          disabled={matching}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {matching ? (
            <IconLoader2 size={16} className="animate-spin" />
          ) : (
            <IconSparkles size={16} />
          )}
          <span>{matching ? 'Matching Candidates...' : 'Run Matching Now'}</span>
        </button>
      </div>

      {/* Leaderboard Title */}
      <div className="border-b border-subtle pb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-accent-light rounded-md flex items-center justify-center text-accent">
          <IconTrophy size={20} />
        </div>
        <div>
          <h1 className="text-xl font-medium tracking-tight text-text-primary">
            Fit Leaderboard
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Ranked candidate matches for the position <span className="font-semibold text-text-primary">{job.title}</span> {job.company ? `@ ${job.company}` : ''}
          </p>
        </div>
      </div>

      {/* Matches List */}
      {matching ? (
        <div className="py-20 flex flex-col items-center justify-center border border-subtle border-dashed rounded-lg bg-surface-secondary/20">
          <IconLoader2 className="w-10 h-10 text-accent animate-spin mb-3" />
          <p className="text-base font-medium text-text-primary">Running AI Match Evaluations...</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="py-16 text-center border border-subtle border-dashed rounded-lg bg-surface-primary max-w-xl mx-auto flex flex-col items-center justify-center p-8">
          <IconTrophy className="w-12 h-12 text-text-secondary/30 mb-3" />
          <h3 className="text-base font-medium text-text-primary mb-1">No matches run yet</h3>
          <p className="text-sm text-text-secondary mb-6">
            Evaluate all candidate profiles against this Job Description requirement.
          </p>
          <button
            onClick={handleMatchAll}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent/90 transition-colors"
          >
            <IconSparkles size={16} />
            <span>Match Candidates</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match, idx) => (
            <MatchCard 
              key={match.id} 
              match={match} 
              rank={idx + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
