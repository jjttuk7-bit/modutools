import React, { lazy } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { categoryById } from '../../data/categories';
import ToolSeoHead from '../../components/seo/ToolSeoHead';

const YoutubeThumbnailTool = lazy(
  () => import('../../tools/thumbnail/youtube-thumbnail/YoutubeThumbnailTool'),
);
const BlogCoverTool = lazy(
  () => import('../../tools/thumbnail/blog-cover/BlogCoverTool'),
);
const InstagramImageTool = lazy(
  () => import('../../tools/thumbnail/instagram-image/InstagramImageTool'),
);
const StoreMainImageTool = lazy(
  () => import('../../tools/thumbnail/store-main-image/StoreMainImageTool'),
);
const TextOnImageTool = lazy(
  () => import('../../tools/thumbnail/text-on-image/TextOnImageTool'),
);

const toolComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'youtube-thumbnail': YoutubeThumbnailTool,
  'blog-cover': BlogCoverTool,
  'instagram-image': InstagramImageTool,
  'store-main-image': StoreMainImageTool,
  'text-on-image': TextOnImageTool,
};

export default function ThumbnailToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const category = categoryById['thumbnail'];
  const ToolComponent = toolId ? toolComponents[toolId] : undefined;

  if (!ToolComponent) {
    return <Navigate to={category.path} replace />;
  }

  return (
    <div className="space-y-4">
      <ToolSeoHead categoryId="thumbnail" toolId={toolId!} />
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
