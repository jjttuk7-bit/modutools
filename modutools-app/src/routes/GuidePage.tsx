import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, ClipboardList } from 'lucide-react';
import { categories } from '../data/categories';
import { toolGuides } from '../data/toolGuides';
import SeoHead, { SITE_URL } from '../components/seo/SeoHead';

const allTools = categories.flatMap((category) => category.tools);

const toolPathById = allTools.reduce(
  (acc, tool) => {
    acc[tool.id] = tool.path;
    return acc;
  },
  {} as Record<string, string>,
);

const toolNameById = allTools.reduce(
  (acc, tool) => {
    acc[tool.id] = tool.name;
    return acc;
  },
  {} as Record<string, string>,
);

export const GuidePage: React.FC = () => {
  const totalTools = allTools.length;
  const itemList = allTools.map((tool, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: tool.name,
    url: `${SITE_URL}${tool.path}`,
  }));

  return (
    <article className="bg-white border border-slate-200 rounded-3xl p-6 md:p-9 dark:bg-slate-900 dark:border-slate-800">
      <SeoHead
        title="30가지 무료 업무 도구 사용 가이드"
        description={`부가세 계산, QR 생성, PDF 정리, 썸네일 제작, 엑셀 정리까지 ${totalTools}가지 무료 도구를 언제 쓰면 좋은지 실제 상황별로 정리했습니다.`}
        path="/guide"
        type="article"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: '30가지 무료 업무 도구 사용 가이드',
            description: `모두의 도구에 담긴 ${totalTools}가지 무료 실무 도구의 사용 상황, 예시, 주의사항을 정리한 안내서입니다.`,
            inLanguage: 'ko-KR',
            url: `${SITE_URL}/guide`,
            publisher: {
              '@type': 'Organization',
              name: '모두의 도구',
              url: SITE_URL,
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: '모두의 도구 사용 가이드 목록',
            itemListElement: itemList,
          },
        ]}
      />

      <header className="border-b border-slate-200 pb-7 dark:border-slate-800">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700">
          <BookOpen className="w-3.5 h-3.5" />
          무료 업무 도구 가이드
        </span>
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-4 dark:text-slate-100">
          30가지 무료 업무 도구, 언제 쓰면 좋을까요?
        </h1>
        <p className="text-sm md:text-base text-slate-600 mt-4 leading-7 max-w-3xl dark:text-slate-400">
          모두의 도구는 계산, QR, PDF 제출 정리, 썸네일 제작, 엑셀 정리처럼
          매일 반복되는 작은 업무를 브라우저에서 바로 처리하도록 만든 서비스입니다.
          아래 가이드는 각 도구를 어떤 상황에서 쓰면 좋은지, 실제 업무에서는
          어떻게 활용할 수 있는지, 사용 전에 무엇을 확인해야 하는지 정리했습니다.
        </p>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 dark:bg-slate-800/40 dark:border-slate-700">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              카테고리
            </p>
            <p className="text-xl font-extrabold text-slate-900 mt-1 dark:text-slate-100">
              {categories.length}개
            </p>
          </div>
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 dark:bg-slate-800/40 dark:border-slate-700">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              무료 도구
            </p>
            <p className="text-xl font-extrabold text-slate-900 mt-1 dark:text-slate-100">
              {totalTools}개
            </p>
          </div>
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 dark:bg-slate-800/40 dark:border-slate-700">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              처리 방식
            </p>
            <p className="text-xl font-extrabold text-slate-900 mt-1 dark:text-slate-100">
              브라우저 중심
            </p>
          </div>
        </div>
      </header>

      <div className="mt-8 space-y-9">
        {categories.map((category) => (
          <section
            key={category.id}
            className="border-b border-slate-200 pb-9 last:border-b-0 last:pb-0 dark:border-slate-800"
          >
            <div className="flex items-start gap-3">
              <span
                className={`inline-flex shrink-0 items-center justify-center w-10 h-10 rounded-xl border ${category.accentBg} ${category.accent}`}
              >
                {category.icon}
              </span>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight dark:text-slate-100">
                  {category.name}
                </h2>
                <p className="text-sm text-slate-600 mt-2 leading-6 dark:text-slate-400">
                  {category.desc}. {category.tagline}이라는 기준으로, 파일이나
                  입력값이 불필요하게 외부로 나가지 않도록 설계했습니다.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {category.tools.map((tool) => {
                const guide = toolGuides[tool.id];

                return (
                  <div
                    key={tool.id}
                    className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-950/30 dark:border-slate-800"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex ${category.accent}`}>
                            {tool.icon}
                          </span>
                          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                            {tool.name}
                          </h3>
                        </div>
                        <p className="text-xs font-semibold text-slate-500 mt-1 dark:text-slate-400">
                          {tool.desc}
                        </p>
                      </div>
                      <Link
                        to={tool.path}
                        className="inline-flex shrink-0 items-center gap-1 text-[11px] font-extrabold text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                        aria-label={`${tool.name} 바로 사용하기`}
                      >
                        사용
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="mt-4 space-y-3 text-sm text-slate-600 leading-6 dark:text-slate-400">
                      <div>
                        <p className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
                          <ClipboardList className="w-3.5 h-3.5" />
                          어떤 상황에서 쓰나요?
                        </p>
                        <p className="mt-1">{guide.when}</p>
                      </div>
                      <div>
                        <p className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          실제 사용 예시
                        </p>
                        <p className="mt-1">{guide.example}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-3 dark:bg-slate-900 dark:border-slate-800">
                        <p className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
                          사용 전 확인할 점
                        </p>
                        <p className="mt-1 text-xs leading-5">{guide.beforeUse}</p>
                      </div>
                    </div>

                    {guide.relatedToolIds.length > 0 ? (
                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                        <p className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
                          함께 쓰면 좋은 도구
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {guide.relatedToolIds.map((relatedId) => (
                            <Link
                              key={relatedId}
                              to={toolPathById[relatedId]}
                              className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-950 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:text-white"
                            >
                              {toolNameById[relatedId]}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6 dark:bg-slate-800/40 dark:border-slate-700">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
          도구를 고르는 간단한 기준
        </h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600 leading-6 dark:text-slate-400">
          <p>
            금액을 검산하거나 견적을 정리해야 한다면{' '}
            <Link to="/business" className="font-bold text-slate-900 dark:text-slate-100">
              사장님 계산기
            </Link>
            를 먼저 확인하세요. 부가세, 공급가액, 프리랜서 원천징수, 마진처럼
            자주 헷갈리는 숫자를 빠르게 비교할 수 있습니다.
          </p>
          <p>
            제출 파일을 정리해야 한다면{' '}
            <Link to="/submit" className="font-bold text-slate-900 dark:text-slate-100">
              PDF 정리 도구
            </Link>
            가 적합합니다. 사진을 PDF로 묶고, 여러 PDF를 합치고, 필요한 페이지만
            추출하거나 민감한 정보를 가릴 수 있습니다.
          </p>
          <p>
            오프라인 안내문이나 매장 운영에는{' '}
            <Link to="/qr" className="font-bold text-slate-900 dark:text-slate-100">
              QR도구함
            </Link>
            이 편합니다. 링크, 와이파이, 연락처 정보를 QR로 만들고, 받은 QR의
            내용도 확인할 수 있습니다.
          </p>
          <p>
            이미지 작업이나 명단 정리처럼 반복되는 운영 업무는{' '}
            <Link to="/thumbnail" className="font-bold text-slate-900 dark:text-slate-100">
              썸네일도구함
            </Link>
            과{' '}
            <Link to="/excel" className="font-bold text-slate-900 dark:text-slate-100">
              엑셀 정리 도구
            </Link>
            를 함께 쓰면 시간을 줄일 수 있습니다.
          </p>
        </div>
      </section>
    </article>
  );
};

export default GuidePage;
