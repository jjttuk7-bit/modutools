import React, { lazy } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { categoryById } from '../../data/categories';

const VatCalculatorTool = lazy(
  () => import('../../tools/business/vat-calculator/VatCalculatorTool'),
);
const SupplyPriceTool = lazy(
  () => import('../../tools/business/supply-price/SupplyPriceTool'),
);
const FreelancerTaxTool = lazy(
  () => import('../../tools/business/freelancer-tax/FreelancerTaxTool'),
);
const QuoteSplitTool = lazy(
  () => import('../../tools/business/quote-split/QuoteSplitTool'),
);
const MarginCalculatorTool = lazy(
  () => import('../../tools/business/margin-calculator/MarginCalculatorTool'),
);

const toolComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'vat-calculator': VatCalculatorTool,
  'supply-price': SupplyPriceTool,
  'freelancer-tax': FreelancerTaxTool,
  'quote-split': QuoteSplitTool,
  'margin-calculator': MarginCalculatorTool,
};

export default function BusinessToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const category = categoryById['business'];
  const ToolComponent = toolId ? toolComponents[toolId] : undefined;

  if (!ToolComponent) {
    return <Navigate to={category.path} replace />;
  }

  return (
    <div className="space-y-4">
      <Link
        to={category.path}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {category.shortName}로 돌아가기
      </Link>
      <ToolComponent />
    </div>
  );
}
