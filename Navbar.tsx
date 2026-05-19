import React from 'react';
import { useAuthStore } from '../store/authStore';
import { LogOut, User, BarChart2, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useThemeStore from '../store/themeStore';

const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#0b0f19]/70 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      {/* Brand logo */}
      <div 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2.5 cursor-pointer group"
      >
        <div className="relative p-2 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition duration-200">
          <BarChart2 className="w-5 h-5" />
          <div className="absolute inset-0 rounded-xl blur bg-indigo-500/20 group-hover:bg-indigo-500/40 -z-10 transition"></div>
        </div>
        <span className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-950 dark:from-slate-100 dark:to-slate-200 bg-clip-text text-transparent tracking-tight">
          SmartLeads <span className="text-indigo-500 dark:text-indigo-400">Dashboard</span>
        </span>
      </div>

      {/* Control Tools */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl cursor-pointer transition active:scale-95 duration-200"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Session Info */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="p-1 bg-indigo-500/10 rounded-lg text-indigo-500 dark:text-indigo-400">
                <User className="w-4 h-4" />
              </div>
              
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                  {user.role} Account
                </p>
              </div>

              {/* Glowing Role Badge */}
              <span className={`text-[10px] px-2 py-0.5 font-bold tracking-wider rounded-md uppercase ${
                user.role === 'admin' 
                  ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20' 
                  : 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20'
              }`}>
                {user.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              title="Log Out"
              className="p-2.5 bg-slate-50 hover:bg-rose-500/10 dark:bg-slate-900 dark:hover:bg-rose-500/10 border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-500/30 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl cursor-pointer transition active:scale-95 duration-200"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
