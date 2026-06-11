import { Shield } from 'lucide-react';

export default function PrivacyNotice() {
  return (
    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-4 shadow-xs">
      <div className="mt-0.5 p-2 bg-white rounded-lg text-emerald-600 shadow-xs">
        <Shield className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-emerald-900 font-bold text-sm">파일은 서버에 저장되지 않습니다.</h3>
        <p className="text-emerald-700 text-xs mt-1 leading-relaxed">
          모든 데이터 처리는 사용자의 브라우저 메모리 상에서만 이루어집니다.
          <br />
          작업 완료 후 창을 닫으면 데이터는 완전히 소멸됩니다. (로그인 불필요, 100% 프라이버시 보호)
        </p>
      </div>
    </div>
  );
}
