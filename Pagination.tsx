import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationInfo } from '../types';

interface PaginationProps {
  info: PaginationInfo;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ info, onPageChange }) => {
  const { page, totalPages, totalLeads } = info;

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/10">
        <p className="text-xs text-slate-500 font-medium">
          Showing all <span className="font-bold text-slate-600 dark:text-slate-400">{totalLeads}</span> leads
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#111827]/10 backdrop-blur-sm rounded-b-2xl">
      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium order-2 sm:order-1">
        Showing <span className="font-bold text-slate-800 dark:text-slate-200">{(page - 1) * info.limit + 1}</span> to{' '}
        <span className="font-bold text-slate-800 dark:text-slate-200">
          {Math.min(page * info.limit, totalLeads)}
        </span>{' '}
        of <span className="font-bold text-slate-800 dark:text-slate-200">{totalLeads}</span> leads
      </div>

      <div className="flex items-center gap-2 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-2 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 px-4 py-2 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-2 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition duration-200"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
