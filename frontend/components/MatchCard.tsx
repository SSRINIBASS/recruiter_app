import Link from 'next/link';
import { ScoreBar } from './ScoreBar';
import { SkillTag } from './SkillTag';
import { MatchRecord } from '../lib/api';

type MatchCardProps = {
  match: MatchRecord;
  rank: number;
};

export function MatchCard({ match, rank }: MatchCardProps) {
  const isTopRank = rank === 1;

  return (
    <div
      className={`bg-surface-primary rounded-lg p-6 border ${
        isTopRank
          ? 'border-accent ring-1 ring-accent/30'
          : 'border-subtle'
      } transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6`}
    >
      {/* Rank and Info */}
      <div className="flex items-start gap-4 flex-1">
        {/* Rank Number */}
        <span
          className={`text-xl font-medium tracking-tight mt-1 ${
            isTopRank ? 'text-accent' : 'text-text-secondary'
          }`}
        >
          #{rank}
        </span>

        {/* Candidate Details */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3">
            <span className="text-lg font-medium text-text-primary">
              {match.candidate_name || 'Candidate Name'}
            </span>
          </div>

          {/* Fit Explanation */}
          {match.fit_analysis && (
            <p className="text-base text-text-secondary leading-relaxed max-w-2xl">
              {match.fit_analysis}
            </p>
          )}

          {/* Skill lists */}
          <div className="flex flex-wrap gap-2 pt-1">
            {/* Proven skills */}
            {match.matching_skills.map((skill) => (
              <SkillTag key={skill} skill={skill} variant="proven" />
            ))}
            {/* Claimed-only skills */}
            {match.claimed_only_skills && match.claimed_only_skills.map((skill) => (
              <SkillTag key={skill} skill={skill} variant="claimed" />
            ))}
            {/* Gaps */}
            {match.skill_gaps.map((skill) => (
              <SkillTag key={skill} skill={skill} variant="gap" />
            ))}
          </div>
        </div>
      </div>

      {/* Match Score & Action */}
      <div className="flex flex-col items-end gap-3 justify-between w-full md:w-56 flex-shrink-0">
        <div className="w-full">
          <div className="text-xs uppercase font-medium text-text-secondary tracking-wider mb-1 text-right">
            Match Score
          </div>
          <ScoreBar score={match.match_score} showBar={true} />
        </div>

        <Link
          href={`/candidates/${match.candidate_id}`}
          className="w-full text-center px-4 py-2 text-sm font-medium rounded-md bg-accent-light text-accent-text hover:bg-accent/15 transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
