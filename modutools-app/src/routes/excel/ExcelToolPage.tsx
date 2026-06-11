import React, { lazy } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { categoryById } from '../../data/categories';
import ToolSeoHead from '../../components/seo/ToolSeoHead';

const RemoveDuplicatesTool = lazy(
  () => import('../../tools/excel/remove-duplicates/RemoveDuplicatesTool'),
);
const PhoneCleanerTool = lazy(
  () => import('../../tools/excel/phone-cleaner/PhoneCleanerTool'),
);
const CsvEncodingFixTool = lazy(
  () => import('../../tools/excel/csv-encoding-fix/CsvEncodingFixTool'),
);
const MergeExcelTool = lazy(() => import('../../tools/excel/merge-excel/MergeExcelTool'));
const SplitByColumnTool = lazy(
  () => import('../../tools/excel/split-by-column/SplitByColumnTool'),
);

const toolComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'remove-duplicates': RemoveDuplicatesTool,
  'phone-cleaner': PhoneCleanerTool,
  'csv-encoding-fix': CsvEncodingFixTool,
  'merge-excel': MergeExcelTool,
  'split-by-column': SplitByColumnTool,
};

export default function ExcelToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const category = categoryById['excel'];
  const ToolComponent = toolId ? toolComponents[toolId] : undefined;

  if (!ToolComponent) {
    return <Navigate to={category.path} replace />;
  }

  return (
    <div className="space-y-4">
      <ToolSeoHead categoryId="excel" toolId={toolId!} />
      <Link
        to={category.path}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {category.shortName}로 돌아가기
      </Link>
      <ToolComponent />
    </div>
  );
}
