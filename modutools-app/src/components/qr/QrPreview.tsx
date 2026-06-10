import React, { useEffect, useRef } from 'react';
import { Eye, Shield, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';

interface QrPreviewProps {
  value?: string;
  fgColor?: string;
  bgColor?: string;
  margin?: number;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

export const QrPreview: React.FC<QrPreviewProps> = ({
  value = '',
  fgColor = '#0f172a',
  bgColor = '#ffffff',
  margin = 4,
  canvasRef,
}) => {
  const localCanvasRef = useRef<HTMLCanvasElement>(null);
  const activeCanvasRef = canvasRef || localCanvasRef;

  useEffect(() => {
    if (!value) return;

    const canvas = activeCanvasRef.current;
    if (canvas) {
      QRCode.toCanvas(
        canvas,
        value,
        {
          width: 240,
          margin,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: 'H',
        },
        (error) => {
          if (error) {
            console.error('QR Code render error:', error);
          }
        },
      );
    }
  }, [value, fgColor, bgColor, margin, activeCanvasRef]);

  return (
    <div
      className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center h-full min-h-[380px]"
      id="qr-preview-container"
    >
      <div className="flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4">
        <Sparkles size={12} className="animate-pulse" />
        <span className="font-bold">실시간 미리보기</span>
      </div>

      <div
        className="w-[200px] h-[200px] md:w-[240px] md:h-[240px] rounded-2xl overflow-hidden shadow-md flex items-center justify-center transition-all duration-300 relative bg-white border border-slate-100"
        id="qr-render-box"
      >
        {value ? (
          <canvas
            ref={activeCanvasRef}
            className="w-full h-full object-contain"
            id="qr-active-canvas"
          />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 p-4 text-slate-400">
            <Eye size={36} className="text-slate-300 stroke-[1.5]" />
            <p className="text-xs font-bold leading-normal text-slate-500">
              정보를 입력하고
              <br />
              [QR 생성하기]를 눌러주세요.
            </p>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 mt-4 max-w-[200px] font-medium leading-relaxed">
        {value
          ? '실시간 코드 스캔이 즉시 가능합니다.'
          : '입력값 설정 시 코드가 자동으로 갱신됩니다.'}
      </p>
      <div className="mt-2.5 flex items-center justify-center space-x-1 text-[10px] text-slate-400 font-semibold">
        <Shield size={12} className="text-emerald-600" />
        <span>서버 전송 없이 100% 로컬 브라우저 보안 구동</span>
      </div>
    </div>
  );
};

export default QrPreview;
