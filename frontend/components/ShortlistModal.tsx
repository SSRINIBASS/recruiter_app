'use client';

import { useEffect, useRef, useState } from 'react';
import {
  IconX,
  IconMail,
  IconLoader2,
  IconCheck,
  IconCopy,
  IconChevronDown,
  IconChevronUp,
  IconUser,
  IconAlertCircle,
} from '@tabler/icons-react';
import { api, MatchRecord, OutreachEmailResponse } from '../lib/api';

const SENDER_NAME_KEY = 'talentiq_sender_name';

type ShortlistModalProps = {
  jdId: string;
  jdTitle: string;
  matches: MatchRecord[];
  onClose: () => void;
};

export function ShortlistModal({ jdId, jdTitle, matches, onClose }: ShortlistModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Persist sender name in localStorage
  const [senderName, setSenderName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SENDER_NAME_KEY) || '';
    }
    return '';
  });

  // Top-K slider — default 3 or all if fewer candidates
  const [topK, setTopK] = useState<number>(Math.min(3, matches.length));

  // Manually selected candidate IDs (initialised to top-K)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(matches.slice(0, Math.min(3, matches.length)).map((m) => m.candidate_id))
  );

  // Generated emails state
  const [emails, setEmails] = useState<OutreachEmailResponse[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [copiedIds, setCopiedIds] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync selectedIds when topK slider changes
  useEffect(() => {
    setSelectedIds(new Set(matches.slice(0, topK).map((m) => m.candidate_id)));
  }, [topK, matches]);

  // Persist sender name on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SENDER_NAME_KEY, senderName);
    }
  }, [senderName]);

  const toggleCandidate = (candidateId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(candidateId)) {
        next.delete(candidateId);
      } else {
        next.add(candidateId);
      }
      return next;
    });
  };

  const toggleExpanded = (candidateId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(candidateId)) {
        next.delete(candidateId);
      } else {
        next.add(candidateId);
      }
      return next;
    });
  };

  const handleCopy = async (email: OutreachEmailResponse) => {
    const text = `Subject: ${email.subject}\n\n${email.body}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIds((prev) => new Set(prev).add(email.candidate_id));
      setTimeout(() => {
        setCopiedIds((prev) => {
          const next = new Set(prev);
          next.delete(email.candidate_id);
          return next;
        });
      }, 2000);
    } catch {
      // Fallback for browsers that block clipboard in non-HTTPS
    }
  };

  const handleGenerate = async () => {
    if (!senderName.trim()) {
      setError('Please enter your name before generating emails.');
      return;
    }
    if (selectedIds.size === 0) {
      setError('Please select at least one candidate.');
      return;
    }
    setError(null);
    setGenerating(true);
    setEmails([]);
    setExpandedIds(new Set());
    try {
      const result = await api.generateOutreachEmails(
        Array.from(selectedIds),
        jdId,
        senderName.trim()
      );
      setEmails(result.emails);
      // Auto-expand first email
      if (result.emails.length > 0) {
        setExpandedIds(new Set([result.emails[0].candidate_id]));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate outreach emails.');
    } finally {
      setGenerating(false);
    }
  };

  // Close on overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div className="bg-surface-primary border border-subtle rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-subtle flex-shrink-0">
          <div className="flex items-center gap-2">
            <IconMail className="text-accent w-5 h-5" />
            <h2 className="text-base font-medium text-text-primary">Shortlist &amp; Generate Outreach</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

          {/* Sender Name */}
          <div className="space-y-1.5">
            <label className="text-xs uppercase font-medium text-text-secondary tracking-wider">
              Your Name (Sender)
            </label>
            <input
              id="sender-name-input"
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. Sarah Johnson"
              className="w-full px-3 py-2 text-sm bg-surface-secondary border border-subtle rounded-md text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>

          {/* Top-K Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-medium text-text-secondary tracking-wider">
                Shortlist Top Candidates
              </label>
              <span className="text-sm font-medium text-accent">
                Top {topK} of {matches.length}
              </span>
            </div>
            <input
              id="topk-slider"
              type="range"
              min={1}
              max={matches.length}
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-full accent-[var(--color-accent)]"
            />
          </div>

          {/* Candidate Checklist */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-medium text-text-secondary tracking-wider">
              Selected Candidates ({selectedIds.size})
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {matches.map((match, idx) => {
                const isSelected = selectedIds.has(match.candidate_id);
                return (
                  <label
                    key={match.candidate_id}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md border cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-accent/50 bg-accent/5'
                        : 'border-subtle bg-surface-secondary hover:border-accent/30'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleCandidate(match.candidate_id)}
                      className="accent-[var(--color-accent)] w-4 h-4 flex-shrink-0"
                    />
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <IconUser size={14} className="text-text-secondary flex-shrink-0" />
                      <span className="text-sm font-medium text-text-primary truncate">
                        {match.candidate_name || 'Candidate'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-text-secondary">#{idx + 1}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        match.match_score >= 75
                          ? 'bg-green-500/10 text-green-600'
                          : match.match_score >= 50
                          ? 'bg-yellow-500/10 text-yellow-600'
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {match.match_score}%
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-destructive-fill border border-destructive-text/10 rounded-md text-destructive-text text-sm">
              <IconAlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Generated Emails */}
          {emails.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs uppercase font-medium text-text-secondary tracking-wider border-t border-subtle pt-4">
                Generated Emails ({emails.length})
              </div>
              {emails.map((email) => {
                const isExpanded = expandedIds.has(email.candidate_id);
                const isCopied = copiedIds.has(email.candidate_id);
                return (
                  <div
                    key={email.candidate_id}
                    className="border border-subtle rounded-lg overflow-hidden"
                  >
                    {/* Email header row */}
                    <div className="flex items-center justify-between px-4 py-3 bg-surface-secondary">
                      <div className="flex items-center gap-2 min-w-0">
                        <IconUser size={14} className="text-accent flex-shrink-0" />
                        <span className="text-sm font-medium text-text-primary truncate">
                          {email.candidate_name}
                        </span>
                        {email.candidate_email && (
                          <span className="text-xs text-text-secondary hidden sm:block truncate">
                            — {email.candidate_email}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleCopy(email)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-accent-light text-accent-text hover:bg-accent/15 transition-colors"
                        >
                          {isCopied ? (
                            <>
                              <IconCheck size={13} />
                              Copied!
                            </>
                          ) : (
                            <>
                              <IconCopy size={13} />
                              Copy
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => toggleExpanded(email.candidate_id)}
                          className="p-1.5 text-text-secondary hover:text-text-primary transition-colors"
                        >
                          {isExpanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                        </button>
                      </div>
                    </div>
                    {/* Expandable email body */}
                    {isExpanded && (
                      <div className="px-4 py-3 space-y-3 bg-surface-primary">
                        <div className="space-y-1">
                          <p className="text-xs uppercase font-medium text-text-secondary tracking-wider">Subject</p>
                          <p className="text-sm text-text-primary font-medium">{email.subject}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs uppercase font-medium text-text-secondary tracking-wider">Body</p>
                          <pre className="text-sm text-text-primary whitespace-pre-wrap font-sans leading-relaxed">
                            {email.body}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-subtle flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary rounded-md border border-subtle hover:bg-surface-secondary transition-colors"
          >
            Close
          </button>
          <button
            id="generate-emails-btn"
            onClick={handleGenerate}
            disabled={generating || selectedIds.size === 0}
            className="inline-flex items-center gap-2 px-5 py-2 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {generating ? (
              <>
                <IconLoader2 size={15} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <IconMail size={15} />
                Generate {selectedIds.size} Email{selectedIds.size !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
