import { roundWon } from '../../../lib/money';

export interface QuoteSplitInputs {
  mode: 'totalToSupply' | 'supplyToTotal';
  amountStr: string;
  vatRateStr: string;
  isCustomRate: boolean;
}

export interface QuoteSplitValidation {
  isValid: boolean;
  errors: {
    amount?: string;
    vatRate?: string;
  };
}

export function validateQuoteInputs(
  inputs: QuoteSplitInputs,
): QuoteSplitValidation {
  const errors: { amount?: string; vatRate?: string } = {};

  const amtStrClean = inputs.amountStr.replace(/,/g, '').trim();
  if (!amtStrClean) {
    errors.amount = '금액을 입력해주세요.';
  } else {
    const amt = parseFloat(amtStrClean);
    if (isNaN(amt) || amt < 0) {
      errors.amount = '올바른 금액을 입력해주세요.';
    }
  }

  const vatRateStrClean = inputs.vatRateStr.trim();
  if (inputs.isCustomRate) {
    if (!vatRateStrClean) {
      errors.vatRate = '부가세율을 확인해주세요.';
    } else {
      const vatRate = parseFloat(vatRateStrClean);
      if (isNaN(vatRate) || vatRate < 0 || vatRate > 100) {
        errors.vatRate = '부가세율을 확인해주세요.';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function calculateQuoteSplit(inputs: {
  mode: 'totalToSupply' | 'supplyToTotal';
  amount: number;
  vatRate: number;
}) {
  const { mode, amount, vatRate } = inputs;
  const rateMultiplier = vatRate / 100;

  if (mode === 'totalToSupply') {
    const totalAmount = roundWon(amount);
    const supplyAmount = roundWon(totalAmount / (1 + rateMultiplier));
    const vatAmount = totalAmount - supplyAmount;

    return {
      supplyAmount,
      vatAmount,
      totalAmount,
      vatRate,
    };
  }

  const supplyAmount = roundWon(amount);
  const vatAmount = roundWon(supplyAmount * rateMultiplier);
  const totalAmount = supplyAmount + vatAmount;

  return {
    supplyAmount,
    vatAmount,
    totalAmount,
    vatRate,
  };
}

export function getQuoteExplanation(
  mode: 'totalToSupply' | 'supplyToTotal',
  supplyAmt: number,
  vatAmt: number,
  totalAmt: number,
  vatRate: number,
): string {
  if (mode === 'totalToSupply') {
    return `계산식 (총액에서 나누기): 공급가액 = 합계금액 ${totalAmt.toLocaleString()}원 / ${
      1 + vatRate / 100
    } = ${supplyAmt.toLocaleString()}원, 부가세 = 합계금액 - 공급가액 = ${vatAmt.toLocaleString()}원 (부가세율 ${vatRate}%)`;
  }
  return `계산식 (공급가액에서 합계 만들기): 부가세 = 공급가액 ${supplyAmt.toLocaleString()}원 × ${vatRate}% = ${vatAmt.toLocaleString()}원, 합계금액 = 공급가액 + 부가세 = ${totalAmt.toLocaleString()}원`;
}
