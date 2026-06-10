import { roundWon } from '../../../lib/money';

export interface FreelancerTaxInputs {
  contractAmtStr: string;
  taxRateStr: string;
  isCustomRate: boolean;
}

export interface FreelancerTaxValidation {
  isValid: boolean;
  errors: {
    contractAmt?: string;
    taxRate?: string;
  };
}

export function validateFreelancerInputs(
  inputs: FreelancerTaxInputs,
): FreelancerTaxValidation {
  const errors: { contractAmt?: string; taxRate?: string } = {};

  const contractStr = inputs.contractAmtStr.replace(/,/g, '').trim();
  if (!contractStr) {
    errors.contractAmt = '계약금액을 입력해주세요.';
  } else {
    const contractAmt = parseFloat(contractStr);
    if (isNaN(contractAmt) || contractAmt < 0) {
      errors.contractAmt = '올바른 금액을 입력해주세요.';
    }
  }

  const taxRateStrClean = inputs.taxRateStr.trim();
  if (inputs.isCustomRate) {
    if (!taxRateStrClean) {
      errors.taxRate = '원천징수율을 확인해주세요.';
    } else {
      const taxRate = parseFloat(taxRateStrClean);
      if (isNaN(taxRate) || taxRate < 0 || taxRate > 100) {
        errors.taxRate = '원천징수율을 확인해주세요.';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function calculateFreelancerTax(contractAmt: number, taxRate: number) {
  const roundedContract = Math.round(contractAmt);
  const taxAmount = roundWon(roundedContract * (taxRate / 100));
  const actualAmount = roundedContract - taxAmount;

  return {
    contractAmount: roundedContract,
    taxRate,
    taxAmount,
    actualAmount,
  };
}

export function getFreelancerExplanation(
  contractAmt: number,
  taxRate: number,
  taxAmt: number,
  actualAmt: number,
): string {
  return `계산식: 원천징수액 = 계약금액 ${contractAmt.toLocaleString()}원 × ${taxRate}% = ${taxAmt.toLocaleString()}원, 실수령액 = 계약금액 - 원천징수액 = ${actualAmt.toLocaleString()}원`;
}
