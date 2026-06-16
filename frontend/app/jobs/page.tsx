'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  IconPlus, 
  IconBriefcase, 
  IconTrash, 
  IconTrophy, 
  IconLoader2, 
  IconAlertCircle 
} from '@tabler/icons-react';
import { api, JobDescription } from '../../lib/api';

export default function JobsList() {
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getJobs();
      setJobs(data);
    } catch (err: any) {
      setError('Failed to fetch job descriptions. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job description? This will delete all candidate match records associated with it.')) {
      return;
    }

    try {
      await api.deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete job description');
    }
  };

  // Format date utility
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex justify-between items-center border-b border-subtle pb-6">
        <div>
          <h1 className="text-xl font-medium tracking-tight text-text-primary">Job Descriptions</h1>
          <p className="text-sm text-text-secondary">Define company job postings and evaluate candidate fit match pools.</p>
        </div>
        
        <Link
          href="/jobs/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent/90 transition-colors"
        >
          <IconPlus size={16} />
          <span>New Job Description</span>
        </Link>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <IconLoader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 bg-destructive-fill rounded-md border border-destructive-text/10 flex items-start gap-2 text-destructive-text text-sm font-medium">
          <IconAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-surface-primary border border-subtle rounded-lg p-12 text-center text-text-secondary max-w-xl mx-auto mt-6">
          <IconBriefcase className="mx-auto w-10 h-10 text-text-secondary/50 mb-3" />
          <h3 className="text-base font-medium text-text-primary mb-1">No Job Descriptions</h3>
          <p className="text-sm text-text-secondary mb-6">
            Get started by adding a new job description to evaluate candidates against.
          </p>
          <Link
            href="/jobs/new"
            className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent/90 transition-colors"
          >
            Create Job Description
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div 
              key={job.id} 
              className="bg-surface-primary border border-subtle rounded-lg p-6 flex flex-col justify-between hover:border-accent/50 transition-colors h-60"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-medium text-text-primary leading-tight hover:text-accent transition-colors">
                    <Link href={`/jobs/${job.id}`}>
                      {job.title}
                    </Link>
                  </h2>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="text-text-secondary hover:text-destructive-text p-1.5 rounded-md hover:bg-destructive-fill/50 transition-colors"
                    title="Delete Job Description"
                  >
                    <IconTrash size={16} />
                  </button>
                </div>
                
                {job.company && (
                  <p className="text-sm font-medium text-accent-text bg-accent-light/60 px-2 py-0.5 rounded-sm inline-block">
                    {job.company}
                  </p>
                )}
                
                {/* Description Preview snippet */}
                <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed pt-1">
                  {job.description_text}
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-subtle pt-4 mt-4 text-sm">
                <span className="text-text-secondary font-medium text-xs">
                  Created: {formatDate(job.created_at)}
                </span>
                
                <Link
                  href={`/jobs/${job.id}`}
                  className="inline-flex items-center gap-1.5 text-accent font-medium hover:text-accent-text transition-colors"
                >
                  <IconTrophy size={16} />
                  <span>Leaderboard</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
