export interface SupplyPriceInputs {
  totalAmtStr: string;
  vatRateStr: string;
  isCustomRate: boolean;
}

export interface SupplyPriceValidation {
  isValid: boolean;
  errors: {
    totalAmt?: string;
    vatRate?: string;
  };
}

export function validateSupplyPriceInputs(
  inputs: SupplyPriceInputs,
): SupplyPriceValidation {
  const errors: { totalAmt?: string; vatRate?: string } = {};

  const totalStr = inputs.totalAmtStr.replace(/,/g, '').trim();
  if (!totalStr) {
    errors.totalAmt = '합계금액을 입력해주세요.';
  } else {
    const totalAmt = parseFloat(totalStr);
    if (isNaN(totalAmt) || totalAmt < 0) {
      errors.totalAmt = '올바른 금액을 입력해주세요.';
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

export function getSupplyExplanation(
  totalAmt: number,
  vatRate: number,
  supplyAmt: number,
  vatAmt: number,
): string {
  const factor = 1 + vatRate / 100;
  return `계산식: 공급가액 = 합계금액 ${totalAmt.toLocaleString()}원 / ${factor} = ${supplyAmt.toLocaleString()}원, 부가세 = 합계금액 - 공급가액 = ${vatAmt.toLocaleString()}원`;
}
