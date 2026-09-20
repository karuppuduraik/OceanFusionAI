import React from 'react';

export default function Input({
  label,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  id,
  helperText,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-ocean-navy dark:text-ocean-sky mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative rounded-xl">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-ocean-sky/60">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`w-full rounded-xl border bg-white/70 dark:bg-ocean-deep/70 text-slate-900 dark:text-ocean-surface placeholder-slate-400 dark:placeholder-ocean-sky/40 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ocean-teal focus:border-transparent ${
            Icon ? 'pl-10' : 'pl-4'
          } pr-4 py-2.5 ${
            error
              ? 'border-rose-500 ring-1 ring-rose-500'
              : 'border-ocean-sky/50 dark:border-ocean-borderDark hover:border-ocean-teal/50'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-400 dark:text-ocean-sky/60 mt-1">{helperText}</p>}
    </div>
  );
}
