#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const DIST_ROOT = resolve(PROJECT_ROOT, 'dist');
const SITE_URL = (process.env.SITE_URL || 'https://modutools.kr').replace(/\/$/, '');
const SITE_NAME = '모두의 도구';

const categories = [
  {
    id: 'business',
    path: '/business',
    name: '사장님 계산기',
    description: '부가세, 공급가액, 프리랜서 원천징수, 견적 분할, 마진율을 브라우저에서 계산하는 무료 도구 모음입니다.',
    tools: [
      ['vat-calculator', '부가세 계산기', '공급가액을 기준으로 부가세와 합계금액을 확인합니다. 세금계산서 작성 전 금액 검산에 유용합니다.'],
      ['supply-price', '공급가액 역산', '부가세 포함 총액에서 공급가액과 부가세를 분리합니다. 총액 기준 견적이나 결제 내역 정리에 적합합니다.'],
      ['freelancer-tax', '프리랜서 3.3%', '사업소득 원천징수 3.3% 공제액과 실수령액을 계산합니다. 외주 계약과 입금액 확인에 사용할 수 있습니다.'],
      ['quote-split', '견적서 금액 나누기', '총 예산을 공급가액과 부가세로 나누거나 항목별 견적 금액을 정리합니다.'],
      ['margin-calculator', '마진율 계산기', '매입가, 판매가, 부대비용을 기준으로 이익금과 마진율을 확인합니다.'],
    ],
  },
  {
    id: 'qr',
    path: '/qr',
    name: 'QR 도구함',
    description: 'URL, 와이파이, 명함 정보를 QR로 만들고 QR 이미지 내용을 확인하는 무료 브라우저 도구입니다.',
    tools: [
      ['url-qr', 'URL QR', '긴 웹 주소나 신청서 링크를 스캔하기 쉬운 QR 이미지로 변환합니다.'],
      ['wifi-qr', 'WiFi QR', '매장과 사무실의 와이파이 이름과 비밀번호를 QR로 만들어 방문자 접속을 돕습니다.'],
      ['vcard-qr', '명함 QR', '이름, 회사, 전화번호, 이메일을 vCard QR로 만들어 휴대폰 주소록 저장을 쉽게 합니다.'],
      ['qr-reader', 'QR 판독', '이미지 파일에 들어 있는 QR 내용을 열기 전에 먼저 확인합니다.'],
      ['qr-design', 'QR 디자인', '색상과 로고를 적용한 QR 이미지를 만들고 스캔 가능성을 확인합니다.'],
    ],
  },
  {
    id: 'submit',
    path: '/submit',
    name: 'PDF 정리 도구',
    description: '사진을 PDF로 묶고 PDF 합치기, 페이지 추출, 개인정보 마스킹, 이미지 압축을 처리하는 무료 도구입니다.',
    tools: [
      ['photo-to-pdf', '사진 PDF 변환', '여러 장의 서류 사진을 순서대로 묶어 하나의 PDF 제출 파일로 만듭니다.'],
      ['pdf-merge', 'PDF 합치기', '견적서, 사업자등록증, 안내문처럼 여러 PDF를 하나의 파일로 결합합니다.'],
      ['pdf-extract', 'PDF 페이지 추출', '긴 PDF에서 필요한 페이지만 골라 별도 파일로 저장합니다.'],
      ['pdf-mask', '안심 마스킹', 'PDF와 이미지의 주민등록번호, 주소, 계좌번호 같은 민감 정보를 검정 박스로 가립니다.'],
      ['image-compress', '이미지 압축', '업로드 용량 제한에 맞춰 이미지 크기와 품질을 조정합니다.'],
    ],
  },
  {
    id: 'thumbnail',
    path: '/thumbnail',
    name: '썸네일 도구함',
    description: '유튜브, 블로그, 인스타그램, 스마트스토어에 쓰는 대표 이미지를 브라우저에서 제작하는 무료 도구입니다.',
    tools: [
      ['youtube-thumbnail', '유튜브 썸네일', '영상 주제와 핵심 문구가 잘 보이는 16:9 썸네일 이미지를 만듭니다.'],
      ['blog-cover', '블로그 대표이미지', '정보성 글과 공지 글에 어울리는 블로그 커버 이미지를 제작합니다.'],
      ['instagram-image', '인스타그램 이미지', '정사각형과 세로형 피드 이미지에 문구와 디자인 요소를 배치합니다.'],
      ['store-main-image', '스토어 대표이미지', '상품 사진 위에 제품명과 핵심 정보를 정리한 쇼핑몰 대표 이미지를 만듭니다.'],
      ['text-on-image', '이미지 위 텍스트', '기존 사진 위에 제목, 가격, 안내 문구, 로고를 간단히 합성합니다.'],
    ],
  },
  {
    id: 'excel',
    path: '/excel',
    name: '엑셀 정리 도구',
    description: '엑셀과 CSV의 중복 행, 전화번호 형식, 한글 깨짐, 파일 합치기와 분할을 브라우저에서 처리합니다.',
    tools: [
      ['remove-duplicates', '중복 행 지우기', '기준 컬럼 또는 전체 행 일치를 기준으로 중복 데이터를 제거합니다.'],
      ['phone-cleaner', '전화번호 다듬기', '섞여 있는 휴대폰 번호 표기를 010-0000-0000 형식으로 정리합니다.'],
      ['csv-encoding-fix', 'CSV 한글 깨짐 복구', 'UTF-8과 EUC-KR 인코딩 차이로 깨진 CSV 한글을 읽기 쉽게 변환합니다.'],
      ['merge-excel', '엑셀 합치기', '여러 엑셀 또는 CSV 파일을 하나의 표로 모아 비교와 필터링을 쉽게 합니다.'],
      ['split-by-column', '컬럼별 나누기', '지점, 담당자, 지역 같은 기준 컬럼에 따라 파일을 나누어 ZIP으로 저장합니다.'],
    ],
  },
  {
    id: 'image',
    path: '/image',
    name: '이미지 정리 도구',
    description: '사진 용량, 픽셀 크기, 증명사진 규격, JPG 변환, 자르기와 여백을 브라우저에서 처리하는 무료 도구입니다.',
    tools: [
      ['compress', '이미지 압축', '업로드 용량 제한에 맞춰 사진 파일 크기를 줄입니다.'],
      ['resize', '이미지 크기 변경', '가로와 세로 픽셀 크기를 원하는 규격으로 조정합니다.'],
      ['id-photo', '증명사진 규격 맞추기', '이력서와 접수용 증명사진을 정해진 픽셀 규격으로 저장합니다.'],
      ['jpg-converter', 'JPG 변환', 'PNG와 WEBP 이미지를 호환성 높은 JPG 파일로 변환합니다.'],
      ['crop-padding', '자르기 / 여백 넣기', '정사각형과 지정 비율에 맞춰 이미지를 자르거나 여백을 넣습니다.'],
    ],
  },
];

