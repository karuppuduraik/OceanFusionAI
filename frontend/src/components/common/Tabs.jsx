import React from 'react';
import { motion } from 'framer-motion';

export default function Tabs({ tabs = [], activeTab, onChange, className = '' }) {
  return (
    <div className={`flex items-center gap-1.5 p-1 bg-slate-200/70 dark:bg-ocean-deep/80 rounded-2xl border border-ocean-sky/40 dark:border-ocean-borderDark w-fit ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === (tab.id ?? tab);
        const label = tab.label ?? tab;
        const id = tab.id ?? tab;
        const Icon = tab.icon;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`relative px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 select-none ${
              isActive
                ? 'text-white'
                : 'text-slate-600 dark:text-ocean-sky/70 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-gradient-to-r from-ocean-navy to-ocean-teal rounded-xl shadow-md"
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {label}
              {tab.badge !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-ocean-teal/20 text-ocean-teal'
                }`}>
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
