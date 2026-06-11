import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  Layers,
  FileImage,
  Minimize2,
  ShieldAlert,
  Scissors,
} from 'lucide-react';
import AdSlot from '../common/AdSlot';

export type SubmitSeoToolId =
  | 'pdf-mask'
  | 'photo-to-pdf'
  | 'image-compress'
  | 'pdf-merge'
  | 'pdf-extract';

interface SeoBlock {
  neededWhen: string[];
  howToUse: string[];
  howToVerify: string;
  caveats: string[];
  privacyDisclaimer: string;
  faqList: { q: string; a: string }[];
  relatedTools: { name: string; path: string; icon: string }[];
}

const seoData: Record<SubmitSeoToolId, SeoBlock> = {
  'pdf-mask': {
    neededWhen: [
      '관공서, 은행, 대기업 채용 사이트에 주민등록번호 뒷자리가 가려진 초본/등본을 내야 할 때',
      '장학금 수혜를 위해 성적증명서에서 본인의 특정 프라이빗 기록이나 교수명 등을 숨기고 싶을 때',
      '계약서 증빙 시 사업자등록번호 외 타인의 민감한 대표번호 및 예금주 계좌번호를 블랙박스 처리해야 할 때',
      '이력서에 필수 기재하지 않는 주소지, 생년월일, 키 등의 규정을 어겨 불합격될 요소를 자르고 싶을 때',
      '대외비 실적 PDF 보고서에서 핵심 기밀 단어나 부서 예산 수치만 신속하게 암막 가림할 때',
    ],
    howToUse: [
      '숨길 개인정보가 포함된 원본 PDF 서류 1장을 끌어다 놓거나 업로드 버튼을 클릭해 불러옵니다.',
      '마우스로 지우고자 하는 글자 영역이나 민감한 표 부분을 직사각형 드래그하여 블랙 마스크를 그립니다.',
      '실수로 그려진 하이라이트는 마스크 우측 상단의 지우기(X) 아이콘을 터치/클릭하여 완전 제거합니다.',
      "마스킹 범위 정리가 끝나면 하단의 '개인정보 숨긴 새 PDF 저장' 단추를 힘껏 클릭합니다.",
      '렌더링이 완료된 즉시 활성화된 다운로드 버튼을 눌러 결점이 숨겨진 완성본 저장을 마무리합니다.',
    ],
    howToVerify:
      "새로 저장된 'protected_document.pdf' 파일을 로컬 브라우저 크롬이나 아크로뱃 리더 프로그램으로 열면 드래그 및 복사를 시도해도 마스킹 처리된 영역 하부의 본래 텍스트 픽셀 정보까지 메타 데이터 상에서 깨끗하게 소거 및 파괴되어 절대 되살리거나 읽을 수 없음을 자가 검증할 수 있습니다.",
    caveats: [
      '완벽한 암막 데이터 파괴를 보증하기 위해 해당 문장은 영구 제거 가공되는 특성이 있습니다.',
      '웹 표준 사양 규격에 따라 DRM 암호 보안 잠금이 단단하게 잠겨 있는 PDF의 경우, 마스킹 편집 전 사전 암호 해제 조치가 꼭 뒷받침되어야 에러 없이 작동합니다.',
    ],
    privacyDisclaimer:
      '본 마스킹 서비스는 업로드 즉시 클라우드에 전송되어 수집되는 가공 방식과 달리, 100% 로컬 디바이스 웹 브라우저 안에서만 격리 실행됩니다. 주민번호가 담긴 원본 실체가 PDF 정리 도구의 외부에 결코 공개 유출되지 않습니다.',
    faqList: [
      {
        q: '가리고 난 뒤 드래그 복사하면 원본 텍스트가 복사되나요?',
        a: '아니요. 본 프로그램은 단순 겉포장용 이미지 박스를 덧씌우는 구동 방식을 배제하고 pdf-lib 물리 레벨에서 드래그 대상 글자 자체를 대체하여 원본 문자 메타를 파괴 소거하는 솔루션이 접목되었으므로 사후 텍스트 복제를 시도해도 아무것도 노출되지 않습니다.',
      },
      {
        q: '스캔해서 올린 사진 형태의 PDF에도 박스를 적용할 수 있나요?',
        a: '네. 픽셀 위에 수동으로 드래그하여 검정 칠박스를 영구 삽입하는 구조이기 때문에, 글자가 아닌 이미지 스캔 본으로 인쇄되어 글꼴 데이터 정보가 전혀 인식되지 않는 이미지형 PDF 파일 역시 동일하게 마스킹 보호 기능을 즐길 수 있습니다.',
      },
    ],
    relatedTools: [
      { name: '사진 PDF 변환', path: '/submit/photo-to-pdf', icon: 'FileImage' },
      { name: 'PDF 합치기', path: '/submit/pdf-merge', icon: 'Layers' },
      { name: 'PDF 페이지 뽑기', path: '/submit/pdf-extract', icon: 'Scissors' },
    ],
  },
  'photo-to-pdf': {
    neededWhen: [
      '휴대폰 카메라로 촬영한 실물 신분증 및 영수증 사진 여러 장을 하나의 깔끔한 공문서 양식 문서로 합쳐 내야 할 때',
      '자격증 스캔 사진 이미지 파일(JPG, PNG, WebP)들을 차례대로 이어 붙여 1부의 입증 파일로 증명하려 할 때',
      '학교 과제를 손글씨로 쓴 뒤 캡처한 이미지 장들을 하나의 PDF 보고서 과제 파일로 마감 기한 전 송출할 때',
      '공식 계약 협의 증거 이미지 묶음을 법적 규격에 합당한 정식 통합 도큐먼트로 일목요연하게 벼려낼 때',
    ],
    howToUse: [
      '묶을 이미지 파일들을 드래그 앤 드롭 하거나 파일 추가 버튼을 누르고 다중 대기열에 올립니다.',
      "목록에 등장한 각 아이템 하단의 순번 정렬 단추 및 불필요 파일 '삭제' 단추를 이용해 선후 관계를 바로잡습니다.",
      "출력될 영토 레이아웃을 'A4 가로', '비율 유지' 등으로 맞추고 용지 여백 크기나 방향을 목적에 최적화하여 설계합니다.",
      "지정 세팅이 완료되면 'PDF 문서 생성'을 실행하여 이미지 패싱 기법을 브라우저에 지시합니다.",
      "완성 메시지와 함께 다운로드 단추가 나오면, 'converted_images.pdf' 파일을 즉각 디렉토리에 안착시킵니다.",
    ],
    howToVerify:
      '생성된 PDF를 더블클릭하여 열었을 때, 본래 촬영된 제각각의 정방형 혹은 변형 이미지들이 일반 공문서 규격인 A4 규격 도화지 격자 안에 일그러짐 없이 차곡차곡 인쇄 배열되어 정돈되어 출현하는 것을 직감적으로 실측 완료하게 됩니다.',
    caveats: [
      '너무 한꺼번에 고해상도(예: 4K 해상도 이상 60장 이상) 사진을 한 호흡에 올릴 시 임베디드 웹 브라우저 RAM 메카니즘 과부하로 순간적인 리로드 현상이 올 수 있으니 일정 단위 조율 분할을 권고합니다.',
    ],
    privacyDisclaimer:
      '이메일이나 연락처 등 민감 정보가 찍힌 도화지 스크린샷 원본들은 외부 저장소 등 클라우드 API를 단 1Byte도 두르지 않고 메모리 RAM에서 다운로드 즉시 버퍼 휘발됩니다.',
    faqList: [
      {
        q: '스마트폰에서 찍은 HEIC나 WebP 이미지도 바로 올릴 수 있나요?',
        a: '기본적인 PNG, JPG 확장자뿐만 아니라 크롬/아일랜드 가상 뷰 호환이 입증된 범용 전용 규격에 맞춰 원활한 업로드 패싱이 전처리 지원됩니다.',
      },
      {
        q: 'A4 용지 한 면에 이미지 여러 장을 바둑판 배열로 구겨 넣는 게 가능한가요?',
        a: '사용성을 극대화하기 위해 업로드하신 1장의 사진을 PDF 1페이지의 고해상도 지면으로 매칭 정렬하여, 가독성 불량으로 탈락하는 불의의 사고를 방지하도록 설계되었습니다.',
      },
    ],
    relatedTools: [
      { name: 'PDF 개인정보 마스킹', path: '/submit/pdf-mask', icon: 'ShieldAlert' },
      { name: 'PDF 합치기', path: '/submit/pdf-merge', icon: 'Layers' },
      { name: '이미지 용량 줄이기', path: '/submit/image-compress', icon: 'Minimize2' },
    ],
  },
  'image-compress': {
    neededWhen: [
      '국가 지원 포털 제출 한계 규격이 500KB인데 촬영 증빙 원본 사진 파일이 8MB에 육박할 때',
      '웹사이트 프로필 업로드 및 신청 화면 등에 저용량 소스 이미지만 접수받아 빠른 제출 타임어택이 중요할 때',
      '고해상도 PDF 가공 전단계에서 삽입될 사진들의 부피와 오버로드를 한 발 앞서 사전 경량화 콤팩트 세팅할 때',
      '블로그 업로드용 혹은 기업 내부 ERP 업로드용 전송 트래픽을 아끼고자 적당히 화질과 압축률 타협을 요망할 때',
    ],
    howToUse: [
      '용량을 축소할 스마트폰용 이미지 원본(JPG, JPEG, PNG 등) 단종 또는 묶음을 등록합니다.',
      '원하는 압축 세기(퀄리티 백분율 20% ~ 90%)를 슬라이더 바 컨트롤러를 통해 직관적으로 조율 지정합니다.',
      "압축 후 예상 파일 예측 지표를 보며 '이미지 압축 수행' 버튼을 원터치 단행합니다.",
      '가상의 최적 스펙 압축이 마쳐지면, 다운로드 링크를 열어 초경량 이미지로 소장합니다.',
    ],
    howToVerify:
      '내 컴퓨터 탐색기나 스마트폰 앨범 상세정보 메뉴를 조회하여, 기존에는 메가 바이트 단위였던 사진 파일 스펙이 퀄리티 왜곡이나 깨짐 없이 알차게 줄어든 실 수치를 육안상 증명해 낼수 있습니다.',
    caveats: [
      '과도하게 압축 세기를 올리면(퀄리티 30% 미만 극단적 제한 시) 원본 속 세부 글자가 블러 처리된 것처럼 뭉개져 식별 불량이 될 수 있으니 주의를 보탭니다.',
    ],
    privacyDisclaimer:
      '사진 내부의 GPS 위치 메타데이터나 엑시프 파일 규격 역시 외부 외부망으로 반출되어 가림막 백업을 쌓지 않고 독립적 브라우저 루틴 내에서 단번에 압착 세트 전환됩니다.',
    faqList: [
      {
        q: 'PNG 이미지 투명 배경 채널이 압축 시 깨지지 않나요?',
        a: '투명 특수 레이어 채널을 다 무질서하게 흩뜨려 검게 태우지 않고 고안된 픽셀 전치 변환을 시도하여 안도하고 사용할 수 있습니다.',
      },
      {
        q: '한꺼번에 여러 장의 사진도 가능한가요?',
        a: '네, 슬라이더 바 조절에 맞춰 수십 장의 대량 파일도 개별 병렬 구조로 동시 처리되어 찰나의 시간으로 경량 인도가 결정됩니다.',
      },
    ],
    relatedTools: [
      { name: '사진 PDF 변환', path: '/submit/photo-to-pdf', icon: 'FileImage' },
      { name: 'PDF 개인정보 마스킹', path: '/submit/pdf-mask', icon: 'ShieldAlert' },
    ],
  },
  'pdf-merge': {
    neededWhen: [
      "이력서 PDF, 졸업증서 PDF, 경력증명서 PDF 등 따로따로 뽑아낸 단종 인증본들을 '최종합본.pdf' 1개로 병합할 때",
      '동료들이 각자 제작해 올린 PPT 기반 개별 장표 PDF 본을 1부의 종합 프레젠테이션 수주 제안 보고서로 조합할 때',
      '스캔 기계에서 낱개 한 페이지 단위로 쪼개져 뱉어진 서류 파일을 순서대로 꼼꼼히 연계 단결할 때',
    ],
    howToUse: [
      '합쳐지게 될 두 개 이상의 PDF 파일들을 차례대로 전용 영토 안으로 드래그해 놓아 대기합니다.',
      '각 레코드 우측 정렬 화살표(▲, ▼)를 마우스로 여러 번 압축 클릭하여 최적 일치 병합 순번을 조율합니다.',
      "'PDF 합치기' 핵심 단추를 클릭해 실시간 물리 병합 파이프라인 조립을 시작합니다.",
      "프로세스 바가 종착점에 이르고 '모든 PDF 문서 어셈블 완료'가 출력되면 다운로드 버튼을 눌러 소장합니다.",
    ],
    howToVerify:
      '합쳐서 확보한 최종 PDF 문서를 열면 표지부터 뒷면까지, 지정한 순번 질서 정연하게 누락 페이징 없이 단 하나의 일체형 통합서류 스트림이 완성되었는지를 직각 탐독하는 것으로 실효를 알 수 있습니다.',
    caveats: [
      '각기 다른 포맷 비율(가로형 가로 양식, 세로형 양식 혼재)을 통일감 높게 연결하기는 하나 가급적 한 규격의 PDF들의 집합일 때 가장 인물 지평이 잘 표현됩니다.',
    ],
    privacyDisclaimer:
      'PDF 정리 도구의 PDF 컴바이너 모듈은 전송 백엔드가 없는 WebAssembly 및 로컬 API 가상화 기법을 사용하여, 이용 시 기밀 소송 조항이나 성적 기록서가 다른 곳으로 일절 백업 저장되지 않습니다.',
    faqList: [
      {
        q: '병합할 수 있는 최대 PDF 개수 한계가 규정되어 있나요?',
        a: '기기 시스템 메모리와 브라우저 한도 내에서 수십 군데 흩어진 데이터셋을 한 호흡에 연접 수리를 마칠 수 있으므로 일상적인 수준은 모두 지원됩니다.',
      },
      {
        q: '합쳐진 결과 파일 용량이 너무 커지면 어떻게 대처하나요?',
        a: "용량이 제한 폭을 훌쩍 넘길 땐 PDF 정리 도구의 또 다른 동반자인 '이미지 압축' 혹은 'PDF 페이지 뽑기'를 동원해 사전에 불필요한 고해상도 영역을 절삭하는 방책을 제안합니다.",
      },
    ],
    relatedTools: [
      { name: 'PDF 페이지 뽑기', path: '/submit/pdf-extract', icon: 'Scissors' },
      { name: 'PDF 개인정보 마스킹', path: '/submit/pdf-mask', icon: 'ShieldAlert' },
    ],
  },
  'pdf-extract': {
    neededWhen: [
      '100장이 넘어가는 계약 연금 규격서 중, 본인의 이름과 실 서명이 명징하게 표기된 실 서명 7페이지 1장만 추출할 때',
      '학위 논문이나 전체 등본 문서 중 증빙 요건으로 채택 가능한 앞 지면의 1페이지 및 2페이지 구역만 간추릴 때',
      '과도하게 불려져 메일 첨부가 거절되는 큰 PDF에서 핵심 슬라이드 프레임 몇 페이지만 추려 전송할 때',
    ],
    howToUse: [
      '페이지 분해를 감내할 원본 PDF 서식 파일을 도구가 제공하는 인입 경로에 집어넣습니다.',
      "직접 개별 페이지 체크박스를 일일이 눈으로 보고 누르거나 상단 범위창에 '1-3, 5' 등 패턴 양식에 맞춰 입력합니다.",
      "'선택 페이지 PDF 만들기' 구역을 단행하면 필요한 슬라이스 조각의 연산 복제가 급속 처리됩니다.",
      "'추출 결과 확인 영역'에 수치가 올바른 것을 확인 후 '다운로드받기'로 가뿐히 확보합니다.",
    ],
    howToVerify:
      "추출 마감된 'extracted_pages.pdf'를 가동하면 기존의 90장짜리 두터운 문서더미는 온데간데없고 오로지 내가 적출을 약속한 '2, 3, 5' 등의 타깃 원티드 지면들만 깨끗하고 가볍게 잔존해 있음을 체득할 수 있습니다.",
    caveats: [
      '수식 가공 시 범위 계산 문자열 중 0페이지 또는 총 수량을 까마득히 뛰어넘는 999 등의 뻥카 허수를 지정할 시 경고 메커니즘에 의해 범위 조정 요망 오류 메시지가 출력됩니다.',
    ],
    privacyDisclaimer:
      '절단 필터링 동작 시 사용자인 본인의 내부 웹 브라우저 임프린트 레지스터 영역 안에서 복사 과정이 일어날 뿐 PDF 정리 도구 클라우드 서비스는 그 어떠한 사본 및 데이터 흔적도 수집 또는 열람하지 못함을 엄정 약속합니다.',
    faqList: [
      {
        q: '텍스트나 하이퍼링크 같은 PDF 내 인터랙티브 오브젝트 기능도 추출 후 유지되나요?',
        a: '네. pdf-lib가 단순 스크린샷 캡처 적출 방식이 아닌 타깃 페이지 노드 자체를 통째 복사해 담는 진성 임베디드 오더 복제 방식을 차용하므로, 원본의 구조적 속성이 대부분 상속 실현됩니다.',
      },
      {
        q: '비밀번호 암호가 걸린 PDF에서도 마음에 드는 지면만 편취가 가능한가요?',
        a: '인코딩 잠금장치가 유동적으로 걸린 문서는 파일의 무결한 메타 데이터 노출이 차단되므로 기기에서 비봉인 가공을 한 후에 도구함에 위임해 주시는 것이 필수입니다.',
      },
    ],
    relatedTools: [
      { name: 'PDF 합치기', path: '/submit/pdf-merge', icon: 'Layers' },
      { name: 'PDF 개인정보 마스킹', path: '/submit/pdf-mask', icon: 'ShieldAlert' },
    ],
  },
};

