import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  FileSpreadsheet,
  Copy,
  PlusCircle,
  CheckCircle,
  RefreshCw,
  LayoutGrid,
} from 'lucide-react';
import AdSlot from '../common/AdSlot';

export type ExcelSeoToolId =
  | 'remove-duplicates'
  | 'merge-excel'
  | 'phone-cleaner'
  | 'csv-encoding-fix'
  | 'split-by-column';

interface SeoBlock {
  neededWhen: string[];
  howToUse: string[];
  howToVerify: string;
  caveats: string[];
  privacyDisclaimer: string;
  faqList: { q: string; a: string }[];
  relatedTools: { name: string; path: string; icon: string }[];
}

const seoData: Record<ExcelSeoToolId, SeoBlock> = {
  'remove-duplicates': {
    neededWhen: [
      '마케팅 뉴스레터 대량 발송 전, 동일한 이메일이 여러 번 들어가 발송 비용이 낭비되고 수신자 신뢰가 무너지는 사고를 사전에 차단할 때',
      '경품·이벤트 응모자 명단에서 동일인이 여러 번 응모해 추첨 공정성이 깨지는 상황을 막기 위해 응모자 중복을 정제해야 할 때',
      '복수의 거래처에서 모은 거래내역에서 동일한 거래가 중복 기록되어 매출이 부풀려진 상태를 정확한 단일 값으로 바로잡을 때',
      '인사·총무 부서에서 사내 동호회 명단·교육 신청자·복지 신청자를 합칠 때 동일 사번이 중복으로 들어와 비용 산정이 왜곡되는 경우',
      '쇼핑몰·CRM에서 내려받은 고객 DB에 같은 사람의 옛 가입 정보·신규 가입 정보가 섞여 있어 단일 고객으로 통합해야 할 때',
    ],
    howToUse: [
      '중복 제거할 엑셀(.xlsx) 또는 CSV 파일을 드래그앤드롭하거나 파일 선택 버튼으로 업로드합니다.',
      "상단에 표시된 헤더 목록에서 '기준 컬럼'을 선택합니다(예: 이메일 1개 기준, 또는 이름+휴대폰 2개 기준 등 복수 지정 가능).",
      "'기준 컬럼 일치'와 '전체 컬럼 완전 일치' 두 가지 모드 중 상황에 맞는 쪽을 선택합니다. 마케팅 발송 정리는 보통 기준 컬럼만으로도 충분하지만, 회계 거래내역처럼 모든 값이 동일해야 중복으로 판정해야 하는 경우엔 후자를 씁니다.",
      '미리보기 영역에서 제거 예정 행(빨간 배경)과 유지 행(흰 배경)을 시각적으로 확인합니다. 중복 그룹별로 가장 위 행이 기본 유지 행으로 표시됩니다.',
      "결과가 의도와 같다면 'XLSX 내려받기' 또는 'CSV 내려받기' 버튼으로 저장합니다. 원본 행 순서는 그대로 유지되며 중복만 제거됩니다.",
    ],
    howToVerify:
      '결과 파일을 엑셀로 열어 첫 시트의 행 개수가 \'원본 행 수 - 중복으로 표시된 행 수\'와 일치하는지 확인합니다. 가장 확실한 검증법은 결과 파일에서 기준 컬럼을 다시 한 번 \'중복 제거\' 처리(엑셀 데이터 메뉴) 했을 때 \'제거된 항목 0개\'라는 메시지가 떠야 한다는 점입니다. 또한 표본 5행 정도를 임의 추출해 원본에 동일 값이 단 1개만 남아 있는지 직접 검색해 보면 안심할 수 있습니다.',
    caveats: [
      "데이터 앞뒤 공백, 대소문자, 전각·반각 숫자 차이가 있으면 사람 눈에는 같은 값이지만 컴퓨터는 다른 값으로 인식해 중복으로 잡지 못합니다. 발송 명단의 경우 미리 '전화번호 다듬기' 도구로 표준화한 뒤 본 도구를 돌리는 2단계 처리를 권장합니다.",
      'CSV 파일을 업로드할 때 파일 인코딩이 CP949/EUC-KR이면 한글 컬럼명이 깨질 수 있습니다. 이때는 \'CSV 한글 깨짐 복구\' 도구로 먼저 UTF-8 변환을 거치는 것이 안전합니다.',
    ],
    privacyDisclaimer:
      '업로드한 파일은 사용자 브라우저의 메모리에서 직접 파싱·중복 판정·결과 생성까지 모든 단계가 이뤄집니다. 본 도구의 어떠한 서버에도 행 데이터·헤더·파일명이 전송되지 않으며, 탭을 닫는 즉시 메모리에서 휘발됩니다. 고객 휴대폰·주민번호·이메일 등 민감한 개인정보가 담긴 명단도 외부 유출 걱정 없이 안심하고 처리할 수 있습니다.',
    faqList: [
      {
        q: '10만 행이 넘는 대용량 파일도 처리되나요?',
        a: '브라우저 메모리 한도(보통 PC에서 4GB) 안에서 동작하므로 통상 10만~50만 행까지는 무리 없이 처리됩니다. 다만 100만 행을 넘어가는 초대형 파일은 분할 후 처리하는 것을 권장합니다. xlsx 형식보다는 CSV가 메모리 효율이 좋아 대용량은 CSV로 다루는 것이 빠릅니다.',
      },
      {
        q: '중복 그룹에서 어떤 행을 \'유지\' 행으로 남길지 직접 고를 수 있나요?',
        a: '본 도구는 원본 행 순서를 기준으로 \'먼저 등장한 행\'을 유지합니다. 만약 \'가장 최신 행만 남기고 싶다\'면 업로드 전 엑셀에서 \'등록일\' 열 기준 내림차순 정렬을 미리 해두면 동일 효과를 얻을 수 있습니다.',
      },
      {
        q: '두 개 이상의 컬럼을 동시에 기준 삼아 중복을 정의할 수 있나요?',
        a: '네. 기준 컬럼 선택 UI에서 \'이름\'과 \'휴대폰\'을 둘 다 체크하면 두 값이 동시에 일치하는 행만 중복으로 판정합니다. 동명이인을 잘못 합치는 사고를 막을 때 매우 유용합니다.',
      },
    ],
    relatedTools: [
      { name: '엑셀 합치기', path: '/excel/merge-excel', icon: 'PlusCircle' },
      { name: '전화번호 다듬기', path: '/excel/phone-cleaner', icon: 'RefreshCw' },
      { name: '컬럼별 나누기', path: '/excel/split-by-column', icon: 'Copy' },
    ],
  },

  'merge-excel': {
    neededWhen: [
      '본사에서 각 지점·대리점·지사가 보내온 월별 매출 보고서를 하나의 마스터 파일로 통합해 전국 단위 실적을 한 번에 분석해야 할 때',
      '협업 부서·외부 협력사가 각자 작성해 보낸 같은 양식의 설문 응답·만족도 조사 결과를 한 시트로 모아 통계를 돌릴 때',
      '여러 명이 각자 작성한 출장 정산·지출 명세서 양식을 회계팀이 한 파일로 합쳐 한 번에 결재·검증할 때',
      '쇼핑몰 운영자가 네이버 스마트스토어·쿠팡·11번가 등 멀티 채널의 주문 다운로드 CSV를 한 파일로 합쳐 통합 발주 명단을 만들 때',
      '학원·교육기관에서 반별·강사별 출석부를 학기말에 학생 단위 통합 출석 데이터로 정리할 때',
    ],
    howToUse: [
      '합칠 엑셀·CSV 파일들을 한꺼번에 드래그앤드롭하거나 파일 선택 버튼으로 다중 선택합니다(2~수십 개 가능).',
      "헤더 매칭 모드를 선택합니다. '엄격(헤더 완전 일치)'은 모든 파일의 첫 행이 글자까지 똑같을 때, '관대(헤더 부분 일치)'는 일부 파일에 추가/누락 컬럼이 있어도 동일 이름끼리 알아서 정렬해 합쳐줍니다.",
      "원본 추적이 필요하면 '소스 파일명 컬럼 추가' 옵션을 활성화합니다. 결과 파일에 마지막 열로 '출처 파일' 컬럼이 자동 생성되어 어떤 행이 어떤 파일에서 왔는지 한눈에 보입니다.",
      "여러 시트가 있는 파일은 '모든 시트 합산' / '첫 시트만 사용' 중 선택합니다. 매장별로 시트가 나뉜 파일을 한 데 합칠 때 전자가 유용합니다.",
      "'엑셀로 통합'을 실행하면 미리보기와 함께 합산 행 수·헤더 충돌 여부가 리포트로 표시됩니다. 결과가 만족스러우면 한 장의 XLSX 또는 CSV로 다운로드합니다.",
    ],
    howToVerify:
      '결과 파일을 열어 다음 세 가지를 차례로 확인합니다. (1) 행 수가 원본 파일들의 행 수 합과 일치하는가(헤더 1행 차이 고려), (2) \'소스 파일\' 컬럼이 있다면 모든 원본 파일명이 빠짐없이 등장하는가, (3) 임의의 한 행을 골라 그 값이 원본 파일에 그대로 있는지 역추적이 가능한가. 이 세 가지가 충족되면 병합이 정상적으로 끝났다는 강력한 증거입니다.',
    caveats: [
      "관대 모드는 같은 이름의 컬럼만 자동 정렬합니다. '휴대폰', '연락처', '전화번호'처럼 의미는 같지만 헤더가 다른 컬럼은 별개의 열로 분리되어 결과에 빈 칸이 생깁니다. 가능하면 원본 파일들의 헤더를 사전에 통일해 두는 것이 깔끔합니다.",
      '날짜·금액 컬럼의 서식이 파일마다 다르면(예: 2026-01-01 vs 2026/01/01) 텍스트로 인식되어 정렬·합계가 깨질 수 있습니다. 병합 후 엑셀에서 일괄 서식 통일을 거치는 것을 권장합니다.',
    ],
    privacyDisclaimer:
      '모든 입력 파일은 사용자 브라우저 메모리 안에서만 파싱·결합되며, 서버로 단 1바이트도 전송되지 않습니다. 매출·고객 명단 등 외부 유출이 부담스러운 비즈니스 데이터를 합칠 때 가장 안전한 방식입니다. 결과 파일 또한 사용자 PC에서 직접 생성되어 다운로드되므로 클라우드 흔적이 남지 않습니다.',
    faqList: [
      {
        q: '파일마다 헤더 순서가 다른데 자동으로 맞춰주나요?',
        a: '관대 모드에서는 헤더 이름 기준으로 자동 정렬합니다. 예를 들어 A 파일이 [이름, 연락처, 이메일], B 파일이 [연락처, 이메일, 이름] 순이어도 결과는 동일 이름끼리 모여 한 컬럼으로 합쳐집니다. 헤더 이름이 단 한 글자라도 다르면 다른 컬럼으로 분리되므로 이름 통일이 핵심입니다.',
      },
      {
        q: '시트가 여러 개인 XLSX 파일은 어떻게 처리되나요?',
        a: "'모든 시트 합산' 옵션을 활성화하면 한 파일 안의 모든 시트를 차례로 읽어 결과에 누적합니다. 단, 시트마다 헤더 구조가 다르면 관대 모드로 동작하며 누락 컬럼이 생길 수 있으니, 통일된 양식의 시트들만 처리하는 것을 권장합니다.",
      },
      {
        q: '한 번에 합칠 수 있는 파일 개수 제한이 있나요?',
        a: '명시적 상한은 없으나, 브라우저 메모리 한도 안에서 동작하므로 일반 PC 기준 30~50개·합산 50만 행 정도까지는 무리 없이 처리됩니다. 그 이상은 1차 합산 후 2차 합산으로 분할하는 것이 안전합니다.',
      },
    ],
    relatedTools: [
      { name: '중복 행 지우기', path: '/excel/remove-duplicates', icon: 'CheckCircle' },
      { name: '컬럼별 나누기', path: '/excel/split-by-column', icon: 'Copy' },
      { name: 'CSV 한글 깨짐 복구', path: '/excel/csv-encoding-fix', icon: 'LayoutGrid' },
    ],
  },

  'phone-cleaner': {
    neededWhen: [
      '단체 SMS·카카오 알림톡 발송 시스템에 명단을 업로드하기 전, 휴대폰 번호 형식 불일치로 발송 실패·반송이 대량 발생하는 사고를 막을 때',
      'CRM·콜센터 시스템에 신규 고객 명단을 한 번에 등록할 때, 시스템이 요구하는 표준 포맷(하이픈 유/무, 국가코드 유/무)에 맞춰 일괄 정제할 때',
      '여러 채널(쇼핑몰·이벤트 신청·오프라인 명함)에서 모은 명단을 한 데 합쳤더니 010-1234-5678, 01012345678, +82-10-1234-5678이 뒤섞여 정리가 필요할 때',
      '구버전 엑셀에서 휴대폰 번호 앞 0이 사라져 숫자로 인식된 명단(예: 1012345678)을 다시 정식 포맷으로 복원해야 할 때',
      '명단 안에 잘못 입력된 번호(자릿수 미달·중복 자리·문자 포함 등)를 자동 탐지해 별도 시트로 분리해 검수해야 할 때',
    ],
    howToUse: [
      '정제할 명단 파일(엑셀·CSV)을 업로드하면 모든 컬럼 헤더가 자동으로 감지됩니다.',
      "'전화번호 컬럼'을 선택합니다. 여러 컬럼이 동시에 전화 정보일 경우 다중 지정도 가능합니다.",
      "출력 형식 두 가지 중 선택: '하이픈 포함(010-XXXX-XXXX)'은 가독성·CRM 호환성, '하이픈 제거(01012345678)'는 일부 SMS API·구형 시스템 호환성에 적합합니다.",
      "'국가코드(+82) 자동 부착' 옵션은 해외 발송이 섞이는 캠페인일 때 활성화합니다. 비활성이면 국내 표준 포맷만 출력됩니다.",
      "'비정상 행 분리' 옵션을 활성화하면 자릿수 미달·문자 혼합 등 표준화 실패 행을 별도 시트(이상치)로 빼주어 사후 수동 검토가 쉬워집니다. 결과를 다운로드한 뒤 발송 시스템에 업로드합니다.",
    ],
    howToVerify:
      '결과 파일의 전화 컬럼을 임의로 20개 정도 표본 추출해 다음을 확인합니다. (1) 모든 표본이 선택한 포맷(예: 010-XXXX-XXXX)으로 통일됐는가, (2) 첫 0이 살아 있는가, (3) 자릿수가 일관된가(국내 휴대폰은 11자리). \'이상치\' 시트가 있다면 그 안의 행이 실제로 비정상인지(자릿수·문자 등) 한 번 더 검토해 표준화 누락이 없었는지 검증합니다.',
    caveats: [
      "070(인터넷 전화)·02(서울 시내)·031(경기 시내) 등 지역·서비스 번호는 휴대폰 표준 11자리와 자릿수가 달라 '비정상'으로 분류될 수 있습니다. 이를 함께 정제하려면 출력 형식을 '일반 전화 호환'으로 전환해야 합니다.",
      "엑셀의 자동 형식 변환으로 인해 휴대폰 번호 앞자리 0이 사라진 셀(예: 1012345678)은 자릿수 부족으로 보일 수 있으나 본 도구가 패턴을 인식해 자동 복원합니다. 다만 010 이외의 시작 번호(011, 016, 017 등 구식 휴대폰)는 명시적으로 알려주지 않으면 정확한 복원이 어렵습니다.",
    ],
    privacyDisclaimer:
      '휴대폰 번호는 가장 민감한 개인정보 중 하나입니다. 본 도구는 업로드된 명단의 모든 처리를 사용자 브라우저 안에서 자바스크립트로 수행하며, 서버로 행 데이터를 전송하지 않습니다. 정제 작업이 끝난 후 탭을 닫으면 모든 번호·이름·메모가 메모리에서 즉시 휘발되어 클라우드·로그·통계 어디에도 남지 않습니다.',
    faqList: [
      {
        q: '국제 번호(+1, +81, +86 등)도 함께 정제되나요?',
        a: "'국가코드 자동 부착' 옵션을 켜면 +82 외의 국가코드를 인식해 그대로 유지합니다. 단, 본 도구의 자동 표준화 로직은 한국 휴대폰(010 + 8자리)에 최적화되어 있어 해외 번호는 자릿수·하이픈 정렬만 보정하고 국가별 세부 포맷 변환은 보장하지 않습니다.",
      },
      {
        q: '중복된 번호도 자동으로 제거되나요?',
        a: '본 도구는 표준화에 집중하며 중복 제거는 별도 도구의 책임 영역입니다. 정제 후 \'중복 행 지우기\' 도구로 한 번 더 처리하는 2단계 워크플로우를 권장합니다. 표준화를 먼저 거치면 \'010-1234-5678\'과 \'01012345678\'을 동일 번호로 인식할 수 있어 중복 식별률이 크게 올라갑니다.',
      },
      {
        q: '엑셀 파일에서 이미 텍스트(\'010-...)로 저장된 번호와 숫자로 저장된 번호가 섞여 있는데 괜찮나요?',
        a: '네. 본 도구는 셀의 데이터 타입(텍스트/숫자)을 가리지 않고 값을 추출해 통일된 포맷으로 출력합니다. 결과 파일은 모든 번호가 텍스트 형식으로 저장되어 \'엑셀에서 앞 0이 사라지는\' 문제가 재발하지 않습니다.',
      },
    ],
    relatedTools: [
      { name: '중복 행 지우기', path: '/excel/remove-duplicates', icon: 'CheckCircle' },
      { name: '엑셀 합치기', path: '/excel/merge-excel', icon: 'PlusCircle' },
      { name: 'CSV 한글 깨짐 복구', path: '/excel/csv-encoding-fix', icon: 'LayoutGrid' },
    ],
  },

  'csv-encoding-fix': {
    neededWhen: [
      '쇼핑몰 관리자 페이지에서 다운로드한 주문 CSV를 엑셀로 열었더니 한글이 \'꿹뛡뛁\'처럼 깨져 도무지 읽을 수 없는 상황',
      '구글 시트·노션·외부 SaaS에서 내보낸 CSV(UTF-8)를 한국형 엑셀(CP949 기본 인식)이 못 읽어 문자가 박살 난 경우',
      '구형 ERP·POS 시스템에서 받은 EUC-KR 인코딩 CSV를 최신 웹 도구·구글 시트에서 그대로 쓰려고 UTF-8로 변환할 때',
      '엑셀에서 깨짐 없이 바로 열리도록 UTF-8 + BOM(Byte Order Mark)을 강제 부착해 더블 클릭만으로 한글이 보이는 \'엑셀 친화형\' CSV로 정제할 때',
      '해외 협업자에게 한국어가 섞인 CSV를 보낼 때 그쪽 엑셀이 어떤 인코딩이든 정상 인식할 수 있도록 표준 UTF-8로 통일할 때',
    ],
    howToUse: [
      "깨진(또는 변환할) CSV 파일을 드래그앤드롭하거나 파일 선택 버튼으로 업로드합니다.",
      '본 도구는 업로드 직후 파일의 인코딩(UTF-8 / EUC-KR / CP949 등)을 자동 감지하여 화면에 표시합니다.',
      '미리보기 영역에서 한글이 정상적으로 표시되는지 확인합니다. 자동 감지가 어색하면 인코딩 드롭다운에서 수동으로 다른 값을 선택해 미리보기를 재실행할 수 있습니다.',
      "출력 형식을 선택합니다: 'UTF-8 (BOM 포함)'은 엑셀에서 더블클릭으로 바로 열기 좋고, 'UTF-8 (BOM 없음)'은 웹 도구·구글 시트에 적합합니다. 'EUC-KR'은 구형 한국 시스템 호환용입니다.",
      "'CSV 변환'을 실행한 뒤 결과 파일을 다운로드합니다. 엑셀에서 더블클릭으로 열어 한글이 정상 표시되는지 최종 확인합니다.",
    ],
    howToVerify:
      '변환한 CSV를 엑셀에서 더블클릭으로 열어 한글이 깨짐 없이 표시되면 가장 확실한 검증입니다. 만약 그래도 깨진다면 \'UTF-8 (BOM 포함)\' 옵션이 선택됐는지, 그리고 엑셀 버전이 너무 오래된 것은 아닌지(2010 이하는 BOM 인식이 불안정) 확인하세요. 또 다른 검증법은 구글 시트에 변환 파일을 업로드해 한글이 정상 표시되는지 보는 것입니다 — 양쪽 모두에서 정상이면 표준 호환성이 확보된 것입니다.',
    caveats: [
      '한 파일 안에 두 가지 인코딩이 섞여 있는 경우(매우 드물지만 가능)에는 자동 감지가 한쪽으로만 결정되어 다른 쪽 행이 손상될 수 있습니다. 이런 파일은 텍스트 에디터(예: VS Code)에서 줄 단위로 직접 검토한 뒤 분할 변환을 권장합니다.',
      "BOM(EFBB BF, 3바이트)이 부착된 CSV를 일부 데이터베이스 임포트 도구(MySQL LOAD DATA 등)는 첫 컬럼명 앞에 보이지 않는 문자가 붙어 있다고 오인합니다. 이런 경우엔 'UTF-8 (BOM 없음)' 옵션으로 변환해야 합니다.",
    ],
    privacyDisclaimer:
      '인코딩 변환은 100% 사용자 브라우저 안의 TextDecoder/TextEncoder API로 처리되며, 서버에 단 1바이트도 업로드되지 않습니다. 영업비밀이 담긴 매출 CSV, 고객 명단 CSV, 정산 자료 CSV 등을 안심하고 변환할 수 있으며, 처리 후 탭을 닫으면 메모리에서 즉시 휘발됩니다.',
    faqList: [
      {
        q: 'EUC-KR과 CP949는 어떻게 다른가요?',
        a: 'EUC-KR은 한글 완성형(2,350자) 표준이고, CP949는 EUC-KR을 확장해 추가 한자·완성형 외 글자까지 8,822자를 담은 마이크로소프트 사실상 표준입니다. 일반적인 한글 비즈니스 문서는 두 인코딩 모두 같은 결과를 내지만, 한자·특수 한글이 포함된 파일은 CP949로 처리해야 안전합니다. 본 도구는 둘을 자동 구분합니다.',
      },
      {
        q: '엑셀에서 한글이 깨질 때 가장 확실한 해결법은 무엇인가요?',
        a: 'UTF-8 + BOM 포함 형식으로 변환하는 것이 가장 안정적입니다. BOM은 파일 시작 부분에 \'이 파일은 UTF-8입니다\'라고 명시적으로 알려주는 짧은 표식으로, 엑셀이 자동으로 한국어 환경에서도 UTF-8로 열어줍니다. 본 도구의 \'UTF-8 (BOM 포함)\' 옵션이 이 방식입니다.',
      },
      {
        q: '구분자가 콤마(,)가 아닌 탭(\\t)이나 세미콜론(;)인 CSV도 지원되나요?',
        a: '네. 본 도구는 구분자를 자동 감지합니다. 콤마·탭·세미콜론·파이프(|)까지 일반적인 구분자를 인식하며, 결과 파일은 동일 구분자를 유지한 채 인코딩만 변환합니다. 따라서 \'TSV(탭 구분)\' 파일도 한글 깨짐만 복구해 그대로 사용할 수 있습니다.',
      },
    ],
    relatedTools: [
      { name: '엑셀 합치기', path: '/excel/merge-excel', icon: 'PlusCircle' },
      { name: '중복 행 지우기', path: '/excel/remove-duplicates', icon: 'CheckCircle' },
      { name: '전화번호 다듬기', path: '/excel/phone-cleaner', icon: 'RefreshCw' },
    ],
  },

  'split-by-column': {
    neededWhen: [
      '전국 고객 명단을 \'지역\' 컬럼 기준으로 시도별로 쪼개 각 지점장에게 담당 지역 명단을 따로 전달해야 할 때',
      '본사가 보유한 통합 거래내역을 \'담당 영업사원\' 기준으로 분리해 각자에게 본인 담당 명단만 전달해야 할 때 (개인정보 최소 권한 원칙)',
      '학원·교육기관에서 통합 출석부를 \'반 이름\' 또는 \'강사명\' 기준으로 쪼개 강사별 출석부를 일괄 생성할 때',
      '쇼핑몰 운영자가 통합 주문 명단을 \'택배사\' 기준으로 분리해 각 택배사 발송 시스템에 별도 업로드할 때',
      '인사팀이 전 직원 명단을 \'부서\' 기준으로 분리해 부서장에게 본인 부서 인사 정보만 회람할 때',
    ],
    howToUse: [
      '나눌 통합 파일(엑셀·CSV)을 업로드하면 헤더 목록이 자동으로 표시됩니다.',
      "'분류 기준 컬럼'을 선택합니다(예: 지역, 부서, 담당자 등). 본 도구는 해당 컬럼의 고유값을 자동 추출해 미리보기에 표시합니다.",
      "출력 모드 두 가지 중 선택: 'ZIP에 개별 파일'(각 분류값마다 별도 XLSX 파일이 생성되어 압축됨, 외부 전달용으로 적합)과 '단일 파일 다중 시트'(한 XLSX 파일 안에 분류값마다 시트가 생성됨, 내부 검토용으로 적합).",
      "원본의 헤더 행은 모든 결과 파일·시트에 자동 복제됩니다. 빈 값(NULL) 행은 별도 분류('미분류') 파일로 빠지게 할지, 무시할지 옵션으로 선택할 수 있습니다.",
      "'파일 나누기'를 실행하면 미리보기와 함께 분류 개수·예상 파일 수가 리포트되며, 결과를 한 번에 다운로드합니다.",
    ],
    howToVerify:
      '결과를 다운받은 뒤 다음 세 가지를 확인합니다. (1) 분류 카테고리 개수가 결과 파일 수(또는 시트 수)와 정확히 일치하는가, (2) 임의의 결과 파일 하나를 열어 그 파일 안 행의 분류 컬럼이 단 하나의 값으로만 채워져 있는가(섞임 없음), (3) 모든 결과 파일의 행 수 합이 원본 행 수와 일치하는가. 이 세 가지가 충족되면 분할이 누락·중복 없이 완벽히 수행된 것입니다.',
    caveats: [
      '분류 컬럼의 고유값이 너무 많은 경우(예: 수천 개의 ID별로 분리) 결과 파일 수가 폭발해 압축 시간이 길어지고 다운로드 용량이 커집니다. 가능하면 상위 카테고리(지역·부서 단위)로 분리한 뒤 필요시 한 번 더 세분화하는 2단계 분할을 권장합니다.',
      '파일명에 사용할 수 없는 특수문자(/, \\, :, *, ?, ", <, >, |)가 분류 값에 포함되면 자동으로 언더스코어(_)로 치환됩니다. 결과 파일명이 원본 분류값과 약간 다를 수 있으니 결과 압축의 파일명 매핑 리포트를 한 번 확인하세요.',
    ],
    privacyDisclaimer:
      '통합 명단을 외부 클라우드 서비스에서 분할할 경우 전체 원본이 외부 서버에 노출됩니다. 본 도구는 모든 분할 처리를 사용자 브라우저 안에서 수행하므로 원본·결과 모두 사용자 PC를 떠나지 않습니다. 개인정보 최소 권한 분배(담당자별 본인 분량만 전달) 원칙을 지키면서도 분리 작업 자체에서 개인정보가 외부에 흘러가지 않는 가장 안전한 방식입니다.',
    faqList: [
      {
        q: '두 개 이상의 컬럼을 동시에 기준으로 분리할 수 있나요?',
        a: '현재는 단일 컬럼 기준 분리를 표준 동작으로 지원합니다. \'지역\'과 \'담당자\' 두 컬럼 동시 분리가 필요하다면, 먼저 \'지역\' 기준으로 ZIP을 만든 뒤 각 결과 파일을 다시 \'담당자\' 기준으로 분리하는 2단계 처리를 권장합니다.',
      },
      {
        q: '분류 값이 빈 셀(NULL)인 행은 어떻게 처리되나요?',
        a: "옵션에 따라 두 가지 동작 중 선택할 수 있습니다. '미분류 파일로 분리'를 선택하면 빈 셀 행만 모은 별도 파일(__미분류.xlsx)이 결과에 포함되어 사후 검토가 쉽습니다. '제외'를 선택하면 빈 셀 행이 결과에서 누락됩니다(원본 행 수와 합이 안 맞을 수 있음을 유의).",
      },
      {
        q: 'ZIP과 다중 시트 중 어느 쪽이 더 좋은가요?',
        a: '용도가 다릅니다. ZIP은 \'각 담당자에게 본인 파일만 따로 전달\' 같은 분배 시나리오에 최적이며, 다중 시트는 \'전체 데이터를 한 파일로 유지하면서 분류별 빠른 탐색\'이 필요한 내부 검토 용도에 적합합니다. 외부에 보내야 한다면 ZIP, 본인이 분석한다면 다중 시트를 권장합니다.',
      },
    ],
    relatedTools: [
      { name: '엑셀 합치기', path: '/excel/merge-excel', icon: 'PlusCircle' },
      { name: '중복 행 지우기', path: '/excel/remove-duplicates', icon: 'CheckCircle' },
      { name: '전화번호 다듬기', path: '/excel/phone-cleaner', icon: 'RefreshCw' },
    ],
  },
};

