import React from 'react';
import { NavLink } from 'react-router-dom';
import { categories } from '../data/categories';

export const MobileToolTabs: React.FC = () => {
  return (
    <div className="md:hidden sticky top-16 z-20 bg-white border-b border-slate-200/70 dark:bg-slate-950/90 dark:border-slate-800">
      <div className="overflow-x-auto no-scrollbar">
        <nav className="flex items-center gap-1.5 px-3 py-2 min-w-max">
          {categories.map((c) => (
            <NavLink
              key={c.id}
              to={c.path}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800'
                }`
              }
            >
              <span className="w-4 h-4 inline-flex items-center justify-center">
                {c.icon}
              </span>
              {c.shortName}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileToolTabs;
