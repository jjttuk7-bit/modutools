import React, { Suspense } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Heart, Loader2, Mail, X } from 'lucide-react';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileToolTabs from './MobileToolTabs';
import { categories } from '../data/categories';

const CONTACT_EMAIL = 'monglesb@gmail.com';
const feedbackMailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  '[모두의 도구] 피드백·도구 제안',
)}&body=${encodeURIComponent(
  '모두의 도구를 사용해주셔서 감사합니다.\n\n사용 중 문제가 있었거나 새로 필요하신 도구가 있다면 아래에 자유롭게 적어주세요.\n\n1. 사용하신 도구:\n2. 문제 또는 제안 내용:\n3. 참고할 파일 형식/상황:\n',
)}`;

const RouteFallback: React.FC = () => (
  <div className="flex items-center justify-center gap-2 text-slate-400 py-24">
    <Loader2 className="w-5 h-5 animate-spin" />
    <span className="text-xs font-bold">도구를 불러오는 중...</span>
  </div>
);

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const [feedbackOpen, setFeedbackOpen] = React.useState(false);
  const activeCategory = categories.find((c) =>
    location.pathname === c.path || location.pathname.startsWith(c.path + '/'),
  );

  const categoryList = categories.map((c) => c.shortName).join(' · ');

  return (
    <div
      id="main-layout-root"
      className="min-h-screen bg-[#F1F5F9] flex flex-col selection:bg-[#0F172A] selection:text-white dark:bg-slate-950 dark:text-slate-100"
    >
      <Header />
      <MobileToolTabs />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row gap-6 items-start flex-1">
          <div className="hidden md:block sticky top-24 self-start">
            <Sidebar activeCategory={activeCategory} />
          </div>

          <div className="flex-1 w-full min-w-0" id="main-content-area">
            <Suspense fallback={<RouteFallback />}>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </main>

      <footer
        id="app-footer"
        className="bg-[#0F172A] text-slate-300 py-8 px-6 mt-6 dark:bg-slate-950 dark:border-t dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white tracking-wide">
              모두의 도구 · modutools
            </h4>
            <p className="text-xs text-slate-400 font-medium">
              {categoryList}까지 한 곳에서. 서버 전송 없이 브라우저에서 모든
              처리를 마칩니다.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-slate-300">
            <Link to="/" className="hover:text-white transition-colors">
              홈
            </Link>
            <button
              type="button"
              onClick={() => setFeedbackOpen(true)}
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              피드백·도구 제안
            </button>
            <Link to="/about" className="hover:text-white transition-colors">
              소개
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              이용약관
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              개인정보 보호
            </Link>
            <span className="text-slate-700">|</span>
            <span className="text-slate-500 font-normal">v0.1.0</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-center md:text-left">
          <p className="text-xs leading-relaxed text-slate-400">
            모두의 도구를 사용해주셔서 감사합니다. 사용하면서 문제가 있거나
            새로 필요하신 도구가 있다면{' '}
            <a
              href={feedbackMailto}
              className="font-bold text-slate-200 underline-offset-4 hover:text-white hover:underline"
            >
              이메일로 피드백을 보내주세요
            </a>
            . 보내주신 의견은 다음 도구와 개선 작업에 참고하겠습니다.
          </p>
        </div>

        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-slate-500">
          <span>© 2026 modutools. All rights reserved.</span>
          <span className="flex items-center gap-1">
            대한민국 사장님·프리랜서를 위해 만들었습니다
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          </span>
        </div>

        {feedbackOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-dialog-title"
          >
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="feedback-dialog-title"
                    className="text-base font-extrabold text-slate-900 dark:text-slate-100"
                  >
                    피드백·도구 제안
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    모두의 도구를 사용해주셔서 감사합니다. 사용하면서 문제가 있거나
                    새로 필요하신 도구가 있다면 이메일로 피드백을 보내주세요.
                    보내주신 의견은 다음 도구와 개선 작업에 참고하겠습니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFeedbackOpen(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  aria-label="피드백 팝업 닫기"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <a
                href={feedbackMailto}
                className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
              >
                <Mail className="h-4 w-4" />
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
};

export default MainLayout;
