import React from 'react';

export default function Card({ children, className = '', hover = true, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-ocean-card border border-ocean-border rounded-2xl p-5 shadow-card-soft transition-all duration-200 ${
        hover ? 'hover:shadow-card-hover hover:border-ocean-secondary/40' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
