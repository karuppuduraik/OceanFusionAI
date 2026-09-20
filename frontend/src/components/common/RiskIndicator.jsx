import React from 'react';

export default function RiskIndicator({ score, label, showProgress = true }) {
  // score is 0 - 100
  let color = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
  let progressColor = 'bg-emerald-500';
  let level = 'Low Risk';

  if (score >= 70) {
    color = 'text-rose-500 bg-rose-500/10 border-rose-500/30';
    progressColor = 'bg-rose-500';
    level = 'Critical Threat';
  } else if (score >= 40) {
    color = 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    progressColor = 'bg-amber-500';
    level = 'Elevated Risk';
  }

  const displayLabel = label || level;

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between text-xs">
        <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${color}`}>
          {displayLabel}
        </span>
        <span className="font-mono font-bold text-slate-700 dark:text-ocean-sky">
          {score}%
        </span>
      </div>
      {showProgress && (
        <div className="w-full h-1.5 bg-slate-200 dark:bg-ocean-deep rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
          />
        </div>
      )}
    </div>
  );
}
