import React, { ChangeEvent } from 'react';
import { formatNumber, parseMoneyString, formatToKoreanWordSimple } from '../../lib/money';
import { X } from 'lucide-react';

interface MoneyInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  helperText?: string;
  showKoreanWord?: boolean;
}

export const MoneyInput: React.FC<MoneyInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = '0',
  helperText,
  showKoreanWord = true,
}) => {
  const displayValue = value === 0 ? '' : formatNumber(value);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const parsed = parseMoneyString(rawVal);
    onChange(parsed);
  };

  const clearInput = () => {
    onChange(0);
  };

  return (
    <div id={`money-input-container-${id}`} className="space-y-1.5 w-full">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-xs font-bold text-slate-700 tracking-wide">
          {label}
        </label>
        {value > 0 && showKoreanWord && (
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
            {formatToKoreanWordSimple(value)}
          </span>
        )}
      </div>

      <div className="relative rounded-lg shadow-xs">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">
          ₩
        </span>
        <input
          type="text"
          id={id}
          value={displayValue}
          onChange={handleInputChange}
          inputMode="numeric"
          placeholder={placeholder}
          className="block w-full pl-8 pr-10 py-3 text-slate-900 border border-slate-200 rounded-lg bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold transition-all duration-150"
        />
        {value > 0 && (
          <button
            type="button"
            onClick={clearInput}
            aria-label="금액 초기화"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {helperText && !displayValue && (
        <p className="text-[11px] text-slate-400 leading-normal">{helperText}</p>
      )}
    </div>
  );
};

export default MoneyInput;
