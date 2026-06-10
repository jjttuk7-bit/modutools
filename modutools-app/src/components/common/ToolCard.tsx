import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { ToolMeta } from '../../types/tool';

interface ToolCardProps {
  tool: ToolMeta;
  variant?: 'default' | 'subtle';
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, variant = 'default' }) => {
  return (
    <Link
      to={tool.path}
      className={`group flex items-start gap-3 p-4 rounded-2xl border transition-all ${
        variant === 'subtle'
          ? 'bg-white border-slate-200 hover:border-slate-900 hover:shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-100'
          : 'bg-white border-slate-200 hover:border-slate-900 hover:shadow-md dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-100'
      }`}
    >
      <span className="p-2 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-slate-100 dark:group-hover:text-slate-900">
        {tool.icon}
      </span>
      <span className="flex flex-col flex-1 min-w-0">
        <span className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-900 group-hover:text-[#0F172A] dark:text-slate-100 dark:group-hover:text-slate-50">
            {tool.name}
          </span>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors dark:text-slate-600 dark:group-hover:text-slate-100" />
        </span>
        <span className="text-xs text-slate-500 mt-1 line-clamp-2 dark:text-slate-400">
          {tool.desc}
        </span>
      </span>
    </Link>
  );
};

export default ToolCard;
