import React, { useEffect, useRef, useState } from 'react';
import { Crop, Download, Upload } from 'lucide-react';
import PrivacyBadges from '../../../components/common/PrivacyBadges';
import { createCanvas, drawImageContain, drawImageCover, exportCanvasToBlob, loadImageFromFile } from '../../../lib/image/canvas';
import { downloadBlob } from '../../../lib/download';
import { createSafeFilename, getImageDimensions, validateImageFile } from '../../../lib/image/image';

type Mode = 'padding' | 'crop';

const ratios = [
  { label: '1:1', w: 1, h: 1 },
  { label: '4:5', w: 4, h: 5 },
  { label: '16:9', w: 16, h: 9 },
  { label: '3:4', w: 3, h: 4 },
];

export default function CropPaddingTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [ratioIndex, setRatioIndex] = useState(0);
  const [longSide, setLongSide] = useState(1200);
  const [mode, setMode] = useState<Mode>('padding');
  const [background, setBackground] = useState('#ffffff');
  const [sourceSize, setSourceSize] = useState({ width: 0, height: 0 });
  const [busy, setBusy] = useState(false);
  const previewUrlRef = useRef('');
  const resultUrlRef = useRef('');
  const mountedRef = useRef(true);
  const runIdRef = useRef(0);

  useEffect(() => {
    previewUrlRef.current = previewUrl;
  }, [previewUrl]);

  useEffect(() => {
    resultUrlRef.current = resultUrl;
  }, [resultUrl]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      runIdRef.current += 1;
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  const selectFile = async (nextFile?: File) => {
    if (!nextFile || !validateImageFile(nextFile)) return;
    runIdRef.current += 1;
    const nextPreviewUrl = URL.createObjectURL(nextFile);
    let nextSourceSize: { width: number; height: number };
    try {
      nextSourceSize = await getImageDimensions(nextFile);
    } catch {
      URL.revokeObjectURL(nextPreviewUrl);
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(nextFile);
    setPreviewUrl(nextPreviewUrl);
    setSourceSize(nextSourceSize);
    setResultUrl('');
    setResultBlob(null);
  };

  const process = async () => {
    if (!file || busy) return;
    const runId = ++runIdRef.current;
    setBusy(true);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl('');
    setResultBlob(null);
    try {
    const ratio = ratios[ratioIndex];
    const width = ratio.w >= ratio.h ? longSide : Math.round((longSide * ratio.w) / ratio.h);
    const height = ratio.h >= ratio.w ? longSide : Math.round((longSide * ratio.h) / ratio.w);
    const image = await loadImageFromFile(file);
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('캔버스를 만들지 못했습니다.');
    if (mode === 'padding') {
      drawImageContain(ctx, image, width, height, background);
    } else {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      drawImageCover(ctx, image, width, height);
    }
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
    if (!file || !resultBlob) return;
    downloadBlob(resultBlob, createSafeFilename(file.name, `_${ratios[ratioIndex].label.replace(':', 'x')}`, 'jpg'));
  };

  return (
    <div className="space-y-6">
      <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <span className="p-2 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100"><Crop className="w-5 h-5" /></span>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-100">자르기 / 여백 넣기</h1>
            <p className="text-sm text-slate-600 mt-1 dark:text-slate-400">이미지를 원하는 비율로 자르거나 흰 여백으로 맞춥니다.</p>
          </div>
        </div>
        <div className="mt-5"><PrivacyBadges /></div>
      </section>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <section className="space-y-4">
          <label className="relative flex min-h-48 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white p-6 text-center cursor-pointer hover:border-indigo-400 dark:bg-slate-900 dark:border-slate-700">
            <Upload className="w-8 h-8 text-indigo-600" />
            <span className="text-sm font-bold text-slate-900 mt-3 dark:text-slate-100">이미지 선택</span>
            <span className="text-xs text-slate-500 mt-1">상품 사진, 프로필, 대표 이미지에 적합</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(event) => selectFile(event.target.files?.[0])} />
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:bg-slate-900 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 mb-2">원본 {sourceSize.width ? `${sourceSize.width}x${sourceSize.height}px` : ''}</p>
              {previewUrl ? <img src={previewUrl} alt="" className="w-full max-h-96 rounded-2xl object-contain bg-slate-100" /> : <div className="flex h-72 items-center justify-center rounded-2xl bg-slate-100 text-xs font-bold text-slate-400">원본 미리보기</div>}
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:bg-slate-900 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 mb-2">결과</p>
              {resultUrl ? <img src={resultUrl} alt="" className="w-full max-h-96 rounded-2xl object-contain bg-slate-100" /> : <div className="flex h-72 items-center justify-center rounded-2xl bg-slate-100 text-xs font-bold text-slate-400">결과 미리보기</div>}
            </div>
          </div>
        </section>
        <aside className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4 h-fit dark:bg-slate-900 dark:border-slate-800">
          <label className="text-xs font-bold text-slate-600">방식<select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={mode} onChange={(e) => setMode(e.target.value as Mode)}><option value="padding">잘림 없이 여백</option><option value="crop">중앙 기준 자르기</option></select></label>
          <label className="text-xs font-bold text-slate-600">비율<select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={ratioIndex} onChange={(e) => setRatioIndex(Number(e.target.value))}>{ratios.map((ratio, index) => <option key={ratio.label} value={index}>{ratio.label}</option>)}</select></label>
          <label className="text-xs font-bold text-slate-600">긴 변(px)<input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" type="number" value={longSide} onChange={(e) => setLongSide(Number(e.target.value))} /></label>
          <label className="text-xs font-bold text-slate-600">여백 색상<input className="mt-1 h-10 w-full rounded-xl border border-slate-200" type="color" value={background} onChange={(e) => setBackground(e.target.value)} /></label>
          <button onClick={process} disabled={!file || busy} className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white disabled:bg-slate-300">{busy ? '처리 중' : '적용하기'}</button>
          <button onClick={download} disabled={!resultBlob} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white disabled:bg-slate-300"><Download className="w-4 h-4" /> 다운로드</button>
        </aside>
      </div>
    </div>
  );
}
