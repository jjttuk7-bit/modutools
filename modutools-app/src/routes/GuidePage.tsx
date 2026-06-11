import React from 'react';
import { BookOpen } from 'lucide-react';
import { categories } from '../data/categories';

export const GuidePage: React.FC = () => {
  const totalTools = categories.reduce((sum, c) => sum + c.tools.length, 0);

  return (
    <article className="bg-white border border-slate-200 rounded-3xl p-7 md:p-9 dark:bg-slate-900 dark:border-slate-800">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700">
        <BookOpen className="w-3.5 h-3.5" />
        가이드
      </span>
      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-4 dark:text-slate-100">
        모두의 도구 사용 안내
      </h1>
      <p className="text-sm text-slate-600 mt-3 leading-relaxed dark:text-slate-400">
        {categories.length}개 카테고리에 담긴 {totalTools}개 실무 도구의 용도와
        추천 사용 시점을 한 번에 정리했습니다. 어느 일이 생겼을 때 어느 도구를
        꺼내면 되는지 빠르게 확인해 보세요.
      </p>

      <div className="mt-7 space-y-5">
        {categories.map((c) => (
          <section
            key={c.id}
            className="border border-slate-200 rounded-2xl p-5 bg-slate-50/40 dark:bg-slate-800/40 dark:border-slate-700"
          >
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border ${c.accentBg} ${c.accent}`}
              >
                {c.icon}
              </span>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight dark:text-slate-100">
                {c.name}
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed dark:text-slate-400">
              {c.desc}
            </p>
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {c.tools.map((t) => (
                <li
                  key={t.id}
                  className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-400"
                >
                  <span className="text-slate-400 mt-0.5 dark:text-slate-500">•</span>
                  <span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      {t.name}
                    </span>{' '}
                    <span className="text-slate-500 dark:text-slate-400">— {t.desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  );
};

export default GuidePage;
