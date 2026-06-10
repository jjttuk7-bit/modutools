import React from 'react';
import { ShieldCheck, ServerOff, KeyRound } from 'lucide-react';

export const PrivacyBadges: React.FC = () => {
  const badges = [
    { icon: <ServerOff className="w-4 h-4" />, label: '서버 전송 없음' },
    { icon: <ShieldCheck className="w-4 h-4" />, label: '브라우저 안에서 처리' },
    { icon: <KeyRound className="w-4 h-4" />, label: '로그인 불필요' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((b) => (
        <span
          key={b.label}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 rounded-full px-3 py-1.5 dark:text-slate-300 dark:bg-slate-900 dark:border-slate-700"
        >
          {b.icon}
          {b.label}
        </span>
      ))}
    </div>
  );
};

export default PrivacyBadges;
