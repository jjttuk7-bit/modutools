import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DisclaimerBox: React.FC = () => {
  return (
    <div
      id="disclaimer-alert-box"
      className="bg-amber-50/70 border border-amber-100/80 rounded-xl p-4 my-5 flex items-start space-x-2.5 shadow-xs"
    >
      <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
      <div className="space-y-1 text-left">
        <h5 className="text-xs font-bold text-amber-900">법적 면책 및 세무 참고 안내</h5>
        <p className="text-xs text-amber-800 leading-relaxed font-semibold">
          이 계산기는 간편 계산을 위한 참고용 도구입니다. 실제 세무 신고, 계약, 세금계산서
          발행 전에는 세무 전문가 또는 관련 기관의 안내를 확인하세요.
        </p>
      </div>
    </div>
  );
};

export default DisclaimerBox;
