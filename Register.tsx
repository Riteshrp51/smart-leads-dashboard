import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, BarChart2, ShieldAlert, AlertCircle } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'sales']),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const { register: registerAction, error, loading, token, clearError } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'sales',
    },
  });

  // Redirect if logged in
  useEffect(() => {
    if (token) {
      navigate('/');
    }
    return () => {
      clearError();
    };
  }, [token, navigate, clearError]);

  const onSubmit = async (data: RegisterFormValues) => {
    await registerAction(data.name, data.email, data.password, data.role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b0f19] px-4 relative overflow-hidden transition-colors duration-200">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 backdrop-blur-xl shadow-xl dark:shadow-2xl relative">
        <div className="flex flex-col items-center mb-8 text-center">
          {/* Glowing Brand Icon */}
          <div className="relative p-3 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl text-white shadow-xl shadow-indigo-500/25 mb-4">
            <BarChart2 className="w-6 h-6 animate-pulse" />
            <div className="absolute inset-0 rounded-2xl blur bg-indigo-500/30 -z-10"></div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Create Account
          </h2>

          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
            Get started with SmartLeads tracker today
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 flex items-center gap-3 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 rounded-2xl text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase px-1">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-450 dark:text-slate-500">
                <User className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                placeholder="John Doe"
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
                placeholder="you@example.com"
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

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase px-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-455 dark:text-slate-500">
                <Lock className="w-4.5 h-4.5" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-2xl text-sm font-medium outline-none transition duration-200"
              />
            </div>
            {errors.password && (
              <p className="text-[11px] text-rose-500 dark:text-rose-400 font-semibold px-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Role select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-550 dark:text-slate-400 tracking-wide uppercase px-1">
              Account Role
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-455 dark:text-slate-500">
                <ShieldAlert className="w-4.5 h-4.5" />
              </span>
              <select
                {...register('role')}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 dark:text-slate-100 rounded-2xl text-sm font-medium outline-none transition duration-200 cursor-pointer appearance-none"
              >
                <option value="sales" className="bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200">Sales Executive</option>
                <option value="admin" className="bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200">Administrator</option>
              </select>
            </div>
            {errors.role && (
              <p className="text-[11px] text-rose-500 dark:text-rose-400 font-semibold px-1">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:via-purple-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-[1.01] active:scale-98 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-550 dark:text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
