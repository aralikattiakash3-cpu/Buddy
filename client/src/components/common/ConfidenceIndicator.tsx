import React from 'react';
import { clsx } from 'clsx';

interface ConfidenceIndicatorProps {
  level: 'low' | 'medium' | 'high';
  showLabel?: boolean;
  className?: string;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  level,
  showLabel = true,
  className,
}) => {
  const config = {
    low: { dots: 1, color: 'bg-red-400', label: 'Low Confidence', textColor: 'text-red-700', bg: 'bg-red-50' },
    medium: { dots: 2, color: 'bg-amber-400', label: 'Medium Confidence', textColor: 'text-amber-700', bg: 'bg-amber-50' },
    high: { dots: 3, color: 'bg-green-500', label: 'High Confidence', textColor: 'text-green-700', bg: 'bg-green-50' },
  };
  const { dots, color, label, textColor, bg } = config[level] || config.medium;

  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', bg, textColor, className)}>
      <span className="flex gap-0.5">
        {[1, 2, 3].map(i => (
          <span
            key={i}
            className={clsx('w-1.5 h-1.5 rounded-full', i <= dots ? color : 'bg-slate-200')}
          />
        ))}
      </span>
      {showLabel && label}
    </span>
  );
};

interface SuitabilityScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export const SuitabilityScore: React.FC<SuitabilityScoreProps> = ({ score, size = 'md' }) => {
  const color =
    score >= 75 ? 'text-green-700 bg-green-50 border-green-200' :
    score >= 50 ? 'text-amber-700 bg-amber-50 border-amber-200' :
    'text-red-700 bg-red-50 border-red-200';

  const barColor =
    score >= 75 ? 'bg-green-500' :
    score >= 50 ? 'bg-amber-400' :
    'bg-red-400';

  const sizeClass = size === 'lg' ? 'text-2xl font-black' : size === 'sm' ? 'text-sm font-bold' : 'text-lg font-bold';

  return (
    <div className={clsx('border rounded-xl p-3 text-center', color)}>
      <div className={sizeClass}>{score}<span className="text-xs font-normal ml-0.5">/100</span></div>
      <div className="mt-1.5 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-500', barColor)}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-xs mt-1 opacity-80">Suitability</p>
    </div>
  );
};
