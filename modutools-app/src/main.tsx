import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * 프리렌더된 정적 SEO 태그 정리.
 *
 * 정적 HTML(prerender-static.mjs)에는 크롤러/소셜 봇용 SEO 메타가 들어 있다.
 * 그런데 React 19는 컴포넌트가 렌더한 <title>/<meta>/<link>를 <head>로 자동
 * hoisting 하면서 기존 정적 태그를 제거하지 않는다. 그대로 두면 런타임에
 * "정적 태그 + React가 추가한 태그"가 겹쳐 title·description·og·twitter가
 * 두 벌씩 생긴다.
 *
 * JS가 실행되는 환경에서는 어차피 SeoHead(모든 라우트에서 렌더)가 동일한
 * 메타를 다시 주입하므로, 마운트 직전에 정적 baseline 태그를 한 번 제거한다.
 * JS가 없는 크롤러에서는 이 코드가 실행되지 않아 정적 메타가 그대로 남는다.
 */
function removePrerenderedSeoTags() {
  const head = document.head;
  if (!head) return;
  const selectors = [
    'title',
    'meta[name="description"]',
    'link[rel="canonical"]',
    'meta[property^="og:"]',
    'meta[name^="twitter:"]',
  ];
  for (const selector of selectors) {
    head.querySelectorAll(selector).forEach((el) => el.remove());
  }
}

removePrerenderedSeoTags();

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