const iconMap: Record<string, React.ElementType> = {
  PlusCircle,
  CheckCircle,
  RefreshCw,
  LayoutGrid,
  Copy,
};

interface ExcelSeoProps {
  toolId?: ExcelSeoToolId;
}

interface HomeCard {
  id: ExcelSeoToolId;
  title: string;
  desc: string;
  path: string;
  icon: React.ElementType;
}

const homeCards: HomeCard[] = [
  {
    id: 'remove-duplicates',
    title: '중복 행 지우기',
    desc: '이메일 발송 명단·고객 DB·이벤트 응모자에서 동일 행을 마우스 클릭으로 정제. 기준 컬럼 단·복수 지원.',
    path: '/excel/remove-duplicates',
    icon: CheckCircle,
  },
  {
    id: 'merge-excel',
    title: '엑셀 합치기',
    desc: '전국 지점·여러 협력사가 보낸 같은 양식 파일을 한 마스터 시트로 통합. 헤더 부분 일치까지 자동 정렬.',
    path: '/excel/merge-excel',
    icon: PlusCircle,
  },
  {
    id: 'phone-cleaner',
    title: '전화번호 다듬기',
    desc: '010-1234-5678 / 01012345678 / +82-10... 뒤섞인 명단을 표준 포맷으로 일괄 정제. 비정상 행 자동 분리.',
    path: '/excel/phone-cleaner',
    icon: RefreshCw,
  },
  {
    id: 'csv-encoding-fix',
    title: 'CSV 한글 깨짐 복구',
    desc: 'EUC-KR / UTF-8 자동 감지 후 엑셀에서 바로 열리는 BOM 포함 UTF-8로 변환. 구글 시트 호환까지.',
    path: '/excel/csv-encoding-fix',
    icon: LayoutGrid,
  },
  {
    id: 'split-by-column',
    title: '컬럼별 나누기',
    desc: '지역·담당자·부서 기준으로 한 파일을 여러 파일(ZIP) 또는 다중 시트로 자동 분할. 외부 전달·내부 검토 양쪽 지원.',
    path: '/excel/split-by-column',
    icon: Copy,
  },
];

