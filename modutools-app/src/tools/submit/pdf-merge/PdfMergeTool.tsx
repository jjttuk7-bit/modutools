import React, { useState, useRef } from 'react';
import PrivacyNotice from '../../../components/submit/PrivacyNotice';
import AdSlot from '../../../components/common/AdSlot';
import SubmitSeo from '../../../components/seo/SubmitSeo';
import {
  Layers,
  FileIcon,
  ArrowUp,
  ArrowDown,
  Download,
  CheckCircle,
  Plus,
  ShieldCheck,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { getPdfPageCount, mergePdfFiles } from './pdfMergeUtils';

interface UploadedPdfItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
}

export default function PdfMergeTool() {
  const [dragActive, setDragActive] = useState(false);
  const [pdfFiles, setPdfFiles] = useState<UploadedPdfItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);

  const [currentPhase, setCurrentPhase] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [, setMergedBlob] = useState<Blob | null>(null);
  const [mergedUrl, setMergedUrl] = useState<string>('');
  const [mergedSize, setMergedSize] = useState<number>(0);
  const [totalMergedPages, setTotalMergedPages] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const resetBlobOutput = () => {
    if (mergedUrl) {
      URL.revokeObjectURL(mergedUrl);
      setMergedUrl('');
    }
    setMergedBlob(null);
    setMergedSize(0);
    setTotalMergedPages(0);
  };

  const processFiles = async (fileList: File[]) => {
    setErrorMsg(null);
    const validPdfs = fileList.filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'),
    );

    if (validPdfs.length === 0 && fileList.length > 0) {
      setErrorMsg('PDF 파일만 업로드할 수 있습니다.');
      return;
    }

    if (validPdfs.length < fileList.length) {
      setErrorMsg('일부 PDF 가 아닌 파일은 선택 목록에서 대기 제외되었습니다.');
    }

    const newPdfs: UploadedPdfItem[] = [];
    for (let i = 0; i < validPdfs.length; i++) {
      const file = validPdfs[i];
      const pageCount = await getPdfPageCount(file);
      newPdfs.push({
        id: `${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        file,
        name: file.name,
        size: file.size,
        pageCount,
      });
    }

    setPdfFiles((prev) => [...prev, ...newPdfs]);
    resetBlobOutput();
  };

  const removeFile = (id: string) => {
    setPdfFiles(pdfFiles.filter((f) => f.id !== id));
    resetBlobOutput();
  };

  const clearAllFiles = () => {
    setPdfFiles([]);
    resetBlobOutput();
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === pdfFiles.length - 1) return;

    const newList = [...pdfFiles];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;

    setPdfFiles(newList);
    resetBlobOutput();
  };

  const handleMerge = async () => {
    if (pdfFiles.length < 2) {
      setErrorMsg('PDF를 합치려면 최소 2개 이상의 문서를 업로드해 주세요.');
      return;
    }

    setIsMerging(true);
    setErrorMsg(null);
    resetBlobOutput();

    try {
      const filesToMerge = pdfFiles.map((p) => p.file);
      const result = await mergePdfFiles(filesToMerge, (phase) => {
        setCurrentPhase(phase);
      });

      const url = URL.createObjectURL(result.blob);
      setMergedBlob(result.blob);
      setMergedUrl(url);
      setMergedSize(result.blob.size);
      setTotalMergedPages(result.pageCount);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err?.message ||
          'PDF 병합 도중 읽을 수 없는 구성이 있어 실패했습니다. 암호화 여부 등을 확인하세요.',
      );
    } finally {
      setIsMerging(false);
    }
  };

  const handleResetMerge = () => {
    clearAllFiles();
  };

  const totalOriginalSize = pdfFiles.reduce((sum, f) => sum + f.size, 0);

  return (
    <div id="pdf-merge-tool-container" className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="p-1 rounded bg-teal-50 text-teal-700 border border-teal-100">
            <Layers className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">PDF 합치기</h1>
        </div>
        <p className="text-xs text-gray-500">
          여러 개의 PDF를 원하는 순서대로 하나의 제출용 PDF로 합치세요.
        </p>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
        <p className="text-[11px] text-emerald-850 leading-relaxed font-medium">
          <strong>파일은 서버에 저장되지 않습니다.</strong> 모든 병합 처리와 완성본 다운로드는 기기
          내부 웹 브라우저 안에서만 격리되어 진행됩니다.
        </p>
      </div>

      <PrivacyNotice />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div
            id="pdf-merge-drop-zone"
            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 transition-colors ${
              dragActive
                ? 'border-emerald-600 bg-emerald-50/20'
                : 'border-gray-200 bg-white hover:border-emerald-500/50'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              id="pdf-merge-native-picker"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-[0px]"
              accept=".pdf,application/pdf"
              multiple
              onChange={handleFileChange}
            />

            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full mb-3 shadow-inner">
                <Plus className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-gray-800">
                합칠 PDF 파일들을 드래그해서 놓거나 여기에 클릭하여 선택하세요
              </p>
              <button
                type="button"
                className="mt-3 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                PDF 업로드
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 text-[11px] text-rose-700 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {pdfFiles.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>결합 대상 문서 대기열</span>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                      {pdfFiles.length}개 파일
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    전체 원본 용량 합계:{' '}
                    <span className="font-semibold text-slate-600 font-mono">
                      {formatSize(totalOriginalSize)}
                    </span>
                  </p>
                </div>

                <button
                  onClick={clearAllFiles}
                  className="text-[10px] font-bold text-rose-600 hover:text-rose-700 hover:underline border border-rose-100/30 rounded bg-rose-50/50 px-2 py-1 transition-colors cursor-pointer"
                >
                  목록 전체 삭제
                </button>
              </div>

              <div id="pdf-reorder-group" className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {pdfFiles.map((file, index) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2.5 bg-white border border-gray-150 rounded-lg p-3 shadow-xs hover:border-gray-250 transition-colors"
                  >
                    <div className="p-2 bg-rose-50 text-rose-600 rounded border border-rose-100/20 shrink-0">
                      <FileIcon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0 pr-1">
                      <p className="text-[11px] font-bold text-gray-800 truncate" title={file.name}>
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1 font-mono">
                        <span className="text-slate-500 font-semibold">{formatSize(file.size)}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">{file.pageCount} 페이지</span>
                        <span>•</span>
                        <span className="text-slate-400">병합 {index + 1}순위</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 bg-slate-50 border border-gray-100 p-0.5 rounded-lg">
                      <button
                        onClick={() => moveFile(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-white hover:shadow-xs text-slate-500 disabled:opacity-20 transition-all cursor-pointer"
                        title="순번 올리기"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveFile(index, 'down')}
                        disabled={index === pdfFiles.length - 1}
                        className="p-1 rounded hover:bg-white hover:shadow-xs text-slate-500 disabled:opacity-20 transition-all cursor-pointer"
                        title="순번 내리기"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 px-2 rounded hover:bg-rose-50 text-rose-500 hover:text-rose-600 transition-colors text-[10px] font-bold shrink-0 cursor-pointer"
                      title="제거"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button
              id="pdf-merge-action-button"
              onClick={handleMerge}
              disabled={pdfFiles.length < 2 || isMerging}
              className={`w-full py-4 rounded-xl text-sm font-bold transition-all shadow-sm ${
                pdfFiles.length < 2
                  ? 'bg-gray-150 text-gray-400 cursor-not-allowed'
                  : isMerging
                  ? 'bg-slate-700 text-white cursor-wait'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer'
              }`}
            >
              {isMerging ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>병합 어셈블리 진행 중: [{currentPhase}]</span>
                </div>
              ) : (
                'PDF 합치기'
              )}
            </button>

            {mergedUrl && (
              <div
                id="pdf-merge-success-banner"
                className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-5 md:p-6 animate-fade-in space-y-5 text-center"
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-emerald-100 text-emerald-600 mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-gray-900">모든 PDF 파일 통합 완료!</h4>
                  <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                    선택한 정렬 순번을 온전히 준수하여 단일 통합 PDF 문서가 메모리에
                    조립되었습니다.
                  </p>
                </div>

                <div className="max-w-md mx-auto grid grid-cols-3 bg-white border border-gray-150 rounded-lg py-3.5 shadow-xs divide-x divide-gray-100 font-mono text-xs">
                  <div className="text-center px-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans mb-1">
                      원본 파일 개수
                    </p>
                    <p className="font-bold text-slate-600">{pdfFiles.length}개</p>
                  </div>
                  <div className="text-center px-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans mb-1">
                      합쳐진 전체 면수
                    </p>
                    <p className="font-bold text-emerald-700">{totalMergedPages} pages</p>
                  </div>
                  <div className="text-center px-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans mb-1">
                      최종 파일 크기
                    </p>
                    <p className="font-bold text-slate-800">{formatSize(mergedSize)}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                  <a
                    href={mergedUrl}
                    download="merged.pdf"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>다운로드</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleResetMerge}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-lg border border-gray-250 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    <span>새로 만들기</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {totalOriginalSize >= 10485760 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-[11px] text-amber-900 space-y-1 animate-fade-in">
              <p className="font-bold">⚠️ 대용량 문서 병합 관리</p>
              <p className="leading-relaxed text-amber-800">
                선택하신 문서들의 총 기입 용량이 10MB를 초과 전개 중입니다. 모바일 사양에서는 PDF
                메모리 용량 누수로 튕길 우려가 있으니 컴퓨터(PC) 등 고사양 장치 사용을 강력 권유
                드립니다.
              </p>
            </div>
          )}

          <div className="bg-white border border-gray-150 rounded-xl p-5 space-y-3.5 shadow-sm">
            <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-700" />
              정렬 정비 사용 팁
            </h4>

            <div className="space-y-3 text-[11px] text-gray-650 leading-relaxed">
              <p>
                제출이 까다로운 채용 공고 또는 관공서에서는 서류 제출 시 파일 하나로 업로드하도록
                규정하는 경우가 대부분입니다.
              </p>
              <ul className="space-y-2 pl-4 list-disc text-[10px] text-slate-500">
                <li>
                  이력서, 졸업증명서, 성적표, 추천서를 업로드하여 순서대로 위/아래 교대 정렬해 묶을
                  수 있습니다.
                </li>
                <li>
                  암호가 설정되어 전송을 거부하는 파일의 경우, 사전에 암호 보호를 완벽히 푼 뒤
                  PDF 정리 도구에 밀어넣으셔야 오류가 흐르지 않습니다.
                </li>
              </ul>
            </div>
          </div>

          <AdSlot type="rectangle" label="우측 파일 병합 광고" />
        </div>
      </div>

      <SubmitSeo toolId="pdf-merge" />
    </div>
  );
}
