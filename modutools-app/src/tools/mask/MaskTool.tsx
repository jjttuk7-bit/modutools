import { useState, useEffect } from 'react';
import { FileDigit, Loader2, ShieldCheck } from 'lucide-react';
import FileUploader from '../../components/mask/FileUploader';
import PdfViewer from '../../components/mask/PdfViewer';
import Toolbar from '../../components/mask/Toolbar';
import InfoSections from '../../components/mask/InfoSections';
import PrivacyBadges from '../../components/common/PrivacyBadges';
import type { MaskBox } from '../../types/mask';
import { loadPdfDocument } from '../../lib/mask/pdfRender';
import { applyMaskToPdf } from '../../lib/mask/pdfMask';
import { convertImageToPdf } from '../../lib/mask/pdfImageConverter';

export default function MaskTool() {
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.3);

  const [fileError, setFileError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);

  const [boxes, setBoxes] = useState<MaskBox[]>([]);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  const goToNextPage = () => {
    if (pageCount && currentPage < pageCount) {
      setCurrentPage((p) => p + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!pdfDoc) return;

      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft') {
        goToPrevPage();
      } else if (e.key === 'ArrowRight') {
        goToNextPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfDoc, currentPage, pageCount]);

  const handleClearWithoutErrorReset = () => {
    setPdfBytes(null);
    setFileName(null);
    setFileSize(null);
    setPdfDoc(null);
    setPageCount(null);
    setCurrentPage(1);
    setBoxes([]);
  };

  const handleFileSelect = async (file: File, buffer: ArrayBuffer) => {
    setFileError(null);
    setIsConverting(true);
    try {
      let finalBuffer = buffer;
      let finalSize = file.size;

      const lowerName = file.name.toLowerCase();
      const isImage =
        lowerName.endsWith('.png') ||
        lowerName.endsWith('.jpg') ||
        lowerName.endsWith('.jpeg');

      if (isImage) {
        const pdfFromImageBytes = await convertImageToPdf(buffer, file.name);
        finalBuffer = pdfFromImageBytes;
        finalSize = pdfFromImageBytes.byteLength;
      }

      const bufferForPdfJs = finalBuffer.slice(0);
      const bufferForPdfLib = finalBuffer.slice(0);

      const loadedDoc = await loadPdfDocument(bufferForPdfJs);
      setPdfDoc(loadedDoc);
      setPageCount(loadedDoc.numPages);
      setCurrentPage(1);
      setPdfBytes(bufferForPdfLib);
      setFileName(file.name);
      setFileSize(finalSize);

      try {
        const firstPage = await loadedDoc.getPage(1);
        const originalViewport = firstPage.getViewport({ scale: 1.0 });
        const targetWidth = 720;
        const autoScale = Math.min(
          Math.max(targetWidth / originalViewport.width, 0.15),
          1.5,
        );
        setScale(Math.round(autoScale * 100) / 100);
      } catch (scaleErr) {
        console.error('Failed to calculate initial scale, defaulting to 1.0:', scaleErr);
        setScale(1.0);
      }

      setBoxes([]);
    } catch (err: any) {
      console.error('Failed to parse document:', err);
      setFileError(
        err.message ||
          '파일을 로딩하는 과정에서 치명적인 오류가 발생했습니다. 암호화되거나 깨진 파일이 아닌지 확인하세요.',
      );
      handleClearWithoutErrorReset();
    } finally {
      setIsConverting(false);
    }
  };

  const handleClear = () => {
    handleClearWithoutErrorReset();
    setFileError(null);
  };

  const handleAddBox = (boxCoords: Omit<MaskBox, 'id' | 'pageNumber'>) => {
    const newBox: MaskBox = {
      id: crypto.randomUUID(),
      pageNumber: currentPage,
      ...boxCoords,
    };
    setBoxes((prev) => [...prev, newBox]);
  };

  const handleRemoveBox = (id: string) => {
    setBoxes((prev) => prev.filter((box) => box.id !== id));
  };

  const handleUndo = () => {
    if (boxes.length === 0) return;
    setBoxes((prev) => prev.slice(0, -1));
  };

  const handleClearCurrentPage = () => {
    setBoxes((prev) => prev.filter((box) => box.pageNumber !== currentPage));
  };

  const handleClearAll = () => {
    if (boxes.length === 0) return;
    if (window.confirm('모든 페이지에 그려진 마스킹 가림 박스를 완전히 초기화하시겠습니까?')) {
      setBoxes([]);
    }
  };

  const handleDownload = async () => {
    if (!pdfBytes) return;

    try {
      setIsDownloading(true);

      const compiledPdfBytes = await applyMaskToPdf(pdfBytes, boxes);

      const blob = new Blob([compiledPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;

      const cleanName = fileName ? fileName.replace(/\.(pdf|png|jpe?g)$/i, '') : 'document';
      link.download = `masked_${cleanName}.pdf`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Failed to export masked PDF document:', err);
      alert(
        `마스킹된 PDF 문서를 병합 및 컴파일하는 데 일시적인 오류가 발생했습니다.\n\n상세 요인: ${
          err?.message || String(err)
        }`,
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const currentPageBoxesCount = boxes.filter((b) => b.pageNumber === currentPage).length;

  return (
    <div id="mask-tool-root" className="space-y-6">
      <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-violet-700 bg-violet-50 border border-violet-100 rounded-full px-3 py-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          업로드 없음, 전송 없음
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
          안심마스킹
        </h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-3xl">
          계약서, 사업자등록증, 통장사본, 이력서, 신청서 등의 민감한 개인 식별 부위를 브라우저 안에서
          직접 마스킹하고 안전한 PDF로 받아 가세요.
        </p>
        <div className="mt-4">
          <PrivacyBadges />
        </div>
      </section>

      <div
        id="split-screen-layout"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
      >
        <div id="left-controls-column" className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              문서 업로드
            </h3>
            {isConverting ? (
              <div
                id="uploader-converting-loader"
                className="flex flex-col items-center justify-center py-10 text-center space-y-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl"
              >
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                <div className="space-y-1 px-4">
                  <p className="text-xs font-bold text-slate-700">안전한 로컬 변환 작업 중</p>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    업로드한 파일을 기기 메모리에서
                    <br />
                    안전하게 마스킹 전용 PDF로 정제하고 있습니다.
                  </p>
                </div>
              </div>
            ) : (
              <FileUploader
                fileName={fileName}
                fileSize={fileSize}
                pageCount={pageCount}
                onFileSelect={handleFileSelect}
                onClear={handleClear}
                externalError={fileError}
                onClearExternalError={() => setFileError(null)}
              />
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                편집 도구
              </h3>

              {pdfDoc ? (
                <Toolbar
                  currentPage={currentPage}
                  pageCount={pageCount || 1}
                  onPrevPage={goToPrevPage}
                  onNextPage={goToNextPage}
                  onUndo={handleUndo}
                  onClearCurrentPage={handleClearCurrentPage}
                  onClearAll={handleClearAll}
                  onDownload={handleDownload}
                  canUndo={boxes.length > 0}
                  hasBoxesOnPage={currentPageBoxesCount > 0}
                  hasAnyBoxes={boxes.length > 0}
                  isDownloading={isDownloading}
                  currentBoxesCount={currentPageBoxesCount}
                  totalBoxesCount={boxes.length}
                />
              ) : (
                <div
                  id="toolbar-disabled-card"
                  className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-6 text-center"
                >
                  <p className="text-xs text-slate-400 leading-relaxed">
                    마스킹할 PDF 파일을 등록 필드에 안심하고 로드해 주시면 세부 편집 도구(페이지 변환,
                    취소, 기기 다운로드 등)가 활성화됩니다.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between opacity-50">
              <span className="text-[10px] font-mono">v1.0.2 Stable</span>
              <span className="text-[10px] font-medium">Privacy First Design</span>
            </div>
          </div>
        </div>

        <div id="center-workspace-column" className="lg:col-span-6 flex flex-col">
          {pdfDoc ? (
            <PdfViewer
              pdfDoc={pdfDoc}
              currentPage={currentPage}
              scale={scale}
              onScaleChange={setScale}
              boxes={boxes}
              onAddBox={handleAddBox}
              onRemoveBox={handleRemoveBox}
            />
          ) : (
            <div
              id="empty-viewer-placeholder"
              className="flex-1 min-h-[500px] border border-slate-300 rounded-2xl bg-white flex flex-col items-center justify-center p-8 text-center space-y-5 relative shadow-inner"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-inner">
                <FileDigit className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-2">
                <h4 className="text-base font-bold text-slate-800">
                  문서 및 이미지 미리보기가 여기에 나타납니다
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  왼쪽의 파일 업로드 구역에 PDF 또는 이미지(PNG, JPG)를 등록해주시면 기기 내부에서 즉시
                  안전한 가상 프리뷰로 렌더링되며, 즉각적인 마우스 드래그를 통해 실시간 마스킹이
                  시작됩니다.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-5 border-t border-slate-100 w-full max-w-sm text-left">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  <span>서버 업로드 및 원격 네트워크 송출 일체 없음 (기밀 유지)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  <span>수동 마스킹으로 기계 오작동이나 민감 문자 누출 없음</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  <span>영구적인 완전 무료, 워터마크 없음</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div id="right-info-column" className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-5 flex items-start gap-3">
            <span className="text-xl">🛡️</span>
            <div>
              <h4 className="text-xs font-bold text-emerald-800">안심하세요</h4>
              <p className="text-[11.5px] text-emerald-700 leading-relaxed mt-1">
                이 서비스는 사용자의 귀중한 PDF 파일을 외부 서버에 저장하거나 외부로 전송하지 않습니다.
                모든 PDF 처리, 미리보기, 마스킹 박스 입히기 작업은 브라우저 안에서만 진행됩니다.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              주의사항 및 도움말
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-700 mb-1">꼭 가려야 할 정보들</p>
                <ul className="text-[11px] text-slate-500 space-y-1 list-disc list-inside">
                  <li>주민등록번호 전체 부위</li>
                  <li>계좌번호 및 개인 신용카드 번호</li>
                  <li>상세 집 주소 및 연락처 정보</li>
                  <li>직인, 대표자 인장 및 사인 날인</li>
                </ul>
              </div>

              <div className="p-3 border border-slate-100 rounded-xl">
                <p className="font-bold text-slate-700 mb-1">모바일 사용 권장안</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  터치 제스처를 지원하지만, 픽셀 단위의 정밀한 마스킹 박스 설정을 위하여 PC 환경에서
                  마우스 및 트랙패드로 편집하시는 것을 강력히 권장합니다.
                </p>
              </div>

              <div className="p-3 border border-slate-100 rounded-xl">
                <p className="font-bold text-slate-700 mb-1">새로고침 시 폐기 규칙</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  웹 보안 표준에 따라 새로고침 시 이전에 기록된 마스킹 좌표는 모두 메모리에서 즉시 영구
                  폐기됩니다. 작업물은 가공 후 즉시 다운로드하세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="manual-and-faq-details">
        <InfoSections />
      </section>
    </div>
  );
}
