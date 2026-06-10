import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Loader2, Move, MousePointer, Info, X } from 'lucide-react';
import type { MaskBox } from '../../types/mask';
import { renderPdfPage } from '../../lib/mask/pdfRender';
import { convertCanvasToPdf, convertPdfToCanvas } from '../../lib/mask/coordinate';

interface PdfViewerProps {
  pdfDoc: any;
  currentPage: number;
  scale: number;
  onScaleChange: (scale: number) => void;
  boxes: MaskBox[];
  onAddBox: (box: Omit<MaskBox, 'id' | 'pageNumber'>) => void;
  onRemoveBox: (id: string) => void;
}

export default function PdfViewer({
  pdfDoc,
  currentPage,
  scale,
  onScaleChange,
  boxes,
  onAddBox,
  onRemoveBox,
}: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<any>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let active = true;
    setIsRendering(true);
    setRenderError(null);

    const renderInstance = renderPdfPage(pdfDoc, currentPage, canvasRef.current!, scale);

    renderInstance.promise
      .then((vp) => {
        if (active) {
          setViewport(vp);
          setIsRendering(false);
        }
      })
      .catch((err: any) => {
        if (!active) return;
        if (
          err?.name === 'RenderingCancelledException' ||
          err?.message?.includes('cancel') ||
          err?.message?.includes('cancelled')
        ) {
          return;
        }
        console.error('PDF page render error:', err);
        setRenderError(err.message || String(err));
        setIsRendering(false);
      });

    return () => {
      active = false;
      renderInstance.cancel();
    };
  }, [pdfDoc, currentPage, scale]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!viewport || isRendering) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setDragStart({ x, y });
    setDragCurrent({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !dragStart) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDragCurrent({ x, y });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !dragStart || !dragCurrent || !viewport) {
      setIsDrawing(false);
      setDragStart(null);
      setDragCurrent(null);
      return;
    }

    setIsDrawing(false);

    const canvasX = Math.min(dragStart.x, dragCurrent.x);
    const canvasY = Math.min(dragStart.y, dragCurrent.y);
    const canvasWidth = Math.abs(dragStart.x - dragCurrent.x);
    const canvasHeight = Math.abs(dragStart.y - dragCurrent.y);

    if (canvasWidth > 4 && canvasHeight > 4) {
      const pdfBox = convertCanvasToPdf(canvasX, canvasY, canvasWidth, canvasHeight, viewport);
      onAddBox(pdfBox);
    }

    setDragStart(null);
    setDragCurrent(null);
  };

  const handleMouseLeave = () => {
    if (isDrawing) {
      handleMouseUp();
    }
  };

  const handleZoomIn = () => {
    onScaleChange(Math.min(scale + 0.1, 3.0));
  };

  const handleZoomOut = () => {
    onScaleChange(Math.max(scale - 0.1, 0.1));
  };

  const handleFitToWidth = () => {
    if (!pdfDoc || !containerRef.current) return;
    try {
      pdfDoc.getPage(currentPage).then((page: any) => {
        const originalViewport = page.getViewport({ scale: 1.0 });
        const containerWidth = containerRef.current!.clientWidth - 48;
        const calculatedScale = Math.min(
          Math.max(containerWidth / originalViewport.width, 0.1),
          3.0,
        );
        onScaleChange(Math.round(calculatedScale * 100) / 100);
      });
    } catch (e) {
      console.error('Fit to width calculate error:', e);
    }
  };

  const currentPageBoxes = boxes.filter((box) => box.pageNumber === currentPage);

  const getTempBoxStyle = () => {
    if (!dragStart || !dragCurrent) return {};
    const left = Math.min(dragStart.x, dragCurrent.x);
    const top = Math.min(dragStart.y, dragCurrent.y);
    const width = Math.abs(dragStart.x - dragCurrent.x);
    const height = Math.abs(dragStart.y - dragCurrent.y);

    return {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
    };
  };

  return (
    <div
      id="pdf-viewer-widget"
      className="bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full min-h-[500px]"
    >
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-50 text-emerald-700 p-1.5 rounded-lg border border-emerald-100">
            <MousePointer className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">마스킹 캔버스</h4>
            <p className="text-[11px] text-slate-500">
              지우고 싶은 민감정보 영역을 마우스 드래그로 그리세요.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="fit-width-btn"
            onClick={handleFitToWidth}
            className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-all cursor-pointer shadow-sm hover:scale-102"
            title="현재 화면 크기에 맞게 문서 크기를 자동 조절합니다"
          >
            <Move className="w-3.5 h-3.5 text-emerald-600" />
            <span>너비 맞춤</span>
          </button>

          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg shadow-sm">
            <button
              id="zoom-out-btn"
              onClick={handleZoomOut}
              disabled={scale <= 0.1}
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded transition-all cursor-pointer disabled:text-slate-300 disabled:cursor-not-allowed"
              title="축소"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="text-xs font-semibold text-slate-700 font-mono w-12 text-center select-none">
              {Math.round(scale * 100)}%
            </span>

            <button
              id="zoom-in-btn"
              onClick={handleZoomIn}
              disabled={scale >= 3.0}
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded transition-all cursor-pointer disabled:text-slate-300 disabled:cursor-not-allowed"
              title="확대"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        id="pdf-editor-panel"
        ref={containerRef}
        className="flex-1 overflow-auto p-6 flex justify-center items-start min-h-[400px] relative select-none"
      >
        {isRendering && (
          <div className="absolute inset-0 bg-slate-100/70 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2 z-20">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <span className="text-xs font-semibold text-slate-600">
              페이지를 고품질로 변환 중...
            </span>
          </div>
        )}

        <div
          id="canvas-stage-wrapper"
          className="relative shadow-lg border border-slate-200 bg-white"
          style={{
            width: viewport ? `${viewport.width}px` : '100%',
            height: viewport ? `${viewport.height}px` : '450px',
            maxWidth: viewport ? 'none' : '550px',
          }}
        >
          {renderError && (
            <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center p-6 text-center gap-4 z-20 overflow-auto">
              <div className="bg-rose-100 text-rose-700 p-3 rounded-full">
                <Info className="w-6 h-6" />
              </div>
              <div className="max-w-md space-y-2">
                <span className="text-sm font-bold text-slate-800 block">
                  문서 페이지 시각화 오류
                </span>
                <p className="text-xs text-slate-500 leading-relaxed font-mono bg-slate-100 p-2.5 rounded border border-slate-200 break-all select-text">
                  {renderError}
                </p>
                <div className="bg-amber-50 text-amber-800 p-3 rounded-lg border border-amber-200 text-left space-y-1 mt-4">
                  <p className="text-xs font-bold">💡 조치 방법 안내:</p>
                  <ul className="text-[11px] list-disc list-inside space-y-1 text-amber-700">
                    <li>대용량 PDF 문서인 경우 브라우저 렌더러 메모리가 일시적으로 모자랄 수 있습니다.</li>
                    <li>웹 브라우저의 전용 그래픽 하드웨어 가속 설정을 확인하세요.</li>
                    <li>
                      페이지가 정상 변환되지 않았다면 PDF 대신 문서를{' '}
                      <b>캡처한 이미지 파일(PNG/JPG)</b>로 업로드하시면 더욱 매끄럽고 완벽하게
                      작동합니다.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <canvas
            id="pdf-interactive-canvas"
            ref={canvasRef}
            className={viewport ? 'block pointer-events-none' : 'hidden'}
          />

          {viewport && (
            <div
              id="mask-drawing-overlay"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              className="absolute inset-0 cursor-crosshair z-10"
            >
              {currentPageBoxes.map((box) => {
                const canvasBox = convertPdfToCanvas(
                  box.x,
                  box.y,
                  box.width,
                  box.height,
                  viewport,
                );

                return (
                  <div
                    id={`active-mask-${box.id}`}
                    key={box.id}
                    className="absolute bg-black cursor-default border border-rose-500/30 group p-0"
                    style={{
                      left: `${canvasBox.x}px`,
                      top: `${canvasBox.y}px`,
                      width: `${canvasBox.width}px`,
                      height: `${canvasBox.height}px`,
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <button
                      id={`remove-mask-${box.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveBox(box.id);
                      }}
                      className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-rose-600 hover:scale-110 cursor-pointer z-30 border border-white"
                      title="이 마스킹 박스 개별 삭제"
                    >
                      <X className="w-3 h-3" />
                    </button>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-70 transition-opacity">
                      <span className="text-[10px] text-white bg-slate-900 border border-slate-700 px-1 py-0.5 rounded leading-none font-mono">
                        가려짐
                      </span>
                    </div>
                  </div>
                );
              })}

              {isDrawing && dragStart && dragCurrent && (
                <div
                  id="temporary-drag-indicator"
                  className="absolute bg-black/40 border border-emerald-500 border-dashed pointer-events-none"
                  style={getTempBoxStyle()}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 border-t border-slate-200 p-3 px-4 flex items-center gap-2 text-xs text-slate-500 shrink-0">
        <Info className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>지우고 싶은 비밀 번호, 계좌, 주소, 주민등록 상의 단어를 보며 직접 드래그해서 가리세요.</span>
      </div>
    </div>
  );
}
