import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Download, FileArchive, Minimize2, ShieldCheck, Upload } from 'lucide-react';
import PrivacyBadges from '../../../components/common/PrivacyBadges';
import { compressImage, compressToTargetSize } from '../../../lib/image/compression';
import { formatFileSize, parseTargetSizeToBytes } from '../../../lib/image/fileSize';
import { createSafeFilename, getImageDimensions, validateImageFile } from '../../../lib/image/image';
import { createZipBlob } from '../../../lib/zip';

interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
}

interface ResultImage {
  id: string;
  name: string;
  blob: Blob;
  url: string;
  originalSize: number;
  width: number;
  height: number;
  status: string;
}

const targets = [
  { label: '300KB', bytes: 300 * 1024 },
  { label: '500KB', bytes: 500 * 1024 },
  { label: '1MB', bytes: 1024 * 1024 },
];

export default function ImageCompressTool() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [results, setResults] = useState<ResultImage[]>([]);
  const [targetBytes, setTargetBytes] = useState(500 * 1024);
  const [customSize, setCustomSize] = useState(500);
  const [customUnit, setCustomUnit] = useState<'KB' | 'MB'>('KB');
  const [format, setFormat] = useState<'jpg' | 'png' | 'webp'>('jpg');
  const [maxSide, setMaxSide] = useState(1600);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<UploadedImage[]>([]);
  const resultsRef = useRef<ResultImage[]>([]);
  const mountedRef = useRef(true);
  const runIdRef = useRef(0);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      runIdRef.current += 1;
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
      resultsRef.current.forEach((result) => URL.revokeObjectURL(result.url));
    };
  }, []);

  const addFiles = async (files: File[]) => {
    setError(null);
    const validFiles = files.filter(validateImageFile);
    if (validFiles.length === 0) {
      setError('JPG, PNG, WEBP 이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    const items: UploadedImage[] = [];
    for (const [index, file] of validFiles.entries()) {
        const previewUrl = URL.createObjectURL(file);
        try {
          const { width, height } = await getImageDimensions(file);
          items.push({
          id: `${Date.now()}-${index}-${file.name}`,
          file,
          previewUrl,
          width,
          height,
          });
        } catch {
          URL.revokeObjectURL(previewUrl);
        }
    }
    if (items.length === 0) {
      setError('이미지 정보를 읽지 못했습니다.');
      return;
    }
    setImages((prev) => [...prev, ...items]);
    setResults((prev) => {
      prev.forEach((result) => URL.revokeObjectURL(result.url));
      return [];
    });
  };

  const clearAll = () => {
    images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    results.forEach((result) => URL.revokeObjectURL(result.url));
    setImages([]);
    setResults([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const compress = async () => {
    if (images.length === 0) return;
    const runId = ++runIdRef.current;
    setBusy(true);
    setError(null);
    results.forEach((result) => URL.revokeObjectURL(result.url));
    setResults([]);

    try {
      const next: ResultImage[] = [];
      for (const item of images) {
        const result =
          targetBytes > 0
            ? await compressToTargetSize(item.file, targetBytes, format, maxSide)
            : await compressImage(item.file, { quality: 0.8, maxWidthOrHeight: maxSide, format });
        const url = URL.createObjectURL(result.blob);
        if (!mountedRef.current || runId !== runIdRef.current) {
          URL.revokeObjectURL(url);
          continue;
        }
        next.push({
          id: item.id,
          name: createSafeFilename(item.file.name, '_compressed', format),
          blob: result.blob,
          url,
          originalSize: item.file.size,
          width: result.width,
          height: result.height,
          status: result.status,
        });
      }
      if (!mountedRef.current || runId !== runIdRef.current) {
        next.forEach((result) => URL.revokeObjectURL(result.url));
        return;
      }
      setResults(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : '이미지 압축 중 오류가 발생했습니다.');
    } finally {
      setBusy(false);
    }
  };

  const downloadZip = async () => {
    const blob = await createZipBlob(results.map((result) => ({ name: result.name, blob: result.blob })));
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'modutools-compressed-images.zip';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const applyCustomTarget = () => {
    setTargetBytes(parseTargetSizeToBytes(customSize, customUnit));
  };

  return (
    <div className="space-y-6">
      <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <span className="p-2 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Minimize2 className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-100">이미지 압축</h1>
            <p className="text-sm text-slate-600 mt-1 dark:text-slate-400">업로드 제한에 맞춰 여러 이미지를 한 번에 줄입니다.</p>
          </div>
        </div>
        <div className="mt-5">
          <PrivacyBadges />
        </div>
      </section>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <section className="space-y-4">
          <label className="relative flex flex-col items-center justify-center min-h-52 rounded-3xl border-2 border-dashed border-slate-300 bg-white text-center p-6 cursor-pointer hover:border-indigo-400 dark:bg-slate-900 dark:border-slate-700">
            <Upload className="w-8 h-8 text-indigo-600" />
            <span className="text-sm font-bold text-slate-900 mt-3 dark:text-slate-100">이미지를 선택하거나 끌어다 놓으세요</span>
            <span className="text-xs text-slate-500 mt-1">JPG, PNG, WEBP 여러 장 지원</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(event) => addFiles(Array.from(event.target.files ?? []))}
            />
          </label>

          {error && (
            <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {images.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-3">
              {images.map((image) => (
                <div key={image.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:bg-slate-900 dark:border-slate-800">
                  <img src={image.previewUrl} alt="" className="w-14 h-14 rounded-xl object-cover bg-slate-100" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">{image.file.name}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{formatFileSize(image.file.size)} · {image.width}x{image.height}px</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.length > 0 && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-5 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-extrabold text-emerald-950">압축 완료</h2>
                  <p className="text-xs text-emerald-800 mt-1">{results.length}개 파일을 다운로드할 수 있습니다.</p>
                </div>
                <button onClick={downloadZip} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800">
                  <FileArchive className="w-4 h-4" /> ZIP
                </button>
              </div>
              <div className="space-y-2">
                {results.map((result) => (
                  <div key={result.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white border border-emerald-100 p-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-900">{result.name}</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {formatFileSize(result.originalSize)} → {formatFileSize(result.blob.size)} · {result.width}x{result.height}px
                      </p>
                    </div>
                    <a href={result.url} download={result.name} className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-[11px] font-bold text-white">
                      <Download className="w-3.5 h-3.5" /> 받기
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <aside className="rounded-3xl border border-slate-200 bg-white p-5 space-y-5 h-fit dark:bg-slate-900 dark:border-slate-800">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">목표 용량</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {targets.map((target) => (
                <button
                  key={target.label}
                  onClick={() => setTargetBytes(target.bytes)}
                  className={`rounded-xl border px-2 py-2 text-xs font-bold ${targetBytes === target.bytes ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}
                >
                  {target.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs" type="number" min={1} value={customSize} onChange={(e) => setCustomSize(Number(e.target.value))} />
              <select className="rounded-xl border border-slate-200 px-2 text-xs" value={customUnit} onChange={(e) => setCustomUnit(e.target.value as 'KB' | 'MB')}>
                <option>KB</option>
                <option>MB</option>
              </select>
              <button onClick={applyCustomTarget} className="rounded-xl bg-slate-900 px-3 text-xs font-bold text-white">적용</button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">긴 변 최대 크기</label>
            <input className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs" type="number" min={100} value={maxSide} onChange={(e) => setMaxSide(Number(e.target.value))} />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">출력 형식</label>
            <select className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs" value={format} onChange={(e) => setFormat(e.target.value as 'jpg' | 'png' | 'webp')}>
              <option value="jpg">JPG</option>
              <option value="png">PNG</option>
              <option value="webp">WEBP</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button onClick={compress} disabled={images.length === 0 || busy} className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white disabled:bg-slate-300">
              {busy ? '처리 중' : '압축하기'}
            </button>
            <button onClick={clearAll} className="rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600">초기화</button>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600">
            <ShieldCheck className="w-4 h-4 inline mr-1 text-indigo-600" />
            압축은 브라우저 메모리에서만 실행되며 파일은 서버로 전송되지 않습니다.
          </div>
        </aside>
      </div>
    </div>
  );
}
