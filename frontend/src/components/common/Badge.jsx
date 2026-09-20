import React from 'react';

export default function Badge({ children, variant = 'info', className = '' }) {
  const variants = {
    success: 'bg-emerald-50 text-ocean-success border-emerald-200',
    warning: 'bg-amber-50 text-ocean-warning border-amber-200',
    danger: 'bg-rose-50 text-ocean-danger border-rose-200',
    info: 'bg-sky-50 text-ocean-primary border-sky-200',
    accent: 'bg-cyan-50 text-ocean-secondary border-cyan-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        variants[variant] || variants.info
      } ${className}`}
    >
      {children}
    </span>
  );
}
