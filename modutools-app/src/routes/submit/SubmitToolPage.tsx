import React, { lazy } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { categoryById } from '../../data/categories';

const PdfMaskTool = lazy(() => import('../../tools/submit/pdf-mask/PdfMaskTool'));
const PhotoToPdfTool = lazy(() => import('../../tools/submit/photo-to-pdf/PhotoToPdfTool'));
const ImageCompressTool = lazy(
  () => import('../../tools/submit/image-compress/ImageCompressTool'),
);
const PdfMergeTool = lazy(() => import('../../tools/submit/pdf-merge/PdfMergeTool'));
const PdfExtractTool = lazy(() => import('../../tools/submit/pdf-extract/PdfExtractTool'));

const toolComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'pdf-mask': PdfMaskTool,
  'photo-to-pdf': PhotoToPdfTool,
  'image-compress': ImageCompressTool,
  'pdf-merge': PdfMergeTool,
  'pdf-extract': PdfExtractTool,
};

export default function SubmitToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const category = categoryById['submit'];
  const ToolComponent = toolId ? toolComponents[toolId] : undefined;

  if (!ToolComponent) {
    return <Navigate to={category.path} replace />;
  }

  return (
    <div className="space-y-4">
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
