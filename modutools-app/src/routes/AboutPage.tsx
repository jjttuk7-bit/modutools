import React from 'react';
import { Info, Mail } from 'lucide-react';
import PrivacyBadges from '../components/common/PrivacyBadges';
import SeoHead from '../components/seo/SeoHead';

const CONTACT_EMAIL = 'monglesb@gmail.com';

export const AboutPage: React.FC = () => {
  return (
    <article className="bg-white border border-slate-200 rounded-3xl p-7 md:p-9 prose prose-slate max-w-none dark:bg-slate-900 dark:border-slate-800 dark:prose-invert">
      <SeoHead
        title="소개 — 모두의 도구를 만든 이유"
        description="대한민국 사장님·프리랜서를 위한 무료 실무 도구함. 회원가입·서버 전송 없이 브라우저 안에서만 처리하는 모두의 도구의 운영 원칙과 30가지 도구를 소개합니다."
        path="/about"
      />
      <header className="not-prose mb-6">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5 dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-900">
          <Info className="w-3.5 h-3.5" />
          About — 모두의 도구
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-4 dark:text-slate-100">
          대한민국 사장님·프리랜서를 위해, 가입 없이 바로 쓰는 무료 실무 도구.
        </h1>
        <p className="text-sm text-slate-600 mt-3 leading-relaxed dark:text-slate-400">
          모두의 도구(modutools)는 매장 운영·서류 정리·QR 안내·이미지 디자인·엑셀 정리 같은
          반복 업무를 회원가입 없이 한 곳에서 끝낼 수 있도록 모아 둔 무료 도구함입니다.
          모든 처리는 사용자 브라우저 안에서만 일어나고, 어떤 입력값·파일도 서버로 전송되지
          않습니다.
        </p>
        <div className="mt-5">
          <PrivacyBadges />
        </div>
      </header>

      <h2>1. 모두의 도구는 왜 만들어졌나요?</h2>
      <p>
        매일 비슷한 업무가 반복되는데도, 그 작은 작업을 위해 별도 프로그램을 설치하거나
        클라우드 서비스에 가입하고 파일을 업로드해야 했습니다. 부가세 계산 한 번 하려고
        가입하고, QR 한 장 만들려고 광고 가득한 사이트에서 회원가입을 하고, PDF 한 장
        합치려고 신용카드 등록 안내를 봐야 했습니다. 모두의 도구는 그 마찰을 줄이기 위해
        만들었습니다. 가입·결제·설치 없이 브라우저만 있으면 끝나도록.
      </p>
      <p>
        대상 사용자는 자영업 사장님, 1인 사업자, 프리랜서, 그리고 회사에서 잡무·반복 업무를
        맡고 있는 실무자입니다. 무겁고 복잡한 ‘올인원’ SaaS가 아니라, 한 번에 한 가지 일을
        깔끔하게 끝내주는 도구를 모아 두는 방향을 추구합니다.
      </p>

      <h2>2. 어떤 도구가 들어 있나요?</h2>
      <p>
        여섯 개 카테고리, 총 30개의 무료 도구가 있습니다. 모든 도구는 회원가입과 결제 없이
        즉시 사용할 수 있습니다.
      </p>
      <ul>
        <li>
          <strong>사장님 계산기</strong> — 부가세 10%, 공급가액 역산, 프리랜서 3.3% 원천세,
          견적서 1식 자동 분할, 마진·할인율 계산기.
        </li>
        <li>
          <strong>QR 도구함</strong> — URL QR, 매장 와이파이 QR, 명함 vCard QR, 로고 합성 QR
          디자인, 이미지 QR 판독기.
        </li>
        <li>
          <strong>PDF 정리 도구</strong> — 사진→PDF 변환, PDF 합치기, PDF 페이지 추출,
          이미지 용량 압축, 주민번호·계좌 마스킹.
        </li>
        <li>
          <strong>썸네일 도구함</strong> — 유튜브 썸네일, 블로그 커버, 매장 메인 이미지,
          이미지 위 텍스트 합성, 인스타그램 정사각 이미지.
        </li>
        <li>
          <strong>엑셀 정리 도구</strong> — 중복 행 지우기, 엑셀 파일 합치기, 전화번호 포맷
          통일, CSV 한글 깨짐 복구, 컬럼별 ZIP/시트 분할.
        </li>
      </ul>

      <h2>3. 운영 원칙</h2>
      <p>
        모두의 도구는 다음 세 가지 원칙 위에 만들어졌으며, 새 도구가 추가될 때도 같은
        원칙이 유지됩니다.
      </p>
      <ol>
        <li>
          <strong>서버 무전송 — 브라우저에서만 처리합니다.</strong> 부가세·환산 결과,
          업로드한 PDF·엑셀·이미지, 입력한 텍스트와 휴대폰 번호는 단 한 줄도 외부 서버로
          전송되지 않습니다. 모든 연산은 사용자 브라우저의 자바스크립트 엔진과 메모리에서만
          일어나고, 탭을 닫으면 즉시 휘발됩니다.
        </li>
        <li>
          <strong>회원가입·결제 없음 — 누구나 무료로.</strong> 이메일 입력, 신용카드 등록,
          기간 제한 같은 장벽 없이 모든 도구를 영구 무료로 제공합니다. 사용량 제한도
          없습니다.
        </li>
        <li>
          <strong>가벼움 — 한 가지 일을 정확하게.</strong> 모든 도구를 다 모은 ‘올인원’이
          아니라, 한 번에 한 가지 작업을 깔끔하게 끝내는 도구를 모아 둡니다. 광고가 도구
          사용을 방해하지 않도록 광고 영역을 도구 결과 바깥의 안내·SEO 본문 사이에만
          배치합니다.
        </li>
      </ol>

      <h2>4. 광고 운영 방침</h2>
      <p>
        모두의 도구는 무료 도구 운영에 필요한 서버·도메인 비용을 충당하기 위해 일부 페이지에
        Google AdSense 등 광고 네트워크를 게재할 수 있습니다. 광고는 다음 원칙을 따릅니다.
      </p>
      <ul>
        <li>
          도구 입력·결과 영역 안에는 광고를 배치하지 않습니다. 광고는 도구 사용을 끝낸 다음
          노출되는 SEO 본문·관련 도구 추천 영역에만 등장합니다.
        </li>
        <li>광고 클릭을 유도하는 안내 문구나 광고처럼 보이는 가짜 버튼을 사용하지 않습니다.</li>
        <li>
          광고 식별자·쿠키 수집은 광고 네트워크 사업자의 정책을 따르며, 자세한 내용은{' '}
          <a href="/privacy">개인정보 처리방침</a>에서 확인할 수 있습니다.
        </li>
      </ul>

      <h2>5. 책임의 한계</h2>
      <p>
        사장님 계산기 카테고리의 부가세·원천세·마진 계산 결과는 일반적 참고를 위한 도구이며
        법적 조언이나 세무 자문이 아닙니다. 세법은 매년 개정되고 업종·계약 형태에 따라
        실제 적용 세율이 달라질 수 있으므로, 중요한 의사결정은 반드시 세무사·변호사 등
        전문가의 검토를 거치시기 바랍니다. 자세한 면책 조항은{' '}
        <a href="/terms">이용약관</a>에서 확인할 수 있습니다.
      </p>

      <h2>6. 연락처 · 의견 제보</h2>
      <p>
        새로운 도구 아이디어, 기능 개선 제안, 오류 제보, 사업 협력 문의는 언제든 환영합니다.
        아래 이메일로 부담 없이 보내주세요. 가능한 한 빠르게 회신드리겠습니다.
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

export default AboutPage;
