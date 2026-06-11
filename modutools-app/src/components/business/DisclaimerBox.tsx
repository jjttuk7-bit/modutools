import React from 'react';
import { AlertCircle, ScrollText } from 'lucide-react';
import { Link } from 'react-router-dom';

export type DisclaimerVariant =
  | 'vat'
  | 'supply'
  | 'freelancer'
  | 'quote'
  | 'margin'
  | 'general';

interface DisclaimerBoxProps {
  variant?: DisclaimerVariant;
}

const variantSpecifics: Record<DisclaimerVariant, string> = {
  vat:
    '부가세는 사업자 유형(개인·법인·간이·일반), 면세·과세 구분, 영세율·면세 매출 비중에 따라 실제 적용 세율과 공제 한도가 달라질 수 있습니다. 본 계산기는 일반 과세 사업자의 표준 10%를 기본으로 가정합니다.',
  supply:
    '공급가액 역산은 세금계산서 발행 직전의 빠른 확인용입니다. 면세·영세 거래, 음식점업 등 의제매입세액공제 대상 업종은 별도 계산 로직이 필요할 수 있어 결과가 실제 신고 금액과 다를 수 있습니다.',
  freelancer:
    '프리랜서 3.3% 원천세 계산은 일반적인 사업소득(3.3%) 또는 인적용역 기타소득 가정입니다. 실제 원천징수 의무는 지급자와의 계약 형태(사업소득/기타소득/근로소득)에 따라 달라지며, 종합소득세 신고 시 추가 세액이 발생할 수 있습니다.',
  quote:
    '견적서의 \'1식\' 자동 분할은 거래 협의·세금계산서 발행의 편의를 위한 참고 수치입니다. 실제 계약 단가, 부가세 산정 방식, 도장·서명·인지세 등 법적 효력은 계약 당사자 합의와 별도 규정을 따릅니다.',
  margin:
    '마진율·할인율 계산은 단가 결정과 가격 협상의 빠른 참고를 위한 도구입니다. 실제 손익 계산에는 부가세, 운반·창고 비용, 카드 수수료, 환불·교환 손실, 인건비 등 부대 비용이 추가로 반영되어야 합니다.',
  general:
    '입력한 금액과 결과는 일반적인 가정에 따른 자동 계산입니다. 업종·계약 형태에 따라 실제 적용 수치가 다를 수 있습니다.',
};

export const DisclaimerBox: React.FC<DisclaimerBoxProps> = ({ variant = 'general' }) => {
  const specific = variantSpecifics[variant];

  return (
    <div
      id="disclaimer-alert-box"
      className="bg-amber-50/70 border border-amber-100/80 rounded-xl p-5 my-5 space-y-3 shadow-xs"
    >
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-left">
          <h5 className="text-xs font-bold text-amber-900">법적 면책 및 세무 참고 안내</h5>
          <p className="text-xs text-amber-800 leading-relaxed font-semibold">
            본 계산기의 결과는 <strong>일반적인 참고를 위한 자동 계산값</strong>이며,
            세무사·회계사·변호사 등 자격 있는 전문가의 검토와 자문을 대체하지 않습니다.
          </p>
        </div>
      </div>

      <ul className="space-y-1.5 text-[11px] text-amber-800 leading-relaxed pl-1">
        <li className="flex items-start gap-2">
          <span className="text-amber-700 font-bold shrink-0 mt-0.5">•</span>
          <span>{specific}</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-700 font-bold shrink-0 mt-0.5">•</span>
          <span>
            세법·시행령·국세청 고시는 매년 또는 수시로 개정될 수 있으며, 본 도구의 계산 로직이
            최신 개정안을 즉시 반영하지 않을 수 있습니다.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-700 font-bold shrink-0 mt-0.5">•</span>
          <span>
            결과의 사용·인용·전달로 인해 발생하는 가산세, 과소·과대 신고, 계약 분쟁, 기타
            일체의 직·간접 손해에 대해 운영자는 책임을 지지 않습니다.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-700 font-bold shrink-0 mt-0.5">•</span>
          <span>
            세금계산서 발행, 신고, 계약 체결 등 중요한 의사결정 전에는 반드시 세무 전문가 또는
            관련 기관(국세청 홈택스, 관할 세무서, 4대보험공단 등)의 안내를 확인하세요.
          </span>
        </li>
      </ul>

      <div className="pt-2 border-t border-amber-100/80">
        <Link
          to="/terms"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-900 hover:text-amber-700 transition-colors"
        >
          <ScrollText className="w-3.5 h-3.5" />
          전체 면책 조항 — 이용약관 제5조 보기
        </Link>
      </div>
    </div>
  );
};

export default DisclaimerBox;
