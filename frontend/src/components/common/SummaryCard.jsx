import React from 'react';
import Card from './Card';

export default function SummaryCard({ title, value, unit = '', change = '', icon: Icon, status = 'normal' }) {
  const statusColors = {
    normal: 'text-ocean-primary bg-sky-50',
    warning: 'text-ocean-warning bg-amber-50',
    danger: 'text-ocean-danger bg-rose-50',
    success: 'text-ocean-success bg-emerald-50',
    info: 'text-ocean-secondary bg-cyan-50',
  };

  return (
    <Card className="flex flex-col justify-between p-3.5 sm:p-4 space-y-2.5 overflow-hidden h-full shadow-sm hover:shadow-md">
      <div className="flex items-start justify-between gap-1.5 min-w-0">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider leading-snug flex-1 min-w-0 break-words line-clamp-2">
          {title}
        </span>
        {Icon && (
          <div className={`p-1.5 sm:p-2 rounded-xl flex-shrink-0 ml-1 ${statusColors[status] || statusColors.normal}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="min-w-0 w-full">
        <div className="flex items-baseline gap-1 min-w-0 w-full overflow-hidden">
          <span
            title={typeof value === 'string' ? value : undefined}
            className={`font-bold font-heading text-ocean-text tracking-tight min-w-0 truncate block ${
              String(value).length > 10
                ? 'text-sm sm:text-base'
                : String(value).length > 7
                ? 'text-base sm:text-lg'
                : 'text-lg sm:text-xl xl:text-[22px]'
            }`}
          >
            {value}
          </span>
          {unit && <span className="text-xs font-semibold text-slate-500 flex-shrink-0">{unit}</span>}
        </div>

        {change && (
          <p className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1 leading-tight truncate" title={change}>
            <span className="truncate">{change}</span>
          </p>
        )}
      </div>
    </Card>
  );
}

