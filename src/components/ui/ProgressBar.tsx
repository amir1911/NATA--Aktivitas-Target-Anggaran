import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ProgressBarProps {
  value: number; // 0 to 100
  color?: 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showPercentage?: boolean;
}

export function ProgressBar({
  value,
  color = 'blue',
  size = 'md',
  className,
  showPercentage = false,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, value));

  const colors = {
    blue: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    amber: 'bg-gradient-to-r from-amber-400 to-orange-500',
    rose: 'bg-gradient-to-r from-rose-500 to-red-600',
    indigo: 'bg-gradient-to-r from-indigo-500 to-purple-600',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {showPercentage && (
        <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
          <span>Kemajuan</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div
        className={twMerge(
          clsx('w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden', heights[size], className)
        )}
      >
        <div
          className={clsx('h-full transition-all duration-500 rounded-full', colors[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
