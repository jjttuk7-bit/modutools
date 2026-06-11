import React, { useState } from 'react';
import { ResultCard, ResultRow } from '../../../components/business/ResultCard';
import { PrivacyNotice } from '../../../components/business/PrivacyNotice';
import { DisclaimerBox } from '../../../components/business/DisclaimerBox';
import { BusinessSeo } from '../../../components/seo/BusinessSeo';
import { AdSlot } from '../../../components/common/AdSlot';
import { TrendingUp, X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { formatMoney, parseMoney } from '../../../lib/money';
import {
  validateMarginInputs,
  calculateMargin,
  getMarginVerdict,
  getMarginExplanation,
} from './marginCalculatorUtils';

export const MarginCalculatorTool: React.FC = () => {
  const [sellingPriceStr, setSellingPriceStr] = useState<string>('');
  const [purchasePriceStr, setPurchasePriceStr] = useState<string>('');
  const [extraCostStr, setExtraCostStr] = useState<string>('');

  const [calculated, setCalculated] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    sellingPrice?: string;
    purchasePrice?: string;
    extraCost?: string;
  }>({});

  const [resultRows, setResultRows] = useState<ResultRow[]>([]);
  const [explanation, setExplanation] = useState<string>('');
  const [verdict, setVerdict] = useState<{
    message: string;
    type: 'danger' | 'warning' | 'success';
  } | null>(null);

  const handlePriceChange = (
    valueStr: string,
    setter: (val: string) => void,
    errorField: string,
  ) => {
    const cleaned = valueStr.replace(/[^0-9]/g, '');
    if (cleaned === '') {
      setter('');
      return;
    }
    const num = parseInt(cleaned, 10);
    setter(new Intl.NumberFormat('ko-KR').format(num));

    if (errors[errorField as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [errorField]: undefined }));
    }
  };

  const handleCalculate = () => {
    const validation = validateMarginInputs({
      sellingPriceStr,
      purchasePriceStr,
      extraCostStr,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      setCalculated(false);
      return;
    }

    setErrors({});
    const sellingPrice = parseMoney(sellingPriceStr);
    const purchasePrice = parseMoney(purchasePriceStr);
    const extraCost = extraCostStr ? parseMoney(extraCostStr) : 0;

    const result = calculateMargin({
      sellingPrice,
      purchasePrice,
      extraCost,
    });

    setResultRows([
      { label: '판매가', value: result.sellingPrice, valueSuffix: '원' },
      { label: '매입가', value: result.purchasePrice, valueSuffix: '원' },
      { label: '기타 비용', value: result.extraCost, valueSuffix: '원' },
      { label: '총비용', value: result.totalCost, valueSuffix: '원' },
      { label: '마진액', value: result.marginAmount, valueSuffix: '원' },
      { label: '마진율', value: Number(result.marginRate.toFixed(1)), valueSuffix: '%' },
      {
        label: '원가율',
        value: Number(result.costRate.toFixed(1)),
        isTotal: true,
        valueSuffix: '%',
      },
    ]);

    setVerdict(getMarginVerdict(result.marginAmount, result.marginRate));
    setExplanation(getMarginExplanation(result));
    setCalculated(true);
  };

  const handleReset = () => {
    setSellingPriceStr('');
    setPurchasePriceStr('');
    setExtraCostStr('');
    setCalculated(false);
    setErrors({});
    setResultRows([]);
    setExplanation('');
    setVerdict(null);
  };

  const getCopyText = () => {
    if (resultRows.length === 0) return '';
    const sellVal = resultRows.find((r) => r.label === '판매가')?.value;
    const buyVal = resultRows.find((r) => r.label === '매입가')?.value;
    const extraVal = resultRows.find((r) => r.label === '기타 비용')?.value;
    const totalCostVal = resultRows.find((r) => r.label === '총비용')?.value;
    const marginAmtVal = resultRows.find((r) => r.label === '마진액')?.value;
    const marginRateVal = resultRows.find((r) => r.label === '마진율')?.value;
    const costRateVal = resultRows.find((r) => r.label === '원가율')?.value;

    return (
      `판매가: ${typeof sellVal === 'number' ? formatMoney(sellVal) : '0'}원\n` +
      `매입가: ${typeof buyVal === 'number' ? formatMoney(buyVal) : '0'}원\n` +
      `기타 비용: ${typeof extraVal === 'number' ? formatMoney(extraVal) : '0'}원\n` +
      `총비용: ${typeof totalCostVal === 'number' ? formatMoney(totalCostVal) : '0'}원\n` +
      `마진액: ${typeof marginAmtVal === 'number' ? formatMoney(marginAmtVal) : '0'}원\n` +
      `마진율: ${marginRateVal}%\n` +
      `원가율: ${costRateVal}%`
    );
  };

  return (
    <div id="margin-calculator-tool" className="space-y-6">
      <div className="space-y-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-left">
        <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-1.5">
          <TrendingUp className="w-5 h-5 text-[#0F172A]" />
          마진율 계산기
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          판매가, 매입가, 기타 비용을 입력하면 마진액과 마진율을 계산합니다.
        </p>
      </div>

      <PrivacyNotice />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-xs text-left">
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider border-b border-slate-100 pb-2">
            판매 및 매입 단가 입력
          </h3>

          <div className="space-y-1.5">
            <label htmlFor="selling-price-input" className="text-xs font-bold text-slate-700">
              판매가
            </label>
            <div className="relative rounded-lg shadow-sm">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold text-xs select-none">
                ₩
              </span>
              <input
                type="text"
                id="selling-price-input"
                name="selling-price-input"
                value={sellingPriceStr}
                onChange={(e) =>
                  handlePriceChange(e.target.value, setSellingPriceStr, 'sellingPrice')
                }
                inputMode="numeric"
                placeholder="예: 50,000"
                className={`block w-full pl-8 pr-10 py-3 text-sm font-semibold text-slate-900 border ${
                  errors.sellingPrice
                    ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                    : 'border-slate-200 focus:ring-slate-100 focus:border-slate-800'
                } rounded-lg bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-hidden focus:ring-2 transition-all`}
              />
              {sellingPriceStr && (
                <button
                  type="button"
                  onClick={() => setSellingPriceStr('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {errors.sellingPrice && (
              <p className="text-[11px] text-red-500 font-medium">{errors.sellingPrice}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="purchase-price-input"
              className="text-xs font-bold text-slate-700"
            >
              매입가
            </label>
            <div className="relative rounded-lg shadow-sm">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold text-xs select-none">
                ₩
              </span>
              <input
                type="text"
                id="purchase-price-input"
                name="purchase-price-input"
                value={purchasePriceStr}
                onChange={(e) =>
                  handlePriceChange(e.target.value, setPurchasePriceStr, 'purchasePrice')
                }
                inputMode="numeric"
                placeholder="예: 30,000"
                className={`block w-full pl-8 pr-10 py-3 text-sm font-semibold text-slate-900 border ${
                  errors.purchasePrice
                    ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                    : 'border-slate-200 focus:ring-slate-100 focus:border-slate-800'
                } rounded-lg bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-hidden focus:ring-2 transition-all`}
              />
              {purchasePriceStr && (
                <button
                  type="button"
                  onClick={() => setPurchasePriceStr('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {errors.purchasePrice && (
              <p className="text-[11px] text-red-500 font-medium">{errors.purchasePrice}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="extra-cost-input"
              className="text-xs font-bold text-slate-700 flex justify-between"
            >
              <span>
                기타 비용 <span className="text-slate-400 font-normal">(선택)</span>
              </span>
            </label>
            <div className="relative rounded-lg shadow-sm">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold text-xs select-none">
                ₩
              </span>
              <input
                type="text"
                id="extra-cost-input"
                name="extra-cost-input"
                value={extraCostStr}
                onChange={(e) =>
                  handlePriceChange(e.target.value, setExtraCostStr, 'extraCost')
                }
                inputMode="numeric"
                placeholder="예: 플랫폼 수수료, 배송비, 포장비, 광고비 등"
                className={`block w-full pl-8 pr-10 py-3 text-sm font-semibold text-slate-900 border ${
                  errors.extraCost
                    ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                    : 'border-slate-200 focus:ring-slate-100 focus:border-slate-800'
                } rounded-lg bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-hidden focus:ring-2 transition-all`}
              />
              {extraCostStr && (
                <button
                  type="button"
                  onClick={() => setExtraCostStr('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              * 포장비, 수수료, 광고비, 배송비 등 기타 비용의 합계를 원 단위로 입력하세요.
            </p>
            {errors.extraCost && (
              <p className="text-[11px] text-red-500 font-medium">{errors.extraCost}</p>
            )}
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-[#0F172A] hover:bg-[#1E293B] font-bold text-white py-3.5 rounded-lg text-xs transition-colors hover:cursor-pointer shadow-md shadow-slate-950/10"
          >
            계산하기
          </button>
        </div>

        <div id="margin-calculator-results" className="space-y-5">
          <ResultCard
            id="margin-result"
            title="마진 및 수익률 대조 결과표"
            rows={resultRows}
            onReset={handleReset}
            calculated={calculated}
            copyText={getCopyText()}
          />

          {calculated && verdict && (
            <div
              className={`p-4 border rounded-xl flex items-start gap-2.5 text-left shadow-xs ${
                verdict.type === 'danger'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : verdict.type === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              {verdict.type === 'danger' && (
                <AlertTriangle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
              )}
              {verdict.type === 'warning' && (
                <AlertTriangle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
              )}
              {verdict.type === 'success' && (
                <CheckCircle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h4 className="text-xs font-bold">마진율 임계 분석</h4>
                <p className="text-xs font-semibold leading-relaxed">{verdict.message}</p>
              </div>
            </div>
          )}

          {calculated && explanation && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-left">
              <h4 className="text-xs font-bold text-[#0F172A] mb-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-slate-500" />
                마진 분석 산식 정보
              </h4>
              <p className="text-xs text-slate-500 font-mono leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-150 whitespace-pre-line">
                {explanation}
              </p>
            </div>
          )}

          <div className="pt-2">
            <AdSlot type="rectangle" label="광고" id="margin-results-ad" />
          </div>
        </div>
      </div>

      <AdSlot type="responsive" label="기사 중간 광고" id="margin-mid-ad" />

      <DisclaimerBox variant="margin" />

      <BusinessSeo toolId="margin" />
    </div>
  );
};

export default MarginCalculatorTool;
