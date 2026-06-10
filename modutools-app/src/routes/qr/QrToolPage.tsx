import React, { lazy } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { categoryById } from '../../data/categories';

const UrlQrTool = lazy(() => import('../../tools/qr/url-qr/UrlQrTool'));
const WifiQrTool = lazy(() => import('../../tools/qr/wifi-qr/WifiQrTool'));
const VcardQrTool = lazy(() => import('../../tools/qr/vcard-qr/VcardQrTool'));
const QrReaderTool = lazy(() => import('../../tools/qr/qr-reader/QrReaderTool'));
const QrDesignTool = lazy(() => import('../../tools/qr/qr-design/QrDesignTool'));

const toolComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'url-qr': UrlQrTool,
  'wifi-qr': WifiQrTool,
  'vcard-qr': VcardQrTool,
  'qr-reader': QrReaderTool,
  'qr-design': QrDesignTool,
};

export default function QrToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const category = categoryById['qr'];
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
