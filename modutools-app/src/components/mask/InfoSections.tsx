import { HelpCircle, ShieldAlert, FileText, Lock } from 'lucide-react';

export default function InfoSections() {
  const cases = [
    '계약서 공유 전 (거래 정보 보호)',
    '사업자등록증 제출 전 (대표자 주민번호 및 세부 정보 보호)',
    '통장사본 제출 전 (계좌번호 및 예금주 외 민감 정보 보호)',
    '이력서 및 증빙서류 제출 전 (휴대전화 번호, 이메일, 생년월일 등)',
    '견적서나 신청서 외부 공유 전 (수량, 금액, 개인 정보 보호)',
  ];

  const targets = [
    '주민등록번호 및 외국인등록번호 (가장 민감)',
    '계좌번호 및 신용카드 번호 등의 금융 정보',
    '개인 연락처 (전화번호 및 이메일)',
    '세부 상세 주소 및 메인 주소 일부분',
    '자유 서명, 전자 서명 및 인감도장 날인부',
    '사업자 등록번호의 세부 단락 및 법인등록번호',
    '이력서 내부의 증명사진 일부 혹은 가구원 이름',
  ];

  const warnings = [
    '마스킹할 영역을 반드시 화면에서 하나하나 신중하게 검토하고 적용하세요.',
    '다운로드한 마스킹 PDF를 PDF 뷰어로 직접 열어서 검은 박스가 올바른 자리에 입혀졌는지 최종 재확인하세요.',
    '안심마스킹은 원본 파일을 절대 저장하거나 클라우드에 백업하지 않으므로, 원래의 파일을 수정한 후에도 본인 기기의 원본 파일을 그대로 소장 및 보관하셔야 합니다.',
  ];

  const faqs = [
    {
      q: '제 PDF가 서버에 업로드되나요?',
      a: '아니요. 안심마스킹은 어떠한 경우에도 사용자의 PDF 파일을 서버에 전송하지 않습니다. 업로드 UI는 브라우저 메모리에 로드하기 위한 도구일 뿐이며, 모든 원본 렌더링 및 검정 박스 결합(pdf-lib)은 전적으로 100% 사용자의 개인 기기(PC/모바일 브라우저) 내부에서 로컬로 진행됩니다.',
    },
    {
      q: '작업한 문서를 추후 복구하거나 저장해주나요?',
      a: '아니요. 데이터 프라이버시 보호를 위해 어떠한 클라우드 백업이나 임시 저장을 지원하지 않습니다. 브라우저 페이지를 새로고침하거나 종료하는 즉시 작업 중이던 마스킹 데이터와 메모리상의 문서는 완전히 증발합니다.',
    },
    {
      q: '이 서비스를 완전히 무료로 제한 없이 쓸 수 있나요?',
      a: '네. 회원가입이나 요금 지불, 광고 노출 없이 영구히 무제한으로 사용하실 수 있는 무료 공공형 문서 보안 도구입니다.',
    },
    {
      q: '모바일이나 태블릿 기기에서도 작동하나요?',
      a: '예, 작동합니다. 다만, 드래그 앤 드롭을 통한 미세한 픽셀 마스킹 사각형 지정 작업의 특성상 화면이 넓은 PC 환경에서 마우스나 트랙패드를 사용하여 정밀하고 완벽하게 마스킹하는 것을 권장해 드립니다.',
    },
    {
      q: 'AI가 개인정보 영역을 자동으로 분석하고 가려주나요?',
      a: '현재 버전은 사용자가 직접 마스킹 영역을 선택하는 "수동 마스킹" 방식입니다. AI 자동 인식을 통한 마스킹은 미세한 개인정보 누락을 발생시킬 우려가 있으므로, 사용자가 직접 눈으로 보면서 직관적으로 가리는 이 수동 마스킹 방식이 가장 안전하고 확실합니다.',
    },
  ];

  return (
    <div id="info-sections-container" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          id="info-case-section"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md duration-200"
        >
          <div className="flex items-center gap-2.5 mb-4 text-emerald-600 font-bold text-sm">
            <FileText className="w-5 h-5" />
            <h3 className="font-extrabold text-slate-800">문서 마스킹이 필요한 대표 사례</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-500">
            {cases.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold shrink-0">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          id="info-target-section"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md duration-200"
        >
          <div className="flex items-center gap-2.5 mb-4 text-slate-800 font-bold text-sm">
            <Lock className="w-5 h-5 text-indigo-500" />
            <h3 className="font-extrabold text-slate-800">반드시 가려야 할 주요 민감 정보</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-500">
            {targets.map((t, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold shrink-0">•</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          id="info-warning-section"
          className="bg-amber-50/40 p-6 rounded-2xl border border-amber-200/80 shadow-sm transition-all hover:shadow-md duration-200"
        >
          <div className="flex items-center gap-2.5 mb-4 text-amber-700 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 animate-pulse text-amber-600" />
            <h3 className="font-extrabold text-amber-800">안전한 사용을 위한 주의사항</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-amber-800/80">
            {warnings.map((w, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold shrink-0">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        id="faq-section"
        className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl"
      >
        <div className="flex items-center gap-2.5 mb-6 text-white font-extrabold text-base border-b border-slate-800 pb-4">
          <HelpCircle className="w-6 h-6 text-emerald-400" />
          <h2>자주 묻는 질문 (FAQ)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, i) => (
            <div
              id={`faq-item-${i}`}
              key={i}
              className="space-y-2 bg-slate-800/60 p-5 rounded-2xl border border-slate-800 hover:border-slate-700/80 transition-all"
            >
              <h4 className="text-white font-bold text-sm flex gap-1.5 items-start">
                <span className="text-emerald-400 font-extrabold text-base">Q.</span>
                <span className="mt-0.5">{faq.q}</span>
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed pl-5">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
