import React, { lazy } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ToolSeoHead from '../../components/seo/ToolSeoHead';
import { categoryById } from '../../data/categories';

const ImageCompressTool = lazy(() => import('../../tools/image/compress/ImageCompressTool'));
const ImageResizeTool = lazy(() => import('../../tools/image/resize/ImageResizeTool'));
const IdPhotoTool = lazy(() => import('../../tools/image/id-photo/IdPhotoTool'));
const JpgConverterTool = lazy(() => import('../../tools/image/jpg-converter/JpgConverterTool'));
const CropPaddingTool = lazy(() => import('../../tools/image/crop-padding/CropPaddingTool'));

const toolComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  compress: ImageCompressTool,
  resize: ImageResizeTool,
  'id-photo': IdPhotoTool,
  'jpg-converter': JpgConverterTool,
  'crop-padding': CropPaddingTool,
};

export default function ImageToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const category = categoryById['image'];
  const ToolComponent = toolId ? toolComponents[toolId] : undefined;

  if (!ToolComponent) {
    return <Navigate to={category.path} replace />;
  }

  return (
    <div className="space-y-4">
      <ToolSeoHead categoryId="image" toolId={toolId!} />
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
