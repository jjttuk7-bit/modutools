import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ShieldCheck, Award, BookOpen, Home } from 'lucide-react';
import { categories } from '../data/categories';
import type { CategoryMeta } from '../types/tool';

interface SidebarProps {
  activeCategory?: CategoryMeta;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeCategory }) => {
  const location = useLocation();

  return (
    <aside
      id="sidebar-navigation"
      className="w-72 bg-white border border-slate-200/80 rounded-2xl p-5 space-y-6 flex-shrink-0 h-fit dark:bg-slate-900 dark:border-slate-800"
    >
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1 dark:text-slate-500">
          카테고리
        </h3>
        <nav className="space-y-1.5" aria-label="카테고리 일람">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-xl transition-all duration-150 border ${
                isActive
                  ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md shadow-slate-950/20 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100'
                  : 'text-slate-700 hover:text-slate-900 border-transparent hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100'
              }`
            }
          >
            <span className="p-2 rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              <Home className="w-4 h-4" />
            </span>
            <span className="flex flex-col">
              <span className="text-xs font-bold leading-tight">전체 홈</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {categories.length}개 카테고리 한눈에
              </span>
            </span>
          </NavLink>

          <NavLink
            to="/guide"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-xl transition-all duration-150 border ${
                isActive
                  ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md shadow-slate-950/20 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100'
                  : 'text-slate-700 hover:text-slate-900 border-transparent hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`p-2 rounded-lg ${
                    isActive
                      ? 'bg-white/15 text-white dark:bg-slate-900/20 dark:text-slate-900'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                </span>
                <span className="flex flex-col">
                  <span className="text-xs font-bold leading-tight">
                    사용 가이드
                  </span>
                  <span
                    className={`text-[10px] ${
                      isActive ? 'text-slate-300 dark:text-slate-700' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    25개 도구 사용 상황
                  </span>
                </span>
              </>
            )}
          </NavLink>

          {categories.map((c) => {
            const isActive = location.pathname.startsWith(c.path);
            return (
              <NavLink
                key={c.id}
                to={c.path}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-150 border group ${
                  isActive
                    ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md shadow-slate-950/20 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100'
                    : 'text-slate-700 hover:text-slate-900 border-transparent hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                }`}
              >
                <span
                  className={`p-2 rounded-lg flex-shrink-0 ${
                    isActive
                      ? 'bg-white/15 text-white dark:bg-slate-900/20 dark:text-slate-900'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-slate-700'
                  }`}
                >
                  {c.icon}
                </span>
                <span className="flex flex-col min-w-0 pr-1 select-none">
                  <span
                    className={`text-xs font-bold leading-tight ${
                      isActive ? 'text-white dark:text-slate-900' : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {c.shortName}
                  </span>
                  <span
                    className={`text-[10px] truncate mt-0.5 ${
                      isActive ? 'text-slate-300 dark:text-slate-700' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {c.tagline}
                  </span>
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {activeCategory && activeCategory.tools.length > 1 && (
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1 dark:text-slate-500">
            {activeCategory.shortName} 도구
          </h3>
          <nav className="space-y-1.5" aria-label="도구 일람">
            {activeCategory.tools.map((t) => {
              const isActive = location.pathname === t.path;
              return (
                <NavLink
                  key={t.id}
                  to={t.path}
                  className={`flex items-start space-x-3 p-2.5 rounded-xl transition-all duration-150 border group ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100'
                      : 'text-slate-700 hover:text-slate-900 border-transparent hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                  }`}
                >
                  <span
                    className={`p-1.5 rounded-lg flex-shrink-0 ${
                      isActive
                        ? 'bg-white/15 text-white dark:bg-slate-900/20 dark:text-slate-900'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-slate-700'
                    }`}
                  >
                    {t.icon}
                  </span>
                  <span className="flex flex-col min-w-0 pr-1 select-none">
                    <span
                      className={`text-[11px] font-bold leading-tight ${
                        isActive ? 'text-white dark:text-slate-900' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {t.name}
                    </span>
                    <span
                      className={`text-[10px] truncate mt-0.5 ${
                        isActive ? 'text-slate-300 dark:text-slate-700' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {t.desc}
                    </span>
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      )}

      <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-150 relative overflow-hidden select-none dark:bg-slate-800/50 dark:border-slate-700">
        <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-100">
          <ShieldCheck className="w-4 h-4 flex-shrink-0 text-[#0F172A] dark:text-emerald-400" />
          <span className="text-xs font-bold">100% 브라우저 처리</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed mt-1.5 font-medium dark:text-slate-400">
          입력하신 데이터·파일은 외부 서버로 전송되지 않습니다. 모든 처리는 브라우저
          안에서 끝나며, 로그인이나 회원가입도 필요 없습니다.
        </p>
        <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.03] dark:opacity-[0.05]">
          <Award className="w-20 h-20 text-slate-950 dark:text-slate-100" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
