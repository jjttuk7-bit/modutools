import React from 'react';
import { Sparkles } from 'lucide-react';
import { categories } from '../data/categories';
import CategoryCard from '../components/common/CategoryCard';
import PrivacyBadges from '../components/common/PrivacyBadges';

export const HomePage: React.FC = () => {
  const totalTools = categories.reduce((sum, c) => sum + c.tools.length, 0);

  return (
    <div className="space-y-10">
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
