'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconSearch, IconPlus, IconLoader2, IconAlertCircle } from '@tabler/icons-react';
import { api, Candidate } from '../../lib/api';
import { CandidateRow } from '../../components/CandidateRow';

export default function CandidatesList() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getCandidates();
      setCandidates(data);
    } catch (err: any) {
      setError('Failed to fetch candidate list. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this candidate? This will delete all analysis and match records.')) {
      return;
    }

    try {
      await api.deleteCandidate(id);
      // Remove from local list
      setCandidates((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete candidate');
    }
  };

  // Filter candidates by search term
  const filteredCandidates = candidates.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.phone && c.phone.includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex justify-between items-center border-b border-subtle pb-6">
        <div>
          <h1 className="text-xl font-medium tracking-tight text-text-primary">Candidates</h1>
          <p className="text-sm text-text-secondary">Manage candidate profiles and view AI-parsed resume details.</p>
        </div>
        
        <Link
          href="/candidates/upload"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent/90 transition-colors"
        >
          <IconPlus size={16} />
          <span>Upload Resume</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <IconSearch className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 pr-4 py-2 w-full border border-subtle rounded-md text-base focus:outline-none focus:border-accent"
        />
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
      ) : (
        <div className="bg-surface-primary rounded-lg border border-subtle overflow-hidden">
          {filteredCandidates.length === 0 ? (
            <div className="p-12 text-center text-text-secondary">
              {searchTerm 
                ? 'No candidates found matching your search term.' 
                : 'No candidates in database. Click "Upload Resume" to add candidate profiles.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-subtle">
                <thead className="bg-surface-secondary">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Phone Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Uploaded Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      AI Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Document
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-surface-primary divide-y divide-subtle">
                  {filteredCandidates.map((candidate) => (
                    <CandidateRow
                      key={candidate.id}
                      candidate={candidate}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
