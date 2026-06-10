import React, { useState } from 'react';
import { ResultCard, ResultRow } from '../../../components/business/ResultCard';
import { PrivacyNotice } from '../../../components/business/PrivacyNotice';
import { DisclaimerBox } from '../../../components/business/DisclaimerBox';
import { BusinessSeo } from '../../../components/seo/BusinessSeo';
import { AdSlot } from '../../../components/common/AdSlot';
import { UserCheck, X } from 'lucide-react';
import { formatMoney, parseMoney } from '../../../lib/money';
import {
  validateFreelancerInputs,
  calculateFreelancerTax,
  getFreelancerExplanation,
} from './freelancerTaxUtils';

export const FreelancerTaxTool: React.FC = () => {
  const [contractAmtStr, setContractAmtStr] = useState<string>('');
  const [isCustomRate, setIsCustomRate] = useState<boolean>(false);
  const [taxRateStr, setTaxRateStr] = useState<string>('3.3');

  const [calculated, setCalculated] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ contractAmt?: string; taxRate?: string }>({});

  const [resultRows, setResultRows] = useState<ResultRow[]>([]);
  const [explanation, setExplanation] = useState<string>('');

  const handleContractChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cleaned = rawValue.replace(/[^0-9]/g, '');
    if (cleaned === '') {
      setContractAmtStr('');
      return;
    }
    const num = parseInt(cleaned, 10);
    setContractAmtStr(new Intl.NumberFormat('ko-KR').format(num));

    if (errors.contractAmt) {
      setErrors((prev) => ({ ...prev, contractAmt: undefined }));
    }
  };

  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cleaned = rawValue.replace(/[^0-9.]/g, '');

    const val = parseFloat(cleaned);
    if (!isNaN(val) && val > 100) {
      setTaxRateStr('100');
    } else {
      setTaxRateStr(cleaned);
    }

    if (errors.taxRate) {
      setErrors((prev) => ({ ...prev, taxRate: undefined }));
    }
  };

  const handleCalculate = () => {
    const validation = validateFreelancerInputs({
      contractAmtStr,
      taxRateStr,
      isCustomRate,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      setCalculated(false);
      return;
    }

    setErrors({});
    const contractAmt = parseMoney(contractAmtStr);
    const taxRate = isCustomRate ? parseFloat(taxRateStr) : 3.3;

    const result = calculateFreelancerTax(contractAmt, taxRate);

    setResultRows([
      { label: '계약금액', value: result.contractAmount, valueSuffix: '원' },
      { label: '원천징수율', value: `${result.taxRate}`, valueSuffix: '%' },
      { label: '원천징수액', value: result.taxAmount, valueSuffix: '원' },
      { label: '실수령액', value: result.actualAmount, isTotal: true, valueSuffix: '원' },
    ]);

    setExplanation(
      getFreelancerExplanation(
        result.contractAmount,
        result.taxRate,
        result.taxAmount,
        result.actualAmount,
      ),
    );
    setCalculated(true);
  };

  const handleReset = () => {
    setContractAmtStr('');
    setIsCustomRate(false);
    setTaxRateStr('3.3');
    setCalculated(false);
    setErrors({});
    setResultRows([]);
    setExplanation('');
  };

  const getCopyText = () => {
    if (resultRows.length === 0) return '';
    return (
      `[프리랜서 3.3% 계산 결과]\n` +
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
    <div id="freelancer-tax-tool" className="space-y-6">
      <div className="space-y-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-left">
        <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-1.5">
          <UserCheck className="w-5 h-5 text-[#0F172A]" />
          프리랜서 3.3% 계산기
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          계약금액에서 3.3% 원천징수액과 실제 입금액을 계산합니다.
        </p>
      </div>

      <PrivacyNotice />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-xs text-left">
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider border-b border-slate-100 pb-2">
            원천세 계약 조건 입력
          </h3>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="contract-input" className="text-xs font-bold text-slate-700">
                계약금액
              </label>
            </div>
            <div className="relative rounded-lg shadow-sm">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold text-xs select-none">
                ₩
              </span>
              <input
                type="text"
                id="contract-input"
                name="contract-input"
                value={contractAmtStr}
                onChange={handleContractChange}
                inputMode="numeric"
                placeholder="예: 1,000,000"
                className={`block w-full pl-8 pr-10 py-3 text-sm font-semibold text-slate-900 border ${
                  errors.contractAmt
                    ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                    : 'border-slate-200 focus:ring-slate-100 focus:border-slate-800'
                } rounded-lg bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-hidden focus:ring-2 transition-all`}
              />
              {contractAmtStr && (
                <button
                  type="button"
                  onClick={() => setContractAmtStr('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {errors.contractAmt && (
              <p className="text-[11px] text-red-500 font-medium">{errors.contractAmt}</p>
            )}
          </div>

          <div className="space-y-1.5" id="tax-rate-switcher">
            <span className="text-xs font-bold text-slate-700">원천징수율 선택</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsCustomRate(false);
                  if (errors.taxRate)
                    setErrors((prev) => ({ ...prev, taxRate: undefined }));
                }}
                className={`py-2 px-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  !isCustomRate
                    ? 'bg-[#0F172A] text-white border-[#0F172A]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                3.3% (기본세율)
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
              <label htmlFor="custom-tax-rate" className="text-xs font-bold text-slate-700">
                직접 기입할 세율 (%)
              </label>
              <div className="relative rounded-lg shadow-sm">
                <input
                  type="text"
                  id="custom-tax-rate"
                  name="custom-tax-rate"
                  value={taxRateStr}
                  onChange={handleTaxRateChange}
                  inputMode="decimal"
                  placeholder="예: 3.3"
                  className={`block w-full pr-10 pl-3 py-2 text-sm font-semibold text-slate-900 border ${
                    errors.taxRate
                      ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                      : 'border-slate-200 focus:ring-slate-100 focus:border-slate-800'
                  } rounded-lg bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-hidden focus:ring-2 transition-all`}
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 font-bold text-xs select-none">
                  %
                </span>
              </div>
              {errors.taxRate && (
                <p className="text-[11px] text-red-500 font-medium">{errors.taxRate}</p>
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

        <div id="freelancer-tax-results" className="space-y-5">
          <ResultCard
            id="freelancer-result"
            title="원천징수 및 실수령액 상세"
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
            <AdSlot type="rectangle" label="광고" id="freelancer-results-ad" />
          </div>
        </div>
      </div>

      <AdSlot type="responsive" label="기사 중간 광고" id="freelancer-mid-ad" />

      <DisclaimerBox />

      <BusinessSeo toolId="freelancer" />
    </div>
  );
};

export default FreelancerTaxTool;
