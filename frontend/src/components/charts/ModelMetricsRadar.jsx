import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export default function ModelMetricsRadar({ data = [] }) {
  const { isDark } = useTheme();

  const gridColor = isDark ? 'rgba(25, 167, 206, 0.25)' : 'rgba(20, 108, 148, 0.15)';
  const textColor = isDark ? '#AFD3E2' : '#146C94';

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-2">
        <h4 className="text-sm font-bold font-heading text-ocean-navy dark:text-ocean-surface">
          Multi-Model Capability Comparison
        </h4>
        <p className="text-xs text-slate-500 dark:text-ocean-sky/70">
          Cross-domain benchmark scores (0–100%) across 6 oceanographic dimensions
        </p>
      </div>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke={gridColor} />
            <PolarAngleAxis dataKey="metric" stroke={textColor} tick={{ fontSize: 10, fill: textColor }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={gridColor} tick={{ fontSize: 9 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? 'rgba(11, 36, 71, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                borderColor: '#19A7CE',
                borderRadius: '12px',
                fontSize: '11px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" />
            <Radar
              name="CNN-LSTM Net"
              dataKey="CNN_LSTM"
              stroke="#19A7CE"
              fill="#19A7CE"
              fillOpacity={0.25}
            />
            <Radar
              name="XGBoost Forest"
              dataKey="XGBoost"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.25}
            />
            <Radar
              name="Physics PINN"
              dataKey="PINN"
              stroke="#F59E0B"
              fill="#F59E0B"
              fillOpacity={0.2}
            />
            <Radar
              name="Deep Ensemble"
              dataKey="Ensemble"
              stroke="#8B5CF6"
              fill="#8B5CF6"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
