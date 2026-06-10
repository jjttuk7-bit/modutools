import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import PrivacyNotice from '../../../components/submit/PrivacyNotice';
import AdSlot from '../../../components/common/AdSlot';
import SubmitSeo from '../../../components/seo/SubmitSeo';
import {
  FileImage,
  Trash2,
  ArrowUp,
  ArrowDown,
  Download,
  CheckCircle,
  Plus,
  ArrowRight,
  Info,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import type {
  ImageFileItem,
  PaperSizeOption,
  MarginOption,
  QualityOption,
} from './photoToPdfUtils';
import { generatePhotoToPdf } from './photoToPdfUtils';

export default function PhotoToPdfTool() {
  const [dragActive, setDragActive] = useState(false);
  const [images, setImages] = useState<ImageFileItem[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [paperSize, setPaperSize] = useState<PaperSizeOption>('A4_PORTRAIT');
  const [margin, setMargin] = useState<MarginOption>('WITH_MARGIN');
  const [quality, setQuality] = useState<QualityOption>('STANDARD');

  const [result, setResult] = useState<{
    pdfUrl: string;
    pdfSize: number;
    pageCount: number;
    originalSize: number;
  } | null>(null);

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

  const processFiles = (fileList: File[]) => {
    setErrorMsg(null);
    const validImages = fileList.filter((f) =>
      ['image/jpeg', 'image/png', 'image/webp'].includes(f.type),
    );

    if (validImages.length === 0 && fileList.length > 0) {
      setErrorMsg('이미지 파일만 업로드할 수 있습니다. (JPG, JPEG, PNG, WEBP만 호환 가능)');
      return;
    }

    if (validImages.length < fileList.length) {
      setErrorMsg('일부 이미지 형식이 아닌 파일은 선택 리스트에서 제외되었습니다.');
    }

    const newItems: ImageFileItem[] = validImages.map((file, i) => ({
      id: `${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
      file,
      name: file.name,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newItems]);
    setResult(null);
  };

  const removeImage = (id: string) => {
    const target = images.find((img) => img.id === id);
    if (target) {
      URL.revokeObjectURL(target.previewUrl);
    }
    setImages((prev) => prev.filter((img) => img.id !== id));
    setResult(null);
  };

  const clearAllImages = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setResult(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === images.length - 1) return;

    const newImages = [...images];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = newImages[index];
    newImages[index] = newImages[targetIdx];
    newImages[targetIdx] = temp;

    setImages(newImages);
  };

  const handleConvert = async () => {
    if (images.length === 0) return;
    setIsConverting(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const pdfBytes = await generatePhotoToPdf(
        images,
        { paperSize, margin, quality },
        (status) => {
          setProgressStatus(status);
        },
      );

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(blob);
      const originalSizeSum = images.reduce((sum, img) => sum + img.size, 0);

      setResult({
        pdfUrl,
        pdfSize: pdfBytes.length,
        pageCount: images.length,
        originalSize: originalSizeSum,
      });
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e?.message || 'PDF 결합 진행 도중 오류가 발생했습니다.');
    } finally {
      setIsConverting(false);
    }
  };

  const totalOriginalSize = images.reduce((sum, img) => sum + img.size, 0);

  return (
    <div id="photo-to-pdf-tool" className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="p-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
            <FileImage className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">사진 PDF 변환</h1>
        </div>
        <p className="text-xs text-gray-500">
          사업자등록증, 통장사본, 신분증 사본, 영수증, 과제 사진을 제출용 PDF로 변환하세요.
        </p>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
        <p className="text-[11px] text-emerald-850 leading-relaxed font-medium">
          <strong>파일은 서버에 저장되지 않습니다.</strong> 모든 처리는 인터넷이 차단되어도 브라우저
          안에서만 안전하게 실행되는 100% 온디바이스(On-device) 장치입니다. 안심하고 서류를
          정리하세요.
        </p>
      </div>

      <PrivacyNotice />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div
            id="image-drop-area"
            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-colors ${
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
              id="image-picker-input"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
            />

            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full mb-3 shadow-inner">
                <Plus className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-gray-800">
                변환할 이미지들을 드래그해서 놓거나 이곳을 클릭하세요
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                허용 파일 형식: JPG, JPEG, PNG, WEBP (다중 선택 가능)
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 text-[11px] text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {images.length > 0 && (
            <div id="image-queue-wrapper" className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>대기 이미지 목록</span>
                    <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-full text-[10px] font-mono">
                      {images.length}장
                    </span>
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    전체 원본 용량:{' '}
                    <span className="font-semibold text-slate-600 font-mono">
                      {formatSize(totalOriginalSize)}
                    </span>
                  </p>
                </div>
                <button
                  id="clear-all-images-btn"
                  onClick={clearAllImages}
                  className="text-[10px] font-semibold text-rose-600 hover:text-rose-700 hover:underline border border-rose-100/30 rounded bg-rose-50/50 px-2 py-1 transition-colors"
                >
                  전체 삭제
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3" id="images-sorting-panel">
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    id={`image-item-${img.id}`}
                    className="flex items-center gap-3 bg-white border border-gray-150 rounded-lg p-2.5 shadow-sm hover:border-gray-300 transition-colors"
                  >
                    <img
                      src={img.previewUrl}
                      alt="Thumbnail Preview"
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded bg-slate-50 border border-gray-100 shrink-0"
                    />

                    <div className="flex-1 min-w-0 pr-1">
                      <p className="text-[11px] font-bold text-gray-800 truncate" title={img.name}>
                        {img.name}
                      </p>
                      <p className="text-[10px] font-semibold text-gray-400 font-mono mt-0.5">
                        {formatSize(img.size)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-0.5 shrink-0 border-l border-gray-100 pl-2">
                      <button
                        onClick={() => moveImage(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                        title="위로 이동"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveImage(index, 'down')}
                        disabled={index === images.length - 1}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                        title="아래로 이동"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeImage(img.id)}
                      className="p-1.5 rounded hover:bg-rose-50 text-rose-500 hover:text-rose-600 shrink-0 transition-colors"
                      title="제거"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-150 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-4 h-4 text-slate-400" />
              용지 레이아웃 &amp; 압축 품질 선택
            </h3>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">
                  용지 크기 및 배향
                </label>
                <select
                  className="w-full text-xs px-2.5 py-1.5 border border-gray-200 bg-white rounded cursor-pointer hover:border-gray-300 font-medium text-slate-700"
                  value={paperSize}
                  onChange={(e) => {
                    setPaperSize(e.target.value as PaperSizeOption);
                    setResult(null);
                  }}
                >
                  <option value="A4_PORTRAIT">A4 세로</option>
                  <option value="A4_LANDSCAPE">A4 가로</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">
                  여백 설정
                </label>
                <select
                  className="w-full text-xs px-2.5 py-1.5 border border-gray-200 bg-white rounded cursor-pointer hover:border-gray-300 font-medium text-slate-700"
                  value={margin}
                  onChange={(e) => {
                    setMargin(e.target.value as MarginOption);
                    setResult(null);
                  }}
                >
                  <option value="WITH_MARGIN">여백 있음 (A4 기본여백)</option>
                  <option value="NO_MARGIN">여백 없음 (A4 가득 차게)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">
                  압축 품질 기준
                </label>
                <select
                  className="w-full text-xs px-2.5 py-1.5 border border-gray-200 bg-white rounded cursor-pointer hover:border-gray-300 font-medium text-slate-700"
                  value={quality}
                  onChange={(e) => {
                    setQuality(e.target.value as QualityOption);
                    setResult(null);
                  }}
                >
                  <option value="STANDARD">일반 제출용 (75% / 1600px)</option>
                  <option value="HIGH">고화질 원본급 (90% / 2000px)</option>
                  <option value="LOW">작은 용량 최적화 (55% / 1200px)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              id="convert-photo-to-pdf-btn"
              onClick={handleConvert}
              disabled={images.length === 0 || isConverting}
              className={`w-full py-3.5 rounded-lg text-sm font-bold transition-all shadow-sm ${
                images.length === 0
                  ? 'bg-gray-150 text-gray-400 cursor-not-allowed'
                  : isConverting
                  ? 'bg-slate-700 text-white cursor-wait'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer hover:shadow'
              }`}
            >
              {isConverting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>실시간 작업 중: [{progressStatus}] ...</span>
                </div>
              ) : (
                `${images.length}장의 사진으로 통합 A4 PDF 파일 만들기`
              )}
            </button>

            {result && (
              <div
                id="converted-pdf-result"
                className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-5 text-center animate-fade-in space-y-4"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 mx-auto">
                  <CheckCircle className="w-5.5 h-5.5" />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-900">제출용 PDF 문서 빌드 완료!</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    작업하신 사진 목록이 무사히 PDF 파일포맷으로 패키징되었습니다.
                  </p>
                </div>

                <div className="max-w-md mx-auto grid grid-cols-2 bg-white border border-gray-150 rounded-lg py-2.5 divide-x divide-gray-100">
                  <div className="text-center px-2">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">
                      이미지 총 용량
                    </p>
                    <p className="text-xs font-bold font-mono text-slate-500 mt-0.5">
                      {formatSize(result.originalSize)}
                    </p>
                  </div>
                  <div className="text-center px-2">
                    <p className="text-[9px] font-bold text-emerald-600 uppercase">
                      완성 PDF 파일 용량
                    </p>
                    <p className="text-xs font-bold font-mono text-emerald-700 mt-0.5">
                      {formatSize(result.pdfSize)}
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 font-medium">
                  총 <span className="font-bold text-emerald-700">{result.pageCount}쪽</span> 분량 •{' '}
                  {result.originalSize - result.pdfSize > 0 ? (
                    <span>
                      원본 대비 약{' '}
                      <span className="font-bold text-emerald-700">
                        {Math.round(
                          ((result.originalSize - result.pdfSize) / result.originalSize) * 100,
                        )}
                        %
                      </span>{' '}
                      용량이 스마트 감축되었습니다!
                    </span>
                  ) : (
                    <span>원본 픽셀 화질 손상 방지가 보존되었습니다!</span>
                  )}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                  <a
                    href={result.pdfUrl}
                    download="photo_to_pdf.pdf"
                    id="download-converted-pdf-btn"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>최종 PDF 파일 받기</span>
                  </a>

                  <button
                    id="reset-photos-tool-button"
                    onClick={clearAllImages}
                    className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-bold rounded-lg border border-gray-200 transition-colors"
                  >
                    새로 작업하기
                  </button>

                  <Link
                    to="/submit/pdf-mask"
                    className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-5 py-2.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold rounded-lg border border-emerald-200 transition-colors"
                  >
                    <span>개인정보 가리러 가기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <p className="text-[10px] text-slate-450 leading-relaxed max-w-sm mx-auto">
                  💡 <strong>팁</strong>: PDF로 만든 뒤 주민번호, 계좌번호, 주소 등 민감정보를 가릴 수
                  있습니다.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {totalOriginalSize >= 10485760 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-[11px] text-amber-900 space-y-1">
              <p className="font-bold">⚠️ 대용량 이미지 가동 제안</p>
              <p className="leading-relaxed text-amber-800">
                선택하신 이미지의 총 합산 용량이 10MB를 초과 전개 중입니다. 모바일 사양에서는 PDF 결합
                중 메모리 임계치 도달로 튕길 우려가 있으니 컴퓨터(PC) 등 고사양 장치 사용을 강력 권유
                드립니다.
              </p>
            </div>
          )}

          <div className="bg-white border border-gray-150 rounded-xl p-4.5 space-y-3.5 shadow-sm">
            <h4 className="text-xs font-bold text-gray-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              간단한 이용 팁
            </h4>
            <ol className="space-y-2.5 text-[11px] text-gray-600 list-decimal pl-4.5 leading-relaxed">
              <li>
                제출해야 하는 신분증, 재직증명서, 졸업증명서 등 이미지들을 동시에 다량 선택해
                업로드합니다.
              </li>
              <li>
                목록의 위/아래 이동기호 버튼을 클릭해 책 전면에서 후면으로 인쇄될 순서를 바르게
                재정렬합니다.
              </li>
              <li>기관 용량 규격에 맞춰 일반 제출용 옵션을 사용하시면 용량이 무타하게 최적화됩니다.</li>
            </ol>
          </div>

          <AdSlot type="rectangle" label="우측 전면 사이드 광고" />
        </div>
      </div>

      <SubmitSeo toolId="photo-to-pdf" />
    </div>
  );
}
