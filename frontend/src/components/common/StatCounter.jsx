import React, { useEffect, useState } from 'react';

export default function StatCounter({ value, duration = 1200, decimals = 1, prefix = '', suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(0);
  const target = typeof value === 'number' ? value : parseFloat(value) || 0;

  useEffect(() => {
    let startTimestamp = null;
    let initialVal = displayValue;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = initialVal + (target - initialVal) * ease;
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [target, duration]);

  return (
    <span>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}
