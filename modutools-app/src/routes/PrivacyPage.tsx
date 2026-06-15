import React from 'react';
import { Mail, ShieldCheck } from 'lucide-react';
import PrivacyBadges from '../components/common/PrivacyBadges';
import SeoHead from '../components/seo/SeoHead';

const CONTACT_EMAIL = 'monglesb@gmail.com';
const EFFECTIVE_DATE = '2026년 6월 15일';

export const PrivacyPage: React.FC = () => {
  return (
    <article className="bg-white border border-slate-200 rounded-3xl p-7 md:p-9 prose prose-slate max-w-none dark:bg-slate-900 dark:border-slate-800 dark:prose-invert">
      <SeoHead
        title="개인정보 처리방침 — 모두의 도구"
        description="모두의 도구는 회원가입을 받지 않고, 입력값·업로드 파일을 서버로 전송하지 않습니다. 모든 처리는 브라우저 안에서만 일어나며 탭을 닫으면 즉시 휘발됩니다."
        path="/privacy"
      />
      <header className="not-prose mb-6">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5 dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-900">
          <ShieldCheck className="w-3.5 h-3.5" />
          개인정보 처리방침
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-4 dark:text-slate-100">
          서버에 보내지 않고, 저장하지 않습니다.
        </h1>
        <p className="text-sm text-slate-600 mt-3 leading-relaxed dark:text-slate-400">
          모두의 도구의 모든 도구는 입력 값과 업로드한 파일을 외부 서버로 전송하지
          않습니다. 처리 결과 또한 사용자의 브라우저 메모리 안에서만 만들어집니다.
        </p>
        <p className="text-xs text-slate-500 mt-2 dark:text-slate-500">
          시행일: {EFFECTIVE_DATE}
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
        서비스를 사용할 수 있습니다. 이 과정에서 Google 및 제3자 광고 사업자는 쿠키,
        웹 비콘, IP 주소, 광고 식별자, 브라우저·기기 정보와 같은 기술을 사용해 광고
        게재, 광고 성과 측정, 부정 이용 방지, 관심 기반 광고 제공을 수행할 수 있습니다.
      </p>
      <p>
        Google이 파트너 사이트 또는 앱에서 수집한 데이터를 사용하는 방식은{' '}
        <a
          href="https://policies.google.com/technologies/partner-sites?hl=ko"
          target="_blank"
          rel="noreferrer"
        >
          Google 파트너 사이트 또는 앱을 사용할 때 Google에서 데이터를 사용하는 방식
        </a>
        에서 확인할 수 있습니다. 사용자는 브라우저 설정 또는 Google 광고 설정을 통해
        쿠키와 맞춤 광고 사용을 제한할 수 있습니다.
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
      <p className="not-prose">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-2 hover:bg-emerald-100 transition-colors dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-900 dark:hover:bg-emerald-950/60"
        >
          <Mail className="w-4 h-4" />
          {CONTACT_EMAIL}
        </a>
      </p>
    </article>
  );
};

export default PrivacyPage;