const toolEntries = categories.flatMap((category) =>
  category.tools.map(([id, name, description]) => ({
    id,
    name,
    description,
    path: `${category.path}/${id}`,
    category,
  })),
);

const routeMap = new Map();

function addRoute(path, title, description, sections) {
  routeMap.set(path, { path, title, description, sections });
}

addRoute('/', '모두의 도구 · 가입 없이 바로 쓰는 무료 실무 도구', '사장님과 프리랜서를 위한 30가지 무료 실무 도구를 한 곳에서 제공합니다.', [
  ['무료 실무 도구함', '모두의 도구는 부가세 계산, QR 생성, PDF 정리, 썸네일 제작, 엑셀 정리처럼 반복되는 업무를 회원가입 없이 처리하도록 만든 브라우저 기반 서비스입니다. 입력값과 파일은 사용자의 기기 안에서 처리되며, 별도 서버 업로드 없이 결과를 확인할 수 있습니다.'],
  ['제공 도구', categories.map((category) => `${category.name}: ${category.description}`).join(' ')],
]);

addRoute('/guide', '30가지 무료 업무 도구 사용 가이드', '모두의 도구에 포함된 30가지 무료 도구의 사용 상황, 예시, 주의사항을 정리했습니다.', [
  ['도구 선택 가이드', '금액 검산은 사장님 계산기, 오프라인 안내는 QR 도구함, 제출 파일 정리는 PDF 정리 도구, 이미지 제작은 썸네일 도구함, 명단 정리는 엑셀 정리 도구를 먼저 확인하면 좋습니다. 각 도구는 한 가지 업무를 빠르게 끝내도록 설계되어 있습니다.'],
  ['사용 전 확인할 점', '세무 계산 결과는 참고용이며 실제 신고나 계약에는 전문가 확인이 필요할 수 있습니다. PDF, 이미지, 엑셀 파일은 처리 후 결과물을 다시 열어 순서와 내용, 개인정보 포함 여부를 확인하는 것이 안전합니다.'],
]);

addRoute('/about', '소개 — 모두의 도구를 만든 이유', '대한민국 사장님과 프리랜서를 위한 무료 실무 도구함의 운영 원칙을 소개합니다.', [
  ['운영 목적', '모두의 도구는 작은 업무 하나를 처리하기 위해 가입, 설치, 결제를 반복해야 하는 불편을 줄이기 위해 만들었습니다. 자영업자, 1인 사업자, 프리랜서, 실무자가 매일 마주치는 계산, 파일 정리, 이미지 작업을 브라우저에서 바로 처리합니다.'],
  ['운영 원칙', '회원가입 없이 무료로 사용할 수 있고, 입력값과 업로드 파일을 서버로 전송하지 않으며, 광고가 도구 입력과 결과 영역을 방해하지 않도록 운영합니다.'],
]);

