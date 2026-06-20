import React, { useEffect, useRef, useState } from 'react';
import { Download, Maximize, Upload } from 'lucide-react';
import PrivacyBadges from '../../../components/common/PrivacyBadges';
import { createCanvas, drawImageContain, drawImageCover, drawImageStretch, exportCanvasToBlob, loadImageFromFile } from '../../../lib/image/canvas';
import { downloadBlob } from '../../../lib/download';
import { formatFileSize } from '../../../lib/image/fileSize';
import { createSafeFilename, getImageDimensions, validateImageFile } from '../../../lib/image/image';

type FitMode = 'contain' | 'cover' | 'stretch';

interface SelectedImage {
  file: File;
  previewUrl: string;
  width: number;
  height: number;
}

export default function ImageResizeTool() {
  const [image, setImage] = useState<SelectedImage | null>(null);
  const [width, setWidth] = useState(1000);
  const [height, setHeight] = useState(1000);
  const [lockRatio, setLockRatio] = useState(true);
  const [fit, setFit] = useState<FitMode>('contain');
  const [background, setBackground] = useState('#ffffff');
  const [resultUrl, setResultUrl] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<SelectedImage | null>(null);
  const resultUrlRef = useRef('');
  const mountedRef = useRef(true);
  const runIdRef = useRef(0);

  useEffect(() => {
    imageRef.current = image;
  }, [image]);

  useEffect(() => {
    resultUrlRef.current = resultUrl;
  }, [resultUrl]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      runIdRef.current += 1;
      if (imageRef.current) URL.revokeObjectURL(imageRef.current.previewUrl);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  const selectFile = async (file?: File) => {
    if (!file || !validateImageFile(file)) return;
    runIdRef.current += 1;
    const previewUrl = URL.createObjectURL(file);
    let size: { width: number; height: number };
    try {
      size = await getImageDimensions(file);
    } catch {
      URL.revokeObjectURL(previewUrl);
      return;
    }
    if (image) URL.revokeObjectURL(image.previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setImage({ file, previewUrl, ...size });
    setWidth(size.width || 1000);
    setHeight(size.height || 1000);
    setResultUrl('');
    setResultBlob(null);
  };

  const updateWidth = (nextWidth: number) => {
    setWidth(nextWidth);
    if (lockRatio && image?.width && image?.height) {
      setHeight(Math.max(1, Math.round((nextWidth * image.height) / image.width)));
    }
  };

  const updateHeight = (nextHeight: number) => {
    setHeight(nextHeight);
    if (lockRatio && image?.width && image?.height) {
      setWidth(Math.max(1, Math.round((nextHeight * image.width) / image.height)));
    }
  };

  const resize = async () => {
    if (!image || busy) return;
    const runId = ++runIdRef.current;
    setBusy(true);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl('');
    setResultBlob(null);
    try {
    const source = await loadImageFromFile(image.file);
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('캔버스를 만들지 못했습니다.');
    if (fit === 'cover') drawImageCover(ctx, source, width, height);
    if (fit === 'contain') drawImageContain(ctx, source, width, height, background);
    if (fit === 'stretch') drawImageStretch(ctx, source, width, height);
    const blob = await exportCanvasToBlob(canvas, 'jpg', 0.92);
    if (!mountedRef.current || runId !== runIdRef.current) return;
    setResultBlob(blob);
    const nextUrl = URL.createObjectURL(blob);
    if (!mountedRef.current || runId !== runIdRef.current) {
      URL.revokeObjectURL(nextUrl);
      return;
    }
    setResultUrl(nextUrl);
    } finally {
      if (mountedRef.current && runId === runIdRef.current) setBusy(false);
    }
  };

  const download = () => {
    if (!image || !resultBlob) return;
    downloadBlob(resultBlob, createSafeFilename(image.file.name, `_${width}x${height}`, 'jpg'));
  };

  return (
    <div className="space-y-6">
      <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <span className="p-2 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100"><Maximize className="w-5 h-5" /></span>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-100">이미지 크기 변경</h1>
            <p className="text-sm text-slate-600 mt-1 dark:text-slate-400">픽셀 규격을 맞추고 비율 유지, 채우기, 늘리기를 선택합니다.</p>
          </div>
        </div>
        <div className="mt-5"><PrivacyBadges /></div>
      </section>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <section className="space-y-4">
          <label className="relative flex min-h-48 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white p-6 text-center cursor-pointer hover:border-indigo-400 dark:bg-slate-900 dark:border-slate-700">
            <Upload className="w-8 h-8 text-indigo-600" />
            <span className="text-sm font-bold text-slate-900 mt-3 dark:text-slate-100">이미지 선택</span>
            <span className="text-xs text-slate-500 mt-1">JPG, PNG, WEBP</span>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(event) => selectFile(event.target.files?.[0])} />
          </label>

          {image && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:bg-slate-900 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-500 mb-2">원본</p>
                <img src={image.previewUrl} alt="" className="w-full max-h-96 rounded-2xl object-contain bg-slate-100" />
                <p className="text-xs text-slate-500 mt-3">{image.width}x{image.height}px · {formatFileSize(image.file.size)}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:bg-slate-900 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-500 mb-2">결과</p>
                {resultUrl ? <img src={resultUrl} alt="" className="w-full max-h-96 rounded-2xl object-contain bg-slate-100" /> : <div className="flex h-72 items-center justify-center rounded-2xl bg-slate-100 text-xs font-bold text-slate-400">변환 결과</div>}
              </div>
            </div>
          )}
        </section>

        <aside className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4 h-fit dark:bg-slate-900 dark:border-slate-800">
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-bold text-slate-600">가로(px)<input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" type="number" value={width} onChange={(e) => updateWidth(Number(e.target.value))} /></label>
            <label className="text-xs font-bold text-slate-600">세로(px)<input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" type="number" value={height} onChange={(e) => updateHeight(Number(e.target.value))} /></label>
          </div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700"><input type="checkbox" checked={lockRatio} onChange={(e) => setLockRatio(e.target.checked)} /> 비율 유지</label>
          <label className="text-xs font-bold text-slate-600">맞춤 방식<select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={fit} onChange={(e) => setFit(e.target.value as FitMode)}><option value="contain">잘림 없이 여백</option><option value="cover">꽉 채우기</option><option value="stretch">늘려 맞추기</option></select></label>
          <label className="text-xs font-bold text-slate-600">여백 색상<input className="mt-1 h-10 w-full rounded-xl border border-slate-200" type="color" value={background} onChange={(e) => setBackground(e.target.value)} /></label>
          <button onClick={resize} disabled={!image || busy} className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white disabled:bg-slate-300">{busy ? '처리 중' : '크기 변경'}</button>
          <button onClick={download} disabled={!resultBlob} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white disabled:bg-slate-300"><Download className="w-4 h-4" /> 다운로드</button>
        </aside>
      </div>
    </div>
  );
}
