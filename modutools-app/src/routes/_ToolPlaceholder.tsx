import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import type { CategoryMeta, ToolMeta } from '../types/tool';

interface ToolPlaceholderProps {
  category: CategoryMeta;
}

const findTool = (category: CategoryMeta, toolId?: string): ToolMeta | undefined => {
  if (!toolId) return undefined;
  return category.tools.find((t) => t.id === toolId);
};

export const ToolPlaceholder: React.FC<ToolPlaceholderProps> = ({ category }) => {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = findTool(category, toolId);

  return (
    <div className="space-y-6">
      <Link
        to={category.path}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {category.shortName}로 돌아가기
      </Link>

      <div className="bg-white border border-slate-200 rounded-3xl p-7 md:p-9">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border ${category.accentBg} ${category.accent}`}
          >
            {tool?.icon ?? category.icon}
          </span>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              {tool?.name ?? '준비 중인 도구'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">{tool?.desc ?? '곧 추가됩니다.'}</p>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4">
          <Construction className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-900">
              아직 이전 작업이 끝나지 않았어요.
            </p>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              이 도구는 골격 단계에서 placeholder로 제공됩니다. 단계별 이전 일정에
              따라 곧 실제 기능이 연결됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolPlaceholder;
