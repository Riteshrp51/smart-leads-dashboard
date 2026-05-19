import React from 'react';
import { Inbox, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  showCreateButton?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Leads Found',
  description = 'Add some leads to start tracking your business opportunities.',
  showCreateButton = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-[#111827]/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-md dark:shadow-xl max-w-lg mx-auto backdrop-blur-md">
      <div className="relative mb-6 p-4 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/50 rounded-2xl inline-block text-indigo-500 dark:text-indigo-400">
        <Inbox className="w-12 h-12" />
        <div className="absolute inset-0 rounded-2xl blur-lg bg-indigo-500/10 -z-10"></div>
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        {title}
      </h3>
      
      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm leading-relaxed mb-8">
        {description}
      </p>

      {showCreateButton && (
        <button
          onClick={() => navigate('/create-lead')}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-95 transition duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Your First Lead
        </button>
      )}
    </div>
  );
};

export default EmptyState;
