import React from 'react';
import type { CategoryMeta } from '../types/tool';
import ToolCard from '../components/common/ToolCard';
import PrivacyBadges from '../components/common/PrivacyBadges';

interface CategoryHomeProps {
  category: CategoryMeta;
}

export const CategoryHome: React.FC<CategoryHomeProps> = ({ category }) => {
  return (
    <div className="space-y-8">
      <section className="bg-white border border-slate-200 rounded-3xl p-7 md:p-9 dark:bg-slate-900 dark:border-slate-800">
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-bold border rounded-full px-3 py-1.5 ${category.accentBg} ${category.accent}`}
        >
          <span className="w-3.5 h-3.5 inline-flex items-center justify-center">
            {category.icon}
          </span>
          {category.tagline}
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-4 dark:text-slate-100">
          {category.name}
        </h1>
        <p className="text-sm text-slate-600 mt-3 leading-relaxed max-w-2xl dark:text-slate-400">
          {category.desc}
        </p>
        <div className="mt-5">
          <PrivacyBadges />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-1 dark:text-slate-500">
          {category.shortName} 도구 ({category.tools.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {category.tools.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CategoryHome;
