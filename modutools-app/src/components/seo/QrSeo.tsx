import React from 'react';
import { HelpCircle, Star, ShieldCheck } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

interface QrSeoProps {
  toolId?: string;
  title: string;
  subtitle?: string;
  paragraphs: string[];
  faqs?: FaqItem[];
}

export const QrSeo: React.FC<QrSeoProps> = ({
  toolId,
  title,
  subtitle,
  paragraphs,
  faqs,
}) => {
  return (
    <div
      className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 mt-12 text-left"
      id={`seo-section-${toolId || 'general'}`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-2 text-emerald-600 mb-3 text-xs font-bold tracking-wider uppercase">
          <Star size={12} className="fill-emerald-600" />
          <span>QR도구함 지식 가이드</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-slate-400 mb-6 font-medium">{subtitle}</p>
        )}

        <div className="space-y-4 text-slate-600 text-xs md:text-sm leading-relaxed mb-8">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {faqs && faqs.length > 0 && (
          <div className="border-t border-slate-200 pt-8" id="faq-container">
            <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center space-x-2">
              <HelpCircle className="text-emerald-600" size={16} />
              <span>자주 묻는 질문 (FAQ)</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl p-5 border border-slate-200"
                  id={`faq-item-${idx}`}
                >
                  <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-start space-x-2">
                    <span className="text-emerald-600 font-mono">Q.</span>
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed pl-5">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center space-x-1">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span className="font-semibold text-slate-500">
              서버 저장 없는 순수 브라우저 연산 방식
            </span>
          </span>
          <span>© QR도구함</span>
        </div>
      </div>
    </div>
  );
};

export default QrSeo;
