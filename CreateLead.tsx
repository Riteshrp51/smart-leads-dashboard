import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLeadStore } from '../store/leadStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { User, Mail, ShieldAlert, ArrowLeft, PlusCircle } from 'lucide-react';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  source: z.enum(['Website', 'Instagram', 'Referral']),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
});

type LeadFormValues = z.infer<typeof leadSchema>;

const CreateLead: React.FC = () => {
  const { createLead, actionLoading, error, clearError } = useLeadStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      email: '',
      source: 'Website',
      status: 'New',
    },
  });

  const onSubmit = async (data: LeadFormValues) => {
    clearError();
    const success = await createLead(data);
    if (success) {
      navigate('/');
    }
  };

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

          {/* Form Card */}
          <div className="bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-md dark:shadow-2xl relative">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200 dark:border-b-slate-800/80">
              <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-500 dark:text-indigo-400">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Add Customer Lead</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Input prospect details to begin tracking communication status
                </p>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 rounded-2xl text-xs flex items-center gap-3">
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase px-1">
                  Lead Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-455 dark:text-slate-500">
                    <User className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    {...register('name')}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-2xl text-sm font-medium outline-none transition duration-200"
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] text-rose-500 dark:text-rose-400 font-semibold px-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase px-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-455 dark:text-slate-500">
                    <Mail className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="email"
                    placeholder="jane.smith@example.com"
                    {...register('email')}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-2xl text-sm font-medium outline-none transition duration-200"
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-rose-500 dark:text-rose-400 font-semibold px-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Source Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase px-1">
                    Lead Source
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-455 dark:text-slate-500">
                      <ShieldAlert className="w-4.5 h-4.5" />
                    </span>
                    <select
                      {...register('source')}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 dark:text-slate-100 rounded-2xl text-sm font-medium outline-none transition duration-200 cursor-pointer appearance-none"
                    >
                      <option value="Website" className="bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200">Website</option>
                      <option value="Instagram" className="bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200">Instagram</option>
                      <option value="Referral" className="bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200">Referral</option>
                    </select>
                  </div>
                  {errors.source && (
                    <p className="text-[11px] text-rose-500 dark:text-rose-400 font-semibold px-1">
                      {errors.source.message}
                    </p>
                  )}
                </div>

                {/* Status Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase px-1">
                    Pipeline Status
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-455 dark:text-slate-500">
                      <ShieldAlert className="w-4.5 h-4.5" />
                    </span>
                    <select
                      {...register('status')}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 dark:text-slate-100 rounded-2xl text-sm font-medium outline-none transition duration-200 cursor-pointer appearance-none"
                    >
                      <option value="New" className="bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200">New</option>
                      <option value="Contacted" className="bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200">Contacted</option>
                      <option value="Qualified" className="bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200">Qualified</option>
                      <option value="Lost" className="bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200">Lost</option>
                    </select>
                  </div>
                  {errors.status && (
                    <p className="text-[11px] text-rose-500 dark:text-rose-400 font-semibold px-1">
                      {errors.status.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-5 py-2.5 bg-white hover:bg-slate-50/80 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl text-xs transition active:scale-95 hover:shadow-sm dark:hover:shadow-black/25 duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:via-purple-600 hover:to-purple-700 text-white font-semibold rounded-2xl text-xs shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center min-w-[100px] cursor-pointer"
                >
                  {actionLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Add Lead'
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateLead;
