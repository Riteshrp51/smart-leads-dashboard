import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle } from 'lucide-react';

const Sidebar: React.FC = () => {
  const links = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/create-lead', label: 'Add Lead', icon: PlusCircle },
  ];

  return (
    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#0b0f19]/40 p-4 flex flex-row md:flex-col gap-2 shrink-0">
      <div className="hidden md:block mb-4 px-3">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
          Navigation
        </p>
      </div>

      <nav className="flex flex-row md:flex-col gap-1.5 w-full">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer w-full hover:scale-[1.01] active:scale-[0.99] ${
                  isActive
                    ? 'bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/5 dark:shadow-indigo-500/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/50 border border-transparent'
                }`
              }
            >
              <Icon className="w-4.5 h-4.5" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
