import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import { AdSlot } from '../common/AdSlot';

export type BusinessSeoToolId =
  | 'vat'
  | 'supply'
  | 'freelancer'
  | 'quote'
  | 'margin'
  | 'home';

interface BusinessSeoProps {
  toolId: BusinessSeoToolId;
}

interface ContentEntry {
  title: string;
  paragraphs: string[];
  faqs: { q: string; a: string }[];
}

const contentMap: Record<BusinessSeoToolId, ContentEntry> = {
  home: {
    title:
      '사장님 계산기: 소상공인, 프리랜서, 1인 기업 필수 금융 간편 계산기',
    paragraphs: [
      '소상공인, 온라인 쇼핑몰 판매자, 1인 창조기업 및 프리랜서들은 비즈니스를 운영하며 매일 수많은 돈 계산에 직면합니다. 공급가액과 부가세를 구분하여 견적을 내거나, 사업소득 원천징수 3.3%를 공제한 정확한 실수령액을 파악하거나, 사장에 맞는 유효 마진을 산출하기란 늘 번거롭고 실수하기 쉽습니다.',
      '사장님 계산기은 이러한 업무상 병목을 완전히 해결합니다. 한 화면에서 부가세 계산, 공급가액 역산, 3.3% 원천세, 견적서 산출, 최적의 판매 마진율까지 원스톱으로 처리할 수 있는 반응형 웹 금융 도구 세트입니다. 데이터는 그 어떤 외부 백엔드 서버나 클라우드로 전송되지 않으므로, 중요한 사업 기밀 및 견적금액 유출 우려 없이 브라우저 단독으로 완전하고 안전한 프라이버시 환경에서 안심하고 계산할 수 있습니다.',
    ],
    faqs: [
      {
        q: '사장님 계산기의 모든 기능은 무료인가요?',
        a: '네, 그렇습니다. 본 사이트는 회원가입이나 로그인 과정을 요구하지 않고 전 과정을 조건 없이 100% 무료로 개방하고 있습니다. 소액 계산부터 대규모 기업 견적서 조율까지 제약 없이 이용해 주시기 바랍니다.',
      },
      {
        q: '입력한 계산 내역이 서버에 기록에 남거나 탈취될 위험은 없나요?',
        a: '절대 없습니다. 본 서비스는 순수한 클라이언트 기반 단독 자바스크립트로 계산을 처리합니다. 입력한 거래 대금이나 마진율, 개인 계약액 정보 등은 브라우저 새로고침이나 탭을 끄는 즉시 소멸하며 어떠한 로그도 기록되지 않아 완벽한 익명성과 보안을 제공합니다.',
      },
      {
        q: 'Google AdSense 광고가 적재되는 이유는 무엇인가요?',
        a: '본 서비스가 완전 무료로 지속 가능하게 서빙될 수 있도록 최소한의 AdSense 광고 지면을 할당하고 있습니다. 계산 결과값 및 핵심 입력 버튼들과 오클릭하지 않도록 가독성 높은 격리 구조로 설계하였으니 안심하고 보실 수 있습니다.',
      },
    ],
  },
  vat: {
    title: '부가세 계산기 상세 가이드',
    paragraphs: [
      '# 1. 이 도구가 필요한 경우',
      '* 공급가액 기준 부가세(10%)를 별도로 계산해야 할 때',
      '* 세금계산서의 공급가액과 부가가치세를 나누어 적어야 할 때',
      '* 부가세 포함 이전의 순수 물건 값에 세율을 적용하고 싶을 때',
      '* 세무 신고나 매출 결산 시 공급액을 확인할 때',
      '# 2. 사용 방법',
      '공급가액 입력 칸에 원 단위 금액을 입력해주세요. 부가세율을 10% 기본세율 외에 다른 수치로 적용하길 원하신다면 "직접 입력" 버턴을 누르고 원하는 퍼센트(%) 단위를 적어주세요. 이후 "계산하기"를 누르면 결과 명세가 나옵니다.',
      '# 3. 계산식 설명',
      '부가세액 = 공급가액 × 부가세율 (예: 10% 세율의 경우 공급가액 × 0.1)\n합계금액 = 공급가액 + 부가세액',
      '# 4. 결과 확인 방법',
      '우측 또는 하단에 노출되는 부가세 대조 결과 명세표에서 입력된 공급가액, 선택된 부가세율, 산출된 부가세, 그리고 최종 합산액(합계금액)을 볼 수 있습니다. "계산 결과 전체 복사하기"를 눌러 즉시 클립보드에 담을 수 있습니다.',
      '# 5. 주의사항',
      '부가세 계산기는 간편 계산을 위한 참고용 모의 연산기입니다. 실제 국세청 세금계산서 발행 시 원 단위 이하 절사나 반올림의 처리 및 기업 과세구분 형태(일반, 간이, 영세, 면세)에 맞춰 최종 수치를 다시 비교하는 것을 권장합니다.',
      '# 6. 입력값 저장 없음 안내',
      '입력하신 대금 정보는 이용자의 웹 브라우저 메모리 안에서만 일회성 계산으로 활용되며, 그 어떠한 데이터도 서버로 전송되거나 저장되지 않으므로 안심하고 마음껏 기입하셔도 좋습니다.',
    ],
    faqs: [
      {
        q: '간이과세자도 이 부가세 계산기를 사용하나요?',
        a: '간이과세자는 실제 세액 납부 계산 시 업종별 부가가치율을 타지만, 거래처와 견적을 주고받거나 단가를 가르는 기준표(일반 과세 10% 기준)를 계산하기 위해서는 본 계산기가 매우 활발히 이용됩니다.',
      },
      {
        q: '소수점 올림이나 내림 규칙은 어떻게 되나요?',
        a: '이 계산기는 통용되는 세무 원칙에 맞춰 결과값을 원 단위로 올바르게 절삭/보정하여 출력합니다.',
      },
    ],
  },
  supply: {
    title: '공급가액 역산 계산기 상세 가이드',
    paragraphs: [
      '# 1. 이 도구가 필요한 경우',
      '* 부가세가 포함된 전체 결제액(합계금액)에서 순수 원가를 발라내야 할 때',
      '* 세금계산서 발행을 위해 합계액을 공급가액과 부가세로 나누어 기재해야 할 때',
      '* 플랫폼 정산액이나 소매가에서 실제 공급 매출액을 확인하고 싶을 때',
      '# 2. 사용 방법',
      '부가세가 징수 포함되어 수령된 최종 합계금액을 입력해주세요. 부가세율(기본 10% 또는 직접 입력)을 설정한 뒤 "계산하기" 버튼을 클릭하면, 합계금액에서 공급가액과 부가세를 정확하게 정량 역산해 줍니다.',
      '# 3. 계산식 설명',
      '공급가액 = 합계금액 / (1 + 부가세율) (예: 10% 세율 기준 1.1로 나누기)\n부가세액 = 합계금액 - 공급가액',
      '# 4. 결과 확인 방법',
      '상세 결과 카드에서 나뉘어진 공급가액, 부가세와 합계금액을 한눈에 보고 복사할 수 있으며, 하단 연산 산식을 통해 역산 도정이 어떻게 계산되었는지 상세 연산을 공람할 수 있습니다.',
      '# 5. 주의사항',
      '원 미만의 단수가 발생하는 경우 국세청 영수증이나 세금계산서 발행 시스템에 따라 반올림 또는 절사 편차가 단수 원 단위로 발생할 수 있으므로 최종 확정 전에 체크하십시오.',
      '# 6. 입력값 저장 없음 안내',
      '입력값은 절대 서버로 전송되지 않고 개인 화면 브라우저 내에서 자바스크립트로 즉각 소멸 처리되어 안전을 보장합니다.',
    ],
    faqs: [
      {
        q: '역산 공급가액과 부가세를 더했을 때 원래 합계액과 1원 차이가 나면 어떻게 하나요?',
        a: '소수점 절사 처리 방식 때문에 드물게 1원 편차가 일어날 수 있습니다. 통상 공급가액에 1원을 더하거나 부가세액 쪽을 조절하여 합계와 일치시키는 것이 실무 규칙입니다.',
      },
    ],
  },
  freelancer: {
    title: '프리랜서 3.3% 계산기 상세 가이드',
    paragraphs: [
      '# 1. 이 도구가 필요한 경우',
      '* 외주 계약금액의 실수령액을 확인할 때',
      '* 원천징수 후 입금액을 계산할 때',
      '* 강의료, 원고료, 용역비 입금액을 확인할 때',
      '* 계약서에 적힌 금액과 실제 입금액을 비교할 때',
      '# 2. 사용 방법',
      '계약금액(세전 세액이 부여되기 전 계약 금액)을 기입한 뒤 기본세율(3.3%) 또는 직접 기입할 기타 원천세율을 선택/입력합니다. "계산하기" 버튼을 누르시면 공제액 합과 통장 입금액이 정량 산출됩니다.',
      '# 3. 계산식 설명',
      '원천징수세액 = 계약금액 × 원천세율 (3.3% 기준 = 사업소득세 3% + 지방소득세 0.3%)\n실수령액 = 계약금액 - 원천징수세액',
      '# 4. 결과 확인 방법',
      '상세 확인서 영역을 통해 계약금액, 지정 세율, 공제되는 세금 총량, 통장 실수령액을 확인할 수 있으며, 계산 과정을 논리 원 단위로 식별할 수 있습니다.',
      '# 5. 주의사항',
      '원천징수 3.3%는 소득세의 선납이며, 이듬해 5월 진행되는 종합소득세 신고 시 본인의 총 소득 및 필요경비 조율 양태에 따라 세금을 추가 납부하거나 환급받게 됩니다.',
      '# 6. 입력값 저장 없음 안내',
      '해당 데이터는 로컬 브라우저 세션 내부에서만 휘발 처리되므로 세무 기록이나 신상 유출에 대한 위기가 전혀 우려되지 않습니다.',
    ],
    faqs: [
      {
        q: '지방소득세는 사업소득세와 항상 함께 나오나요?',
        a: '네, 원천세 고지 시 사업소득세(국세 3.0%)의 정확히 10%에 해당하는 지방소득세(지방세 0.3%)가 병합 부과되어 세트인 3.3%가 원칙으로 적용됩니다.',
      },
    ],
  },
  quote: {
    title: '견적서 금액 나누기 상세 가이드',
    paragraphs: [
      '# 1. 이 도구가 필요한 경우',
      '* 총 견적금액을 공급가액과 부가세로 나눌 때',
      '* 거래처에 부가세 포함 금액을 안내할 때',
      '* 견적서에 공급가액, 부가세, 합계금액을 적어야 할 때',
      '* 세금계산서 발행 전 금액을 확인할 때',
      '# 2. 사용 방법',
      '총액에서 나누기 또는 공급가액에서 합해 만들기 중 원하시는 계산 모드를 선택합니다. 이후 기준 금액과 부가세 비율을 올바르게 기입하고 계산하기를 터치하면 견적 표 항목 분리가 끝납니다.',
      '# 3. 계산식 설명',
      '총액 배분 시: 공급가액 = 합계금액 / (1 + 부가세율), 부가세액 = 합계금액 - 공급가액\n공급가액 기준 시: 부가세액 = 공급가액 × 부가세율, 합계금액 = 공급가액 + 부가세액',
      '# 4. 결과 확인 방법',
      '결과 카드의 세액 명서와 연산 산식을 검토하신 뒤 "결과 복사" 기능을 활용해 실무 견적서 품목 작성표에 정확하게 대조 기입할 수 있습니다.',
      '# 5. 주의사항',
      '견적서의 항목 합산액과 실제 세금계산서 발행액의 세법 원 단위 절사 편차에 대비하여 계약 수립 전 상호 정합을 보정하는 것이 지혜롭습니다.',
      '# 6. 입력값 저장 없음 안내',
      '서버를 거치지 않고 로컬 자바스크립트로 연산되는 클라이언트 계산 방식으로 안전하게 비밀이 보호됩니다.',
    ],
    faqs: [
      {
        q: '견적서에 부가세 별도라고 적혀있으면 어떻게 계산하나요?',
        a: '모드 중에서 "공급가액에서 합계금액 계산하기"를 사용하여 공급가액란에 물건 가격을 적고, 합산 총액을 도출해 작성하시면 편리합니다.',
      },
    ],
  },
  margin: {
    title: '마진율 계산기 상세 가이드',
    paragraphs: [
      '# 1. 이 도구가 필요한 경우',
      '* 상품 판매가를 정할 때',
      '* 매입가 대비 수익을 확인할 때',
      '* 스마트스토어, 쿠팡, 자사몰 판매 마진을 계산할 때',
      '* 배송비, 수수료, 광고비를 포함한 실제 수익을 확인할 때',
      '* 가격 인상이나 할인 전 수익률을 비교할 때',
      '# 2. 사용 방법',
      '희망 판매가와 사입 매입 원물 가격을 기입하세요. 플랫폼 수수료나 부자재 비용이 있으시다면 "기타 비용" 란에 전부 병합하여 기재해 마진 왜곡을 완벽히 해결한 뒤 "계산하기"를 수행합니다.',
      '# 3. 계산식 설명',
      '총비용 = 매입가 + 기타 비용\n마진액 = 판매가 - 총비용\n마진율 = 마진액 / 판매가 × 100\n원가율 = 총비용 / 판매가 × 100',
      '# 4. 결과 확인 방법',
      '판매, 사입, 기타비용, 마진액과 실효 마진율 및 수치 대조 확인 결과를 모니터할 수 있으며, 이와 연동된 임계 경보 Verdict로 비용 구조의 건강성을 자가 진단할 수 있습니다.',
      '# 5. 주의사항',
      '판매 채널마다 정산 주기, 정산 기준(배송비 수수료 부과 여부 등)과 세무 부가세 공제 시점이 다르므로, 해당 마진 결과는 사업 시뮬레이션용 참고 수치로 안전하게 판단해 주십시오.',
      '# 6. 입력값 저장 없음 안내',
      '사입 원가 및 고부가가치 기밀 판매 마진 구조의 누출 리스크가 불가능하도록 순수 기기 내 연산 전용으로만 가공됩니다.',
    ],
    faqs: [
      {
        q: '마진율과 마크업률은 어떻게 다릅니까?',
        a: '마진율은 판매 금액(매출액)에서 마진액이 차지하는 비율이고, 마크업률(ROI 등)은 사입한 원가 대비 얼마의 이윤을 얹었는지의 비율로 서로 다릅니다. 이 계산기는 판매가 기준 실효 마진율을 올바르게 구합니다.',
      },
    ],
  },
};

