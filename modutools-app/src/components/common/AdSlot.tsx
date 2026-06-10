import React from 'react';

export type AdType = 'leaderboard' | 'skyscraper' | 'rectangle' | 'responsive';

export interface AdSlotProps {
  type: AdType;
  label?: string;
  id?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ type, label = '광고', id }) => {
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
