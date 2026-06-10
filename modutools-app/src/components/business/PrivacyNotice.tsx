import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacyNotice: React.FC = () => {
  return (
    <div
      id="privacy-notice-box"
      className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 my-4 flex items-start space-x-3 shadow-xs"
    >
      <div className="bg-white border border-emerald-200 p-2 text-emerald-600 rounded-lg shadow-xs flex-shrink-0 mt-0.5">
        <ShieldCheck className="w-5 h-5 text-emerald-600" />
      </div>
      <div className="flex-1 space-y-1 text-left">
        <h4 className="text-sm font-bold text-slate-800">
          안전 보호: 100% 로컬 브라우저 단독 계산
        </h4>
        <div className="text-xs text-slate-600 leading-relaxed font-semibold space-y-1">
          <p>• 입력한 금액은 서버에 저장되지 않습니다.</p>
          <p>• 모든 계산은 브라우저 안에서만 진행됩니다.</p>
          <p>• 계산 결과는 사용자의 화면에서만 표시됩니다.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyNotice;
