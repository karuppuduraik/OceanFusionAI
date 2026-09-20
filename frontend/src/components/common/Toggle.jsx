import React from 'react';

export default function Toggle({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  id,
}) {
  const toggleId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex items-center justify-between gap-4 py-1.5 group">
      {(label || description) && (
        <div
          className="flex flex-col select-none cursor-pointer flex-1"
          onClick={() => !disabled && onChange && onChange(!checked)}
        >
          {label && (
            <label
              htmlFor={toggleId}
              className="text-xs font-semibold text-ocean-navy dark:text-ocean-surface cursor-pointer select-none group-hover:text-ocean-teal transition-colors"
            >
              {label}
            </label>
          )}
          {description && (
            <span className="text-[11px] text-slate-500 dark:text-ocean-sky/70">
              {description}
            </span>
          )}
        </div>
      )}
      <button
        type="button"
        id={toggleId}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ocean-teal/40 ${
          checked ? 'bg-ocean-teal' : 'bg-slate-300 dark:bg-slate-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
