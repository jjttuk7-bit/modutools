import React from 'react';
import { ShieldCheck } from 'lucide-react';
import PrivacyBadges from '../components/common/PrivacyBadges';

export const PrivacyPage: React.FC = () => {
  return (
    <article className="bg-white border border-slate-200 rounded-3xl p-7 md:p-9 prose prose-slate max-w-none dark:bg-slate-900 dark:border-slate-800 dark:prose-invert">
      <header className="not-prose mb-6">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5 dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-900">
          <ShieldCheck className="w-3.5 h-3.5" />
          개인정보 처리방침
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-4 dark:text-slate-100">
          서버에 보내지 않고, 저장하지 않습니다.
        </h1>
        <p className="text-sm text-slate-600 mt-3 leading-relaxed dark:text-slate-400">
          모두도구의 모든 도구는 입력 값과 업로드한 파일을 외부 서버로 전송하지
          않습니다. 처리 결과 또한 사용자의 브라우저 메모리 안에서만 만들어집니다.
        </p>
        <div className="mt-5">
          <PrivacyBadges />
        </div>
      </header>

      <h2>1. 수집하는 정보</h2>
      <p>
        본 서비스는 회원가입을 받지 않으며, 사용자가 입력한 텍스트·금액·파일을 서버로
        전송하지 않습니다. 따라서 개인정보를 수집·저장하지 않습니다.
      </p>

      <h2>2. 광고 및 분석</h2>
      <p>
        본 서비스는 일부 페이지에서 Google AdSense 등 광고 네트워크 또는 방문 통계
        서비스를 사용할 수 있습니다. 해당 서비스는 사용자의 브라우저에 쿠키를
        설정할 수 있으며, 이는 각 서비스 제공자의 정책을 따릅니다.
      </p>

      <h2>3. 파일 처리 방식</h2>
      <p>
        PDF·이미지·QR 등 파일을 다루는 도구는 모두 브라우저 안에서 처리합니다.
        업로드 버튼이 표시되더라도 실제 네트워크 전송은 이루어지지 않으며, 브라우저
        탭을 닫으면 메모리에서 즉시 제거됩니다.
      </p>

      <h2>4. 문의</h2>
      <p>
        본 방침과 관련된 문의는 서비스 운영자 이메일을 통해 접수해 주시기 바랍니다.
      </p>
    </article>
  );
};

export default PrivacyPage;