addRoute('/terms', '이용약관 — 모두의 도구', '모두의 도구 서비스 이용 조건과 책임 한계, 광고 게재 방침을 안내합니다.', [
  ['서비스 이용', '모두의 도구는 무료 웹 기반 도구 서비스입니다. 사용자는 합법적이고 정당한 목적으로 서비스를 이용해야 하며, 자동화된 과도한 접근이나 타인의 권리를 침해하는 결과물 생성을 해서는 안 됩니다.'],
  ['책임의 한계', '계산 결과와 파일 처리 결과는 참고용으로 제공됩니다. 중요한 세무, 계약, 법률 판단에는 자격 있는 전문가의 검토를 권장합니다.'],
]);

addRoute('/privacy', '개인정보 처리방침 — 모두의 도구', '회원가입 없이 사용하며 입력값과 업로드 파일을 서버로 전송하지 않는 처리 방식을 설명합니다.', [
  ['수집하는 정보', '모두의 도구는 회원가입을 받지 않고 사용자가 입력한 텍스트, 금액, 파일을 서버로 전송하지 않습니다. 도구 처리는 브라우저 메모리에서 이루어지며 탭을 닫으면 사라집니다.'],
  ['광고와 쿠키', '일부 페이지에서는 Google AdSense 같은 광고 네트워크가 광고 게재, 성과 측정, 부정 이용 방지를 위해 쿠키와 브라우저 정보를 사용할 수 있습니다.'],
]);

for (const category of categories) {
  addRoute(category.path, `${category.name} — 모두의 도구`, category.description, [
    [category.name, category.description],
    ['포함된 도구', category.tools.map(([, name, description]) => `${name}: ${description}`).join(' ')],
  ]);

  for (const [id, name, description] of category.tools) {
    addRoute(`${category.path}/${id}`, `${name} — ${category.name}`, `${description} 회원가입 없이 브라우저에서 바로 사용할 수 있습니다.`, [
      [name, description],
      ['언제 사용하나요?', `${name}는 ${category.description} ${description} 입력값과 파일은 가능한 브라우저 안에서 처리되며, 결과 확인 후 직접 다운로드하거나 복사할 수 있습니다.`],
      ['관련 도구', category.tools.filter(([toolId]) => toolId !== id).map(([, toolName]) => toolName).join(', ')],
    ]);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderFallback(route) {
  const navLinks = categories
    .map((category) => `<li><a href="${category.path}">${escapeHtml(category.name)}</a></li>`)
    .join('');
  const sections = route.sections
    .map(([heading, body]) => `<section><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(body)}</p></section>`)
    .join('');
  const toolLinks = toolEntries
    .map((tool) => `<li><a href="${tool.path}">${escapeHtml(tool.name)}</a> - ${escapeHtml(tool.description)}</li>`)
    .join('');

  return `<main id="static-content" lang="ko">
  <h1>${escapeHtml(route.title)}</h1>
  <p>${escapeHtml(route.description)}</p>
  ${sections}
  <nav aria-label="주요 카테고리"><h2>카테고리</h2><ul>${navLinks}</ul></nav>
  <section><h2>전체 무료 도구</h2><ul>${toolLinks}</ul></section>
  <p><a href="/about">서비스 소개</a> · <a href="/privacy">개인정보 처리방침</a> · <a href="/terms">이용약관</a> · <a href="/guide">사용 가이드</a></p>
</main>`;
}

function replaceHead(html, route) {
  const canonical = `${SITE_URL}${route.path === '/' ? '' : route.path}`;
  const title = route.title.includes(SITE_NAME) ? route.title : `${route.title} · ${SITE_NAME}`;
  const description = route.description;

  return html
    .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta\s+name="description"\s+content=".*?"\s*\/>/s, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/>/s, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/>/s, `<meta property="og:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/>/s, `<meta property="og:description" content="${escapeHtml(description)}" />`)
    .replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/>/s, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/>/s, `<meta property="og:image" content="${SITE_URL}/og-image.png" />`)
    .replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/>/s, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/>/s, `<meta name="twitter:description" content="${escapeHtml(description)}" />`)
    .replace(/<meta\s+name="twitter:image"\s+content=".*?"\s*\/>/s, `<meta name="twitter:image" content="${SITE_URL}/og-image.png" />`);
}

const templatePath = resolve(DIST_ROOT, 'index.html');
const template = readFileSync(templatePath, 'utf8');

for (const route of routeMap.values()) {
  const html = replaceHead(template, route).replace('<div id="root"></div>', `<div id="root">${renderFallback(route)}</div>`);
  const outputPath =
    route.path === '/'
      ? resolve(DIST_ROOT, 'index.html')
      : resolve(DIST_ROOT, route.path.slice(1), 'index.html');
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, html, 'utf8');
}

console.log(`✓ prerendered static HTML (${routeMap.size} routes, base: ${SITE_URL})`);
