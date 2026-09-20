import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  icon: Icon
}) {
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-ocean-primary hover:bg-ocean-primaryHover text-white shadow-sm',
    secondary: 'bg-ocean-secondary hover:bg-ocean-primary text-white shadow-sm',
    outline: 'bg-white border border-ocean-border text-ocean-primary hover:bg-ocean-primaryLight',
    ghost: 'bg-transparent text-ocean-text hover:bg-ocean-primaryLight hover:text-ocean-primary',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 mr-1.5 flex-shrink-0" />}
      {children}
    </button>
  );
}
