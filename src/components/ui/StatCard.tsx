import React from 'react';
import { Card } from './Card';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isUp: boolean;
  };
  color?: 'sky' | 'emerald' | 'amber' | 'violet' | 'rose' | 'navy';
}

export function StatCard({ title, value, subtitle, icon, trend, color = 'sky' }: StatCardProps) {
  const iconGradients = {
    navy: 'bg-[#091540] text-white shadow-navy-950/20',
    sky: 'bg-[#4EA5D9] text-white shadow-sky-500/20',
    emerald: 'bg-[#22C55E] text-white shadow-green-500/20',
    amber: 'bg-[#F59E0B] text-white shadow-amber-500/20',
    violet: 'bg-[#8B5CF6] text-white shadow-purple-500/20',
    rose: 'bg-[#EF4444] text-white shadow-red-500/20',
  };

  return (
    <Card className="relative overflow-hidden group border border-slate-200/80 bg-white hover:border-[#4EA5D9]/40 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            {title}
          </p>
          <p className="text-2xl font-extrabold text-[#091540] dark:text-white tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 text-xs font-bold pt-1">
              <span className={trend.isUp ? 'text-[#22C55E]' : 'text-[#EF4444]'}>
                {trend.isUp ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-slate-400 font-normal">vs bulan lalu</span>
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconGradients[color]} shadow-md transition-transform duration-300 group-hover:scale-105 shrink-0`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
