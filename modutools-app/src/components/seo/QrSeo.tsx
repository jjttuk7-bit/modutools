import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  Wifi,
  Link as LinkIcon,
  Contact,
  Palette,
  ScanLine,
} from 'lucide-react';
import AdSlot from '../common/AdSlot';

export type QrSeoToolId = 'url-qr' | 'wifi-qr' | 'vcard-qr' | 'qr-design' | 'qr-reader';

interface SeoBlock {
  neededWhen: string[];
  howToUse: string[];
  howToVerify: string;
  caveats: string[];
  privacyDisclaimer: string;
  faqList: { q: string; a: string }[];
  relatedTools: { name: string; path: string; icon: string }[];
}

const seoData: Record<QrSeoToolId, SeoBlock> = {
  'url-qr': {
    neededWhen: [
      '오프라인 매장 출입구나 테이블 POP에 스마트스토어·홈페이지 주소를 한 번의 카메라 조작으로 안내해야 할 때',
      '인쇄물(전단지·현수막·메뉴판) 영역에 한정된 지면에 긴 URL을 적기 어려워 QR 한 점으로 대체하고 싶을 때',
      '유튜브 채널이나 인스타그램 프로필 링크를 명함·강연 슬라이드 위에 그래픽적으로 노출하고 싶을 때',
      '구글폼·네이버폼 설문, 카카오톡 채널, 예약 페이지 등 짧은 캠페인 링크를 즉석에서 손님에게 전달할 때',
      '오프라인 행사 부스에서 방문객이 자료실·이벤트 페이지로 빠르게 이동하도록 동선을 단축할 때',
    ],
    howToUse: [
      '연결할 웹사이트 주소를 상단 입력란에 그대로 붙여 넣습니다(`https://` 누락은 자동 보정 검증됩니다).',
      "URL 길이와 도메인 형식이 유효 검증을 통과하면 'QR 생성' 단추가 활성화되어 즉시 미리보기가 출력됩니다.",
      '미리보기에서 인식률이 어색해 보이면 사이즈 슬라이더를 조정하거나 여백(quiet zone)을 넉넉히 두고 다시 다운로드합니다.',
      "용도에 따라 'PNG 내려받기'(웹·SNS용)와 'SVG 내려받기'(인쇄·확대용) 중 적합한 포맷으로 저장합니다.",
      '실제 배포 전, 카메라 앱이 설치된 스마트폰 2종 이상에서 직접 스캔해 의도한 페이지로 이동하는지 최종 검수합니다.',
    ],
    howToVerify:
      '저장한 QR 파일을 다른 모니터에 띄우거나 종이에 인쇄한 뒤, 본인 휴대폰 카메라 앱 또는 모두의 도구 QR 판독기에 비춰 보았을 때 정확히 입력한 URL이 나타나면 정상 작동입니다. 한 곳에서만 테스트하지 말고 안드로이드·아이폰 두 기기에서 모두 인식되는지를 교차 검증해야 실전 배포 시 문제가 없습니다.',
    caveats: [
      '동일한 URL이라도 길이가 길수록 모듈 밀도가 촘촘해져 인쇄 시 인식률이 떨어집니다. 가능하면 60자 이내 단축 URL 사용을 권합니다.',
      'QR 위에 작은 로고를 얹는 디자인은 오류정정 레벨이 충분할 때만 안전합니다. 캠페인 종료 후 링크가 죽으면 인쇄물 전량이 무효화되므로 영구 URL을 권장합니다.',
    ],
    privacyDisclaimer:
      '본 URL QR 생성기는 입력한 주소를 어떠한 서버에도 전송하지 않고 사용자 브라우저 안에서만 QR 비트 매트릭스를 계산합니다. 영업비밀이 담긴 비공개 URL(랜딩테스트, 베타 페이지 등)을 입력해도 외부 로그·통계·CDN에 흔적이 남지 않습니다.',
    faqList: [
      {
        q: '한 번 만든 QR을 나중에 다른 URL로 바꿀 수 있나요?',
        a: '본 도구는 정적 QR(Static QR) 방식으로 동작합니다. 즉 QR 이미지 자체에 URL이 직접 인코딩되므로 사후 변경은 불가합니다. 사후 변경이 필요한 캠페인이라면 본인 도메인에 짧은 리다이렉트 경로(예: /promo)를 만들고 그 경로를 QR에 굽는 방식을 추천합니다.',
      },
      {
        q: 'QR 색을 회사 브랜드 컬러로 칠하면 인식률이 떨어지지 않나요?',
        a: '전경색과 배경색의 대비비(Contrast Ratio)가 충분하면 색을 입혀도 인식률에 큰 영향이 없습니다. 다만 흰 배경에 노란색 모듈, 회색 배경에 연한 회색 모듈처럼 대비가 부족한 조합은 카메라가 모듈 경계를 못 찾아 실패하므로, 디자인 변경 후엔 반드시 실기 테스트를 거치세요.',
      },
      {
        q: '인쇄 시 추천 사이즈는 어느 정도인가요?',
        a: '경험적으로 가까운 거리(1m 이내)에서 스캔되는 명함·POP는 가로 25mm 이상, 1~3m 거리에서 스캔되는 매장 배너는 가로 80mm 이상, 옥외 현수막처럼 5m 이상 거리에서는 가로 200mm 이상을 권장합니다. 일반적으로 \'스캔 거리(m) × 10mm\' 공식을 기준으로 계산하면 안전합니다.',
      },
    ],
    relatedTools: [
      { name: '와이파이 QR 만들기', path: '/qr/wifi-qr', icon: 'Wifi' },
      { name: '명함 vCard QR', path: '/qr/vcard-qr', icon: 'Contact' },
      { name: '이미지 QR 판독', path: '/qr/qr-reader', icon: 'ScanLine' },
    ],
  },

  'wifi-qr': {
    neededWhen: [
      '카페·식당·미용실 등 매장에서 방문 손님이 SSID와 비밀번호를 일일이 묻지 않고 자동 접속하도록 안내할 때',
      '사무실 회의실에 외부 방문객이 자주 와서 회의용 게스트 Wi-Fi를 빠르게 공유해야 할 때',
      '에어비앤비·게스트하우스·공유 오피스 등 단기 체류자에게 키 카드처럼 Wi-Fi 정보를 깔끔하게 비치할 때',
      '집들이·가족 모임·홈파티 때 손님이 비밀번호를 묻는 번거로움 없이 즉시 인터넷을 쓰게 하고 싶을 때',
      '강의장·세미나실·코워킹 스페이스에서 다수의 인원이 동시에 접속해야 할 때 입실 안내문에 함께 노출할 때',
    ],
    howToUse: [
      '본인 공유기의 SSID(네트워크 이름)을 정확한 대소문자로 입력합니다. 한국어 SSID도 지원되지만 일부 구형 단말에서 인식이 불안정할 수 있어 영문 사용을 권장합니다.',
      '암호화 방식을 WPA/WPA2(또는 WPA3) 중에서 선택합니다. 비밀번호가 없는 공개 Wi-Fi라면 \'없음(nopass)\' 옵션을 고릅니다.',
      'Wi-Fi 비밀번호를 그대로 입력합니다. 특수문자(\\, ;, ", :)가 포함된 경우에도 자동 이스케이프되어 안전하게 처리됩니다.',
      '히든 네트워크(SSID 브로드캐스트 비활성)라면 \'히든 SSID\' 체크박스를 활성화합니다.',
      "'QR 만들기'를 누르면 즉시 미리보기가 생성되고 PNG/SVG 형식으로 받을 수 있습니다. 매장 입구나 테이블에 인쇄하여 비치하세요.",
    ],
    howToVerify:
      'QR을 인쇄 또는 화면에 띄운 뒤 안드로이드 카메라(또는 아이폰의 카메라 앱)를 켜고 QR을 비추면 \'이 네트워크에 연결하시겠습니까?\'라는 시스템 알림이 자동으로 나타납니다. 알림을 탭하면 비밀번호 입력 없이 즉시 Wi-Fi에 접속됩니다. 만약 알림이 뜨지 않는다면 SSID 오타, 암호화 방식 불일치, 또는 OS 버전이 너무 오래된 단말일 가능성이 높습니다.',
    caveats: [
      'iOS 11 미만, Android 10 미만 등 구형 기기에서는 Wi-Fi QR 자동 접속 규격을 지원하지 않을 수 있어 수동 입력 안내가 필요합니다.',
      'Wi-Fi 비밀번호는 QR 비트 패턴 안에 평문으로 인코딩됩니다. 즉 QR 이미지를 캡처한 사람은 누구나 비밀번호를 복원할 수 있으므로, 외부에 공개된 출입구에 노출 시 게스트 전용 SSID·기간 제한 비밀번호를 별도로 운용하는 것이 안전합니다.',
    ],
    privacyDisclaimer:
      'SSID와 비밀번호 정보는 사용자 브라우저 메모리 안에서만 비트 매트릭스로 변환되어 QR 이미지가 생성됩니다. 본 도구의 어떠한 서버에도 비밀번호가 전송되거나 저장되지 않으며, 페이지를 닫는 즉시 브라우저 메모리에서도 휘발됩니다. 따라서 사내 인증 키나 IoT 접속 정보처럼 민감한 문자열도 안심하고 입력할 수 있습니다.',
    faqList: [
      {
        q: 'WPA3 환경에서도 동작하나요?',
        a: '네. WPA3-Personal 환경의 공유기도 카메라가 인식하면 정상적으로 SSID·비밀번호를 자동 전달합니다. 다만 WPA3 전용 모드(WPA2 호환 비활성)는 단말에서도 WPA3을 지원해야 연결되므로, 호환성을 높이려면 공유기 보안 모드를 WPA2/WPA3 혼합 모드로 두는 것을 권장합니다.',
      },
      {
        q: '한 장의 QR에 여러 개의 SSID를 동시에 넣을 수는 없나요?',
        a: '표준 Wi-Fi QR 규격(WIFI:T:WPA;S:...;P:...)은 SSID 1개만 표현 가능합니다. 매장 메인망과 게스트망을 동시에 안내해야 한다면 두 장의 QR을 좌우로 나란히 인쇄해 \'직원/사장님용\', \'손님용\'으로 라벨을 붙이는 방식이 가장 깔끔합니다.',
      },
      {
        q: '스마트폰 카메라 외에 다른 앱이 필요한가요?',
        a: '아이폰(iOS 11+), 갤럭시·픽셀 등 주요 안드로이드(10+)는 기본 카메라 앱이 Wi-Fi QR을 직접 인식합니다. 별도 앱 설치가 필요 없으며, 단말 설정에서 \'QR 스캔\' 기능이 꺼져 있지 않은지만 확인하면 됩니다.',
      },
    ],
    relatedTools: [
      { name: 'URL QR 만들기', path: '/qr/url-qr', icon: 'LinkIcon' },
      { name: '명함 vCard QR', path: '/qr/vcard-qr', icon: 'Contact' },
      { name: 'QR 디자인 (로고)', path: '/qr/qr-design', icon: 'Palette' },
    ],
  },

  'vcard-qr': {
    neededWhen: [
      '종이 명함 뒷면에 QR을 인쇄해 상대방이 카메라 한 번으로 본인 연락처를 주소록에 저장하도록 만들고 싶을 때',
      '전시회·박람회·네트워킹 행사에서 짧은 시간에 다수의 사람과 연락처를 교환해야 하는 영업·세일즈 직군',
      'SNS 프로필·블로그·노션 페이지에 vCard QR을 첨부해 클릭만으로 전화·이메일이 시작되도록 동선을 단축할 때',
      '프리랜서·강사·1인 사업자가 자기 브랜드 디자인 안에 연락처 QR을 그래픽 요소로 녹여 활용할 때',
      '병원·클리닉·법무·세무 사무소가 상담 안내문 하단에 정식 연락처를 깔끔하게 노출하고 싶을 때',
    ],
    howToUse: [
      '이름(필수)·소속(회사·기관)·직책을 차례로 입력합니다. 이름은 한글·영문 모두 지원되며, 양쪽을 함께 적으면 해외 거래처에도 호환됩니다.',
      "전화번호는 국제 형식('+82 10-1234-5678')으로 입력하면 해외에서도 바로 발신됩니다. 국내 사용만 고려한다면 '010-...' 형식도 가능합니다.",
      '이메일과 홈페이지 URL을 추가합니다. URL은 LinkedIn·블로그·포트폴리오 페이지 등 어떤 형태든 무방합니다.',
      "필요시 주소(국문 또는 영문)와 메모란을 채워 vCard 구조의 'NOTE' 필드에 부가 정보를 담을 수 있습니다.",
      "'QR 생성'을 누르면 미리보기와 함께 vCard 원본 텍스트가 표시됩니다. 본인 휴대폰으로 직접 스캔해 주소록 저장이 정상 동작하는지 검증 후 PNG/SVG로 받으세요.",
    ],
    howToVerify:
      '생성된 QR을 본인 휴대폰 카메라로 비추면 \'연락처 추가하시겠습니까?\' 시스템 다이얼로그가 나타나며, 탭하는 즉시 입력한 모든 필드(이름·전화·이메일·주소·메모)가 주소록에 한 번에 저장됩니다. 만약 일부 필드가 누락되면 vCard 표준(RFC 6350)이 요구하는 필드명·구분자가 어긋났을 가능성이 있으므로 입력값을 다시 점검하세요.',
    caveats: [
      'vCard QR은 표준상 최대 2,953 바이트까지 인코딩 가능하지만, 그 한계에 가까울수록 모듈 밀도가 빽빽해져 인쇄 인식률이 급격히 떨어집니다. 메모란에 자기소개를 길게 넣기보다는 핵심 연락처와 한 줄 소개 정도로 압축하는 것이 실용적입니다.',
      "전화번호 앞 '+82'를 빠뜨리면 해외에서 스캔 시 발신이 실패할 수 있으므로, 글로벌 배포용이라면 반드시 국가 코드까지 포함하세요.",
    ],
    privacyDisclaimer:
      '이름·전화·이메일 등 본인 또는 회사의 연락처 정보는 모두 사용자 브라우저 안에서만 vCard 텍스트로 직렬화된 후 QR 비트 패턴으로 변환됩니다. 본 도구는 어떠한 서버에도 입력값을 전송하지 않으며 통계·로그·분석 목적으로도 보관하지 않습니다. 따라서 임원진·VIP 고객 연락처처럼 외부 노출이 부담스러운 데이터도 안심하고 입력할 수 있습니다.',
    faqList: [
      {
        q: '아이폰과 안드로이드 모두에서 한 번에 주소록에 저장되나요?',
        a: '네. 본 도구는 vCard 3.0 표준 포맷(BEGIN:VCARD ... END:VCARD)을 생성하므로, iOS 기본 카메라 및 Android(갤럭시·픽셀 등)의 기본 카메라/QR 스캐너에서 모두 동일하게 \'연락처 추가\' 다이얼로그가 자동 표시됩니다.',
      },
      {
        q: '한 사람의 여러 전화번호(휴대폰·사무실·팩스)를 한 QR에 담을 수 있나요?',
        a: 'vCard 표준은 TEL 필드를 여러 개 허용하므로 휴대폰·사무실·팩스 번호를 동시에 저장하는 것은 기술적으로 가능합니다. 다만 본 도구의 단일 입력 UI에서는 휴대폰 1개를 기본으로 받습니다. 다중 번호가 필요하다면 메모란에 보조 번호를 텍스트로 함께 적어두는 방식을 권장합니다.',
      },
      {
        q: '명함에 인쇄했을 때 어느 정도 크기여야 잘 스캔되나요?',
        a: '명함 단가를 고려해 일반적으로 가로 18~22mm 정사각형이 권장됩니다. 그보다 작아지면 카메라 초점 거리 안에서 모듈을 분리해 읽기 어려워지고, 그보다 크면 명함 디자인을 압도해 비주얼 균형이 무너집니다.',
      },
    ],
    relatedTools: [
      { name: 'URL QR 만들기', path: '/qr/url-qr', icon: 'LinkIcon' },
      { name: '와이파이 QR', path: '/qr/wifi-qr', icon: 'Wifi' },
      { name: 'QR 디자인 (로고)', path: '/qr/qr-design', icon: 'Palette' },
    ],
  },

  'qr-design': {
    neededWhen: [
      '브랜드 컬러와 일치하는 색상으로 QR을 만들어 광고 디자인의 일관성을 깨뜨리지 않으려 할 때',
      '회사 로고·심볼을 QR 중앙에 얹어 단순한 검은 사각형이 아닌 브랜디드 QR을 제작하려 할 때',
      '카페 메뉴판·매장 인테리어 톤에 어울리는 따뜻한 컬러 QR이 필요한 자영업자',
      '인쇄용 고해상도 QR(SVG)이 필요한 그래픽 디자이너·마케터',
      '온라인 이벤트·랜딩페이지에 보이는 QR을 디자인적으로 다듬어 클릭률·스캔율을 올리고자 할 때',
    ],
    howToUse: [
      'QR에 담을 내용을 URL 또는 임의 텍스트 중에서 선택합니다. URL 모드는 자동으로 형식 검증을 거칩니다.',
      "전경색(모듈 색)과 배경색을 컬러 피커로 지정합니다. 대비비가 너무 낮으면 경고 색으로 표시되니 권장 가이드 안에서 골라야 합니다.",
      '필요하다면 로고 이미지(PNG·SVG)를 업로드합니다. 가로폭 기준 QR 전체의 20% 이내로 자동 축소되어 인식률을 보호합니다.',
      "출력 사이즈와 여백(quiet zone)을 슬라이더로 미세 조정하고, 오류정정 레벨(L/M/Q/H)을 선택합니다. 로고를 사용한다면 H(30% 복구)를 권장합니다.",
      "'PNG 내려받기'(웹/SNS)와 'SVG 내려받기'(인쇄 무손실 확대) 중 적합한 포맷으로 저장한 뒤, 실제 카메라 폰 테스트를 거쳐 인식률을 검증합니다.",
    ],
    howToVerify:
      '디자인 적용 후에는 반드시 \'카메라 폰 실기 테스트\'를 거쳐야 합니다. 미리보기 화면에서 잘 보이는 것과 실제 카메라가 모듈 경계를 분리해 읽는 것은 다른 문제이기 때문입니다. 본인 휴대폰 외에 다른 OS(iOS/Android) 한 대를 더 확보해 동일 QR을 스캔하고, 의도한 페이지로 100% 이동하는지 두 차례 이상 확인하세요. 인쇄 전 PDF 시안 단계에서 한 번, 인쇄 후 종이 시안 단계에서 한 번 검증하는 것이 안전합니다.',
    caveats: [
      '로고 비율이 QR 전체의 30%를 초과하면 H 레벨 오류정정으로도 복구가 어려워 인식 실패율이 급격히 올라갑니다. 본 도구는 20% 이내로 자동 제한합니다.',
      '연한 파스텔 톤끼리의 조합(예: 연베이지 배경 × 라이트브라운 모듈)은 카메라 노출에 따라 경계가 사라져 스캔 실패를 유발합니다. 디자인 미감과 인식률의 균형점을 찾기 위해 최소 대비비 4.5:1을 권장합니다.',
    ],
    privacyDisclaimer:
      '입력한 URL·텍스트, 업로드한 로고 이미지는 모두 사용자 브라우저 안에서만 처리됩니다. 본 도구는 어떠한 서버에도 입력 데이터를 전송하지 않고, 로고 이미지 역시 메모리 안에서 캔버스에 합성된 뒤 즉시 폐기됩니다. 기업 BI·CI 가이드의 비공개 로고 시안도 안심하고 사용할 수 있습니다.',
    faqList: [
      {
        q: '로고를 넣었더니 일부 카메라에서 스캔이 안 됩니다. 왜 그런가요?',
        a: '로고 영역이 QR의 데이터 모듈을 덮으면서 오류정정 능력을 초과한 것입니다. 해결법은 (1) 로고 크기를 더 줄이거나, (2) 오류정정 레벨을 H로 올리거나, (3) 로고 주변에 흰 여백 라운드를 두어 손상 모듈 수를 줄이는 것입니다. 본 도구는 기본적으로 H 레벨(30% 복구) 방식으로 인코딩하지만, 그래도 로고가 너무 크면 한계를 넘습니다.',
      },
      {
        q: 'PNG와 SVG 중 어느 것을 내려받아야 하나요?',
        a: '온라인 화면 노출(웹 페이지, 인스타그램, 카카오톡 공유 등)이 목적이라면 PNG가 가볍고 표준 호환이 좋습니다. 반면 옥외 광고·현수막·대형 인쇄물 등 무손실 확대가 필요한 인쇄 용도에는 SVG를 권장합니다. SVG는 벡터 기반이라 100배 확대해도 모듈 경계가 흐려지지 않습니다.',
      },
      {
        q: '동일한 텍스트를 입력해도 매번 QR 모양이 조금씩 다른 이유는?',
        a: 'QR 표준은 오류정정 코드 배치를 위해 \'마스킹 패턴\'을 8가지 중 자동 선택합니다. 입력 텍스트, 사이즈, 오류정정 레벨 조합에 따라 최적의 마스킹 패턴이 달라지므로 모듈 배치가 미세하게 바뀌어 보일 수 있습니다. 내용물(인코딩된 데이터)은 동일하므로 스캔 결과는 정확히 같습니다.',
      },
    ],
    relatedTools: [
      { name: 'URL QR 만들기', path: '/qr/url-qr', icon: 'LinkIcon' },
      { name: '와이파이 QR', path: '/qr/wifi-qr', icon: 'Wifi' },
      { name: '이미지 QR 판독', path: '/qr/qr-reader', icon: 'ScanLine' },
    ],
  },

  'qr-reader': {
    neededWhen: [
      '카메라로 직접 스캔할 수 없는 PC 화면 캡처 속 QR을 데스크톱에서 빠르게 해독해야 할 때',
      '인쇄물에 박힌 QR이 어디로 연결되는지 인쇄소·디자이너가 사전 검수해야 할 때',
      '오래된 사진·스캔 문서 안에 들어 있는 QR이 어떤 정보(연락처·Wi-Fi·URL)였는지 확인하고 싶을 때',
      '의심스러운 메시지에 첨부된 QR 이미지가 피싱 사이트로 유도하지 않는지 안전 검증할 때',
      '캠페인 운영 중 다양한 인쇄 시안에 박힌 QR이 모두 동일한 URL로 정확히 인코딩됐는지 자동 확인할 때',
    ],
    howToUse: [
      '판독할 QR이 담긴 이미지 파일(PNG·JPG·WebP)을 드래그앤드롭하거나 파일 선택 버튼으로 업로드합니다.',
      'QR이 화면에 등장하는 위치가 명확하다면 별도 조작 없이 자동 인식이 즉시 시작됩니다.',
      '인식 결과가 URL이면 즉시 클릭 가능한 링크 형태로, 텍스트면 복사 가능한 코드 블록으로, vCard면 구조화된 연락처 카드로 표시됩니다.',
      'URL의 경우 직접 이동하지 말고 도메인을 먼저 확인하는 것을 습관화하세요. 본 도구는 도메인 호스트만 강조 표시하는 안전 검증 UI를 제공합니다.',
      '결과 텍스트를 클립보드로 복사하거나, 필요하다면 \'QR 디자인\' 도구로 동일 내용을 다시 생성해 원본 QR을 검증·재제작할 수 있습니다.',
    ],
    howToVerify:
      '판독 결과가 출력된 후, 본인이 직접 휴대폰 카메라로 동일한 QR을 스캔해 두 결과(브라우저 판독 결과 vs 카메라 결과)가 일치하는지 교차 검증하면 가장 확실합니다. 만약 두 결과가 다르면 이미지 압축에 의한 모듈 손상, 또는 QR이 인쇄 단계에서 일부 잘림 등의 가능성이 있으므로 원본 파일 또는 인쇄물을 점검해야 합니다.',
    caveats: [
      '저해상도 사진이나 너무 멀리서 찍은 QR은 모듈 경계가 흐려져 판독에 실패할 수 있습니다. 가능하면 가로 200px 이상의 선명한 사진을 사용하세요.',
      '심하게 기울어지거나 카메라 광원이 반사된 QR은 본 도구의 자동 보정 한계를 초과할 수 있습니다. 그런 경우 이미지 편집기에서 명도·기울기를 보정한 뒤 다시 업로드해 보세요.',
    ],
    privacyDisclaimer:
      '업로드한 QR 이미지는 단 한 번도 외부 서버에 전송되지 않고, 사용자 브라우저 안의 Canvas 디코더 라이브러리(jsQR)가 픽셀 데이터를 직접 분석합니다. 결과 또한 본인 브라우저에서만 표시되며, 탭을 닫는 즉시 메모리에서 휘발됩니다. 거래 영수증·내부 결재 문서·민감 계정 정보가 포함된 QR도 안심하고 판독할 수 있습니다.',
    faqList: [
      {
        q: 'PDF 안에 들어 있는 QR도 바로 판독할 수 있나요?',
        a: '본 도구는 이미지 파일(PNG·JPG·WebP)을 입력으로 받습니다. PDF 안의 QR은 먼저 화면 캡처 도구나 PDF 뷰어의 \'이미지로 내보내기\' 기능으로 PNG로 추출한 뒤 업로드하시면 됩니다.',
      },
      {
        q: '여러 개의 QR이 한 이미지에 있을 때도 모두 인식되나요?',
        a: '현재 본 도구는 한 이미지 당 가장 또렷하게 보이는 QR 1개를 우선 판독합니다. 다수의 QR을 동시에 판독해야 한다면, 이미지를 각 QR이 한 장씩 들어가도록 잘라낸 뒤 차례로 업로드하는 것을 권장합니다.',
      },
      {
        q: '판독 결과가 URL일 때 바로 클릭해도 안전한가요?',
        a: '본 도구는 URL을 자동 이동시키지 않고, 도메인 호스트(예: `example.com`)를 강조 표시하여 사용자가 한 번 더 신뢰성을 검토한 후 클릭하도록 설계되어 있습니다. 모르는 단축 URL(bit.ly, t.ly 등)은 한 번 더 도메인 확장 도구로 최종 목적지를 확인한 뒤 접속하는 것이 안전합니다.',
      },
    ],
    relatedTools: [
      { name: 'URL QR 만들기', path: '/qr/url-qr', icon: 'LinkIcon' },
      { name: '와이파이 QR', path: '/qr/wifi-qr', icon: 'Wifi' },
      { name: 'QR 디자인 (로고)', path: '/qr/qr-design', icon: 'Palette' },
    ],
  },
};

const iconMap: Record<string, React.ElementType> = {
  Wifi,
  LinkIcon,
  Contact,
  Palette,
  ScanLine,
};

interface QrSeoProps {
  toolId: QrSeoToolId;
}

export const QrSeo: React.FC<QrSeoProps> = ({ toolId }) => {
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
      id="qr-seo-comprehensive-block"
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
          관련 QR 도구 추천
        </h4>
        <div className="grid sm:grid-cols-3 gap-3">
          {relatedTools.map((tool, idx) => {
            const Icon = iconMap[tool.icon] || LinkIcon;
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
};

export default QrSeo;