function ExcelHomeSeo() {
  return (
    <section
      id="excel-home-seo"
      className="space-y-8 mt-12 mb-6 max-w-4xl mx-auto border-t border-gray-200/60 pt-10 select-none"
    >
      <div className="bg-white border border-gray-150 rounded-xl p-6 md:p-8 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
          <FileSpreadsheet className="w-4 h-4" />
          왜 ‘엑셀 정리 도구’를 모아 두었을까요?
        </div>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">
          엑셀 ‘노가다 업무’를 클릭 몇 번으로 끝내는 다섯 가지 도구
        </h2>
        <div className="text-xs md:text-sm text-slate-600 leading-relaxed space-y-3">
          <p>
            매일 반복되는 실무 속에서 우리는 수많은 엑셀과 CSV 파일을 마주합니다. 여러 사람에게서
            받은 명단의 전화번호 포맷이 제각각이거나, 중복 발송을 막기 위해 골라내야 하는 이메일
            리스트, 웹에서 내려받으면 외계어처럼 깨져 보이는 CSV 한글 파일, 본사·지점이 보낸
            보고서를 한 시트로 통합해야 하는 마감 직전의 순간까지 — 모두가 한 번쯤 겪는 익숙한
            장면입니다.
          </p>
          <p>
            기존에는 복잡한 함수, VBA 매크로, 또는 외부 유료 SaaS의 힘을 빌려야 했던 작업을, 엑셀
            정리 도구는 <strong>마우스 클릭 몇 번</strong>으로 끝낼 수 있도록 설계되었습니다. 모든
            처리는 사용자 브라우저 안에서만 일어나며, 행 데이터·헤더·파일명 단 한 줄도 외부
            서버로 전송되지 않습니다. 사내 매출, 고객 휴대폰, 정산 자료처럼 외부 유출이 곤란한
            데이터도 안심하고 다룰 수 있는 이유입니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-150 rounded-xl p-6 shadow-2xs space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            대표적인 엑셀 업무 병목 해소
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            쇼핑몰 정산, 고객 마케팅 문자 발송, 학원 출석부 관리, 공공기관 보고서 취합 등 실무에서
            가장 자주 발생하는 ‘노가다성’ 수작업을 자동화합니다. 대용량 명단도 수십 초 이내에
            정제·합산·분할이 끝납니다.
          </p>
        </div>
        <div className="bg-white border border-gray-150 rounded-xl p-6 shadow-2xs space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            완전한 로컬 처리, 서버 무전송 보안
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            고객 DB·매출·정산 등 외부에 노출되어선 안 되는 파일을 외부 클라우드에 올리는 위험을
            원천 차단합니다. 모든 파싱·정제·결과 생성이 사용자 브라우저 안에서 끝나며, 탭을 닫는
            순간 메모리에서 휘발됩니다.
          </p>
        </div>
      </div>

      <div className="py-2">
        <AdSlot type="responsive" label="콘텐츠 추천 정보 네트워크 서비스 피드" />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest pl-1">
          5가지 엑셀 정리 도구 상세 안내
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {homeCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                to={card.path}
                className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-150 hover:border-emerald-600 hover:shadow-xs transition-all group"
              >
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100 transition-colors shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 group-hover:text-slate-900">
                    {card.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{card.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-6 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-emerald-900 border-l-4 border-emerald-600 pl-3 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4.5 h-4.5 text-emerald-700" />
          엑셀·CSV 작업을 ‘브라우저 안에서만’ 끝내는 이유
        </h3>
        <p className="text-xs text-emerald-850 leading-relaxed font-semibold pl-1">
          많은 무료 엑셀 정리 사이트가 ‘업로드 → 서버 처리 → 다운로드’ 구조를 채택합니다. 이는 사용자
          데이터가 짧은 시간이라도 외부 서버에 머문다는 의미이며, 영업비밀·개인정보 보호 측면에선
          큰 부담입니다. 본 도구함은 모든 처리를 100% 브라우저에서 수행하여 행 데이터가 결코
          외부로 전송되지 않으며, 인터넷 연결이 끊긴 상태에서도 동작합니다.
        </p>
      </div>
    </section>
  );
}

function ExcelToolSeo({ toolId }: { toolId: ExcelSeoToolId }) {
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
      id="excel-seo-comprehensive-block"
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
          공인 무반출 안심 프라이버시 정책
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
          관련 엑셀 정리 도구 추천
        </h4>
        <div className="grid sm:grid-cols-3 gap-3">
          {relatedTools.map((tool, idx) => {
            const Icon = iconMap[tool.icon] || PlusCircle;
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

export default function ExcelSeo({ toolId }: ExcelSeoProps) {
  if (toolId) {
    return <ExcelToolSeo toolId={toolId} />;
  }
  return <ExcelHomeSeo />;
}
