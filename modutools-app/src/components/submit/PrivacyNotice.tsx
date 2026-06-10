import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function PrivacyNotice() {
  return (
    <div
      id="privacy-notice-box"
      className="bg-emerald-50 border border-emerald-150/60 rounded-xl p-4 my-6 shadow-2xs"
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-xs font-bold text-emerald-900 mb-1.5 flex items-center gap-1.5">
            <span>🛡️ 안전한 100% 온디바이스 보안 필터 보증</span>
          </h3>
          <div className="grid sm:grid-cols-3 gap-3 pt-1 text-[11px] font-medium text-emerald-800">
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
              <span>파일은 서버에 저장되지 않습니다.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
              <span>모든 처리는 브라우저 안에서만 진행됩니다.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
              <span>작업한 파일은 사용자의 기기에만 다운로드됩니다.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
