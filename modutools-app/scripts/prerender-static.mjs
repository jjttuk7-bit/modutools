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

// 심화 가이드 아티클. 본문 원본은 src/data/articles.ts 이며,
// 여기에는 JS 미실행 크롤러용 정적 폴백(요약 본문)을 함께 둔다.
const articlePages = [
  {
    path: '/guide/vat-filing-checklist',
    title: '부가세 신고 전 자영업자 점검 체크리스트',
    description:
      '부가세 신고 시기, 일반과세자와 간이과세자의 차이, 신고 전에 미리 맞춰 둬야 할 금액과 증빙을 자영업자 눈높이에서 정리했습니다.',
    sections: [
      ['부가세는 누가, 언제 신고하나요?', '부가가치세는 사업자가 매출 시 받은 세금에서 매입 시 낸 세금을 빼고 차액을 납부하는 구조입니다. 개인 일반과세자는 1월과 7월에 확정신고하고, 간이과세자는 이듬해 1월에 한 번 신고합니다.'],
      ['일반과세자와 간이과세자', '일반과세자는 공급가액의 10%를 부가세로 구분해 받고 매입세액을 전액 공제받습니다. 간이과세자는 업종별 부가가치율을 적용해 부담이 낮은 대신 세금계산서 발행과 매입세액 공제에 제약이 있습니다.'],
      ['신고 전에 미리 맞춰 둘 숫자', '매출(세금계산서·현금영수증·카드매출)과 매입 증빙이 실제 입금·지출과 맞는지, 공급가액과 부가세가 분리돼 있는지 미리 확인하면 신고가 수월합니다.'],
    ],
  },
  {
    path: '/guide/freelancer-33-refund',
    title: '프리랜서 3.3% 원천징수와 환급 완전 정리',
    description:
      '프리랜서 사업소득에서 떼는 3.3%의 정체, 실수령액 계산, 5월 종합소득세 신고로 환급받는 흐름을 처음 정산하는 사람도 이해할 수 있게 풀었습니다.',
    sections: [
      ['3.3%는 무슨 세금인가', '소득세 3%와 지방소득세 0.3%를 합한 비율로, 대금을 지급하는 쪽이 미리 떼고 나머지를 입금합니다. 최종 세금이 아니라 미리 떼어 둔 금액입니다.'],
      ['실수령액 계산', '계약 금액에서 3.3%를 빼면 실제 입금액입니다. 100만 원이면 33,000원을 떼고 967,000원이 입금됩니다.'],
      ['환급은 언제, 어떻게', '매년 5월 종합소득세 신고에서 1년치 소득과 경비를 합산해 정산합니다. 경비가 많으면 미리 떼인 세금이 실제 세금보다 많아 환급이 발생합니다.'],
    ],
  },
  {
    path: '/guide/supply-price-vs-vat',
    title: '공급가액·부가세·합계, 헷갈리는 금액 구조 완전 정리',
    description:
      '공급가액과 부가세, 합계금액이 어떻게 연결되는지, 총액에서 공급가액을 역산하는 방법과 반올림 처리까지 예시로 정리했습니다.',
    sections: [
      ['세 가지 금액의 관계', '합계 = 공급가액 × 1.1, 부가세 = 공급가액 × 0.1 입니다. 공급가액 100,000원이면 부가세 10,000원, 합계 110,000원입니다.'],
      ['총액만 알 때 역산', '합계를 1.1로 나누면 공급가액이 됩니다. 330,000원이면 공급가액 300,000원, 부가세 30,000원입니다.'],
      ['반올림에서 1원이 어긋나는 이유', '역산 시 나눗셈이 떨어지지 않으면 원 단위 반올림이 생깁니다. 회사의 회계 기준을 정해 일관되게 적용해야 장부가 어긋나지 않습니다.'],
    ],
  },
  {
    path: '/guide/margin-basics',
    title: '마진율·마진액·ROI, 장사 숫자 기초 잡기',
    description:
      '마진율과 마크업의 차이, 마진액 계산, 부대비용을 반영한 실제 이익과 ROI 개념까지 소상공인이 꼭 알아야 할 숫자를 정리했습니다.',
    sections: [
      ['마진율과 마크업은 다르다', '마진율은 판매가 대비 이익 비율, 마크업은 원가 대비 이익 비율입니다. 원가 7,000원을 10,000원에 팔면 마진율 30%, 마크업 약 42.9%입니다.'],
      ['마진액부터 정확히', '판매가에서 매입가를 뺀 값에서 포장·배송·수수료·광고비 같은 부대비용을 빼야 진짜 남는 돈입니다.'],
      ['ROI로 투자 대비를 본다', '마진율이 높아도 재고가 묶이면 ROI는 낮아집니다. 마진율과 회전율을 함께 봐야 합니다.'],
    ],
  },
  {
    path: '/guide/quote-writing-guide',
    title: '견적서 금액 나누기와 작성 실무 가이드',
    description:
      '총 예산을 항목별로 나누는 방법, 공급가액과 부가세를 함께 표기하는 견적서 작성 요령, 흔한 실수와 점검 포인트를 정리했습니다.',
    sections: [
      ['견적서에 꼭 들어갈 항목', '항목명, 수량·단가, 항목별 공급가액, 부가세, 합계, 유효기간과 결제 조건이 명확해야 합니다.'],
      ['총 예산을 항목별로 나누기', '총액을 먼저 1.1로 나눠 공급가액을 구하고, 그 공급가액을 항목별 비중으로 나눈 뒤 각 항목 부가세를 함께 표기합니다.'],
      ['흔한 실수', '항목 합과 총액의 1원 차이는 한 항목에서 끝자리를 조정해 맞추고, "부가세 별도/포함"을 반드시 표기해 분쟁을 막습니다.'],
    ],
  },
  {
    path: '/guide/qr-code-basics',
    title: 'QR코드 원리와 안전하게 스캔하는 법',
    description:
      'QR코드가 어떻게 정보를 담는지, 모르는 QR을 스캔하기 전에 확인할 점, 받은 QR의 내용을 미리 열어 보는 방법을 정리했습니다.',
    sections: [
      ['QR코드는 어떻게 정보를 담나', 'QR은 흑백 점 격자로 텍스트·링크·연락처를 담는 2차원 코드입니다. 오류 복원 기능이 있어 일부가 가려져도(로고 등) 읽힙니다.'],
      ['모르는 QR을 함부로 찍지 않기', '겉모습만으로 목적지를 알 수 없어 큐싱(QR 피싱)에 악용됩니다. 안내문 위에 덧붙은 스티커형 QR은 특히 의심하세요.'],
      ['받은 QR 내용 미리 확인하기', '이미지로 받은 QR은 판독 도구로 내용을 먼저 확인하고, 링크면 도메인이 정상인지 봅니다.'],
    ],
  },
  {
    path: '/guide/wifi-qr-guide',
    title: '매장 와이파이 QR로 손님 접속 돕기',
    description:
      '와이파이 비밀번호를 매번 불러 주지 않아도 되는 WiFi QR 만드는 법과, 게스트 네트워크로 매장 보안을 지키는 팁을 정리했습니다.',
    sections: [
      ['왜 와이파이 QR인가', '손님이 SSID·비밀번호를 입력하지 않고 스캔 한 번으로 접속합니다. 카페·식당·미용실에서 유용합니다.'],
      ['만들 때 필요한 정보', '네트워크 이름(SSID), 비밀번호, 보안 방식(WPA/WPA2)이 필요하며 대소문자까지 정확히 입력합니다.'],
      ['손님용과 내부용 분리', '게스트 네트워크를 따로 만들고 그 비밀번호로만 QR을 만들면 내부망이 안전합니다.'],
    ],
  },
  {
    path: '/guide/business-card-qr',
    title: '명함에 QR 넣기: vCard로 연락처 한 번에 저장',
    description:
      '명함 QR(vCard)로 이름·전화·이메일을 스캔 한 번에 주소록에 저장하게 만드는 법과, 스캔률을 높이는 정보 선택 요령을 정리했습니다.',
    sections: [
      ['vCard QR이란', '연락처 정보를 표준 형식으로 담아, 스캔하면 이름·전화·이메일이 자동으로 주소록에 추가됩니다.'],
      ['담을 정보 고르기', '이름·회사·전화·이메일·웹사이트 정도가 적당합니다. 정보가 너무 많으면 패턴이 복잡해져 스캔이 어렵습니다.'],
      ['스캔 잘 되게 만들기', '인쇄 크기 2cm 이상에 여백을 확보하고, 작은 지면이면 정보량을 줄여 패턴을 단순하게 둡니다.'],
    ],
  },
  {
    path: '/guide/qr-design-tips',
    title: '스캔 잘 되는 디자인 QR 만드는 법',
    description:
      '색상과 로고를 넣은 디자인 QR이 스캔되는 원리와, 실패하지 않는 색 대비·로고 크기·여백 규칙을 정리했습니다.',
    sections: [
      ['디자인 QR이 스캔되는 이유', 'QR의 오류 정정 기능 덕분에 가운데 로고를 얹거나 색을 입혀도 일정 범위 안이면 읽힙니다.'],
      ['색상 대비가 핵심', '어두운 패턴 + 밝은 배경이 가장 안정적입니다. 반전이나 비슷한 명도의 색 조합은 인식 실패를 부릅니다.'],
      ['로고와 여백', '로고는 가운데 작게 넣고, 코드 주변 여백(콰이어트 존)을 확보한 뒤 여러 기기로 테스트합니다.'],
    ],
  },
  {
    path: '/guide/photo-to-pdf-guide',
    title: '서류 사진을 깔끔한 PDF로 제출하기',
    description:
      '여러 장의 서류 사진을 순서대로 묶어 하나의 PDF 제출 파일로 만드는 요령과, 반려를 부르는 흔한 실수를 정리했습니다.',
    sections: [
      ['왜 사진보다 PDF인가', '사진 여러 장은 순서가 섞이고 누락되기 쉽습니다. 한 PDF로 묶으면 순서·방향이 고정돼 반려 가능성이 줄어듭니다.'],
      ['잘 찍는 법', '밝은 곳에서 그림자 없이 정면으로, 네 모서리가 모두 들어오게 찍습니다.'],
      ['제출 전 확인', '글자가 읽히는지, 잘린 부분은 없는지, 용량이 한도 안인지 점검하고 크면 이미지 압축으로 줄입니다.'],
    ],
  },
  {
    path: '/guide/pdf-merge-split',
    title: 'PDF 합치고 필요한 페이지만 추출하기',
    description:
      '여러 PDF를 하나로 합치거나 긴 PDF에서 필요한 페이지만 골라 저장하는 실무 상황과, 순서·페이지 범위를 틀리지 않는 법을 정리했습니다.',
    sections: [
      ['합치기가 필요한 순간', '사업자등록증·견적서·안내문을 한 번에 제출할 때, 여러 PDF를 한 파일로 묶으면 누락이 없습니다.'],
      ['추출이 필요한 순간', '긴 계약서·매뉴얼에서 특정 페이지만 공유할 때 추출을 쓰면 불필요한 정보 노출도 막습니다.'],
      ['순서와 범위 확인', '합칠 때는 더한 순서가 페이지 순서가 되고, 추출은 페이지 범위를 정확히 지정한 뒤 결과를 확인합니다.'],
    ],
  },
  {
    path: '/guide/personal-info-masking',
    title: '제출 서류 개인정보 마스킹, 왜 꼭 해야 하나',
    description:
      '주민등록번호·계좌·주소 같은 민감정보를 가리고 제출해야 하는 이유와, 원본이 남지 않게 안전하게 마스킹하는 법을 정리했습니다.',
    sections: [
      ['마스킹이 필요한 이유', '제출 목적에 불필요한 정보까지 노출하면 도용 위험이 커집니다. 본인 확인에 필요한 부분만 남기세요.'],
      ['무엇을 가려야 하나', '주민번호 뒷자리, 계좌번호, 상세 주소, 서명 등 제출 목적에 불필요한 항목을 가립니다.'],
      ['진짜로 가려지는 방식', '위에 색칠만 하면 원본이 남을 수 있습니다. 가린 뒤 이미지로 평탄화하거나 새 PDF로 저장해야 안전합니다.'],
    ],
  },
  {
    path: '/guide/image-compress-guide',
    title: '업로드 용량 제한에 맞추는 이미지 압축',
    description:
      '"파일이 너무 큽니다" 오류를 피하는 이미지 압축의 원리와, 화질을 덜 해치면서 용량을 줄이는 실전 요령을 정리했습니다.',
    sections: [
      ['왜 용량 제한에 걸리나', '스마트폰 사진은 수 MB라 1~2MB 업로드 한도를 자주 넘깁니다. 제출 전 압축이 필요합니다.'],
      ['용량을 줄이는 두 축', '해상도(크기)를 줄이는 것과 품질(압축률)을 낮추는 것을 함께 조절합니다.'],
      ['화질을 덜 해치는 법', '큰 해상도부터 줄이고 품질은 단계적으로 낮춰, 글자가 읽히는 선까지만 압축합니다.'],
    ],
  },
  {
    path: '/guide/youtube-thumbnail-tips',
    title: '클릭을 부르는 유튜브 썸네일 7가지 원칙',
    description:
      '16:9 유튜브 썸네일에서 클릭률을 높이는 텍스트·색·구도 원칙과, 작은 화면에서 무너지지 않는 가독성 요령을 정리했습니다.',
    sections: [
      ['썸네일이 조회수를 가른다', '시청자는 제목보다 썸네일을 먼저 봅니다. 3초 안에 내용이 전달되지 않으면 지나칩니다.'],
      ['큰 글자, 짧은 카피', '모바일 작은 화면 기준으로 글자는 크고 굵게, 단어는 3~5개로 짧게 둡니다.'],
      ['대비와 시선 유도', '배경·글자 대비를 강하게, 얼굴·표정·화살표로 시선을 끌어 클릭을 유도합니다.'],
    ],
  },
  {
    path: '/guide/blog-cover-guide',
    title: '블로그 대표이미지 잘 만드는 법',
    description:
      '정보성 글과 공지에 어울리는 블로그 커버 이미지의 비율, 제목 텍스트 배치, 브랜드 톤을 통일하는 요령을 정리했습니다.',
    sections: [
      ['대표이미지의 역할', '글 목록과 SNS 공유에서 가장 먼저 보이는 요소로, 주제를 한눈에 전달하고 클릭을 부릅니다.'],
      ['비율과 안전 영역', '플랫폼마다 잘리는 비율이 달라, 중요한 제목 글자는 가운데에 배치합니다.'],
      ['톤 통일로 브랜드감', '색·폰트·레이아웃을 반복하면 블로그 전체가 정돈돼 보이고 작업도 빨라집니다.'],
    ],
  },
  {
    path: '/guide/store-main-image-guide',
    title: '스마트스토어 대표이미지 8가지 원칙',
    description:
      '쇼핑 검색 결과에서 눈에 띄고 클릭을 부르는 상품 대표이미지 구성 원칙과, 플랫폼 규정 안에서 텍스트를 쓰는 법을 정리했습니다.',
    sections: [
      ['대표이미지가 매출을 좌우', '검색 목록에서 경쟁 상품과 나란히 놓이며, 클릭률이 곧 노출과 매출로 이어집니다.'],
      ['상품이 주인공', '배경은 깔끔하게, 상품은 크고 또렷하게, 핵심 메시지는 하나만 강조합니다.'],
      ['규정과 모바일 가독성', '과장 표현은 제재 대상일 수 있으니 규정을 확인하고, 작은 썸네일로 줄여 가독성을 점검합니다.'],
    ],
  },
  {
    path: '/guide/instagram-image-guide',
    title: '인스타그램 피드 이미지, 사이즈와 구성 잡기',
    description:
      '1:1과 4:5 피드 이미지 사이즈, 잘림을 피하는 텍스트 배치, 시리즈 통일감을 만드는 법을 정리했습니다.',
    sections: [
      ['피드 비율 고르기', '1:1 정사각과 4:5 세로형이 기본이며, 세로형이 화면을 더 차지해 눈에 띕니다.'],
      ['안전 영역과 텍스트', '가장자리는 잘리거나 UI에 가려질 수 있어, 중요한 글자·로고는 중앙에 둡니다.'],
      ['시리즈 통일감', '색·폰트·레이아웃을 반복하면 프로필 전체가 정돈돼 보이고 브랜드처럼 인식됩니다.'],
    ],
  },
  {
    path: '/guide/remove-duplicates-guide',
    title: '엑셀 중복 데이터 깔끔하게 제거하기',
    description:
      '명단·주문·고객 목록의 중복 행을 기준 컬럼 또는 전체 일치로 제거하는 법과, 잘못 지우지 않기 위한 점검 포인트를 정리했습니다.',
    sections: [
      ['중복은 왜 생기나', '파일 합치기, 반복 입력, 시스템 내보내기에서 중복이 생겨 집계가 부풀고 중복 발송이 발생합니다.'],
      ['기준 컬럼 vs 전체 일치', '전화번호 같은 한 컬럼으로 볼지, 모든 칸이 같아야 중복으로 볼지 목적에 맞게 정합니다.'],
      ['백업과 검증', '행을 지우는 작업이라 원본을 백업하고, 작업 후 남은 건수와 동명이인 오삭제를 확인합니다.'],
    ],
  },
  {
    path: '/guide/phone-number-format',
    title: '뒤죽박죽 전화번호 표기 통일하기',
    description:
      '010-0000-0000 형식으로 섞여 있는 휴대폰 번호를 일괄 정리하는 법과, 해외·일반전화 같은 예외를 처리하는 요령을 정리했습니다.',
    sections: [
      ['왜 통일이 필요한가', '표기가 제각각이면 문자 발송·중복 제거·정렬에서 오류가 납니다.'],
      ['흔한 표기 차이', '하이픈·공백·국가번호(+82)·앞자리 0 누락이 대표적입니다.'],
      ['일괄 정리와 예외', '숫자만 추출해 표준 형식으로 묶고, 일반전화·해외번호 같은 예외는 변환 후 확인합니다.'],
    ],
  },
  {
    path: '/guide/csv-korean-broken',
    title: 'CSV 한글 깨짐(인코딩), 원인과 복구법',
    description:
      '엑셀에서 CSV를 열면 한글이 깨지는 이유(UTF-8과 EUC-KR의 차이)와, 깨진 글자를 되살리고 재발을 막는 방법을 정리했습니다.',
    sections: [
      ['왜 깨지나', '파일과 여는 프로그램의 인코딩 약속이 다르면 한글이 깨집니다. UTF-8과 EUC-KR 불일치가 대표적입니다.'],
      ['BOM과 엑셀', '엑셀은 BOM 없는 UTF-8 CSV를 EUC-KR로 오해해, 다른 곳에선 멀쩡한 파일이 엑셀에서만 깨집니다.'],
      ['복구와 재발 방지', '올바른 인코딩으로 다시 해석·저장하면 복구되며, 저장 시 인코딩을 명시하면 재발을 막습니다.'],
    ],
  },
  {
    path: '/guide/merge-split-excel',
    title: '여러 엑셀 합치고 기준별로 나누기',
    description:
      '흩어진 엑셀·CSV를 한 시트로 모으는 법과, 통합한 표를 지점·담당자 기준으로 다시 파일로 나누는 실무를 정리했습니다.',
    sections: [
      ['합치기가 필요한 순간', '월별·지점별로 나뉜 같은 형식의 파일을 한 표로 모으면 비교와 집계가 쉬워집니다.'],
      ['합칠 때 주의', '머리행(컬럼) 구조가 같은지 확인하고, 합친 뒤 중복·빈 행을 정리합니다.'],
      ['나누기와 관리', '기준 컬럼으로 담당자·지역별로 분할하고, 파일명 규칙을 통일해 ZIP으로 한 번에 받습니다.'],
    ],
  },
];

for (const article of articlePages) {
  addRoute(article.path, article.title, article.description, article.sections);
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
