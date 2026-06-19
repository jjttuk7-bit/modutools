import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import ToolPlaceholder from '../_ToolPlaceholder';
import SeoHead from '../../components/seo/SeoHead';
import { categoryById } from '../../data/categories';

export default function ImageToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const category = categoryById['image'];
  const tool = category.tools.find((item) => item.id === toolId);

  if (!tool) {
    return <Navigate to={category.path} replace />;
  }

  return (
    <>
      <SeoHead
        title={`${tool.name} 준비 중`}
        description={`${tool.name} 도구는 이미지 정리 도구 카테고리에 연결될 예정입니다.`}
        path={tool.path}
        noindex
      />
      <ToolPlaceholder category={category} />
    </>
  );
}
