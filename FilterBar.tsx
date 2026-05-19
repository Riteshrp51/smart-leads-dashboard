import React from 'react';
import { RotateCcw } from 'lucide-react';

interface FilterBarProps {
  status: string;
  source: string;
  sort: string;
  onFilterChange: (filters: { status?: string; source?: string; sort?: string; page: number }) => void;
  onReset: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  status,
  source,
  sort,
  onFilterChange,
  onReset,
}) => {
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'New', label: 'New' },
    { value: 'Contacted', label: 'Contacted' },
    { value: 'Qualified', label: 'Qualified' },
    { value: 'Lost', label: 'Lost' },
  ];

  const sourceOptions = [
    { value: '', label: 'All Sources' },
    { value: 'Website', label: 'Website' },
    { value: 'Instagram', label: 'Instagram' },
    { value: 'Referral', label: 'Referral' },
  ];

  const sortOptions = [
    { value: 'latest', label: 'Latest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
  ];

  const hasActiveFilters = status !== '' || source !== '' || sort !== 'latest';

  return (
    <div className="flex flex-wrap items-center gap-3 w-full">
      {/* Status Filter */}
      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider hidden sm:inline">Status</span>
        <select
          value={status}
          onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })}
          className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none border-none py-1.5 cursor-pointer"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Source Filter */}
      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider hidden sm:inline">Source</span>
        <select
          value={source}
          onChange={(e) => onFilterChange({ source: e.target.value, page: 1 })}
          className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none border-none py-1.5 cursor-pointer"
        >
          {sourceOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Filter */}
      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider hidden sm:inline">Sort</span>
        <select
          value={sort}
          onChange={(e) => onFilterChange({ sort: e.target.value, page: 1 })}
          className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none border-none py-1.5 cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Button */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/20 hover:border-indigo-500/30 rounded-xl transition cursor-pointer active:scale-95 duration-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;
