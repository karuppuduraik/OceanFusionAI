import React from 'react';
import { motion } from 'framer-motion';

export default function CycloneRiskGauge({ score = 34, title = 'Cyclone Genesis Risk' }) {
  // score is 0 to 100
  const normalizedScore = Math.min(100, Math.max(0, score));
  // Needle angle: -90deg to +90deg
  const angle = (normalizedScore / 100) * 180 - 90;

  let riskColor = '#10B981'; // Green
  let riskText = 'Low Risk';

  if (normalizedScore >= 70) {
    riskColor = '#E11D48'; // Red
    riskText = 'Severe Genesis Risk';
  } else if (normalizedScore >= 40) {
    riskColor = '#F59E0B'; // Amber
    riskText = 'Moderate Probability';
  }

  return (
    <div className="flex flex-col items-center justify-center p-3 w-full">
      <div className="relative w-48 h-28 flex items-end justify-center overflow-hidden">
        {/* Semi-circle Gauge Background Arc */}
        <svg viewBox="0 0 200 110" className="w-full h-full">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#E11D48" />
            </linearGradient>
          </defs>

          {/* Track Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Inner Shadow Arc */}
          <path
            d="M 32 100 A 68 68 0 0 1 168 100"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="4"
          />
        </svg>

        {/* Animated Needle */}
        <motion.div
          initial={{ rotate: -90 }}
          animate={{ rotate: angle }}
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
          style={{ transformOrigin: '50% 100%' }}
          className="absolute bottom-1 w-1.5 h-20 bg-slate-800 dark:bg-white rounded-full shadow-lg z-10 flex items-start justify-center"
        >
          <div className="w-3 h-3 rounded-full bg-ocean-teal -mt-1 shadow-glow-teal" />
        </motion.div>

        {/* Needle Hub */}
        <div className="absolute bottom-0 w-6 h-6 rounded-full bg-slate-900 border-2 border-ocean-teal shadow-md z-20" />
      </div>

      {/* Label and Score */}
      <div className="text-center mt-2">
        <span className="text-2xl font-extrabold font-mono text-ocean-navy dark:text-ocean-surface">
          {normalizedScore}%
        </span>
        <p className="text-xs font-bold uppercase tracking-wider mt-0.5" style={{ color: riskColor }}>
          {riskText}
        </p>
        <span className="text-[11px] text-slate-500 dark:text-ocean-sky/70 block mt-0.5">
          {title}
        </span>
      </div>
    </div>
  );
}
