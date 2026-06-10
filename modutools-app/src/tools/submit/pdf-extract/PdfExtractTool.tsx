import React, { useState, useRef } from 'react';
import PrivacyNotice from '../../../components/submit/PrivacyNotice';
import AdSlot from '../../../components/common/AdSlot';
import SubmitSeo from '../../../components/seo/SubmitSeo';
import {
  Scissors,
  FileIcon,
  Sliders,
  Download,
  CheckCircle,
  Plus,
  RefreshCw,
  HelpCircle,
  ShieldCheck,
  Check,
} from 'lucide-react';
import {
  getPdfLoadMetadata,
  parsePageRange,
  formatSelectedPages,
  extractPdfPages,
} from './pdfExtractUtils';

export default function PdfExtractTool() {
  const [dragActive, setDragActive] = useState(false);
  const [fileObject, setFileObject] = useState<File | null>(null);
  const [fileMetadata, setFileMetadata] = useState<{
    name: string;
    size: number;
    totalPages: number;
  } | null>(null);

  const [pageRangeInput, setPageRangeInput] = useState('');
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [rangeError, setRangeError] = useState<string | null>(null);

  const [isExtracting, setIsExtracting] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [, setExtractedBlob] = useState<Blob | null>(null);
  const [extractedUrl, setExtractedUrl] = useState<string>('');
  const [extractedSize, setExtractedSize] = useState<number>(0);

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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const resetOutputs = () => {
    if (extractedUrl) {
      URL.revokeObjectURL(extractedUrl);
      setExtractedUrl('');
    }
    setExtractedBlob(null);
    setExtractedSize(0);
  };

  const processFile = async (rawFile: File) => {
    setErrorMsg(null);
    setRangeError(null);
    resetOutputs();

    if (rawFile.type !== 'application/pdf' && !rawFile.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('PDF 파일만 업로드할 수 있습니다.');
      return;
    }

    try {
      setCurrentPhase('PDF 분석 중');
      const meta = await getPdfLoadMetadata(rawFile);
      setFileObject(rawFile);
      setFileMetadata({
        name: rawFile.name,
        size: rawFile.size,
        totalPages: meta.pageCount,
      });

      const allPages = Array.from({ length: meta.pageCount }, (_, i) => i + 1);
      setSelectedPages(allPages);
      setPageRangeInput(formatSelectedPages(allPages));
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        'PDF 메타데이터를 파싱하는 과정에서 오류가 발생했습니다. 파일 무결성을 점검하십시오.',
      );
    }
  };

  const removeFile = () => {
    setFileObject(null);
    setFileMetadata(null);
    setSelectedPages([]);
    setPageRangeInput('');
    setRangeError(null);
    resetOutputs();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePageRangeInputChange = (value: string) => {
    setPageRangeInput(value);
    if (!fileMetadata) return;

    if (!value.trim()) {
      setSelectedPages([]);
      setRangeError(null);
      return;
    }

    try {
      const parsed = parsePageRange(value, fileMetadata.totalPages);
      setSelectedPages(parsed);
      setRangeError(null);
    } catch {
      setRangeError('페이지 범위를 다시 확인해주세요.');
    }
  };

  const handlePageToggle = (pageNum: number) => {
    if (!fileMetadata) return;

    let next: number[];
    if (selectedPages.includes(pageNum)) {
      next = selectedPages.filter((p) => p !== pageNum);
    } else {
      next = [...selectedPages, pageNum].sort((a, b) => a - b);
    }

    setSelectedPages(next);
    setPageRangeInput(formatSelectedPages(next));
    setRangeError(null);
  };

  const handleSelectAll = () => {
    if (!fileMetadata) return;
    const all = Array.from({ length: fileMetadata.totalPages }, (_, i) => i + 1);
    setSelectedPages(all);
    setPageRangeInput(formatSelectedPages(all));
    setRangeError(null);
  };

  const handleClearAll = () => {
    if (!fileMetadata) return;
    setSelectedPages([]);
    setPageRangeInput('');
    setRangeError(null);
  };

  const handleSelectOdds = () => {
    if (!fileMetadata) return;
    const odds: number[] = [];
    for (let p = 1; p <= fileMetadata.totalPages; p++) {
      if (p % 2 !== 0) odds.push(p);
    }
    setSelectedPages(odds);
    setPageRangeInput(formatSelectedPages(odds));
    setRangeError(null);
  };

  const handleSelectEvens = () => {
    if (!fileMetadata) return;
    const evens: number[] = [];
    for (let p = 1; p <= fileMetadata.totalPages; p++) {
      if (p % 2 === 0) evens.push(p);
    }
    setSelectedPages(evens);
    setPageRangeInput(formatSelectedPages(evens));
    setRangeError(null);
  };

  const handleStartExtraction = async () => {
    if (!fileObject || !fileMetadata) return;

    if (selectedPages.length === 0) {
      setErrorMsg('추출할 페이지가 최소 1페이지 이상 확보되어야 합니다.');
      return;
    }

    if (rangeError) {
      setErrorMsg('페이지 범위를 다시 확인해주세요.');
      return;
    }

    setIsExtracting(true);
    setErrorMsg(null);
    resetOutputs();

    try {
      const outputBlob = await extractPdfPages(fileObject, selectedPages, (phase) => {
        setCurrentPhase(phase);
      });

      const url = URL.createObjectURL(outputBlob);
      setExtractedBlob(outputBlob);
      setExtractedUrl(url);
      setExtractedSize(outputBlob.size);
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e?.message || '페이지 결단 중 이상 복사가 감지되었습니다.');
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div id="pdf-extract-tool-container" className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="p-1 rounded bg-teal-50 text-teal-700 border border-teal-100">
            <Scissors className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">PDF 페이지 뽑기</h1>
        </div>
        <p className="text-xs text-gray-500">
          PDF에서 필요한 페이지만 선택해 새 PDF로 저장하세요.
        </p>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
        <p className="text-[11px] text-emerald-850 leading-relaxed font-medium">
          <strong>파일은 서버에 저장되지 않습니다.</strong> 모든 처리는 브라우저 안에서만 안전하게
          일방향 진행되며 영구 저장 없이 다운로드 즉시 휘발 소거됩니다.
        </p>
      </div>

      <PrivacyNotice />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {!fileObject && (
            <div
              id="pdf-extract-drop-zone"
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
                id="pdf-extract-native-picker"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-[0px]"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
              />

              <div className="text-center">
                <div className="mx-auto flex items-center justify-center w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full mb-3 shadow-inner">
                  <Plus className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-gray-800">
                  페이지를 뽑아낼 PDF 파일을 드래그해서 놓거나 클릭하여 선택하세요
                </p>
                <button
                  type="button"
                  className="mt-3 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  PDF 업로드
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 text-[11px] text-rose-700 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {fileObject && fileMetadata && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-150 rounded-xl p-4 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="p-2 bg-rose-50 text-rose-600 border border-rose-100/10 rounded-lg shrink-0">
                    <FileIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-[11px] font-bold text-gray-800 truncate"
                      title={fileMetadata.name}
                    >
                      {fileMetadata.name}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1 font-mono font-medium">
                      <span className="text-slate-500">{formatSize(fileMetadata.size)}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">
                        오리지널 총 {fileMetadata.totalPages}페이지
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={removeFile}
                  className="p-1.5 px-3 rounded hover:bg-rose-50 text-rose-600 hover:text-rose-700 font-bold border border-rose-100/30 transition-colors text-[10px] shrink-0 cursor-pointer"
                >
                  지우기
                </button>
              </div>

              <div className="bg-white border border-gray-150 rounded-xl p-5 space-y-4 shadow-sm">
                <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-emerald-700" />
                  추출 대상 규격 공식 지정
                </h3>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">
                      추출 범위 입력 규격
                    </label>
                    <input
                      type="text"
                      value={pageRangeInput}
                      onChange={(e) => handlePageRangeInputChange(e.target.value)}
                      placeholder="예시: 1-3, 5, 8-10 (중간 하이픈 및 쉼표 가능)"
                      className={`w-full px-3 py-2 text-xs border rounded font-mono font-bold focus:outline-emerald-600 ${
                        rangeError
                          ? 'border-rose-300 bg-rose-100/10 focus:outline-rose-500'
                          : 'border-gray-200 bg-white'
                      }`}
                    />

                    {rangeError && (
                      <span className="block text-[10px] text-rose-650 font-bold animate-fade-in">
                        {rangeError}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="px-2.5 py-1.5 rounded border border-gray-200 bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      전체 선택
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="px-2.5 py-1.5 rounded border border-gray-200 bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      전체 해제
                    </button>
                    <button
                      type="button"
                      onClick={handleSelectOdds}
                      className="px-2.5 py-1.5 rounded border border-gray-200 bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      홀수 선택
                    </button>
                    <button
                      type="button"
                      onClick={handleSelectEvens}
                      className="px-2.5 py-1.5 rounded border border-gray-200 bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      짝수 선택
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>개별 페이지 선택기 (체크하여 활성)</span>
                    <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border border-emerald-100/55">
                      {selectedPages.length}개 페이지 선택됨
                    </span>
                  </h4>
                </div>

                <div
                  id="dynamic-visual-page-grid"
                  className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-[360px] overflow-y-auto p-1.5 bg-slate-50 border border-gray-150 rounded-xl no-scrollbar"
                >
                  {Array.from({ length: fileMetadata.totalPages }, (_, index) => {
                    const pageNum = index + 1;
                    const isSelected = selectedPages.includes(pageNum);
                    return (
                      <div
                        key={pageNum}
                        onClick={() => handlePageToggle(pageNum)}
                        className={`aspect-[1/1.41] relative bg-white rounded-lg p-2.5 flex flex-col justify-between select-none cursor-pointer border shadow-2xs hover:shadow-xs transition-all ${
                          isSelected
                            ? 'border-emerald-600 ring-2 ring-emerald-600/15'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-end">
                          {isSelected ? (
                            <div className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[9px] shadow-xs">
                              <Check className="w-2.5 h-2.5 stroke-[4px]" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-300 bg-white" />
                          )}
                        </div>

                        <div className="flex-1 flex flex-col justify-center items-center py-2 space-y-1">
                          <div className="font-sans font-black text-slate-800 text-lg">
                            {pageNum}
                          </div>

                          <div className="w-8/12 h-1 bg-gray-100 rounded" />
                          <div className="w-5/12 h-0.5 bg-gray-100 rounded" />
                          <div className="w-7/12 h-0.5 bg-gray-100 rounded" />
                        </div>

                        <div className="text-center">
                          <p
                            className={`text-[9px] font-bold ${
                              isSelected ? 'text-emerald-700' : 'text-gray-400'
                            }`}
                          >
                            PAGE {pageNum}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <button
                  id="pdf-extract-action-btn"
                  onClick={handleStartExtraction}
                  disabled={selectedPages.length === 0 || isExtracting || !!rangeError}
                  className={`w-full py-4 rounded-xl text-sm font-bold transition-all shadow-sm ${
                    selectedPages.length === 0 || !!rangeError
                      ? 'bg-gray-150 text-gray-400 cursor-not-allowed'
                      : isExtracting
                      ? 'bg-slate-700 text-white cursor-wait'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer'
                  }`}
                >
                  {isExtracting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>추출 필터 조립 진행 중: [{currentPhase}]</span>
                    </div>
                  ) : (
                    '선택 페이지 PDF 만들기'
                  )}
                </button>

                {extractedUrl && (
                  <div
                    id="pdf-extract-outcome-board"
                    className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-5 md:p-6 animate-fade-in space-y-5 text-center"
                  >
                    <div className="flex items-center justify-center w-11 h-11 rounded-full bg-emerald-100 text-emerald-600 mx-auto">
                      <CheckCircle className="w-6 h-6 border-emerald-100" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-gray-900">페이지 추출 완료!</h4>
                      <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                        원본 데이터 중 선택하신 페이지만 정렬 분할 복사하여 추출을 마쳤습니다.
                      </p>
                    </div>

                    <div className="max-w-md mx-auto grid grid-cols-3 bg-white border border-gray-150 rounded-lg py-3.5 shadow-xs divide-x divide-gray-100 font-mono text-xs">
                      <div className="text-center px-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans mb-1">
                          원본 파일 면수
                        </p>
                        <p className="font-bold text-slate-600">
                          {fileMetadata.totalPages} pages
                        </p>
                      </div>
                      <div className="text-center px-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans mb-1">
                          골라 뽑은 면수
                        </p>
                        <p className="font-bold text-emerald-700">
                          {selectedPages.length} pages
                        </p>
                      </div>
                      <div className="text-center px-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans mb-1">
                          추출 후 용량
                        </p>
                        <p className="font-bold text-slate-800">{formatSize(extractedSize)}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                      <a
                        href={extractedUrl}
                        download="extracted_pages.pdf"
                        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>다운로드</span>
                      </a>

                      <button
                        type="button"
                        onClick={removeFile}
                        className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-lg border border-gray-250 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                        <span>새로 만들기</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {fileMetadata && fileMetadata.size >= 10485760 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-[11px] text-amber-900 space-y-1 animate-fade-in">
              <p className="font-bold">⚠️ 대용량 문서 추출 제안</p>
              <p className="leading-relaxed text-amber-800">
                선택하신 문서의 파일 용량이 10MB를 초과 중입니다. 모바일 사양에서는 PDF 페이지
                데이터 렌더링에 일시정지 현상이 올 수 있으니 고사양 컴퓨터(PC) 등 장치 사용을
                권장드립니다.
              </p>
            </div>
          )}

          <div className="bg-white border border-gray-150 rounded-xl p-5 space-y-3.5 shadow-sm">
            <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              페이지 슬라이싱 사용 팁
            </h4>

            <div className="space-y-3 text-[11px] text-gray-650 leading-relaxed">
              <p>
                계약 당사자 간의 개인정보 보호 등 불필요하게 두꺼운 단일 PDF 서적 중 핵심 정산부만
                잘라내 전송하고 싶으실 때 매우 편리합니다.
              </p>
              <ul className="space-y-2 pl-4 list-disc text-[10px] text-slate-500">
                <li>
                  원하는 페이지 썸네일을 직접 클릭해 활성화하거나, 쉼표 `,` 나 하이픈 `-` 을 활용해
                  빠르게 구역 지정을 완료해보세요.
                </li>
                <li>한번 입력한 범위 지정은 위 체크박스 그리드와 실시간 반응 연동됩니다.</li>
                <li>
                  암호 보안 처리가 박힌 파일은 복사에 오류가 있을 수 있으니 잠금을 우선 풀고
                  가져오십시오.
                </li>
              </ul>
            </div>
          </div>

          <AdSlot type="rectangle" label="우측 페이지 추출 광고" />
        </div>
      </div>

      <SubmitSeo toolId="pdf-extract" />
    </div>
  );
}
