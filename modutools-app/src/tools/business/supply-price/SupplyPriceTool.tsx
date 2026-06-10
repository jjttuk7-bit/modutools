import React, { useState } from 'react';
import { ResultCard, ResultRow } from '../../../components/business/ResultCard';
import { PrivacyNotice } from '../../../components/business/PrivacyNotice';
import { DisclaimerBox } from '../../../components/business/DisclaimerBox';
import { BusinessSeo } from '../../../components/seo/BusinessSeo';
import { AdSlot } from '../../../components/common/AdSlot';
import { RotateCcw, X } from 'lucide-react';
import { formatMoney, parseMoney, calculateSupplyFromTotal } from '../../../lib/money';
import { validateSupplyPriceInputs, getSupplyExplanation } from './supplyPriceUtils';

export const SupplyPriceTool: React.FC = () => {
  const [totalAmtStr, setTotalAmtStr] = useState<string>('');
  const [isCustomRate, setIsCustomRate] = useState<boolean>(false);
  const [vatRateStr, setVatRateStr] = useState<string>('10');

  const [calculated, setCalculated] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ totalAmt?: string; vatRate?: string }>({});

  const [resultRows, setResultRows] = useState<ResultRow[]>([]);
  const [explanation, setExplanation] = useState<string>('');

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cleaned = rawValue.replace(/[^0-9]/g, '');
    if (cleaned === '') {
      setTotalAmtStr('');
      return;
    }
    const num = parseInt(cleaned, 10);
    setTotalAmtStr(new Intl.NumberFormat('ko-KR').format(num));

    if (errors.totalAmt) {
      setErrors((prev) => ({ ...prev, totalAmt: undefined }));
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
    const validation = validateSupplyPriceInputs({
      totalAmtStr,
      vatRateStr,
      isCustomRate,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      setCalculated(false);
      return;
    }

    setErrors({});
    const totalAmt = parseMoney(totalAmtStr);
    const vatRate = isCustomRate ? parseFloat(vatRateStr) : 10;

    const result = calculateSupplyFromTotal(totalAmt, vatRate);

    setResultRows([
      { label: '합계금액', value: result.totalAmount, valueSuffix: '원' },
      { label: '부가세율', value: `${result.vatRate}`, valueSuffix: '%' },
      { label: '공급가액', value: result.supplyAmount, valueSuffix: '원' },
      { label: '부가세', value: result.vatAmount, isTotal: true, valueSuffix: '원' },
    ]);

    setExplanation(
      getSupplyExplanation(
        result.totalAmount,
        result.vatRate,
        result.supplyAmount,
        result.vatAmount,
      ),
    );
    setCalculated(true);
  };

  const handleReset = () => {
    setTotalAmtStr('');
    setIsCustomRate(false);
    setVatRateStr('10');
    setCalculated(false);
    setErrors({});
    setResultRows([]);
    setExplanation('');
  };

  const getCopyText = () => {
    if (resultRows.length === 0) return '';
    return (
      `[공급가액 역산 계산 결과]\n` +
      resultRows
        .map(
          (row) =>
            `${row.label}: ${
              typeof row.value === 'number' ? formatMoney(row.value) : row.value
            }${row.valueSuffix || '원'}`,
        )
        .join('\n') +
      `\n\n${explanation}`
    );
  };

  return (
    <div id="supply-price-tool" className="space-y-6">
      <div className="space-y-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-left">
        <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-1.5">
          <RotateCcw className="w-5 h-5 text-[#0F172A]" />
          공급가액 역산 계산기
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          부가세 포함 금액에서 공급가액과 부가세를 분리해 계산합니다.
        </p>
      </div>

      <PrivacyNotice />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-xs text-left">
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider border-b border-slate-100 pb-2">
            역산 합계 대금 입력
          </h3>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="total-input" className="text-xs font-bold text-slate-700">
                합계금액 (부가세 포함)
              </label>
            </div>
            <div className="relative rounded-lg shadow-sm">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold text-xs select-none">
                ₩
              </span>
              <input
                type="text"
                id="total-input"
                name="total-input"
                value={totalAmtStr}
                onChange={handleTotalChange}
                inputMode="numeric"
                placeholder="예: 1,100,000"
                className={`block w-full pl-8 pr-10 py-3 text-sm font-semibold text-slate-900 border ${
                  errors.totalAmt
                    ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                    : 'border-slate-200 focus:ring-slate-100 focus:border-slate-800'
                } rounded-lg bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-hidden focus:ring-2 transition-all`}
              />
              {totalAmtStr && (
                <button
                  type="button"
                  onClick={() => setTotalAmtStr('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {errors.totalAmt && (
              <p className="text-[11px] text-red-500 font-medium">{errors.totalAmt}</p>
            )}
          </div>

          <div className="space-y-1.5" id="tax-rate-switcher">
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

        <div id="supply-price-results" className="space-y-5">
          <ResultCard
            id="supply-result"
            title="공급가액 역산 보고 명세"
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
            <AdSlot type="rectangle" label="광고" id="supply-results-ad" />
          </div>
        </div>
      </div>

      <AdSlot type="responsive" label="기사 중간 광고" id="supply-mid-ad" />

      <DisclaimerBox />

      <BusinessSeo toolId="supply" />
    </div>
  );
};

export default SupplyPriceTool;
