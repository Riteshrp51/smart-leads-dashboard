import React from 'react';

interface LoaderProps {
  fullPage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Loader: React.FC<LoaderProps> = ({ fullPage = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
  };

  const containerClasses = fullPage
    ? 'fixed inset-0 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-sm z-50 flex items-center justify-center'
    : 'flex items-center justify-center p-8 w-full';

  return (
    <div className={containerClasses}>
      <div className="relative flex flex-col items-center gap-4">
        {/* Glowing Spinner */}
        <div className={`relative rounded-full animate-spin border-transparent border-t-indigo-500 border-r-purple-500 ${sizeClasses[size]}`}>
          {/* Inner Glow ring */}
          <div className="absolute inset-0 rounded-full blur-[2px] opacity-75 border-t-indigo-500 border-r-purple-500"></div>
        </div>
        
        {fullPage && (
          <span className="text-slate-500 dark:text-slate-400 font-medium tracking-wide animate-pulse">
            Loading Smart Leads...
          </span>
        )}
      </div>
    </div>
  );
};

export default Loader;
