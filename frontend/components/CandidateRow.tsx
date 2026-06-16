import Link from 'next/link';
import { IconTrash, IconFileText } from '@tabler/icons-react';
import { Candidate } from '../lib/api';

type CandidateRowProps = {
  candidate: Candidate;
  onDelete: (id: string) => void;
};

export function CandidateRow({ candidate, onDelete }: CandidateRowProps) {
  // Get initials for the avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || '?';
  };

  // Format uploaded date
  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <tr className="hover:bg-surface-secondary/40 transition-colors border-b border-subtle">
      {/* Name and Avatar */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center text-accent-text font-medium text-sm">
            {getInitials(candidate.name)}
          </div>
          <div>
            <Link 
              href={`/candidates/${candidate.id}`} 
              className="text-base font-medium text-text-primary hover:text-accent transition-colors"
            >
              {candidate.name}
            </Link>
            <div className="text-sm text-text-secondary">
              {candidate.email || 'No email'}
            </div>
          </div>
        </div>
      </td>

      {/* Contact info */}
      <td className="px-6 py-4 whitespace-nowrap text-base text-text-secondary">
        {candidate.phone || 'No phone'}
      </td>

      {/* Uploaded date */}
      <td className="px-6 py-4 whitespace-nowrap text-base text-text-secondary">
        {formatDate(candidate.uploaded_at)}
      </td>

      {/* Analysis Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        {candidate.has_analysis ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-score-high-fill text-score-high-text">
            Analyzed
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-score-mid-fill text-score-mid-text">
            Pending
          </span>
        )}
      </td>

      {/* Resume File Link */}
      <td className="px-6 py-4 whitespace-nowrap text-base">
        {candidate.resume_url ? (
          <a
            href={
              candidate.resume_url.startsWith("/")
                ? `http://localhost:8000${candidate.resume_url}`
                : candidate.resume_url
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-accent font-medium hover:text-accent-text transition-colors"
          >
            <IconFileText size={16} />
            <span>Resume</span>
          </a>
        ) : (
          <span className="text-text-secondary">None</span>
        )}
      </td>

      {/* Delete button */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">
        <button
          onClick={() => onDelete(candidate.id)}
          className="text-text-secondary hover:text-destructive-text p-1.5 rounded-md hover:bg-destructive-fill/50 transition-colors"
          title="Delete Candidate"
        >
          <IconTrash size={16} />
        </button>
      </td>
    </tr>
  );
}
