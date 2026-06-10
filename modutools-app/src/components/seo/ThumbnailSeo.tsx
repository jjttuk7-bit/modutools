import React from 'react';
import { BookOpen, Sparkles, AlertCircle } from 'lucide-react';

export type ThumbnailSeoToolId =
  | 'youtube'
  | 'blog'
  | 'instagram'
  | 'store'
  | 'text'
  | 'home';

interface ThumbnailSeoProps {
  toolId: ThumbnailSeoToolId;
}

interface ContentStructure {
  title: string;
  subtitle: string;
  points: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

const contentData: Record<ThumbnailSeoToolId, ContentStructure> = {
  home: {
    title: '쉽고 빠른 웹 이미지 제작의 시작, 썸네일도구함',
    subtitle:
      '블로그, 유튜브, 인스타그램, 페이스북의 성공적인 시작은 클릭하고 싶은 대표이미지에서 시작됩니다.',
    points: [
      {
        title: '로그인도 회원가입도 전혀 필요 없습니다',
        desc:
          '도구함에 접속하자마자 단 3초 만에 나만의 맞춤형 썸네일을 제작하고 다운로드할 수 있는 완전 무료 플랫폼입니다.',
      },
      {
        title: '철저한 프라이버시 보호 — 로컬 편집 기술',
        desc:
          '로드되는 이미지나 작성하는 문구는 단 1바이트도 서버로 전송되거나 기록되지 않으며 오직 사용자의 브라우저 내에서만 완벽하게 처리됩니다.',
      },
      {
        title: '다양한 크기 규격 및 맞춤 가이드 서비스',
        desc:
          '유튜브 가로 세로 16:9 비율부터 블로그용 1:1 정방형 비율, 인스타그램 스토리 세로형 비율까지 가이드라인에 맞춰 자동으로 최적화해줍니다.',
      },
    ],
    faqs: [
      {
        q: '정말 무료로 워터마크 없이 쓸 수 있나요?',
        a: '네! 모든 썸네일과 대표이미지는 고화질 PNG 또는 JPEG 등 원하는 확장자로 무료로 제약 없이 다운로드할 수 있으며 어떠한 워터마크도 추가되지 않습니다.',
      },
      {
        q: '스마트폰이나 태블릿에서도 사용하기 편리한가요?',
        a: '모바일에 최적화된 하단 탭 및 반응형 터치 인터페이스로 제작하여 모바일 및 태블릿 브라우저에서도 PC와 동일한 보정 및 텍스트 렌더링을 체험할 수 있습니다.',
      },
    ],
  },
  youtube: {
    title: '성공하는 유튜브를 위한 고화질 유튜브 썸네일 메이커',
    subtitle: '유튜브 SEO 및 클릭률(CTR)을 확실히 높여주는 1280x720 최적화 템플릿 제공',
    points: [
      {
        title: '유튜브 공식 지정 규격 1280x720 완벽 지원',
        desc:
          '유튜브 피드 내에서 가장 선명하게 보이는 공식 표준 권장 해상도로 오차 없는 완벽한 여백 렌더링을 제공합니다.',
      },
      {
        title: '강력한 가독성의 아웃라인 텍스트 및 대비 조절',
        desc:
          '어두운 화면 속에서도 한눈에 제목이 읽히도록 자막 그림자, 배경 그라데이션, 외곽선 투께 미세 조절 기능을 제공합니다.',
      },
      {
        title: '모바일 시청층을 위한 글자 배치 가이드',
        desc:
          '유튜브 우측 하단 시간 표시 레이블(Time badge)에 글자가 가리지 않도록 레이아웃 배치 구조를 세심하게 반영했습니다.',
      },
    ],
    faqs: [
      {
        q: '유튜브 썸네일 업로드 시 파일 크기가 제한되나요?',
        a: '네, 유튜브는 최대 2MB 크기의 파일만 썸네일로 지원합니다. 본 도구에서 압축률을 적절히 조정한 JPG나 PNG를 제작해 한 번에 규격에 맞게 통과시키세요.',
      },
      {
        q: '가독성이 뛰어난 폰트 선택이 왜 중요한가요?',
        a: '피드 스크롤 중 0.5초 이내에 시선을 사로잡아야 하므로, 얇은 서체보다는 두껍고 넓은 고딕 계열(예: 에스코어 드림, 프리텐다드, 지마켓 산스) 폰트를 권장합니다.',
      },
    ],
  },
  blog: {
    title: '검색 노출을 강화하는 블로그 포스팅 대표이미지(썸네일) 제작',
    subtitle:
      '네이버 블로그, 티스토리, 벨로그 등 모든 포털 및 SNS 검색 화면에서 이목을 끄는 1:1/16:9 완성본 제공',
    points: [
      {
        title: '네이버 모바일 뷰 1:1 스퀘어 맞춤형 레이아웃',
        desc:
          '모바일 검색 결과에서 제목 중심부가 가려지거나 늘어나지 않는 완전 정중앙 크롭 배치를 지원합니다.',
      },
      {
        title: '콘텐츠 브랜드 아이덴티티 확립',
        desc:
          '여러 글을 올릴 때 통일된 디자인 톤앤매너를 유지하도록 고정 색상, 공용 템플릿 프리셋, 고유한 엠블럼 삽입 기능을 활용할 수 있습니다.',
      },
      {
        title: '배경화면 오버레이 효과 및 눈부심 방지',
        desc:
          '지나치게 화려하거나 어두운 배경 사진에 투명 서브 필터를 덮어씌워 텍스트 메인 카피를 비약적으로 도드라지게 합니다.',
      },
    ],
    faqs: [
      {
        q: '네이버 블로그의 글 대표이미지는 어떤 비율이 제일 좋습니까?',
        a: '네이버 통합검색 및 블로그 영역 노출시 정방형(1:1) 비율로 크롭되어 보이는 경우가 많으므로 정방형 템플릿을 선택해 제작하는 것이 가장 안전합니다.',
      },
      {
        q: '텍스트에 글씨만 들어가는 것이 네이버 로봇 노출에 영향을 미치나요?',
        a: '아닙니다. 깔끔한 글자와 정보 중심의 설명 엠블럼이 있는 대표이미지는 독자의 이탈률을 막고 클릭 매력을 훨씬 높여줍니다.',
      },
    ],
  },
  instagram: {
    title: '인스타그램 피드를 지배하는 스퀘어 & 포트레이트 가로세로 규격기',
    subtitle: '1:1 정방형, 4:5 정적형 피드, 그리고 스토리/릴스 전용 9:16 맞춤 변환',
    points: [
      {
        title: '여백 및 컬러 배경 레이아웃 자동 확장',
        desc:
          '비율이 맞지 않아 잘라내야 했던 가로형 사진을 흰색이나 블러된 파스텔 배경 마진으로 포근하게 감싸서 피드 감성을 최대화해 드립니다.',
      },
      {
        title: '텍스트 레이아웃 배치 인스타그램 안성맞춤',
        desc:
          '사용자가 드롭다운 하나로 최적의 이미지 중심부에 깔끔한 텍스트 또는 엠블럼 배지를 올릴 수 있게 해 줍니다.',
      },
      {
        title: '고비율 스토리 저장',
        desc:
          '1080x1920 세로형 9:16 모드로 여유롭게 내보내 모바일에서 꽉 찬 고화질 화면을 공유할 수 있습니다.',
      },
    ],
    faqs: [
      {
        q: '인스타그램 피드에서 사진 잘림 현상을 예방하려면 어떻게 해야 하나요?',
        a: '인스타그램 기본 피드는 가로세로 대칭 비율(1:1)로 노출되기 때문에 1:1 템플릿을 선택하고 가장 핵심이 되는 피사체를 중심 원 영역 안에 머무르게 하세요.',
      },
      {
        q: '피드 이미지 감성을 높이기 위한 배경색은 어떻게 추천되나요?',
        a: '깔끔한 무채색 계열이나 원래 이미지의 평균 픽셀 색상값에서 추출된 부드러운 그라데이션 오버레이를 사용하면 한층 통일감 있는 무드를 연출할 수 있습니다.',
      },
    ],
  },
  store: {
    title: '클릭을 부르는 네이버 스마트스토어 & 오픈마켓 상품 대표이미지',
    subtitle: '1000x1000 정방형 고화질 및 카테고리별 테두리, 추가 안내 배너 완벽 제작',
    points: [
      {
        title: '스마트스토어 등록 규격 1000x1000픽셀 셋팅',
        desc:
          '품질 지수에 방해되지 않는 크리스탈 클리어 고화질 해상도를 초기 기본값으로 자동 셋업해 드립니다.',
      },
      {
        title: '핵심 정보 배치 레이어 지원',
        desc:
          '배송방법(무료배송, 당일발송), 할인율, 한정 기한, 원산지 등 핵심 가독 정보 배지를 시안 방해 없이 세련되게 삽입합니다.',
      },
      {
        title: '지저분한 외곽 누끼 없이 깔끔한 여백 처리',
        desc:
          '상품 이미지 테두리에 얇은 화이트 보더라인이나 미니 로고 라벨을 올려 신뢰도를 급격히 상승시킵니다.',
      },
    ],
    faqs: [
      {
        q: '스마트스토어 썸네일에 텍스트가 너무 많으면 제재를 받나요?',
        a: '네, 네이버 쇼핑 검색 가이드상 과다한 홍보 문구나 워터마크는 상품 노출에 불이익을 초래할 수 있으므로, 간결한 기능성 엠블럼 배지 1~2개 정도만 우측 상단이나 하단에 삽입하는 것을 권장합니다.',
      },
      {
        q: '배경이 어수선한 상품 사진은 어떻게 해결하는 것이 좋습니까?',
        a: '이미지 대비 조절이나 테두리를 활용해 상품을 강조하고, 여백 삽입 기능을 이용하여 여유 공간을 둠으로써 사진의 시선 집중도를 높일 수 있습니다.',
      },
    ],
  },
  text: {
    title: '텍스트 추가 도구 — 사진 위에 우아한 글꼴 및 타이포그래피 생성',
    subtitle:
      '포토샵을 몰라도 타이틀, 가독 서브타이틀, 반투명 박스를 브라우저 내에서 3초 만에 설계',
    points: [
      {
        title: '자막 및 레이블의 정밀 정렬 장치',
        desc:
          '수평 정렬(좌측, 중앙, 우측)은 물론이고 한 줄의 입력만으로 세련된 자막 위치를 원클릭에 완성합니다.',
      },
      {
        title: '글자 색상, 투명도, 반투명 텍스트 박스',
        desc:
          '어두운 사진과 밝은 사진 모든 조건에서 텍스트가 분리되어 보이도록 글씨 아래에 흐릿한 무채색 박스를 실시간 레이어링합니다.',
      },
      {
        title: '상업용 사용 가능한 프리미엄 한글 무료 폰트 적용',
        desc:
          '저작권 걱정 없이 안심하고 사용할 수 있는 검증된 상업용 무료 웹폰트 세트를 기본 연동하여 퀄리티를 유지해 드립니다.',
      },
    ],
    faqs: [
      {
        q: '글씨를 드래그해서 위치를 세밀하게 바꾸고 싶어요.',
        a: '각 옵션 패널 내부의 오프셋(X축, Y축) 조절 슬라이더나 상하좌우 버튼을 이용해 미세한 픽셀 단위 정리가 가능합니다.',
      },
      {
        q: '폰트 깨짐 현상이 혹시 발생하지는 않나요?',
        a: '모든 폰트는 구글 CDN을 통해 브라우저 시스템 메모리에 정밀하게 임시 캐싱되어 고해상도 캔버스 렌더링 시에도 깨짐 없이 벡터 아웃라인 품질을 자랑합니다.',
      },
    ],
  },
};

export const ThumbnailSeo: React.FC<ThumbnailSeoProps> = ({ toolId }) => {
  const content = contentData[toolId] || contentData.home;

  return (
    <div id={`seo-content-${toolId}`} className="mt-12 pt-10 border-t border-neutral-200">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="space-y-3 block">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-full text-xs font-semibold text-neutral-800">
            <BookOpen className="w-3.5 h-3.5 text-neutral-600" />
            <span>최적화 정보 &amp; 가이드</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">
            {content.title}
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">{content.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {content.points.map((pt, idx) => (
            <div
              key={idx}
              className="bg-neutral-50 rounded-xl p-5 border border-neutral-100 space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <h3 className="font-bold text-sm text-neutral-800 tracking-tight">{pt.title}</h3>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">{pt.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-amber-500/5 rounded-2xl p-5 border border-amber-500/10 flex items-start gap-4">
          <div className="bg-amber-500/10 p-2 rounded-lg text-amber-600 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-900">이미지 제작 및 노출 극대화 꿀팁!</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              성공적인 검색엔진 노출을 위해서는 적당량의 가독성 좋은 텍스트와 보색 그라데이션 필터가
              중요합니다. 배경이 불완전할 땐 단색 오버레이 레이어를 적극 가용하여 글자의 윤곽선을 살리면
              모바일 소형 화면 시청률(CTR)을 약 28% 상승시킬 수 있습니다.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>자주 묻는 질문 (FAQ)</span>
          </h3>
          <div className="divide-y divide-neutral-200">
            {content.faqs.map((faq, idx) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0 space-y-2">
                <h4 className="font-bold text-sm text-neutral-800 flex items-start gap-2">
                  <span className="text-emerald-600 font-semibold text-sm shrink-0">Q.</span>
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed pl-5">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailSeo;
