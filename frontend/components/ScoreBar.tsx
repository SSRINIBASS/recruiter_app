type ScoreBarProps = {
  score: number;
  showBar?: boolean;
};

export function ScoreBar({ score, showBar = true }: ScoreBarProps) {
  // Determine color theme based on score thresholds
  let fillClass = 'bg-accent';
  let textClass = 'text-accent-text bg-accent-light';
  
  if (score >= 70) {
    fillClass = 'bg-gradient-to-r from-emerald-500 to-teal-600';
    textClass = 'text-score-high-text bg-score-high-fill';
  } else if (score >= 40) {
    fillClass = 'bg-gradient-to-r from-amber-400 to-orange-500';
    textClass = 'text-score-mid-text bg-score-mid-fill';
  } else {
    fillClass = 'bg-gradient-to-r from-rose-500 to-red-600';
    textClass = 'text-score-low-text bg-score-low-fill';
  }

  return (
    <div className="flex items-center gap-3 w-full">
      {showBar && (
        <div className="flex-1 bg-surface-secondary h-2.5 rounded-full overflow-hidden border border-subtle/50">
          <div 
            className={`h-full ${fillClass} transition-all duration-300`} 
            style={{ width: `${score}%` }}
          />
        </div>
      )}
      <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${textClass} min-w-[36px] text-center`}>
        {score}%
      </span>
    </div>
  );
}
