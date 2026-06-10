import React, { useEffect, useState } from 'react';
import type { ImageFitMode, TextLayerOptions } from '../../types/canvas';
import { drawBackground, drawImageToCanvas, drawTextLayer } from '../../lib/thumbnail/canvas';
import { loadImage } from '../../lib/thumbnail/image';
import { Eye, Maximize } from 'lucide-react';

export interface CanvasPreviewProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  width: number;
  height: number;
  backgroundColor: string;
  fitMode: ImageFitMode;
  scale: number;
  offsetX: number;
  offsetY: number;
  textOptions: TextLayerOptions;
  uploadedPreviewUrl: string | null;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  canvasRef,
  width,
  height,
  backgroundColor,
  fitMode,
  scale,
  offsetX,
  offsetY,
  textOptions,
  uploadedPreviewUrl,
}) => {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (uploadedPreviewUrl) {
      loadImage(uploadedPreviewUrl)
        .then((img) => {
          setImageElement(img);
        })
        .catch((err) => {
          console.error('Error loading image in preview:', err);
          setImageElement(null);
        });
    } else {
      setImageElement(null);
    }
  }, [uploadedPreviewUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);

    ctx.clearRect(0, 0, width, height);

    drawBackground(ctx, backgroundColor || '#ffffff', width, height);

    if (imageElement) {
      drawImageToCanvas(
        ctx,
        imageElement,
        { width, height },
        fitMode,
        scale,
        offsetX,
        offsetY,
      );
    } else if (uploadedPreviewUrl) {
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('이미지를 블러 오는 중...', width / 2, height / 2);
    } else {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, width - 20, height - 20);

      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.font = '14px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('[이미지를 업로드하면 배경에 표시됩니다]', width / 2, height / 2);
    }

    drawTextLayer(ctx, textOptions, width, height);

    setIsDrawing(false);
  }, [
    canvasRef,
    width,
    height,
    backgroundColor,
    fitMode,
    scale,
    offsetX,
    offsetY,
    textOptions,
    imageElement,
    uploadedPreviewUrl,
  ]);

  return (
    <div id="canvas-preview-box" className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
          <Eye className="w-4 h-4 text-slate-700" />
          <span>실시간 편집 캔버스</span>
        </h4>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
          <Maximize className="w-3.5 h-3.5" />
          <span>
            규격: {width} × {height} px
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden bg-slate-50 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center p-4 min-h-[200px] md:min-h-[300px]">
        {isDrawing && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="text-[11px] font-bold text-slate-650 animate-pulse">
              렌더링 업데이트 중...
            </span>
          </div>
        )}

        <div className="w-full max-w-full max-h-full flex items-center justify-center">
          <canvas
            id="thumbkit-rendering-canvas"
            ref={canvasRef}
            width={width}
            height={height}
            className="shadow-md rounded-lg max-w-full max-h-[350px] object-contain transition-all duration-300 border border-slate-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 justify-center md:justify-start">
        <span className="w-1.5 h-1.5 bg-slate-800 rounded-full animate-ping shrink-0" />
        <p className="text-[10px] text-slate-500 font-medium">
          브라우저 메모리 로컬 빌드: 수치 및 옵션을 조절하면 최적으로 렌더링됩니다.
        </p>
      </div>
    </div>
  );
};

export default CanvasPreview;
