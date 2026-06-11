import React from 'react';

export type AdType = 'leaderboard' | 'skyscraper' | 'rectangle' | 'responsive';

export interface AdSlotProps {
  type: AdType;
  label?: string;
  id?: string;
  /**
   * AdSense data-ad-slot 슬롯 ID. 승인 후 슬롯 단위로 생성한 ID를 넘긴다.
   * 미지정 시 클라이언트 ID만 있는 단일 슬롯으로 동작한다.
   */
  slotId?: string;
}

/**
 * AdSense 광고 자리.
 *
 * VITE_ADSENSE_CLIENT_ID 환경변수가 설정되지 않은 동안은 아무것도 렌더하지
 * 않는다(빈 placeholder 도 노출하지 않음). AdSense 승인 심사 시 미완성 신호로
 * 잡힐 수 있는 빈 광고 박스를 노출하지 않기 위한 안전 게이트.
 *
 * 승인 후:
 *   Netlify 환경변수에 VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX 추가하면
 *   이 컴포넌트가 자동 활성화되고, 향후 실제 <ins class="adsbygoogle"> 코드로
 *   교체된다.
 */
export const AdSlot: React.FC<AdSlotProps> = ({ type, label = '광고', id }) => {
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined;

  // 환경변수 미설정 → 광고 영역 자체를 노출하지 않음
  if (!clientId) {
    return null;
  }

  const containerStyle =
    'w-full bg-slate-50 border border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center p-4 text-center transition-all';
  let sizeStyles = '';

  switch (type) {
    case 'leaderboard':
      sizeStyles = 'w-full min-h-[90px] md:min-h-[100px] max-w-4xl mx-auto';
      break;
    case 'skyscraper':
      sizeStyles = 'w-[300px] min-h-[600px] mx-auto hidden lg:flex';
      break;
    case 'rectangle':
      sizeStyles = 'w-[300px] min-h-[250px] mx-auto';
      break;
    case 'responsive':
    default:
      sizeStyles = 'w-full min-h-[120px] max-w-3xl mx-auto';
      break;
  }

  return (
    <div
      id={id || `ad-slot-${type}`}
      className={`${containerStyle} ${sizeStyles}`}
      aria-label="광고 영역"
    >
      <div className="flex flex-col items-center space-y-1">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-150 px-2 py-0.5 rounded border border-slate-200">
          {label}
        </span>
        <span className="text-xs text-slate-400 font-sans mt-1">
          비즈니스 및 맞춤형 광고 게재 영역
        </span>
        <span className="text-[11px] text-slate-300 font-mono">
          {type === 'leaderboard' && '728 × 90 또는 반응형'}
          {type === 'skyscraper' && '300 × 600 수직 배너'}
          {type === 'rectangle' && '300 × 250 최적 사각형'}
          {type === 'responsive' && '반응형 스마트 광고 영역'}
        </span>
      </div>
    </div>
  );
};

export default AdSlot;
