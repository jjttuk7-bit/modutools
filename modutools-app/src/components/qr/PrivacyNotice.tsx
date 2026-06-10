import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacyNotice: React.FC = () => {
  return (
    <div
      className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 my-4 flex items-start gap-3 text-left shadow-sm shadow-emerald-50/50"
      id="privacy-notice-box"
    >
      <div className="text-emerald-600 shrink-0 mt-0.5">
        <ShieldCheck size={18} className="stroke-[2.5]" />
      </div>
      <div className="flex-1">
        <h4 className="text-xs font-bold text-emerald-900 italic mb-1 flex items-center">
          입력한 정보는 서버에 저장되지 않습니다.
        </h4>
        <p className="text-[11px] text-emerald-700 leading-relaxed font-medium">
          모든 데이터는 브라우저 내부 메모리에서만 처리되며 창을 닫으면 무조건 완전히
          소멸됩니다. 회원가입 없이 즉시 사용 가능한 로컬 오프라인 전용 시스템입니다.
        </p>
      </div>
    </div>
  );
};

export default PrivacyNotice;
