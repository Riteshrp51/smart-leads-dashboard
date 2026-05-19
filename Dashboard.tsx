import React, { useEffect, useState } from 'react';
import { useLeadStore } from '../store/leadStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import LeadTable from '../components/LeadTable';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import Papa from 'papaparse';
import { Download, Users, CheckCircle2, PhoneCall, XOctagon, Plus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const {
    leads,
    pagination,
    loading,
    error,
    filters,
    fetchLeads,
    setFilters,
    resetFilters,
    deleteLead,
  } = useLeadStore();

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Step 12: Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ search: searchTerm, page: 1 });
      fetchLeads();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, setFilters, fetchLeads]);

  // Refetch leads when non-search filters change
  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.source, filters.sort, filters.page]);

  // Step 13: CSV Export
  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const csvData = leads.map((lead) => ({
      Name: lead.name,
      Email: lead.email,
      Source: lead.source,
      Status: lead.status,
      'Assigned To': typeof lead.createdBy === 'object' ? lead.createdBy.name : 'Unknown',
      'Created Date': new Date(lead.createdAt).toLocaleDateString(),
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics calculation
  const getMetrics = () => {
    const total = pagination.totalLeads || leads.length;
    const qualified = leads.filter((l) => l.status === 'Qualified').length;
    const contacted = leads.filter((l) => l.status === 'Contacted').length;
    const lost = leads.filter((l) => l.status === 'Lost').length;

    return { total, qualified, contacted, lost };
  };

  const metrics = getMetrics();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex flex-col transition-colors duration-200">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full overflow-hidden">
          {/* Header Dashboard section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
                Leads Pipeline
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Monitor, search, and track customer acquisitions in real time.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* CSV Export */}
              {user?.role === 'admin' && (
                <button
                  onClick={handleExportCSV}
                  disabled={leads.length === 0}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs transition cursor-pointer active:scale-95 duration-200"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              )}

              {/* Add Lead */}
              <button
                onClick={() => navigate('/create-lead')}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl text-xs shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 transition cursor-pointer duration-200"
              >
                <Plus className="w-4 h-4" />
                Add Lead
              </button>
            </div>
          </div>

          {/* Step 14: Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Card */}
            <div className="bg-white dark:bg-[#111827]/40 border-t-3 border-t-indigo-500 border-x border-b border-slate-200/80 dark:border-x-slate-800/80 dark:border-b-slate-800/80 rounded-2xl p-4.5 relative overflow-hidden backdrop-blur-sm shadow-sm dark:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-black/30 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Leads</span>
                <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition duration-300">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-800 dark:text-slate-200">{metrics.total}</p>
              <div className="absolute inset-0 rounded-2xl blur-lg bg-indigo-500/5 -z-10"></div>
            </div>

            {/* Qualified Card */}
            <div className="bg-white dark:bg-[#111827]/40 border-t-3 border-t-emerald-500 border-x border-b border-slate-200/80 dark:border-x-slate-800/80 dark:border-b-slate-800/80 rounded-2xl p-4.5 relative overflow-hidden backdrop-blur-sm shadow-sm dark:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-black/30 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Qualified</span>
                <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition duration-300">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-800 dark:text-slate-200">{metrics.qualified}</p>
              <div className="absolute inset-0 rounded-2xl blur-lg bg-emerald-500/5 -z-10"></div>
            </div>

            {/* Contacted Card */}
            <div className="bg-white dark:bg-[#111827]/40 border-t-3 border-t-amber-500 border-x border-b border-slate-200/80 dark:border-x-slate-800/80 dark:border-b-slate-800/80 rounded-2xl p-4.5 relative overflow-hidden backdrop-blur-sm shadow-sm dark:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-black/30 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Contacted</span>
                <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-500 dark:text-amber-400 group-hover:scale-110 transition duration-300">
                  <PhoneCall className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-800 dark:text-slate-200">{metrics.contacted}</p>
              <div className="absolute inset-0 rounded-2xl blur-lg bg-amber-500/5 -z-10"></div>
            </div>

            {/* Lost Card */}
            <div className="bg-white dark:bg-[#111827]/40 border-t-3 border-t-rose-500 border-x border-b border-slate-200/80 dark:border-x-slate-800/80 dark:border-b-slate-800/80 rounded-2xl p-4.5 relative overflow-hidden backdrop-blur-sm shadow-sm dark:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-black/30 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Lost</span>
                <div className="p-1.5 bg-rose-500/10 rounded-lg text-rose-500 dark:text-rose-400 group-hover:scale-110 transition duration-300">
                  <XOctagon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-800 dark:text-slate-200">{metrics.lost}</p>
              <div className="absolute inset-0 rounded-2xl blur-lg bg-rose-500/5 -z-10"></div>
            </div>
          </div>

          {/* Filtering + Search controls */}
          <div className="bg-white dark:bg-[#111827]/30 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-4 space-y-4 backdrop-blur-sm shadow-md dark:shadow-lg">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
              <FilterBar
                status={filters.status || ''}
                source={filters.source || ''}
                sort={filters.sort || 'latest'}
                onFilterChange={setFilters}
                onReset={resetFilters}
              />
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 rounded-2xl text-sm flex items-center gap-3">
              <XOctagon className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Data Presentation Area */}
          <div className="bg-white dark:bg-[#111827]/20 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-lg dark:shadow-2xl backdrop-blur-sm min-h-[300px] flex flex-col justify-between">
            {loading ? (
              <div className="flex-1 flex items-center justify-center py-20">
                <Loader size="lg" />
              </div>
            ) : leads.length === 0 ? (
              <div className="flex-1 flex items-center justify-center py-16 px-4">
                <EmptyState
                  title={searchTerm || filters.status || filters.source ? 'No Matching Leads' : 'No Leads Tracked'}
                  description={
                    searchTerm || filters.status || filters.source
                      ? 'Try clearing your filters or altering your search text.'
                      : 'Create a new lead to start building your sales pipeline.'
                  }
                  showCreateButton={!(searchTerm || filters.status || filters.source)}
                />
              </div>
            ) : (
              <>
                <LeadTable
                  leads={leads}
                  onDelete={deleteLead}
                  currentUserId={user?._id}
                  currentUserRole={user?.role}
                />
                <Pagination
                  info={pagination}
                  onPageChange={(page) => setFilters({ page })}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
