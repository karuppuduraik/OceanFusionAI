import React from 'react';

export function Skeleton({ className = '', variant = 'rect' }) {
  const variantStyles = {
    rect: 'rounded-xl',
    circle: 'rounded-full',
    text: 'rounded h-4 w-full',
  };

  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-ocean-borderDark/60 ${variantStyles[variant]} ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl glass-panel p-5 space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton variant="text" className="w-1/3 h-4" />
        <Skeleton variant="circle" className="w-8 h-8" />
      </div>
      <Skeleton variant="text" className="w-1/2 h-8" />
      <Skeleton variant="text" className="w-2/3 h-3" />
    </div>
  );
}
