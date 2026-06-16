'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IconChevronLeft, IconLoader2, IconAlertCircle } from '@tabler/icons-react';
import { api } from '../../../lib/api';

export default function CreateJob() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Job Title is required.');
      return;
    }
    if (!description.trim()) {
      setError('Job Description text is required.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.createJob(title.trim(), company.trim() || null, description.trim());
      router.push('/jobs');
    } catch (err: any) {
      setError(err.message || 'Failed to save job description. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-accent transition-colors"
        >
          <IconChevronLeft size={16} />
          <span>Back to Jobs</span>
        </Link>
      </div>

      <div className="border-b border-subtle pb-6">
        <h1 className="text-xl font-medium tracking-tight text-text-primary">Create Job Description</h1>
        <p className="text-sm text-text-secondary mt-1">
          Define job requirement details. Evaluated candidates will be ranked against these requirements using Gemini Flash.
        </p>
      </div>

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="bg-surface-primary border border-subtle p-6 rounded-lg space-y-6">
        
        {/* Title */}
        <div className="space-y-1.5">
          <label htmlFor="title" className="text-sm font-medium text-text-secondary">
            Job Title <span className="text-accent font-bold">*</span>
          </label>
          <input
            id="title"
            type="text"
            required
            placeholder="e.g., Senior Software Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            className="w-full h-9 px-3 border border-subtle rounded-md text-base focus:outline-none focus:border-accent"
          />
        </div>

        {/* Company */}
        <div className="space-y-1.5">
          <label htmlFor="company" className="text-sm font-medium text-text-secondary">
            Company / Department
          </label>
          <input
            id="company"
            type="text"
            placeholder="e.g., Engineering Team"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={loading}
            className="w-full h-9 px-3 border border-subtle rounded-md text-base focus:outline-none focus:border-accent"
          />
        </div>

        {/* Description Text */}
        <div className="space-y-1.5">
          <label htmlFor="description" className="text-sm font-medium text-text-secondary">
            Job Description Requirements <span className="text-accent font-bold">*</span>
          </label>
          <textarea
            id="description"
            required
            rows={8}
            placeholder="Describe the job role responsibilities, required technical skills, qualifications, and core competencies..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            className="w-full p-3 border border-subtle rounded-md text-base focus:outline-none focus:border-accent font-sans resize-y min-h-[160px]"
          />
        </div>

        {error && (
          <div className="p-3 bg-destructive-fill rounded-md border border-destructive-text/10 flex items-start gap-2 text-destructive-text text-sm font-medium">
            <IconAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/jobs"
            className="px-4 py-2 border border-subtle text-text-secondary text-sm font-medium rounded-md hover:bg-surface-secondary transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {loading && <IconLoader2 size={16} className="animate-spin" />}
            <span>{loading ? 'Creating...' : 'Create Job'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
