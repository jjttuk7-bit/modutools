import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Layers, ShieldCheck } from 'lucide-react';
import { categories } from '../data/categories';
import ThemeToggle from '../components/common/ThemeToggle';

export const Header: React.FC = () => {
  return (
    <header
      id="app-header"
      className="bg-white border-b border-slate-200/70 sticky top-0 z-30 backdrop-blur dark:bg-slate-950/90 dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-9 h-9 rounded-xl bg-[#0F172A] text-white flex items-center justify-center shadow-sm dark:bg-slate-100 dark:text-slate-900">
            <Layers className="w-5 h-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold text-slate-900 tracking-tight group-hover:text-[#0F172A] dark:text-slate-100">
              모두도구 · modutools
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              회원가입 없이 바로 쓰는 무료 실무 도구
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300">
          {categories.map((c) => (
            <NavLink
              key={c.id}
              to={c.path}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                }`
              }
            >
              {c.shortName}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5 dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-900">
            <ShieldCheck className="w-3.5 h-3.5" />
            서버 전송 없음
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
