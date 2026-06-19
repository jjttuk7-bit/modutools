export interface ToolGuide {
  when: string;
  example: string;
  beforeUse: string;
  relatedToolIds: string[];
}

export const toolGuides: Record<string, ToolGuide> = {
  'vat-calculator': {
    when:
      '세금계산서 발행 전 공급가액, 부가세, 합계금액을 빠르게 맞춰야 할 때 사용합니다. 견적서와 실제 입금액이 서로 다르게 적히지 않도록 금액 구조를 먼저 확인하는 용도에 알맞습니다.',
    example:
      '공급가 100,000원짜리 작업을 안내해야 한다면 부가세 10,000원과 합계 110,000원을 바로 확인해 거래처에 전달할 수 있습니다.',
    beforeUse:
      '면세 품목, 간이과세, 업종별 예외가 있는 경우에는 실제 세무 처리 전에 전문가 확인이 필요합니다.',
    relatedToolIds: ['supply-price', 'quote-split', 'margin-calculator'],
  },
  'supply-price': {
    when:
      '이미 합계금액만 정해져 있고 그 안에서 공급가액과 부가세를 분리해야 할 때 씁니다. 거래처가 “총액 기준”으로 금액을 알려줬을 때 특히 편합니다.',
    example:
      '총 330,000원으로 결제된 건이라면 공급가액 300,000원과 부가세 30,000원을 나눠 장부나 견적서에 옮길 수 있습니다.',
    beforeUse:
      '반올림 처리 방식에 따라 1원 차이가 생길 수 있으니 최종 문서에는 회사의 회계 기준을 따르는 것이 좋습니다.',
    relatedToolIds: ['vat-calculator', 'quote-split'],
  },
  'freelancer-tax': {
    when:
      '프리랜서 사업소득에서 3.3% 원천징수 전 금액과 실수령액을 비교해야 할 때 사용합니다. 외주비를 제안하거나 입금액을 검산할 때 유용합니다.',
    example:
      '계약 금액이 1,000,000원이라면 원천징수액과 실제 입금 예상액을 바로 확인해 정산 안내에 활용할 수 있습니다.',
    beforeUse:
      '근로소득, 기타소득, 사업소득 구분에 따라 적용 방식이 달라질 수 있으므로 계약 형태를 먼저 확인하세요.',
    relatedToolIds: ['quote-split', 'vat-calculator'],
  },
  'quote-split': {
    when:
      '총 예산을 여러 항목으로 나누거나, 부가세 포함 총액을 기준으로 견적서 항목을 정리해야 할 때 사용합니다.',
    example:
      '프로젝트 예산 2,200,000원을 디자인, 개발, 운영 항목으로 나눠 적을 때 각 항목의 공급가와 부가세를 함께 확인할 수 있습니다.',
    beforeUse:
      '실제 계약서에는 작업 범위, 납기, 수정 횟수처럼 금액 외 조건도 함께 명시하는 것이 안전합니다.',
    relatedToolIds: ['vat-calculator', 'supply-price', 'margin-calculator'],
  },
  'margin-calculator': {
    when:
      '상품의 매입가와 판매가를 기준으로 마진율, 이익금, ROI를 빠르게 확인해야 할 때 사용합니다. 스마트스토어, 위탁판매, 소규모 유통 관리에 어울립니다.',
    example:
      '매입가 12,000원, 판매가 18,000원인 상품의 예상 이익을 확인해 할인 판매 가능 범위를 가늠할 수 있습니다.',
    beforeUse:
      '택배비, 플랫폼 수수료, 포장비, 광고비가 빠지면 실제 수익이 과대 계산될 수 있으니 부대비용도 함께 검토하세요.',
    relatedToolIds: ['vat-calculator', 'supply-price'],
  },
  'url-qr': {
    when:
      '웹사이트, 신청서, 메뉴판, 지도 링크를 인쇄물이나 안내문에 넣어야 할 때 사용합니다. 긴 주소를 짧고 스캔하기 쉬운 QR로 바꿀 수 있습니다.',
    example:
      '오프라인 행사 포스터에 설문 링크 QR을 넣으면 방문자가 주소를 직접 입력하지 않고 바로 접속할 수 있습니다.',
    beforeUse:
      'QR을 배포하기 전에 휴대폰 카메라로 실제 스캔해 링크가 정확히 열리는지 확인하세요.',
    relatedToolIds: ['qr-design', 'qr-reader'],
  },
  'wifi-qr': {
    when:
      '카페, 사무실, 매장처럼 방문자가 와이파이에 자주 접속하는 공간에서 SSID와 비밀번호 입력을 줄이고 싶을 때 사용합니다.',
    example:
      '매장 계산대 옆에 WiFi QR을 붙여두면 손님이 비밀번호를 묻지 않아도 바로 네트워크 정보를 불러올 수 있습니다.',
    beforeUse:
      '공용 공간에서는 업무용 내부망과 손님용 네트워크를 분리하고, 비밀번호 변경 시 QR도 다시 만들어야 합니다.',
    relatedToolIds: ['qr-design', 'qr-reader'],
  },
  'vcard-qr': {
    when:
      '명함, 브로셔, 전시 부스 안내물에 연락처를 QR로 넣어 상대가 휴대폰 주소록에 바로 저장하게 하고 싶을 때 사용합니다.',
    example:
      '영업 담당자의 이름, 회사명, 전화번호, 이메일을 vCard QR로 만들면 종이 명함보다 저장 과정이 간단해집니다.',
    beforeUse:
      '개인 휴대전화나 이메일을 공개하기 전에는 배포 범위를 먼저 확인하고, 오탈자가 없는지 스캔 테스트를 해보세요.',
    relatedToolIds: ['qr-design', 'url-qr'],
  },
  'qr-reader': {
    when:
      '이미지 파일에 들어 있는 QR 내용이 무엇인지 확인해야 할 때 사용합니다. 캡처 이미지, 전달받은 QR, 오래된 안내물의 링크 점검에 좋습니다.',
    example:
      '거래처가 보낸 QR 이미지가 결제 링크인지, 신청 링크인지 열어보기 전에 내용을 먼저 확인할 수 있습니다.',
    beforeUse:
      '출처가 불명확한 QR은 바로 접속하지 말고 주소를 확인한 뒤 안전하다고 판단될 때만 여세요.',
    relatedToolIds: ['url-qr', 'wifi-qr', 'qr-design'],
  },
  'qr-design': {
    when:
      '기본 흑백 QR보다 브랜드 색상이나 로고가 들어간 QR이 필요할 때 사용합니다. 포스터, POP, 안내 카드처럼 눈에 잘 띄어야 하는 자료에 적합합니다.',
    example:
      '매장 이벤트 페이지 링크를 브랜드 컬러 QR로 만들어 계산대 안내문에 넣으면 일반 URL보다 참여 유도가 쉬워집니다.',
    beforeUse:
      '색 대비가 낮거나 로고가 너무 크면 스캔이 실패할 수 있으니 완성 후 여러 기기에서 테스트하세요.',
    relatedToolIds: ['url-qr', 'qr-reader'],
  },
  'photo-to-pdf': {
    when:
      '휴대폰으로 찍은 서류 사진 여러 장을 한 개의 PDF 제출 파일로 묶어야 할 때 사용합니다. 등본, 영수증, 신청 서류 정리에 자주 쓰입니다.',
    example:
      '사업자등록증, 통장 사본, 신분증 사본을 각각 촬영한 뒤 순서대로 묶어 하나의 PDF로 제출할 수 있습니다.',
    beforeUse:
      '사진 가장자리가 잘렸거나 글자가 흐릿하면 반려될 수 있으니 PDF로 만들기 전에 원본 사진 품질을 확인하세요.',
    relatedToolIds: ['pdf-merge', 'compress', 'pdf-mask'],
  },
  'pdf-merge': {
    when:
      '여러 PDF를 하나의 파일로 합쳐 제출해야 할 때 사용합니다. 공고, 기관 신청, 거래처 요청에서 “PDF 한 파일” 조건이 있을 때 유용합니다.',
    example:
      '견적서, 사업자등록증, 포트폴리오 PDF를 순서대로 합쳐 메일 첨부 파일을 하나로 정리할 수 있습니다.',
    beforeUse:
      '합치기 전에 페이지 순서와 개인정보 포함 여부를 확인하고, 필요한 경우 마스킹을 먼저 처리하세요.',
    relatedToolIds: ['photo-to-pdf', 'pdf-extract', 'pdf-mask'],
  },
  'pdf-extract': {
    when:
      '긴 PDF에서 필요한 페이지만 골라 따로 저장해야 할 때 사용합니다. 계약서 일부, 안내문 일부, 증빙 페이지 분리 작업에 적합합니다.',
    example:
      '20페이지 제안서 중 회사 소개와 견적 페이지만 뽑아 별도 PDF로 보내야 할 때 빠르게 정리할 수 있습니다.',
    beforeUse:
      '페이지 번호를 잘못 고르면 중요한 내용이 빠질 수 있으니 추출 후 새 파일을 한 번 열어 확인하세요.',
    relatedToolIds: ['pdf-merge', 'pdf-mask'],
  },
  'pdf-mask': {
    when:
      'PDF나 이미지 안의 주민등록번호, 계좌번호, 주소, 전화번호처럼 민감한 정보를 가리고 제출해야 할 때 사용합니다.',
    example:
      '지원 서류에 포함된 신분증 사본에서 뒷자리나 주소 일부를 검정 박스로 가린 뒤 새 PDF로 저장할 수 있습니다.',
    beforeUse:
      '마스킹된 파일을 다시 열어 가린 영역이 실제로 보이지 않는지 확인하고, 원본 파일은 별도로 안전하게 보관하세요.',
    relatedToolIds: ['photo-to-pdf', 'pdf-merge', 'pdf-extract'],
  },
  'image-compress': {
    when:
      '기관이나 플랫폼의 업로드 용량 제한에 맞춰 이미지 파일 크기를 줄여야 할 때 사용합니다. 서류 사진, 프로필 이미지, 첨부 자료 압축에 편합니다.',
    example:
      '5MB 이하만 업로드되는 신청 페이지에서 8MB짜리 사진을 제한 안에 맞게 줄일 수 있습니다.',
    beforeUse:
      '너무 강하게 압축하면 글자가 흐려질 수 있으므로 제출용 문서는 압축 후 가독성을 확인하세요.',
    relatedToolIds: ['compress', 'photo-to-pdf', 'store-main-image'],
  },
  'youtube-thumbnail': {
    when:
      '유튜브 영상 주제와 핵심 문구가 한눈에 보이는 16:9 썸네일을 빠르게 만들고 싶을 때 사용합니다.',
    example:
      '강의 영상의 제목, 회차, 강조 문구를 넣어 업로드 전에 채널 톤에 맞는 썸네일 이미지를 만들 수 있습니다.',
    beforeUse:
      '모바일 화면에서는 글자가 작게 보이므로 핵심 문구를 짧게 잡고, 얼굴이나 제품이 너무 가려지지 않게 배치하세요.',
    relatedToolIds: ['text-on-image', 'blog-cover'],
  },
  'blog-cover': {
    when:
      '블로그 글의 대표 이미지가 필요하지만 디자인 툴을 열기 부담스러울 때 사용합니다. 정보성 글, 후기, 공지 글의 첫인상을 정리하기 좋습니다.',
    example:
      '“부가세 계산 방법” 같은 글의 제목과 부제목을 넣어 검색 결과나 공유 화면에 어울리는 커버 이미지를 만들 수 있습니다.',
    beforeUse:
      '본문 제목과 이미지 문구가 서로 다르면 독자가 혼란스러울 수 있으니 같은 메시지로 맞추는 것이 좋습니다.',
    relatedToolIds: ['text-on-image', 'youtube-thumbnail', 'instagram-image'],
  },
  'instagram-image': {
    when:
      '인스타그램 피드용 정사각형 또는 세로형 이미지를 만들 때 사용합니다. 이벤트 공지, 카드뉴스 첫 장, 상품 안내에 적합합니다.',
    example:
      '카페 신메뉴 출시 안내를 4:5 비율 이미지로 만들어 피드에서 더 넓게 보이도록 제작할 수 있습니다.',
    beforeUse:
      '피드 미리보기에서는 중앙부가 먼저 보이므로 중요한 문구와 제품은 가운데에 배치하세요.',
    relatedToolIds: ['text-on-image', 'store-main-image', 'blog-cover'],
  },
  'store-main-image': {
    when:
      '스마트스토어, 오픈마켓, 자사몰 상품 대표이미지를 정리해야 할 때 사용합니다. 제품 사진 위에 과한 장식 없이 핵심 정보만 얹을 때 좋습니다.',
    example:
      '생활용품 판매 페이지에서 제품명, 용량, 주요 특징을 넣은 대표이미지를 만들어 상품 목록에서 잘 보이게 할 수 있습니다.',
    beforeUse:
      '마켓별 이미지 정책과 금지 문구가 다를 수 있으니 업로드 전 플랫폼 가이드를 확인하세요.',
    relatedToolIds: ['compress', 'text-on-image', 'instagram-image'],
  },
  'text-on-image': {
    when:
      '이미 있는 사진 위에 제목, 가격, 안내 문구, 로고를 간단히 합성해야 할 때 사용합니다. 별도 편집 프로그램 없이 빠른 수정에 적합합니다.',
    example:
      '행사 사진 위에 날짜와 장소를 넣어 안내 이미지로 만들거나, 상품 사진에 짧은 프로모션 문구를 얹을 수 있습니다.',
    beforeUse:
      '배경과 글자 대비가 낮으면 읽기 어려우니 어두운 사진에는 밝은 글자, 밝은 사진에는 진한 글자를 선택하세요.',
    relatedToolIds: ['blog-cover', 'instagram-image', 'youtube-thumbnail'],
  },
  'compress': {
    when:
      '채용 사이트, 공공기관, 학교, 쇼핑몰 관리자처럼 이미지 업로드 용량 제한이 있는 곳에 사진을 올려야 할 때 사용합니다. 원본은 유지하고 제출용 사본만 가볍게 만들 수 있습니다.',
    example:
      '3MB짜리 증빙 사진을 500KB 이하 조건에 맞춰 줄인 뒤 신청서 첨부 파일로 올릴 수 있습니다.',
    beforeUse:
      '문서 사진이나 글자가 들어간 이미지는 압축 후 글자와 숫자가 흐려지지 않았는지 미리보기로 확인하세요.',
    relatedToolIds: ['resize', 'jpg-converter', 'photo-to-pdf'],
  },
  'resize': {
    when:
      '가로·세로 픽셀 크기를 특정 규격에 맞춰야 할 때 사용합니다. 프로필 사진, 제출용 이미지, 쇼핑몰 대표 이미지처럼 크기 조건이 정해진 경우에 알맞습니다.',
    example:
      '800x800 픽셀 이미지만 받는 관리자 페이지에 맞춰 상품 사진을 정사각형 크기로 조정할 수 있습니다.',
    beforeUse:
      '비율을 강제로 바꾸면 얼굴이나 제품이 찌그러질 수 있으니 필요한 경우 비율 유지 옵션을 사용하세요.',
    relatedToolIds: ['compress', 'crop-padding', 'store-main-image'],
  },
  'id-photo': {
    when:
      '이력서, 자격증 접수, 학생증, 시험 원서처럼 증명사진 크기와 비율을 맞춰야 할 때 사용합니다. 직접 크롭 위치를 확인하며 제출용 사진을 만들 수 있습니다.',
    example:
      '3.5x4.5cm 규격이 필요한 접수 페이지에 맞춰 얼굴 중심을 조정하고 JPG 파일로 저장할 수 있습니다.',
    beforeUse:
      '기관마다 배경색, 얼굴 크기, 어깨 포함 여부가 다를 수 있으니 최종 제출 전 안내문을 함께 확인하세요.',
    relatedToolIds: ['compress', 'resize', 'jpg-converter'],
  },
  'jpg-converter': {
    when:
      'PNG, WEBP처럼 일부 사이트에서 거부되는 이미지 파일을 JPG로 바꿔야 할 때 사용합니다. 오래된 접수 시스템이나 쇼핑몰 관리자에서 특히 유용합니다.',
    example:
      '휴대폰에서 저장된 WEBP 이미지를 JPG로 변환해 블로그나 공공 포털 첨부 파일로 올릴 수 있습니다.',
    beforeUse:
      'JPG는 투명 배경을 보존하지 못하므로 투명 PNG는 배경색이 어떻게 채워지는지 변환 결과를 확인하세요.',
    relatedToolIds: ['compress', 'resize', 'crop-padding'],
  },
  'crop-padding': {
    when:
      '이미지를 정사각형이나 특정 비율로 자르거나, 잘림 없이 흰 여백을 넣어 규격에 맞춰야 할 때 사용합니다. 상품 사진, 블로그 대표 이미지, 프로필 이미지 정리에 적합합니다.',
    example:
      '세로로 긴 제품 사진을 1:1 대표 이미지로 만들되 제품이 잘리지 않도록 좌우 여백을 추가할 수 있습니다.',
    beforeUse:
      '여백을 넣으면 실제 피사체가 작아 보일 수 있으니 업로드될 화면 크기에서 충분히 잘 보이는지 확인하세요.',
    relatedToolIds: ['resize', 'jpg-converter', 'store-main-image'],
  },
  'remove-duplicates': {
    when:
      '엑셀이나 CSV에서 같은 고객, 같은 주문, 같은 연락처가 여러 번 들어간 행을 정리해야 할 때 사용합니다.',
    example:
      '이벤트 신청자 명단에서 이메일 기준으로 중복 신청을 제거해 실제 발송 대상만 남길 수 있습니다.',
    beforeUse:
      '이름만 기준으로 중복 제거하면 동명이인이 삭제될 수 있으니 전화번호, 이메일, 주문번호처럼 더 확실한 기준을 선택하세요.',
    relatedToolIds: ['phone-cleaner', 'merge-excel', 'split-by-column'],
  },
  'phone-cleaner': {
    when:
      '전화번호 표기가 01012345678, 010-1234-5678, 10-1234-5678처럼 섞여 있을 때 한 가지 형식으로 정리합니다.',
    example:
      '문자 발송 전 고객 명단의 전화번호를 표준 포맷으로 맞춰 발송 실패를 줄일 수 있습니다.',
    beforeUse:
      '해외 번호나 내선 번호가 섞인 파일은 자동 정리 결과가 기대와 다를 수 있으니 미리 일부 행을 확인하세요.',
    relatedToolIds: ['remove-duplicates', 'csv-encoding-fix'],
  },
  'csv-encoding-fix': {
    when:
      'CSV 파일을 열었을 때 한글이 깨져 보이는 경우 인코딩을 바꿔 복구할 때 사용합니다. 쇼핑몰, 관리자 페이지, 회계 프로그램에서 내려받은 파일에 자주 필요합니다.',
    example:
      '고객명이나 주소가 깨진 주문 CSV를 UTF-8 또는 EUC-KR로 다시 저장해 엑셀에서 읽을 수 있게 만들 수 있습니다.',
    beforeUse:
      '복구 후에는 이름, 주소, 상품명처럼 한글 컬럼이 제대로 보이는지 미리보기로 확인하세요.',
    relatedToolIds: ['merge-excel', 'phone-cleaner'],
  },
  'merge-excel': {
    when:
      '여러 지점, 담당자, 기간별로 나뉜 엑셀 또는 CSV를 한 파일로 모아야 할 때 사용합니다.',
    example:
      '월별 주문 파일 12개를 하나로 합쳐 연간 판매 데이터를 한 번에 필터링할 수 있습니다.',
    beforeUse:
      '파일마다 컬럼명이 다르면 합친 뒤 정리가 어려우므로 가능한 같은 양식의 파일끼리 먼저 묶는 것이 좋습니다.',
    relatedToolIds: ['remove-duplicates', 'split-by-column', 'csv-encoding-fix'],
  },
  'split-by-column': {
    when:
      '하나의 엑셀 파일을 지점, 담당자, 지역, 카테고리 같은 기준별로 나눠 전달해야 할 때 사용합니다.',
    example:
      '전체 고객 명단을 담당자 이름 기준으로 나눠 각 담당자에게 자기 고객 파일만 전달할 수 있습니다.',
    beforeUse:
      '분할 기준 컬럼에 빈 값이나 오탈자가 있으면 파일이 예상보다 많이 생길 수 있으니 기준 컬럼을 먼저 정리하세요.',
    relatedToolIds: ['merge-excel', 'remove-duplicates', 'phone-cleaner'],
  },
};
