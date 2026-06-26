import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock } from 'lucide-react';
import { articleBySlug } from '../data/articles';
import { categories, categoryById } from '../data/categories';
import SeoHead, { SITE_URL } from '../components/seo/SeoHead';

const allTools = categories.flatMap((category) => category.tools);
const toolById = allTools.reduce(
  (acc, tool) => {
    acc[tool.id] = tool;
    return acc;
  },
  {} as Record<string, (typeof allTools)[number]>,
);

export const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? articleBySlug[slug] : undefined;

  if (!article) {
    return <Navigate to="/guide" replace />;
  }

  const category = categoryById[article.categoryId];
  const relatedTools = article.relatedToolIds
    .map((id) => toolById[id])
    .filter(Boolean);

  const articleUrl = `${SITE_URL}/guide/${article.slug}`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      inLanguage: 'ko-KR',
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      url: articleUrl,
      mainEntityOfPage: articleUrl,
      author: { '@type': 'Organization', name: '모두의 도구' },
      publisher: {
        '@type': 'Organization',
        name: '모두의 도구',
        url: SITE_URL,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '가이드', item: `${SITE_URL}/guide` },
        { '@type': 'ListItem', position: 2, name: article.title, item: articleUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: article.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ];

  return (
    <article className="bg-white border border-slate-200 rounded-3xl p-6 md:p-9 dark:bg-slate-900 dark:border-slate-800">
      <SeoHead
        title={article.title}
        description={article.description}
        path={`/guide/${article.slug}`}
        type="article"
        jsonLd={jsonLd}
      />

      <nav className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
        <Link to="/guide" className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100">
          <ArrowLeft className="w-3.5 h-3.5" />
          가이드
        </Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <Link to={category.path} className="hover:text-slate-900 dark:hover:text-slate-100">
          {category.name}
        </Link>
      </nav>

      <header className="border-b border-slate-200 pb-7 mt-4 dark:border-slate-800">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700">
          <BookOpen className="w-3.5 h-3.5" />
          {category.name} 가이드
        </span>
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-4 dark:text-slate-100">
          {article.title}
        </h1>
        <p className="text-sm md:text-base text-slate-600 mt-4 leading-7 max-w-3xl dark:text-slate-400">
          {article.lead}
        </p>
        <div className="mt-4 flex items-center gap-3 text-[11px] font-semibold text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />약 {article.readingMinutes}분
          </span>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <time dateTime={article.updatedAt}>{article.updatedAt} 업데이트</time>
        </div>
      </header>

      <div className="mt-8 space-y-9">
        {article.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight dark:text-slate-100">
              {section.heading}
            </h2>
            <div className="mt-3 space-y-3 text-sm md:text-base text-slate-600 leading-7 dark:text-slate-400">
              {section.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {section.bullets ? (
              <ul className="mt-4 space-y-2">
                {section.bullets.map((b, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-600 leading-6 dark:text-slate-400"
                  >
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6 dark:bg-slate-800/40 dark:border-slate-700">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
          핵심 요약
        </h2>
        <ul className="mt-4 space-y-2">
          {article.takeaways.map((t, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-slate-700 leading-6 dark:text-slate-300"
            >
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
          자주 묻는 질문
        </h2>
        <div className="mt-4 space-y-4">
          {article.faq.map((item) => (
            <div
              key={item.q}
              className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
            >
              <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Q. {item.q}
              </p>
              <p className="mt-2 text-sm text-slate-600 leading-6 dark:text-slate-400">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {relatedTools.length > 0 ? (
        <section className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-extrabold text-slate-500 dark:text-slate-400">
            이 글과 함께 쓰면 좋은 도구
          </h2>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedTools.map((tool) => (
              <Link
                key={tool.id}
                to={tool.path}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={category.accent}>{tool.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-slate-900 truncate dark:text-slate-100">
                      {tool.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate dark:text-slate-400">
                      {tool.desc}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 shrink-0 text-slate-400" />
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <p className="mt-8 text-[11px] text-slate-400 leading-5">
        본 글은 일반적인 이해를 돕기 위한 참고 자료이며, 세무·법률·회계상의
        최종 판단은 홈택스 자료와 자격 있는 전문가의 확인을 거치시기 바랍니다.
      </p>
    </article>
  );
};

export default ArticlePage;
