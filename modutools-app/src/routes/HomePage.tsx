import React from 'react';
import { Sparkles } from 'lucide-react';
import { categories } from '../data/categories';
import CategoryCard from '../components/common/CategoryCard';
import PrivacyBadges from '../components/common/PrivacyBadges';
import SeoHead, { SITE_URL, SITE_NAME } from '../components/seo/SeoHead';

export const HomePage: React.FC = () => {
  const totalTools = categories.reduce((sum, c) => sum + c.tools.length, 0);

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'modutools',
    url: SITE_URL,
    inLanguage: 'ko-KR',
    description:
      '회원가입 없이 바로 쓰는 사장님·프리랜서 무료 실무 도구함. 부가세·QR·PDF·썸네일·이미지·엑셀 정리 30가지.',
  };

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.png`,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: 'monglesb@gmail.com',
        contactType: 'customer support',
        availableLanguage: ['Korean'],
      },
    ],
  };

  return (
    <div className="space-y-10">
      <SeoHead
        title="모두의 도구 · 가입 없이 바로 쓰는 무료 실무 도구"
        description={`사장님·프리랜서가 매일 쓰는 ${totalTools}가지 도구를 한 곳에서. 부가세·프리랜서 3.3% 계산, QR, PDF 정리, 썸네일, 엑셀 정리까지 회원가입 없이 무료. 모든 처리는 브라우저 안에서만 일어납니다.`}
        path="/"
        jsonLd={[websiteJsonLd, organizationJsonLd]}
      />
      <section className="bg-white border border-slate-200 rounded-3xl p-7 md:p-9 dark:bg-slate-900 dark:border-slate-800">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700">
          <Sparkles className="w-3.5 h-3.5" />
          {categories.length}개 카테고리 · {totalTools}개 무료 도구
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-4 dark:text-slate-100">
          사장님·프리랜서가 매일 쓰는 {totalTools}가지 도구,
          <br />
          한 곳에서 끝내세요.
        </h1>
        <p className="text-sm text-slate-600 mt-3 leading-relaxed max-w-2xl dark:text-slate-400">
          회원가입도, 서버 업로드도 필요 없습니다. 모든 처리는 브라우저 안에서만
          끝납니다. 소상공인·프리랜서·1인 운영자가 매일 마주치는 일을
          카테고리별로 정리했어요.
        </p>
        <div className="mt-5">
          <PrivacyBadges />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-1 dark:text-slate-500">
          카테고리 살펴보기
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