const relatedByTool: Record<BusinessSeoToolId, { name: string; path: string }[]> = {
  home: [],
  vat: [
    { name: '공급가액 역산 계산기', path: '/business/supply-price' },
    { name: '견적서 금액 나누기', path: '/business/quote-split' },
    { name: '마진율 계산기', path: '/business/margin-calculator' },
  ],
  supply: [
    { name: '부가세 계산기', path: '/business/vat-calculator' },
    { name: '견적서 금액 나누기', path: '/business/quote-split' },
  ],
  freelancer: [
    { name: '견적서 금액 나누기', path: '/business/quote-split' },
    { name: '부가세 계산기', path: '/business/vat-calculator' },
  ],
  quote: [
    { name: '부가세 계산기', path: '/business/vat-calculator' },
    { name: '공급가액 역산 계산기', path: '/business/supply-price' },
    { name: '프리랜서 3.3% 계산기', path: '/business/freelancer-tax' },
  ],
  margin: [
    { name: '부가세 계산기', path: '/business/vat-calculator' },
    { name: '견적서 금액 나누기', path: '/business/quote-split' },
  ],
};

export const BusinessSeo: React.FC<BusinessSeoProps> = ({ toolId }) => {
  const selected = contentMap[toolId] || contentMap.home;
  const relatedTools = relatedByTool[toolId] || [];

  return (
    <div
      id={`seo-section-${toolId}`}
      className="mt-12 bg-white rounded-xl border border-slate-200 p-6 md:p-8 space-y-8 font-sans scroll-mt-6 text-left"
    >
      <div className="space-y-4">
        <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#0F172A] flex-shrink-0" />
          {selected.title}
        </h2>
        <div className="space-y-4">
          {selected.paragraphs.map((p, idx) => {
            if (p.startsWith('* ')) {
              return (
                <div
                  key={idx}
                  className="flex items-start text-xs text-slate-600 leading-relaxed font-semibold pl-4"
                >
                  <span className="mr-2 text-indigo-600 font-extrabold">•</span>
                  <span>{p.slice(2)}</span>
                </div>
              );
            }
            if (p.startsWith('# ')) {
              return (
                <h3
                  key={idx}
                  className="text-sm font-bold text-slate-900 mt-6 mb-2 border-l-4 border-indigo-500 pl-2"
                >
                  {p.slice(2)}
                </h3>
              );
            }
            return (
              <p
                key={idx}
                className="text-slate-605 text-xs md:text-sm leading-relaxed text-justify whitespace-pre-line font-medium"
              >
                {p}
              </p>
            );
          })}
        </div>
      </div>

      <div className="py-2">
        <AdSlot type="responsive" label="광고" id={`seo-mid-ad-${toolId}`} />
      </div>

      <hr className="border-slate-100" />

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <FileText className="w-4.5 h-4.5 text-[#0F172A]" />
          자주 묻는 질문 (FAQ)
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {selected.faqs.map((faq, idx) => (
            <div
              key={idx}
              id={`faq-${toolId}-${idx}`}
              className="bg-slate-50/50 hover:bg-slate-50 p-4 rounded-lg border border-slate-150 transition-colors"
            >
              <h4 className="text-xs md:text-sm font-bold text-slate-950 flex items-start gap-1">
                <span className="text-blue-700 font-extrabold text-xs md:text-sm">Q.</span>
                <span>{faq.q}</span>
              </h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed font-semibold pl-4 border-l border-slate-300">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {relatedTools.length > 0 && (
        <>
          <hr className="border-slate-100" />
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              함께 활용하면 유용한 관련 계산 도구 추천
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {relatedTools.map((tool, idx) => (
                <Link
                  key={idx}
                  to={tool.path}
                  className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-350 border border-slate-200 rounded-xl transition-all group"
                >
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">
                    {tool.name}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="bg-emerald-50/40 rounded-lg p-4 border border-emerald-150 flex items-start gap-2.5">
        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
        <span className="text-xs text-slate-650 leading-relaxed font-semibold">
          본 계산물은 일련의 모든 거래 기밀 보안을 최고의 가치로 규정하여, 사용자가
          입력한 어떤 사업 가액이나 마진 수치도 클라우드 저장 장치를 일절 경유하지 않는
          완벽한 기기 로컬 처리 계산 방식으로 구현되었습니다.
        </span>
      </div>
    </div>
  );
};

export default BusinessSeo;
