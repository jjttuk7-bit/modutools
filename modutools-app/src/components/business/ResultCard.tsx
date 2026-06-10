import React, { useState } from 'react';
import { copyToClipboard } from '../../lib/copy';
import { Copy, Check, RotateCcw, ShieldCheck } from 'lucide-react';
import { formatNumber } from '../../lib/money';

export interface ResultRow {
  label: string;
  value: number | string;
  isTotal?: boolean;
  isSub?: boolean;
  valueSuffix?: string;
}

interface ResultCardProps {
  id: string;
  title: string;
  rows: ResultRow[];
  onReset?: () => void;
  copyText?: string;
  calculated: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  id,
  title,
  rows,
  onReset,
  copyText,
  calculated,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy =
      copyText ||
      rows
        .map(
          (row) =>
            `${row.label}: ${
              typeof row.value === 'number' ? formatNumber(row.value) : row.value
            }${row.valueSuffix || '원'}`,
        )
        .join('\n');

    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!calculated) {
    return (
      <div
        id={`result-empty-${id}`}
        className="border border-dashed border-slate-200 rounded-xl p-8 bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-2 h-full min-h-[300px]"
      >
        <span className="text-sm font-semibold text-slate-400">계산 결과 대기 중</span>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
          금액을 입력하고 계산하기 버튼을 누르면 실시간 사업세액 및 공제액 결과가 표시됩니다.
        </p>
      </div>
    );
  }

  return (
    <div
      id={`result-card-${id}`}
      className="bg-white border text-left border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col justify-between h-full min-h-[300px]"
    >
      <div className="bg-slate-50 px-4 py-3.5 border-b border-slate-200 flex justify-between items-center">
        <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#0F172A]" />
          {title}
        </h4>
        {onReset && (
          <button
            onClick={onReset}
            id={`reset-btn-${id}`}
            className="text-xs font-bold text-slate-500 hover:text-[#0F172A] flex items-center gap-1 transition-colors hover:bg-white rounded-md px-2 py-1 border border-slate-150"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            초기화
          </button>
        )}
      </div>

      <div className="p-5 flex-1 space-y-3">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className={`flex justify-between items-center py-2 border-b border-dashed border-slate-100 last:border-0 ${
              row.isTotal
                ? 'pt-4 border-t-2 border-solid border-slate-200 mt-2 pb-0'
                : ''
            }`}
          >
            <span
              className={`text-slate-700 ${
                row.isTotal ? 'font-bold text-slate-900 text-base' : 'text-xs'
              } ${row.isSub ? 'pl-3 text-slate-500 text-[11px]' : ''}`}
            >
              {row.label}
            </span>
            <span
              className={`${
                row.isTotal
                  ? 'font-extrabold text-lg text-blue-700 font-sans'
                  : 'font-semibold text-sm text-slate-900 font-sans'
              } ${row.isSub ? 'text-slate-605 text-[11px]' : ''}`}
            >
              {typeof row.value === 'number' ? formatNumber(row.value) : row.value}
              <span className="text-[11px] font-medium text-slate-500 ml-0.5">
                {row.valueSuffix || '원'}
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleCopy}
          id={`copy-btn-${id}`}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-200 shadow-lg ${
            copied
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-[#0F172A] text-white hover:bg-[#1E293B]'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>클립보드에 복사 완료!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>계산 결과 전체 복사하기</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
