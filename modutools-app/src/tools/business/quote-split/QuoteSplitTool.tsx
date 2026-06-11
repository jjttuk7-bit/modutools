import React, { useState } from 'react';
import { ResultCard, ResultRow } from '../../../components/business/ResultCard';
import { PrivacyNotice } from '../../../components/business/PrivacyNotice';
import { DisclaimerBox } from '../../../components/business/DisclaimerBox';
import { BusinessSeo } from '../../../components/seo/BusinessSeo';
import { AdSlot } from '../../../components/common/AdSlot';
import { Scissors, X } from 'lucide-react';
import { formatMoney, parseMoney } from '../../../lib/money';
import {
  validateQuoteInputs,
  calculateQuoteSplit,
  getQuoteExplanation,
} from './quoteSplitUtils';

export const QuoteSplitTool: React.FC = () => {
  const [mode, setMode] = useState<'totalToSupply' | 'supplyToTotal'>('totalToSupply');
  const [amountStr, setAmountStr] = useState<string>('');
  const [isCustomRate, setIsCustomRate] = useState<boolean>(false);
  const [vatRateStr, setVatRateStr] = useState<string>('10');

  const [calculated, setCalculated] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ amount?: string; vatRate?: string }>({});

  const [resultRows, setResultRows] = useState<ResultRow[]>([]);
  const [explanation, setExplanation] = useState<string>('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cleaned = rawValue.replace(/[^0-9]/g, '');
    if (cleaned === '') {
      setAmountStr('');
      return;
    }
    const num = parseInt(cleaned, 10);
    setAmountStr(new Intl.NumberFormat('ko-KR').format(num));

    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  const handleVatRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cleaned = rawValue.replace(/[^0-9.]/g, '');

    const val = parseFloat(cleaned);
    if (!isNaN(val) && val > 100) {
      setVatRateStr('100');
    } else {
      setVatRateStr(cleaned);
    }

    if (errors.vatRate) {
      setErrors((prev) => ({ ...prev, vatRate: undefined }));
    }
  };

  const handleCalculate = () => {
    const validation = validateQuoteInputs({
      mode,
      amountStr,
      vatRateStr,
      isCustomRate,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      setCalculated(false);
      return;
    }

    setErrors({});
    const amountVal = parseMoney(amountStr);
    const vatRate = isCustomRate ? parseFloat(vatRateStr) : 10;

    const result = calculateQuoteSplit({
      mode,
      amount: amountVal,
      vatRate,
    });

    setResultRows([
      { label: '공급가액', value: result.supplyAmount, valueSuffix: '원' },
      { label: '부가세', value: result.vatAmount, valueSuffix: '원' },
      { label: '합계금액', value: result.totalAmount, isTotal: true, valueSuffix: '원' },
      { label: '부가세율', value: `${result.vatRate}`, valueSuffix: '%' },
    ]);

    setExplanation(
      getQuoteExplanation(
        mode,
        result.supplyAmount,
        result.vatAmount,
        result.totalAmount,
        result.vatRate,
      ),
    );
    setCalculated(true);
  };

  const handleReset = () => {
    setAmountStr('');
    setIsCustomRate(false);
    setVatRateStr('10');
    setCalculated(false);
    setErrors({});
    setResultRows([]);
    setExplanation('');
  };

  const getCopyText = () => {
    if (resultRows.length === 0) return '';
    const supplyRow = resultRows.find((r) => r.label === '공급가액');
    const vatRow = resultRows.find((r) => r.label === '부가세');
    const totalRow = resultRows.find((r) => r.label === '합계금액');

    const sVal =
      supplyRow && typeof supplyRow.value === 'number' ? formatMoney(supplyRow.value) : '0';
    const vVal = vatRow && typeof vatRow.value === 'number' ? formatMoney(vatRow.value) : '0';
    const tVal =
      totalRow && typeof totalRow.value === 'number' ? formatMoney(totalRow.value) : '0';

    return `공급가액: ${sVal}원\n` + `부가세: ${vVal}원\n` + `합계금액: ${tVal}원`;
  };

  return (
    <div id="quote-split-tool" className="space-y-6">
      <div className="space-y-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-left">
        <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-1.5">
          <Scissors className="w-5 h-5 text-[#0F172A]" />
          견적서 금액 나누기
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          견적서에 넣을 공급가액, 부가세, 합계금액을 빠르게 나눠 계산하세요.
        </p>
      </div>

      <PrivacyNotice />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-xs text-left">
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider border-b border-slate-100 pb-2">
            견적 대금 입력 조건
          </h3>

          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700">계산 모드 선택</span>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode('totalToSupply');
                  setAmountStr('');
                  setCalculated(false);
                  setErrors({});
                }}
                className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold text-left transition-all border cursor-pointer ${
                  mode === 'totalToSupply'
                    ? 'bg-[#0F172A] text-white border-[#0F172A]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                총액에서 공급가액/부가세 나누기 (총액 기준)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('supplyToTotal');
                  setAmountStr('');
                  setCalculated(false);
                  setErrors({});
                }}
                className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold text-left transition-all border cursor-pointer ${
                  mode === 'supplyToTotal'
                    ? 'bg-[#0F172A] text-white border-[#0F172A]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                공급가액에서 합계금액 계산하기 (공급가액 기준)
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="amount-input" className="text-xs font-bold text-slate-700">
              {mode === 'totalToSupply' ? '총 견적금액' : '공급가액'}
            </label>
            <div className="relative rounded-lg shadow-sm">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold text-xs select-none">
                ₩
              </span>
              <input
                type="text"
                id="amount-input"
                name="amount-input"
                value={amountStr}
                onChange={handleAmountChange}
                inputMode="numeric"
                placeholder={mode === 'totalToSupply' ? '예: 1,100,000' : '예: 1,000,000'}
                className={`block w-full pl-8 pr-10 py-3 text-sm font-semibold text-slate-900 border ${
                  errors.amount
                    ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                    : 'border-slate-200 focus:ring-slate-100 focus:border-slate-800'
                } rounded-lg bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-hidden focus:ring-2 transition-all`}
              />
              {amountStr && (
                <button
                  type="button"
                  onClick={() => setAmountStr('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {errors.amount && (
              <p className="text-[11px] text-red-500 font-medium">{errors.amount}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700">부가세율 선택</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsCustomRate(false);
                  if (errors.vatRate)
                    setErrors((prev) => ({ ...prev, vatRate: undefined }));
                }}
                className={`py-2 px-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  !isCustomRate
                    ? 'bg-[#0F172A] text-white border-[#0F172A]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                10% (기본세율)
              </button>
              <button
                type="button"
                onClick={() => setIsCustomRate(true)}
                className={`py-2 px-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  isCustomRate
                    ? 'bg-[#0F172A] text-white border-[#0F172A]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                직접 입력
              </button>
            </div>
          </div>

          {isCustomRate && (
            <div className="space-y-1.5 animate-fadeIn">
              <label htmlFor="custom-vat-rate" className="text-xs font-bold text-slate-700">
                직접 기입할 세율 (%)
              </label>
              <div className="relative rounded-lg shadow-sm">
                <input
                  type="text"
                  id="custom-vat-rate"
                  name="custom-vat-rate"
                  value={vatRateStr}
                  onChange={handleVatRateChange}
                  inputMode="decimal"
                  placeholder="예: 10"
                  className={`block w-full pr-10 pl-3 py-2 text-sm font-semibold text-slate-900 border ${
                    errors.vatRate
                      ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                      : 'border-slate-200 focus:ring-slate-100 focus:border-slate-800'
                  } rounded-lg bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-hidden focus:ring-2 transition-all`}
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 font-bold text-xs select-none">
                  %
                </span>
              </div>
              {errors.vatRate && (
                <p className="text-[11px] text-red-500 font-medium">{errors.vatRate}</p>
              )}
            </div>
          )}

          <button
            onClick={handleCalculate}
            className="w-full bg-[#0F172A] hover:bg-[#1E293B] font-bold text-white py-3.5 rounded-lg text-xs transition-colors hover:cursor-pointer shadow-md shadow-slate-950/10"
          >
            계산하기
          </button>
        </div>

        <div id="quote-split-results" className="space-y-5">
          <ResultCard
            id="quote-split-result"
            title="견적서 세액 상세 환산표"
            rows={resultRows}
            onReset={handleReset}
            calculated={calculated}
            copyText={getCopyText()}
          />

          {calculated && explanation && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-left">
              <h4 className="text-xs font-bold text-[#0F172A] mb-1">검증 연산 산식</h4>
              <p className="text-xs text-slate-500 font-mono leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-150">
                {explanation}
              </p>
            </div>
          )}

          <div className="pt-2">
            <AdSlot type="rectangle" label="광고" id="quote-results-ad" />
          </div>
        </div>
      </div>

      <AdSlot type="responsive" label="기사 중간 광고" id="quote-split-mid-ad" />

      <DisclaimerBox variant="quote" />

      <BusinessSeo toolId="quote" />
    </div>
  );
};

export default QuoteSplitTool;
