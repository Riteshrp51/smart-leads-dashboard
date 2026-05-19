import React from 'react';
import type { Lead } from '../types';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LeadTableProps {
  leads: Lead[];
  onDelete: (id: string) => void;
  currentUserId?: string;
  currentUserRole?: string;
}

const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  onDelete,
  currentUserId,
  currentUserRole,
}) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: Lead['status']) => {
    const styles = {
      New: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      Contacted: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      Qualified: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      Lost: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    };
    return (
      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const getSourceBadge = (source: Lead['source']) => {
    const styles = {
      Website: 'bg-slate-500/10 text-slate-300 border border-slate-700/50',
      Instagram: 'bg-pink-500/10 text-pink-400 border border-pink-500/20',
      Referral: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    };
    return (
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${styles[source]}`}>
        {source}
      </span>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <th className="px-6 py-4.5 rounded-tl-2xl">Lead Details</th>
            <th className="px-6 py-4.5">Source</th>
            <th className="px-6 py-4.5">Status</th>
            <th className="px-6 py-4.5 hidden md:table-cell">Assigned To</th>
            <th className="px-6 py-4.5 hidden lg:table-cell">Created Date</th>
            <th className="px-6 py-4.5 text-right rounded-tr-2xl">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 bg-transparent text-sm">
          {leads.map((lead) => {
            const creatorName = typeof lead.createdBy === 'object' ? lead.createdBy.name : 'Unknown';
            const creatorId = typeof lead.createdBy === 'object' ? lead.createdBy._id : lead.createdBy;
            
            // Check permissions: Admin can edit all, Sales can only edit their own
            const canModify = currentUserRole === 'admin' || creatorId === currentUserId;
            const canDelete = currentUserRole === 'admin';

            return (
              <tr 
                key={lead._id}
                className="hover:bg-slate-50/70 dark:hover:bg-slate-900/30 transition-all duration-200 group"
              >
                {/* Lead Info */}
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition duration-150">
                      {lead.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {lead.email}
                    </p>
                  </div>
                </td>

                {/* Lead Source */}
                <td className="px-6 py-4">
                  {getSourceBadge(lead.source)}
                </td>

                {/* Lead Status */}
                <td className="px-6 py-4">
                  {getStatusBadge(lead.status)}
                </td>

                {/* Lead Creator */}
                <td className="px-6 py-4 hidden md:table-cell text-slate-700 dark:text-slate-300 font-medium">
                  {creatorName}
                </td>

                {/* Created Date */}
                <td className="px-6 py-4 hidden lg:table-cell text-slate-500 dark:text-slate-400 text-xs">
                  {new Date(lead.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* View Details */}
                    <button
                      onClick={() => navigate(`/leads/${lead._id}`)}
                      title="View Details"
                      className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-slate-900/60 hover:bg-indigo-50 dark:hover:bg-indigo-500/15 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-500/40 rounded-xl cursor-pointer transition-all active:scale-95 duration-200"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => navigate(`/leads/${lead._id}/edit`)}
                      disabled={!canModify}
                      title={canModify ? 'Edit Lead' : 'No Permission to Edit'}
                      className="p-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-white dark:bg-slate-900/60 hover:bg-emerald-50 dark:hover:bg-emerald-500/15 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-300 dark:hover:border-emerald-500/40 rounded-xl cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-slate-900/60 disabled:hover:text-slate-300 dark:disabled:hover:text-slate-400 disabled:hover:border-slate-200 dark:disabled:hover:border-slate-800 transition-all active:scale-95 duration-200"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete lead: "${lead.name}"?`)) {
                          onDelete(lead._id);
                        }
                      }}
                      disabled={!canDelete}
                      title={canDelete ? 'Delete Lead' : 'No Permission to Delete'}
                      className="p-2 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-white dark:bg-slate-900/60 hover:bg-rose-50 dark:hover:bg-rose-500/15 border border-slate-200/80 dark:border-slate-800/80 hover:border-rose-300 dark:hover:border-rose-500/40 rounded-xl cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-slate-900/60 disabled:hover:text-slate-300 dark:disabled:hover:text-slate-400 disabled:hover:border-slate-200 dark:disabled:hover:border-slate-800 transition-all active:scale-95 duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
