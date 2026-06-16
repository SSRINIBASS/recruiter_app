type SkillTagProps = {
  skill: string;
  variant?: 'proven' | 'claimed' | 'gap';
};

export function SkillTag({ skill, variant = 'proven' }: SkillTagProps) {
  let classes = 'bg-score-high-fill text-score-high-text border-score-high-text/20'; // proven

  if (variant === 'claimed') {
    classes = 'bg-score-mid-fill text-score-mid-text border-score-mid-text/20';
  } else if (variant === 'gap') {
    classes = 'bg-surface-secondary text-text-secondary border-subtle border-dashed';
  }

  return (
    <span
      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-sm border ${classes}`}
    >
      {skill}
    </span>
  );
}

