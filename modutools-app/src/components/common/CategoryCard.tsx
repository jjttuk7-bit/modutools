import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { CategoryMeta } from '../../types/tool';

interface CategoryCardProps {
  category: CategoryMeta;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      to={category.path}
      className="group block bg-white border border-slate-200 rounded-2xl p-5 transition-all hover:border-slate-900 hover:shadow-md dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-100"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border ${category.accentBg} ${category.accent}`}
        >
          {category.icon}
        </span>
        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors mt-1 dark:text-slate-600 dark:group-hover:text-slate-100" />
      </div>

      <div className="mt-4">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight dark:text-slate-100">
          {category.name}
        </h3>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed dark:text-slate-400">
          {category.desc}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {category.tools.slice(0, 4).map((t) => (
          <span
            key={t.id}
            className="text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-150 rounded-full px-2 py-0.5 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700"
          >
            {t.name}
          </span>
        ))}
        {category.tools.length > 4 && (
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-150 rounded-full px-2 py-0.5 dark:text-slate-500 dark:bg-slate-800 dark:border-slate-700">
            +{category.tools.length - 4}
          </span>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;
