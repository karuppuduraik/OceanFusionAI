import React from 'react';

export default function CorrelationHeatmap({ data = [] }) {
  return (
    <div className="w-full flex flex-col space-y-3">
      <div>
        <h4 className="text-sm font-bold font-heading text-ocean-navy dark:text-ocean-surface">
          Multi-Variable Hydrodynamic Correlation Matrix
        </h4>
        <p className="text-xs text-slate-500 dark:text-ocean-sky/70">
          Pearson correlation coefficients (r) derived from multi-sensor time-series
        </p>
      </div>

      <div className="space-y-2.5">
        {data.map((item, idx) => {
          const isPositive = item.correlation > 0;
          const absVal = Math.abs(item.correlation);
          const barColor = isPositive ? 'bg-ocean-teal' : 'bg-rose-500';

          return (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-ocean-sky/10 dark:bg-ocean-deep/60 border border-ocean-sky/30 dark:border-ocean-borderDark space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ocean-navy dark:text-ocean-surface">
                  {item.variable}
                </span>
                <span className={`font-mono font-bold ${isPositive ? 'text-ocean-teal' : 'text-rose-400'}`}>
                  {isPositive ? `+${item.correlation.toFixed(2)}` : item.correlation.toFixed(2)}
                </span>
              </div>

              {/* Progress correlation meter */}
              <div className="w-full h-2 bg-slate-200 dark:bg-ocean-borderDark rounded-full overflow-hidden flex">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${absVal * 100}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-ocean-sky/70">
                <span>{item.significance}</span>
                <span className="font-mono">Strength: {Math.round(absVal * 100)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
