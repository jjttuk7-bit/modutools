import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import PrivacyNotice from '../../../components/submit/PrivacyNotice';
import AdSlot from '../../../components/common/AdSlot';
import SubmitSeo from '../../../components/seo/SubmitSeo';
import {
  Minimize2,
  Download,
  CheckCircle,
  Plus,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Zap,
  Sliders,
  FolderArchive,
} from 'lucide-react';
import type {
  CompressionType,
  OutputFormat,
  CompressionOptions,
  CompressedResultItem,
} from './imageCompressUtils';
import { compressSingleImage } from './imageCompressUtils';
import type { ResizeType } from './imageResizeUtils';
import { createZipBlob } from '../../../lib/zip';

interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  previewUrl: string;
  width: number;
  height: number;
}

export default function ImageCompressTool() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  const [processingIndex, setProcessingIndex] = useState<number>(0);
  const [currentPhase, setCurrentPhase] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [compType, setCompType] = useState<CompressionType>('SIMPLE');
  const [simpleQuality, setSimpleQuality] = useState<'HIGH' | 'STANDARD' | 'LOW'>('STANDARD');
  const [targetSizeVal, setTargetSizeVal] = useState<string>('500KB');
  const [targetCustomVal, setTargetCustomVal] = useState<number>(500);
  const [targetCustomUnit, setTargetCustomUnit] = useState<'KB' | 'MB'>('KB');

  const [resizeType, setResizeType] = useState<ResizeType>('KEEP_RATIO');
  const [longEdgeVal, setLongEdgeVal] = useState<string | number>(1600);
  const [longEdgeCustom, setLongEdgeCustom] = useState<number>(1600);
  const [customWidth, setCustomWidth] = useState<number>(1000);
  const [customHeight, setCustomHeight] = useState<number>(1000);
  const [squareSizeVal, setSquareSizeVal] = useState<string | number>(1000);
  const [squareCustom, setSquareCustom] = useState<number>(1000);

  const [outputFormat, setOutputFormat] = useState<OutputFormat>('JPEG');

  const [compressedResults, setCompressedResults] = useState<CompressedResultItem[]>([]);
  const [zipUrl, setZipUrl] = useState<string>('');

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

  const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
        });
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0 });
      };
      img.src = url;
    });
  };

  const processFiles = async (fileList: File[]) => {
    setErrorMsg(null);
    const validImages = fileList.filter((f) =>
      ['image/jpeg', 'image/png', 'image/webp'].includes(f.type),
    );

    if (validImages.length === 0 && fileList.length > 0) {
      setErrorMsg('이미지 파일만 업로드할 수 있습니다. (JPG, JPEG, PNG, WEBP만 지원)');
      return;
    }

    if (validImages.length < fileList.length) {
      setErrorMsg('일부 이미지 형식이 아닌 파일은 선택 목록에서 제외되었습니다.');
    }

    const newItems: UploadedFileItem[] = [];
    for (let i = 0; i < validImages.length; i++) {
      const f = validImages[i];
      const previewUrl = URL.createObjectURL(f);
      const dims = await getImageDimensions(previewUrl);
      newItems.push({
        id: `${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        file: f,
        name: f.name,
        size: f.size,
        previewUrl,
        width: dims.width,
        height: dims.height,
      });
    }

    setUploadedFiles((prev) => [...prev, ...newItems]);
    setCompressedResults([]);
    if (zipUrl) {
      URL.revokeObjectURL(zipUrl);
      setZipUrl('');
    }
  };

  const removeUploadedFile = (id: string) => {
    const target = uploadedFiles.find((f) => f.id === id);
    if (target) {
      URL.revokeObjectURL(target.previewUrl);
    }
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
    setCompressedResults([]);
    if (zipUrl) {
      URL.revokeObjectURL(zipUrl);
      setZipUrl('');
    }
  };

  const clearAllFiles = () => {
    uploadedFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    compressedResults.forEach((r) => URL.revokeObjectURL(r.downloadUrl));
    setUploadedFiles([]);
    setCompressedResults([]);
    setErrorMsg(null);
    if (zipUrl) {
      URL.revokeObjectURL(zipUrl);
      setZipUrl('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartCompression = async () => {
    if (uploadedFiles.length === 0) return;
    setIsCompressing(true);
    setCompressedResults([]);
    setErrorMsg(null);

    compressedResults.forEach((r) => URL.revokeObjectURL(r.downloadUrl));
    if (zipUrl) {
      URL.revokeObjectURL(zipUrl);
      setZipUrl('');
    }

    try {
      const results: CompressedResultItem[] = [];
      for (let i = 0; i < uploadedFiles.length; i++) {
        setProcessingIndex(i);
        const item = uploadedFiles[i];

        const options: CompressionOptions = {
          type: compType,
          simpleQuality,
          targetSizeValue: targetSizeVal,
          targetSizeCustomValue: targetCustomVal,
          targetSizeCustomUnit: targetCustomUnit,
          resize: {
            type: resizeType,
            longEdgeValue: longEdgeVal,
            longEdgeCustom,
            widthValue: customWidth,
            heightValue: customHeight,
            squareSizeValue: squareSizeVal,
            squareSizeCustom: squareCustom,
          },
          outputFormat,
        };

        const res = await compressSingleImage(item.file, options, (phase) => {
          setCurrentPhase(phase);
        });
        results.push(res);
      }

      setCurrentPhase('결과 파일 압축 중');
      const zipData = results.map((res) => ({
        name: res.name,
        blob: res.compressedBlob,
      }));
      const zBlob = await createZipBlob(zipData);
      const zUrl = URL.createObjectURL(zBlob);

      setZipUrl(zUrl);
      setCompressedResults(results);
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e?.message || '압축 중 오류 발생: 브라우저 환경을 확인하세요.');
    } finally {
      setIsCompressing(false);
    }
  };

  const totalOriginalSize = uploadedFiles.reduce((sum, f) => sum + f.size, 0);
  const totalCompressedSize = compressedResults.reduce((sum, r) => sum + r.compressedSize, 0);
  const totalSavedSize = totalOriginalSize - totalCompressedSize;
  const overallRatio = totalOriginalSize > 0 ? (totalSavedSize / totalOriginalSize) * 100 : 0;

  return (
    <div id="image-compress-tool-container" className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="p-1 rounded bg-teal-50 text-teal-700 border border-teal-100">
            <Minimize2 className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">이미지 용량 줄이기</h1>
        </div>
        <p className="text-xs text-gray-500">
          블로그, 쇼핑몰, 공공기관, 과제 제출용 이미지를 원하는 KB/MB까지 최적화하여 줄이세요.
        </p>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
        <p className="text-[11px] text-emerald-850 leading-relaxed font-medium">
          <strong>파일은 서버에 저장되지 않습니다.</strong> 본 도구함은 서버 전송 기술이 부재한 순수
          로컬 엔진으로, 기기 내부 가상 캔버스를 통해 완벽히 비공개 동작합니다.
        </p>
      </div>

      <PrivacyNotice />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div
            id="drag-upload-viewport"
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
              id="compress-file-picker-input"
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
                용량을 줄일 이미지 파일들을 드래그해서 놓거나 클릭하세요
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                지원 파일 형식: JPG, JPEG, PNG, WEBP (여러 장 동시 처리 지원)
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 text-[11px] text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>압축 대기 이미지</span>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                      {uploadedFiles.length}개
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    전체 원본 용량:{' '}
                    <span className="font-semibold text-slate-600 font-mono">
                      {formatSize(totalOriginalSize)}
                    </span>
                  </p>
                </div>
                <button
                  onClick={clearAllFiles}
                  className="text-[10px] font-bold text-rose-600 hover:text-rose-700 hover:underline border border-rose-100/30 rounded bg-rose-50/50 px-2 py-1 transition-colors cursor-pointer"
                >
                  기록 초기화
                </button>
              </div>

              <div
                id="file-queue-viewport"
                className="grid sm:grid-cols-2 gap-2.5 max-h-[350px] overflow-y-auto pr-1 no-scrollbar"
              >
                {uploadedFiles.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2.5 bg-white border border-gray-150 rounded-lg p-2.5 shadow-xs hover:border-gray-250 transition-colors"
                  >
                    <img
                      src={item.previewUrl}
                      alt="Local Upload Thumbnail"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded bg-slate-50 border border-gray-100 shrink-0"
                    />

                    <div className="flex-1 min-w-0 pr-1">
                      <p className="text-[11px] font-bold text-gray-800 truncate" title={item.name}>
                        {item.name}
                      </p>
                      <p className="text-[10px] font-medium text-gray-400 mt-0.5 flex gap-1.5">
                        <span className="font-mono font-bold text-slate-500">
                          {formatSize(item.size)}
                        </span>
                        <span>•</span>
                        <span className="font-mono font-semibold">
                          {item.width}x{item.height}px
                        </span>
                      </p>
                    </div>

                    <button
                      onClick={() => removeUploadedFile(item.id)}
                      className="p-1 px-2 rounded hover:bg-rose-50 text-rose-500 hover:text-rose-600 transition-colors cursor-pointer text-[10px] font-bold shrink-0"
                      title="목록에서 제거"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-150 rounded-xl p-5 space-y-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-100 pb-3">
              <Sliders className="w-4 h-4 text-emerald-700" />
              상세 압축 &amp; 사이즈 설정
            </h3>

            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-slate-500 uppercase">
                1. 압축 메커니즘 설정
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-lg border border-gray-150">
                <button
                  type="button"
                  onClick={() => {
                    setCompType('SIMPLE');
                    setCompressedResults([]);
                  }}
                  className={`py-2 text-xs font-bold rounded-md transition-all ${
                    compType === 'SIMPLE'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  간편 품질 압축
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCompType('TARGET_SIZE');
                    setCompressedResults([]);
                  }}
                  className={`py-2 text-xs font-bold rounded-md transition-all ${
                    compType === 'TARGET_SIZE'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  목표 용량 커스텀제한
                </button>
              </div>

              {compType === 'SIMPLE' ? (
                <div className="bg-slate-50/50 rounded-lg p-3 border border-gray-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Zap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>간편 크기/품질 미리보기 비율</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'HIGH', label: '고화질 고성능', desc: '85% / 2500px' },
                      { key: 'STANDARD', label: '일반 업로드용', desc: '75% / 1600px' },
                      { key: 'LOW', label: '작은 용량 우선', desc: '60% / 1200px' },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => {
                          setSimpleQuality(opt.key as any);
                          setCompressedResults([]);
                        }}
                        className={`p-2 rounded-md border text-center transition-all cursor-pointer ${
                          simpleQuality === opt.key
                            ? 'bg-white border-emerald-600 ring-2 ring-emerald-600/15'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="text-[11px] font-bold text-slate-800">{opt.label}</p>
                        <p className="text-[9px] text-slate-400 font-mono mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50/50 rounded-lg p-3 border border-gray-100 space-y-3.5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <Zap className="w-3.5 h-3.5 text-emerald-600" />
                      <span>목표 한계 용량 선택</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      * 이미지 성격에 따라 해당 용량에 완벽히 정밀 조정되지 않을 수 있습니다.
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { key: '100KB', label: '100KB 이하' },
                      { key: '300KB', label: '300KB 이하' },
                      { key: '500KB', label: '500KB 이하' },
                      { key: '1MB', label: '1MB 이하' },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => {
                          setTargetSizeVal(opt.key);
                          setCompressedResults([]);
                        }}
                        className={`py-1.5 rounded border text-[11px] font-bold text-slate-700 bg-white hover:border-gray-300 transition-all cursor-pointer ${
                          targetSizeVal === opt.key
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500/20'
                            : 'border-gray-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setTargetSizeVal('custom');
                        setCompressedResults([]);
                      }}
                      className={`px-3 py-1.5 rounded border text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                        targetSizeVal === 'custom'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      직접 용량 수치 감력
                    </button>

                    {targetSizeVal === 'custom' && (
                      <div className="flex items-center gap-1 flex-1 max-w-xs transition-opacity animate-fade-in">
                        <input
                          type="number"
                          value={targetCustomVal}
                          onChange={(e) => {
                            setTargetCustomVal(Math.max(1, Number(e.target.value)));
                            setCompressedResults([]);
                          }}
                          className="flex-1 text-xs font-mono font-bold px-2 py-1.5 border border-gray-200 rounded focus:outline-emerald-600 text-right"
                          placeholder="수치 기입"
                        />
                        <select
                          value={targetCustomUnit}
                          onChange={(e) => {
                            setTargetCustomUnit(e.target.value as any);
                            setCompressedResults([]);
                          }}
                          className="text-xs px-2 py-1.5 border border-gray-200 bg-white rounded cursor-pointer"
                        >
                          <option value="KB">KB</option>
                          <option value="MB">MB</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3.5 pt-4 border-t border-gray-100">
              <label className="block text-[10px] font-bold text-slate-500 uppercase">
                2. 픽셀 해상도 사이즈 감축 방식
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    사이즈 유형 선택
                  </label>
                  <select
                    value={resizeType}
                    onChange={(e) => {
                      setResizeType(e.target.value as ResizeType);
                      setCompressedResults([]);
                    }}
                    className="w-full text-xs px-2.5 py-2 border border-gray-200 bg-white rounded cursor-pointer focus:outline-emerald-600 font-medium text-slate-700"
                  >
                    <option value="KEEP_RATIO">원본 종횡 가로비율 유지</option>
                    <option value="LONG_EDGE">긴 변 폭 기준 일괄 맞춤</option>
                    <option value="WIDTH_ONLY">가로(너비) 크기 강제 지정</option>
                    <option value="HEIGHT_ONLY">세로(높이) 크기 강제 지정</option>
                    <option value="SQUARE_CROP">중앙 지점 타겟 정사각형 컷</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  {resizeType === 'LONG_EDGE' && (
                    <div className="space-y-1.5 animate-fade-in">
                      <label className="block text-[11px] font-bold text-slate-600">
                        긴 변 한도값 설정 (px)
                      </label>
                      <div className="flex items-center gap-1.5">
                        <select
                          value={longEdgeVal}
                          onChange={(e) => {
                            setLongEdgeVal(e.target.value);
                            setCompressedResults([]);
                          }}
                          className="text-xs px-2.5 py-1.5 border border-gray-200 bg-white rounded cursor-pointer"
                        >
                          <option value={2500}>2500 px</option>
                          <option value={1920}>1920 px</option>
                          <option value={1600}>1600 px (기본)</option>
                          <option value={1200}>1200 px</option>
                          <option value={1000}>1000 px</option>
                          <option value="custom">직접 수치 기입</option>
                        </select>
                        {longEdgeVal === 'custom' && (
                          <input
                            type="number"
                            value={longEdgeCustom}
                            onChange={(e) => {
                              setLongEdgeCustom(Math.max(10, Number(e.target.value)));
                              setCompressedResults([]);
                            }}
                            className="w-24 text-xs px-2 py-1.5 border border-gray-200 rounded font-mono font-bold text-right focus:outline-emerald-600"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {resizeType === 'WIDTH_ONLY' && (
                    <div className="space-y-1.5 animate-fade-in">
                      <label className="block text-[11px] font-bold text-slate-600">
                        너비 수치 지정 (px)
                      </label>
                      <input
                        type="number"
                        value={customWidth}
                        onChange={(e) => {
                          setCustomWidth(Math.max(10, Number(e.target.value)));
                          setCompressedResults([]);
                        }}
                        className="w-full text-xs px-2.5 py-1.5 border border-gray-200 rounded font-mono font-bold text-right focus:outline-emerald-600"
                      />
                    </div>
                  )}

                  {resizeType === 'HEIGHT_ONLY' && (
                    <div className="space-y-1.5 animate-fade-in">
                      <label className="block text-[11px] font-bold text-slate-600">
                        높이 수치 지정 (px)
                      </label>
                      <input
                        type="number"
                        value={customHeight}
                        onChange={(e) => {
                          setCustomHeight(Math.max(10, Number(e.target.value)));
                          setCompressedResults([]);
                        }}
                        className="w-full text-xs px-2.5 py-1.5 border border-gray-200 rounded font-mono font-bold text-right focus:outline-emerald-600"
                      />
                    </div>
                  )}

                  {resizeType === 'SQUARE_CROP' && (
                    <div className="space-y-1.5 animate-fade-in">
                      <label className="block text-[11px] font-bold text-slate-600">
                        정사각형 크기 크롭 규격
                      </label>
                      <div className="flex items-center gap-1.5">
                        <select
                          value={squareSizeVal}
                          onChange={(e) => {
                            setSquareSizeVal(e.target.value);
                            setCompressedResults([]);
                          }}
                          className="text-xs px-2 py-1.5 border border-gray-200 bg-white rounded cursor-pointer"
                        >
                          <option value={1000}>1000 x 1000 px</option>
                          <option value={800}>800 x 800 px</option>
                          <option value={500}>500 x 500 px</option>
                          <option value="custom">직접 규격 지정</option>
                        </select>
                        {squareSizeVal === 'custom' && (
                          <input
                            type="number"
                            value={squareCustom}
                            onChange={(e) => {
                              setSquareCustom(Math.max(10, Number(e.target.value)));
                              setCompressedResults([]);
                            }}
                            className="w-24 text-xs px-2 py-1.5 border border-gray-200 rounded font-mono font-bold text-right focus:outline-emerald-600"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3.5 pt-4 border-t border-gray-100">
              <label className="block text-[10px] font-bold text-slate-500 uppercase">
                3. 저장할 파일 포맷 지정
              </label>

              <div className="grid sm:grid-cols-4 gap-2">
                {[
                  { key: 'ORIGINAL', name: '원본 형태 보존', desc: '기존 포맷 적용' },
                  { key: 'JPEG', name: 'JPG 인코딩', desc: '압축에 가장 용이' },
                  { key: 'WEBP', name: 'WEBP 웹전용', desc: '지능형 고압축률' },
                  { key: 'PNG', name: 'PNG 무손실', desc: '알파 채널 투명용' },
                ].map((form) => (
                  <button
                    key={form.key}
                    type="button"
                    onClick={() => {
                      setOutputFormat(form.key as any);
                      setCompressedResults([]);
                    }}
                    className={`p-2.5 rounded border text-left cursor-pointer transition-all ${
                      outputFormat === form.key
                        ? 'border-emerald-600 bg-emerald-50/15 text-emerald-800 ring-2 ring-emerald-600/10'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <p className="text-[11px] font-bold text-slate-800">{form.name}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">{form.desc}</p>
                  </button>
                ))}
              </div>

              <div className="bg-slate-50 p-3 rounded text-[10px] text-slate-500 space-y-1">
                <p>
                  • <strong>JPG</strong>: 일반 사진 및 인증 서류에 적합하며 파일 용량이 대폭
                  축소됩니다.
                </p>
                <p>
                  • <strong>WEBP</strong>: 웹 서비스 업로드 및 메일 첨부에 적합하여 가용 면적 대비
                  용량을 더욱 크게 깎아냅니다.
                </p>
                <p>
                  • <strong>PNG</strong>: 글씨의 가독성 처리를 유지하기에 적합하나 무압축 방식 특성상
                  결과 용량이 더욱 늘어날 수 있습니다.
                </p>
                <p className="text-emerald-700 font-medium">
                  * PNG 투명 배경 이미지를 JPG 형식으로 변환할 경우, 흰색 단색 배경으로 자동 합성
                  처리됩니다.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleStartCompression}
              disabled={uploadedFiles.length === 0 || isCompressing}
              className={`w-full py-4 rounded-xl text-sm font-bold transition-all shadow-sm ${
                uploadedFiles.length === 0
                  ? 'bg-gray-150 text-gray-400 cursor-not-allowed'
                  : isCompressing
                  ? 'bg-slate-700 text-white cursor-wait'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer'
              }`}
            >
              {isCompressing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>
                    차례대로 용량 감축 중: [{processingIndex + 1}/{uploadedFiles.length}번째 -{' '}
                    {currentPhase}]
                  </span>
                </div>
              ) : (
                `${uploadedFiles.length}개의 이미지 즉시 압축 소형화하기`
              )}
            </button>

            {compressedResults.length > 0 && (
              <div
                id="compression-success-board"
                className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-5 md:p-6 animate-fade-in space-y-5 text-center"
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-emerald-100 text-emerald-600 mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-gray-900">
                    모든 이미지 압축 처리 성공!
                  </h4>
                  <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                    브라우저 로컬 캔버스 메모리 상에서 이미지가 완벽히 인코딩되었습니다.
                  </p>
                </div>

                <div className="max-w-md mx-auto grid grid-cols-3 bg-white border border-gray-150 rounded-lg py-3 shadow-xs divide-x divide-gray-100">
                  <div className="text-center px-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      원본 전체 크기
                    </p>
                    <p className="text-xs font-bold font-mono text-slate-500 mt-1">
                      {formatSize(totalOriginalSize)}
                    </p>
                  </div>
                  <div className="text-center px-1 font-bold text-emerald-600 flex flex-col justify-center">
                    <span className="text-[10px] font-semibold">최종 감축률</span>
                    <span className="text-sm">- {Math.round(overallRatio)}%</span>
                  </div>
                  <div className="text-center px-1">
                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
                      압축 최종 크기
                    </p>
                    <p className="text-xs font-bold font-mono text-emerald-700 mt-1">
                      {formatSize(totalCompressedSize)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                  {zipUrl && (
                    <a
                      href={zipUrl}
                      download="compressed_images.zip"
                      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
                    >
                      <FolderArchive className="w-4 h-4" />
                      <span>전체 ZIP 파일 다운로드</span>
                    </a>
                  )}

                  <button
                    onClick={clearAllFiles}
                    className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-lg border border-gray-300 transition-colors shrink-0 cursor-pointer"
                  >
                    새로 작업하기
                  </button>

                  <Link
                    to="/submit/pdf-mask"
                    className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-5 py-3 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold rounded-lg border border-emerald-200 transition-colors"
                  >
                    <span>개인정보 가리러 가기</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
                  </Link>
                </div>

                <div className="border-t border-emerald-100/50 pt-5 space-y-2.5 text-left">
                  <h5 className="text-[11px] font-bold text-slate-705 px-1">
                    개별 변환 파일 다운로드 리스트
                  </h5>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                    {compressedResults.map((res) => {
                      const reduction = res.originalSize - res.compressedSize;
                      const ratio = res.originalSize > 0 ? (reduction / res.originalSize) * 100 : 0;
                      return (
                        <div
                          key={res.id}
                          className="flex items-center justify-between gap-3 bg-white/70 border border-emerald-100/40 p-2.5 rounded-lg text-xs hover:bg-white transition-colors"
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <p className="font-bold text-slate-850 truncate">{res.name}</p>
                            <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-slate-400 mt-1 font-mono">
                              <span className="font-bold text-slate-500">
                                {formatSize(res.compressedSize)}
                              </span>
                              <span>•</span>
                              <span className="text-emerald-700 font-bold">
                                -{Math.round(ratio)}%
                              </span>
                              <span>•</span>
                              <span>
                                {res.originalWidth}x{res.originalHeight}px → {res.compressedWidth}x
                                {res.compressedHeight}px
                              </span>
                            </div>
                          </div>

                          <a
                            href={res.downloadUrl}
                            download={res.name}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 text-[10px] font-bold rounded transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>개별 다운로드</span>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {totalOriginalSize >= 10485760 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-[11px] text-amber-900 space-y-1">
              <p className="font-bold">⚠️ 대용량 이미지 처리 경고</p>
              <p className="leading-relaxed text-amber-800">
                선택하신 이미지들의 총 합계 용량이 10MB를 넘어서고 있습니다. 모바일 환경의 제한된
                브라우저 사양에서는 결합 연산 도중 정지 현상이 발생할 수 있으니 컴퓨터(PC) 환경에서
                작업하시는 것을 권장합니다.
              </p>
            </div>
          )}

          <div className="bg-white border border-gray-150 rounded-xl p-5 space-y-3.5 shadow-sm">
            <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              용량 감량 지침 사항
            </h4>

            <div className="space-y-3 text-[11px] text-gray-600 leading-relaxed">
              <p>
                대부분의 취업/채용 포털, 은행 및 관공서 파일 첨부 전력은 1MB, 혹은 500KB 이하를
                보장해야 시스템 안정성을 해치지 않습니다.
              </p>
              <ul className="space-y-2 pl-4 list-disc text-[10px] text-slate-500">
                <li>
                  질이 좋은 5MB이상의 오리지널 촬영본도 해상도를 약간만 조정하면 육안으로는 화질
                  변화를 알아챌 수 없을 정도로 용량을 크게 줄일 수 있습니다.
                </li>
                <li>
                  한 영역으로 다수의 이미지 제출이 필요하다면 통합 ZIP 아카이브를 받으시거나 단일 PDF
                  변환 도구를 적용하시기를 강력히 추천해 드립니다.
                </li>
              </ul>
            </div>
          </div>

          <AdSlot type="rectangle" label="우측 이미지 압축 광고" />
        </div>
      </div>

      <SubmitSeo toolId="image-compress" />
    </div>
  );
}
