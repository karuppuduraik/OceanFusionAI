import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export default function LossConvergenceChart({ data = [] }) {
  const { isDark } = useTheme();

  const gridColor = isDark ? 'rgba(25, 167, 206, 0.12)' : 'rgba(20, 108, 148, 0.08)';
  const textColor = isDark ? '#AFD3E2' : '#146C94';

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-2">
        <h4 className="text-sm font-bold font-heading text-ocean-navy dark:text-ocean-surface">
          Training & Validation Loss Convergence
        </h4>
        <p className="text-xs text-slate-500 dark:text-ocean-sky/70">
          Mean Squared Error (MSE) minimization over 150 training epochs
        </p>
      </div>

      <div className="w-full h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="epoch"
              stroke={textColor}
              tick={{ fontSize: 11 }}
              tickLine={false}
              label={{ value: 'Epochs', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: textColor }}
            />
            <YAxis
              stroke={textColor}
              tick={{ fontSize: 11 }}
              tickLine={false}
              domain={[0, 1.0]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? 'rgba(11, 36, 71, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                borderColor: '#19A7CE',
                borderRadius: '12px',
                fontSize: '11px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" />
            <Line
              type="monotone"
              dataKey="trainLoss"
              name="Training Loss (MSE)"
              stroke="#19A7CE"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#19A7CE' }}
            />
            <Line
              type="monotone"
              dataKey="valLoss"
              name="Validation Loss"
              stroke="#F43F5E"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              dot={{ r: 4, fill: '#F43F5E' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
