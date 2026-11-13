import React from 'react';
import { clsx } from 'clsx';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullPage?: boolean;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', text, fullPage, className }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  const spinner = (
    <div className={clsx('flex flex-col items-center gap-3', className)}>
      <div
        className={clsx(
          sizes[size],
          'rounded-full border-green-200 border-t-green-700 animate-spin'
        )}
      />
      {text && <p className="text-sm text-slate-500 font-medium">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export const PageLoader: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
        <div className="w-8 h-8 rounded-full border-2 border-green-200 border-t-green-700 animate-spin" />
      </div>
      <p className="text-sm text-slate-500 font-medium">{text}</p>
    </div>
  </div>
);
