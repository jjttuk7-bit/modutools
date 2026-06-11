import React from 'react';
import { categoryById } from '../../data/categories';
import type { CategoryId } from '../../types/tool';
import SeoHead, { SITE_URL, SITE_NAME } from './SeoHead';

interface ToolSeoHeadProps {
  categoryId: CategoryId;
  toolId: string;
}

export const ToolSeoHead: React.FC<ToolSeoHeadProps> = ({ categoryId, toolId }) => {
  const category = categoryById[categoryId];
  const tool = category?.tools.find((t) => t.id === toolId);

  if (!category || !tool) return null;

  const url = `${SITE_URL}${tool.path}`;

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${tool.name} — ${SITE_NAME}`,
    url,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web Browser (Chrome, Edge, Safari, Firefox)',
    description: tool.desc,
    inLanguage: 'ko-KR',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: SITE_NAME,
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: category.shortName,
        item: `${SITE_URL}${category.path}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: url,
      },
    ],
  };

  return (
    <SeoHead
      title={`${tool.name} — ${category.shortName}`}
      description={`${tool.desc}. ${SITE_NAME}의 무료 ${category.shortName} 도구로 회원가입 없이 브라우저에서 바로 사용하세요. 입력값은 서버로 전송되지 않습니다.`}
      path={tool.path}
      jsonLd={[softwareJsonLd, breadcrumbJsonLd]}
    />
  );
};

export default ToolSeoHead;
