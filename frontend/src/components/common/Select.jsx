import React from 'react';

export default function Select({
  label,
  options = [],
  value,
  onChange,
  className = '',
  id,
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold uppercase tracking-wider text-ocean-navy dark:text-ocean-sky mb-1.5"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl border bg-white dark:bg-ocean-deep text-slate-900 dark:text-ocean-surface text-sm px-3.5 py-2.5 border-ocean-sky/50 dark:border-ocean-borderDark focus:outline-none focus:ring-2 focus:ring-ocean-teal cursor-pointer ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt.id} value={opt.value ?? opt.id} className="bg-white dark:bg-ocean-dark text-slate-900 dark:text-white">
            {opt.label ?? opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}
