import { roundWon } from '../../../lib/money';

export interface MarginInputs {
  sellingPriceStr: string;
  purchasePriceStr: string;
  extraCostStr: string;
}

export interface MarginValidation {
  isValid: boolean;
  errors: {
    sellingPrice?: string;
    purchasePrice?: string;
    extraCost?: string;
  };
}

export function validateMarginInputs(inputs: MarginInputs): MarginValidation {
  const errors: {
    sellingPrice?: string;
    purchasePrice?: string;
    extraCost?: string;
  } = {};

  const sellStr = inputs.sellingPriceStr.replace(/,/g, '').trim();
  if (!sellStr) {
    errors.sellingPrice = '판매가를 입력해주세요.';
  } else {
    const sellPrice = parseFloat(sellStr);
    if (isNaN(sellPrice) || sellPrice < 0) {
      errors.sellingPrice = '올바른 금액을 입력해주세요.';
    } else if (sellPrice === 0) {
      errors.sellingPrice = '판매가는 0보다 커야 합니다.';
    }
  }

  const buyStr = inputs.purchasePriceStr.replace(/,/g, '').trim();
  if (!buyStr) {
    errors.purchasePrice = '매입가를 입력해주세요.';
  } else {
    const buyPrice = parseFloat(buyStr);
    if (isNaN(buyPrice) || buyPrice < 0) {
      errors.purchasePrice = '올바른 금액을 입력해주세요.';
    }
  }

  const extraStr = inputs.extraCostStr.replace(/,/g, '').trim();
  if (extraStr) {
    const extraPrice = parseFloat(extraStr);
    if (isNaN(extraPrice) || extraPrice < 0) {
      errors.extraCost = '올바른 금액을 입력해주세요.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface MarginResults {
  sellingPrice: number;
  purchasePrice: number;
  extraCost: number;
  totalCost: number;
  marginAmount: number;
  marginRate: number;
  costRate: number;
}

export function calculateMargin(inputs: {
  sellingPrice: number;
  purchasePrice: number;
  extraCost: number;
}): MarginResults {
  const sellingPrice = roundWon(inputs.sellingPrice);
  const purchasePrice = roundWon(inputs.purchasePrice);
  const extraCost = roundWon(inputs.extraCost);

  const totalCost = purchasePrice + extraCost;
  const marginAmount = sellingPrice - totalCost;

  const marginRate = sellingPrice > 0 ? (marginAmount / sellingPrice) * 100 : 0;
  const costRate = sellingPrice > 0 ? (totalCost / sellingPrice) * 100 : 0;

  return {
    sellingPrice,
    purchasePrice,
    extraCost,
    totalCost,
    marginAmount,
    marginRate,
    costRate,
  };
}

export function getMarginVerdict(
  marginAmount: number,
  marginRate: number,
): {
  message: string;
  type: 'danger' | 'warning' | 'success';
} {
  if (marginAmount < 0) {
    return {
      message: '마진이 음수입니다. 판매가 또는 비용을 다시 확인하세요.',
      type: 'danger',
    };
  }
  if (marginRate < 15) {
    return {
      message:
        '마진율이 낮습니다. 비용 구조를 점검해보세요. (업종별 차이가 있을 수 있으므로 참고용으로 활용하세요)',
      type: 'warning',
    };
  }
  return {
    message:
      '마진율이 안정적인 편입니다. (업종별 차이가 있을 수 있으므로 참고용으로 활용하세요)',
    type: 'success',
  };
}

export function getMarginExplanation(res: MarginResults): string {
  return (
    `계산식: 총비용 = 매입가(${res.purchasePrice.toLocaleString()}원) + 기타비용(${res.extraCost.toLocaleString()}원) = ${res.totalCost.toLocaleString()}원\n` +
    `마진액 = 판매가(${res.sellingPrice.toLocaleString()}원) - 총비용(${res.totalCost.toLocaleString()}원) = ${res.marginAmount.toLocaleString()}원\n` +
    `마진율 = 마진액(${res.marginAmount.toLocaleString()}원) / 판매가(${res.sellingPrice.toLocaleString()}원) × 100 = ${res.marginRate.toFixed(1)}%\n` +
    `원가율 = 총비용(${res.totalCost.toLocaleString()}원) / 판매가(${res.sellingPrice.toLocaleString()}원) × 100 = ${res.costRate.toFixed(1)}%`
  );
}
