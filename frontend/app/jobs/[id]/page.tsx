'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  IconChevronLeft,
  IconBriefcase,
  IconSparkles,
  IconTrophy,
  IconLoader2,
  IconAlertCircle,
  IconMail,
} from '@tabler/icons-react';
import { api, JobDescription, MatchRecord } from '../../../lib/api';
import { MatchCard } from '../../../components/MatchCard';
import { ShortlistModal } from '../../../components/ShortlistModal';

export default function JobDetail() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [job, setJob] = useState<JobDescription | null>(null);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showShortlist, setShowShortlist] = useState(false);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const jobData = await api.getJob(id);
      setJob(jobData);

      // Load existing matches
      try {
        const matchesData = await api.getBulkMatches(id);
        setMatches(matchesData.matches || []);
      } catch {
        // No matches run yet, that's fine
        setMatches([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load job description details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadJobDetails();
    }
  }, [id]);

  const handleMatchAll = async () => {
    if (!job) return;
    try {
      setMatching(true);
      setError(null);
      const res = await api.matchBulk(job.id);
      setMatches(res.matches || []);
    } catch (err: any) {
      setError(err.message || 'Failed to perform bulk candidate matching.');
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
          <span>{error || 'Job description not found'}</span>
        </div>
        <button
          onClick={() => router.push('/jobs')}
          className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent/90"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back button and page actions */}
      <div className="flex justify-between items-center">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-accent transition-colors"
        >
          <IconChevronLeft size={16} />
          <span>Back to Jobs</span>
        </Link>

        <div className="flex items-center gap-2">
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
            <span>{matching ? 'Matching Candidates...' : 'Match All Candidates'}</span>
          </button>

          {matches.length > 0 && (
            <button
              id="shortlist-email-btn"
              onClick={() => setShowShortlist(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-accent text-accent text-sm font-medium rounded-md hover:bg-accent/5 transition-colors"
            >
              <IconMail size={16} />
              <span>Shortlist &amp; Email</span>
            </button>
          )}
        </div>
      </div>

      {/* Job Info Card */}
      <div className="bg-surface-secondary border border-subtle rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2">
          <IconBriefcase className="text-accent w-5 h-5" />
          <span className="text-xs uppercase font-medium text-text-secondary tracking-wider">
            Job Details
          </span>
        </div>

        <div>
          <h1 className="text-xl font-medium tracking-tight text-text-primary mb-1">
            {job.title}
          </h1>
          {job.company && (
            <p className="text-base font-medium text-accent">
              {job.company}
            </p>
          )}
        </div>

        <div className="border-t border-subtle pt-4">
          <h3 className="text-xs uppercase font-medium text-text-secondary tracking-wider mb-2">
            Job Description Requirements
          </h3>
          <p className="text-base text-text-primary whitespace-pre-wrap leading-relaxed">
            {job.description_text}
          </p>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-subtle pb-4">
          <IconTrophy className="text-accent w-5 h-5" />
          <h2 className="text-lg font-medium text-text-primary">Ranked Candidate Leaderboard</h2>
        </div>

        {matching ? (
          <div className="py-20 flex flex-col items-center justify-center border border-subtle border-dashed rounded-lg bg-surface-secondary/20">
            <IconLoader2 className="w-10 h-10 text-accent animate-spin mb-3" />
            <p className="text-base font-medium text-text-primary">Running AI Match Evaluations...</p>
            <p className="text-sm text-text-secondary mt-1">Comparing candidate skills and experience against requirements.</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="py-16 text-center border border-subtle border-dashed rounded-lg bg-surface-primary max-w-xl mx-auto flex flex-col items-center justify-center p-8">
            <IconTrophy className="w-12 h-12 text-text-secondary/30 mb-3" />
            <h3 className="text-base font-medium text-text-primary mb-1">No Match Results</h3>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              Run match evaluations to rank all analyzed candidates against this job description.
            </p>
            <button
              onClick={handleMatchAll}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent/90 transition-colors"
            >
              <IconSparkles size={16} />
              <span>Match Candidates Now</span>
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

      {/* Shortlist Modal */}
      {showShortlist && job && (
        <ShortlistModal
          jdId={job.id}
          jdTitle={job.title}
          matches={matches}
          onClose={() => setShowShortlist(false)}
        />
      )}
    </div>
  );
}
