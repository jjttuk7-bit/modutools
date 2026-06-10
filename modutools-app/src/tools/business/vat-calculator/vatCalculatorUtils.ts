export interface VatCalcInputs {
  supplyAmtStr: string;
  vatRateStr: string;
  isCustomRate: boolean;
}

export interface VatCalcValidation {
  isValid: boolean;
  errors: {
    supplyAmt?: string;
    vatRate?: string;
  };
}

export function validateVatInputs(inputs: VatCalcInputs): VatCalcValidation {
  const errors: { supplyAmt?: string; vatRate?: string } = {};

  const supplyStr = inputs.supplyAmtStr.replace(/,/g, '').trim();
  if (!supplyStr) {
    errors.supplyAmt = '공급가액을 입력해주세요.';
  } else {
    const supplyAmt = parseFloat(supplyStr);
    if (isNaN(supplyAmt) || supplyAmt < 0) {
      errors.supplyAmt = '올바른 금액을 입력해주세요.';
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

export function getVatExplanation(
  supplyAmt: number,
  vatRate: number,
  vatAmt: number,
  totalAmt: number,
): string {
  return `계산식: ${supplyAmt.toLocaleString()}원 × ${vatRate}% = 부가세 ${vatAmt.toLocaleString()}원, 합계금액 = ${supplyAmt.toLocaleString()}원 + ${vatAmt.toLocaleString()}원 = ${totalAmt.toLocaleString()}원`;
}
