import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glass?: boolean;
}

export function Card({ children, glass = true, className, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-2xl p-5 transition-all duration-200',
          glass
            ? 'glass-card shadow-sm hover:shadow-md'
            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={twMerge('flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800/60', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={twMerge('text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2', className)}>{children}</h3>;
}
