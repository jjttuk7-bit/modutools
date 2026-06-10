export type CalculationType = 'vat' | 'supply' | 'freelancer' | 'quote' | 'margin';

export interface BaseCalculatorState {
  isCalculated: boolean;
}

export interface VatCalculatorState extends BaseCalculatorState {
  supplyAmt: number;
  vatAmt: number;
  totalAmt: number;
  taxType: 'taxable' | 'zero' | 'exempt';
}

export interface SupplyPriceState extends BaseCalculatorState {
  totalAmt: number;
  supplyAmt: number;
  vatAmt: number;
}

export interface FreelancerTaxState extends BaseCalculatorState {
  contractAmt: number;
  tax3: number;
  tax03: number;
  totalTax: number;
  actualAmt: number;
  customTaxPaid?: boolean;
}

export interface QuoteSplitState extends BaseCalculatorState {
  totalAmt: number;
  items: Array<{
    name: string;
    supplyAmt: number;
    vatAmt: number;
    totalAmt: number;
  }>;
}

export interface MarginCalculatorState extends BaseCalculatorState {
  purchaseAmt: number;
  saleAmt: number;
  marginAmt: number;
  marginRate: number;
  roi: number;
}