const iconMap: Record<string, React.ElementType> = {
  Layers,
  FileImage,
  Minimize2,
  ShieldAlert,
  Scissors,
};

interface SubmitSeoProps {
  toolId: SubmitSeoToolId;
}

export default function SubmitSeo({ toolId }: SubmitSeoProps) {
  const currentData = seoData[toolId];
  if (!currentData) return null;

  const {
    neededWhen,
    howToUse,
    howToVerify,
    caveats,
    privacyDisclaimer,
    faqList,
    relatedTools,
  } = currentData;

  return (
    <section
      id="dynamic-seo-comprehensive-block"
      className="space-y-8 mt-12 mb-6 max-w-4xl mx-auto border-t border-gray-200/60 pt-10 select-none"
    >
      <div className="bg-white border border-gray-150 rounded-xl p-6 shadow-2xs space-y-3.5">
        <h3 className="text-xs font-bold text-slate-900 border-l-4 border-emerald-600 pl-3 uppercase tracking-wider">
          이 도구가 필요한 경우 (사용 케이스)
        </h3>
        <ul className="space-y-2.5 text-xs text-slate-600">
          {neededWhen.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
              <span className="text-emerald-700 font-black text-sm shrink-0 mt-0.5">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white border border-gray-150 rounded-xl p-6 shadow-2xs space-y-3.5">
        <h3 className="text-xs font-bold text-slate-900 border-l-4 border-emerald-600 pl-3 uppercase tracking-wider">
          상세형 무료 사용 프로세스 가이드
        </h3>
        <ol className="space-y-3 text-xs text-slate-655 font-normal">
          {howToUse.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 leading-relaxed">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="pt-0.5">{item}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="py-2">
        <AdSlot type="responsive" label="콘텐츠 추천 정보 네트워크 서비스 피드" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-150 rounded-xl p-6 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 border-l-4 border-emerald-600 pl-3 uppercase tracking-wider">
            결과 파일 및 무결성 확인 방법
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed pl-1 pt-0.5">{howToVerify}</p>
        </div>

        <div className="bg-rose-50/40 border border-rose-100 rounded-xl p-6 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-rose-900 border-l-4 border-rose-600 pl-3 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            작업 시 필수 주의사항
          </h3>
          <ul className="space-y-2 text-xs text-rose-800/90 pl-1">
            {caveats.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-rose-600 font-bold text-sm shrink-0 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-6 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-emerald-900 border-l-4 border-emerald-600 pl-3 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4.5 h-4.5 text-emerald-700" />
          공인 서명 보장형 무반출 안심 서역
        </h3>
        <p className="text-xs text-emerald-850 leading-relaxed font-semibold pl-1">
          {privacyDisclaimer}
        </p>
      </div>

      <div className="bg-white border border-gray-150 rounded-xl p-6 md:p-8 shadow-2xs space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-emerald-650" />
            자주 묻는 질문 (FAQ)
          </h3>
        </div>
        <div className="space-y-5">
          {faqList.map((faq, idx) => (
            <div key={idx} className="space-y-1.5">
              <p className="text-xs font-bold text-slate-850 flex gap-1.5">
                <span className="text-emerald-600 font-bold">Q.</span>
                <span>{faq.q}</span>
              </p>
              <p className="text-xs text-slate-500 leading-relaxed pl-5 font-normal">
                A. {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 border border-gray-150 rounded-xl p-5 space-y-3.5">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest pl-1">
          관련 제출 가동 도구 추천
        </h4>
        <div className="grid sm:grid-cols-3 gap-3">
          {relatedTools.map((tool, idx) => {
            const Icon = iconMap[tool.icon] || FileImage;
            return (
              <Link
                key={idx}
                to={tool.path}
                className="flex items-center justify-between p-3.5 rounded-lg bg-white border border-gray-200 hover:border-emerald-600 hover:shadow-xs hover:bg-emerald-50/20 transition-all group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded bg-slate-50 border border-gray-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 truncate">
                    {tool.name}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-350 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
