import React, { useEffect, useRef, useState } from 'react';
import { BadgeCheck, Download, Upload } from 'lucide-react';
import PrivacyBadges from '../../../components/common/PrivacyBadges';
import { createCanvas, drawImageCover, exportCanvasToBlob, loadImageFromFile } from '../../../lib/image/canvas';
import { downloadBlob } from '../../../lib/download';
import { createSafeFilename, validateImageFile } from '../../../lib/image/image';
import { idPhotoPresets } from './idPhotoPresets';

export default function IdPhotoTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [presetId, setPresetId] = useState(idPhotoPresets[1].id);
  const [background, setBackground] = useState('#ffffff');
  const [quality, setQuality] = useState(0.94);
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

  const preset = idPhotoPresets.find((item) => item.id === presetId) ?? idPhotoPresets[0];

  const selectFile = (nextFile?: File) => {
    if (!nextFile || !validateImageFile(nextFile)) return;
    runIdRef.current += 1;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(nextFile);
    setPreviewUrl(URL.createObjectURL(nextFile));
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
    const image = await loadImageFromFile(file);
    const canvas = createCanvas(preset.width, preset.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('캔버스를 만들지 못했습니다.');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, preset.width, preset.height);
    drawImageCover(ctx, image, preset.width, preset.height);
    const blob = await exportCanvasToBlob(canvas, 'jpg', quality);
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
    downloadBlob(resultBlob, createSafeFilename(file.name, `_${preset.width}x${preset.height}`, 'jpg'));
  };

  return (
    <div className="space-y-6">
      <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <span className="p-2 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100"><BadgeCheck className="w-5 h-5" /></span>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-100">증명사진 규격 맞추기</h1>
            <p className="text-sm text-slate-600 mt-1 dark:text-slate-400">이력서, 자격증, 접수용 사진을 정해진 픽셀 규격으로 저장합니다.</p>
          </div>
        </div>
        <div className="mt-5"><PrivacyBadges /></div>
      </section>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <section className="space-y-4">
          <label className="relative flex min-h-48 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white p-6 text-center cursor-pointer hover:border-indigo-400 dark:bg-slate-900 dark:border-slate-700">
            <Upload className="w-8 h-8 text-indigo-600" />
            <span className="text-sm font-bold text-slate-900 mt-3 dark:text-slate-100">증명사진 선택</span>
            <span className="text-xs text-slate-500 mt-1">얼굴 중심 사진을 사용하면 결과가 좋습니다.</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(event) => selectFile(event.target.files?.[0])} />
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:bg-slate-900 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 mb-2">원본</p>
              {previewUrl ? <img src={previewUrl} alt="" className="w-full max-h-96 rounded-2xl object-contain bg-slate-100" /> : <div className="flex h-72 items-center justify-center rounded-2xl bg-slate-100 text-xs font-bold text-slate-400">원본 미리보기</div>}
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:bg-slate-900 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 mb-2">결과 {preset.width}x{preset.height}px</p>
              {resultUrl ? <img src={resultUrl} alt="" className="mx-auto max-h-96 rounded-2xl object-contain bg-slate-100" /> : <div className="flex h-72 items-center justify-center rounded-2xl bg-slate-100 text-xs font-bold text-slate-400">결과 미리보기</div>}
            </div>
          </div>
        </section>
        <aside className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4 h-fit dark:bg-slate-900 dark:border-slate-800">
          <label className="text-xs font-bold text-slate-600">규격<select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={presetId} onChange={(e) => setPresetId(e.target.value)}>{idPhotoPresets.map((item) => <option key={item.id} value={item.id}>{item.label} · {item.note}</option>)}</select></label>
          <label className="text-xs font-bold text-slate-600">배경색<input className="mt-1 h-10 w-full rounded-xl border border-slate-200" type="color" value={background} onChange={(e) => setBackground(e.target.value)} /></label>
          <label className="text-xs font-bold text-slate-600">품질 {Math.round(quality * 100)}%<input className="mt-2 w-full" type="range" min={0.75} max={1} step={0.01} value={quality} onChange={(e) => setQuality(Number(e.target.value))} /></label>
          <button onClick={process} disabled={!file || busy} className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white disabled:bg-slate-300">{busy ? '처리 중' : '규격 맞추기'}</button>
          <button onClick={download} disabled={!resultBlob} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white disabled:bg-slate-300"><Download className="w-4 h-4" /> 다운로드</button>
          <p className="rounded-2xl bg-amber-50 border border-amber-100 p-3 text-[11px] leading-relaxed text-amber-900">기관별 얼굴 크기와 배경 규정은 다를 수 있으니 제출 안내문을 함께 확인하세요.</p>
        </aside>
      </div>
    </div>
  );
}
