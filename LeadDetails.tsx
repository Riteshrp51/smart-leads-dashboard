import React, { useEffect } from 'react';
import { useLeadStore } from '../store/leadStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { ArrowLeft, User, Mail, ShieldAlert, Calendar, UserCheck, Edit3, Trash2 } from 'lucide-react';

const LeadDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    selectedLead,
    fetchLeadById,
    deleteLead,
    loading,
    actionLoading,
    error,
    clearError,
  } = useLeadStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchLeadById(id);
    }
    return () => {
      clearError();
    };
  }, [id, fetchLeadById, clearError]);

  const handleDelete = async () => {
    if (!id || !selectedLead) return;
    if (window.confirm(`Are you sure you want to delete lead: "${selectedLead.name}"?`)) {
      const success = await deleteLead(id);
      if (success) {
        navigate('/');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      New: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      Contacted: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      Qualified: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      Lost: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    };
    return (
      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${styles[status] || 'bg-slate-500/10'}`}>
        {status}
      </span>
    );
  };

  const getSourceBadge = (source: string) => {
    const styles: any = {
      Website: 'bg-slate-500/10 text-slate-300 border border-slate-700/50',
      Instagram: 'bg-pink-500/10 text-pink-400 border border-pink-500/20',
      Referral: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    };
    return (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${styles[source] || 'bg-slate-500/10'}`}>
        {source}
      </span>
    );
  };

  const creatorName = selectedLead && typeof selectedLead.createdBy === 'object' ? selectedLead.createdBy.name : 'Unknown';
  const creatorEmail = selectedLead && typeof selectedLead.createdBy === 'object' ? selectedLead.createdBy.email : '';
  const creatorId = selectedLead && typeof selectedLead.createdBy === 'object' ? selectedLead.createdBy._id : selectedLead?.createdBy;

  const canModify = user && selectedLead && (user.role === 'admin' || creatorId === user._id);
  const canDelete = user && user.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex flex-col transition-colors duration-200">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-3xl mx-auto w-full">
          {/* Back button */}
          <div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-semibold transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Pipeline
            </button>
          </div>

          {loading ? (
            <div className="bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-12 flex justify-center backdrop-blur-xl">
              <Loader size="lg" />
            </div>
          ) : error ? (
            <div className="bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-12 text-center backdrop-blur-xl">
              <p className="text-rose-500 dark:text-rose-400 text-sm font-semibold">{error}</p>
            </div>
          ) : !selectedLead ? (
            <div className="bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-12 text-center backdrop-blur-xl">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Lead not found.</p>
            </div>
          ) : (
            /* Lead Details Card */
            <div className="bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-md dark:shadow-2xl relative space-y-6">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800/80">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl text-white shadow-xl shadow-indigo-500/20">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{selectedLead.name}</h2>
                    <p className="text-xs text-indigo-500 dark:text-indigo-400 font-semibold mt-0.5">ID: {selectedLead._id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/leads/${selectedLead._id}/edit`)}
                    disabled={!canModify}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-emerald-50 dark:bg-slate-900 dark:hover:bg-emerald-500/10 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500/30 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl text-xs font-semibold cursor-pointer active:scale-95 transition duration-200"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={!canDelete || actionLoading}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-rose-50 dark:bg-slate-900 dark:hover:bg-rose-500/10 border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-500/30 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl text-xs font-semibold cursor-pointer active:scale-95 transition duration-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Email Info */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 mt-0.5">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email Address</p>
                    <a href={`mailto:${selectedLead.email}`} className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition mt-1 block">
                      {selectedLead.email}
                    </a>
                  </div>
                </div>

                {/* Pipeline Status */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 mt-0.5">
                    <ShieldAlert className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Pipeline Status</p>
                    {getStatusBadge(selectedLead.status)}
                  </div>
                </div>

                {/* Lead Source */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 mt-0.5">
                    <ShieldAlert className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Lead Source</p>
                    {getSourceBadge(selectedLead.source)}
                  </div>
                </div>

                {/* Created Date */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 mt-0.5">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Acquisition Date</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                      {new Date(selectedLead.createdAt).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Assigned User/Creator Box */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500 dark:text-indigo-400">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Lead Ownership</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{creatorName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{creatorEmail}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LeadDetails;
