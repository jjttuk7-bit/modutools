import React, { useEffect, useRef, useState } from 'react';
import { Download, FileType, Upload } from 'lucide-react';
import PrivacyBadges from '../../../components/common/PrivacyBadges';
import { createCanvas, exportCanvasToBlob, loadImageFromFile } from '../../../lib/image/canvas';
import { downloadBlob } from '../../../lib/download';
import { createSafeFilename, validateImageFile } from '../../../lib/image/image';

interface ConvertedImage {
  id: string;
  name: string;
  blob: Blob;
  url: string;
}

export default function JpgConverterTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [background, setBackground] = useState('#ffffff');
  const [quality, setQuality] = useState(0.9);
  const [results, setResults] = useState<ConvertedImage[]>([]);
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<ConvertedImage[]>([]);
  const mountedRef = useRef(true);
  const runIdRef = useRef(0);

  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  useEffect(() => () => {
    mountedRef.current = false;
    runIdRef.current += 1;
    resultsRef.current.forEach((result) => URL.revokeObjectURL(result.url));
  }, []);

  const convert = async () => {
    if (busy) return;
    const runId = ++runIdRef.current;
    setBusy(true);
    results.forEach((result) => URL.revokeObjectURL(result.url));
    setResults([]);
    try {
    const next: ConvertedImage[] = [];
    for (const file of files) {
      const image = await loadImageFromFile(file);
      const width = image.naturalWidth || image.width;
      const height = image.naturalHeight || image.height;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('캔버스를 만들지 못했습니다.');
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(image, 0, 0, width, height);
      const blob = await exportCanvasToBlob(canvas, 'jpg', quality);
      next.push({
        id: `${file.name}-${Date.now()}`,
        name: createSafeFilename(file.name, '_jpg', 'jpg'),
        blob,
        url: URL.createObjectURL(blob),
      });
    }
    if (!mountedRef.current || runId !== runIdRef.current) {
      next.forEach((result) => URL.revokeObjectURL(result.url));
      return;
    }
    setResults(next);
    } finally {
      if (mountedRef.current && runId === runIdRef.current) setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <span className="p-2 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100"><FileType className="w-5 h-5" /></span>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-100">JPG 변환</h1>
            <p className="text-sm text-slate-600 mt-1 dark:text-slate-400">PNG, WEBP 이미지를 업로드 호환성이 높은 JPG로 변환합니다.</p>
          </div>
        </div>
        <div className="mt-5"><PrivacyBadges /></div>
      </section>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <section className="space-y-4">
          <label className="relative flex min-h-48 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white p-6 text-center cursor-pointer hover:border-indigo-400 dark:bg-slate-900 dark:border-slate-700">
            <Upload className="w-8 h-8 text-indigo-600" />
            <span className="text-sm font-bold text-slate-900 mt-3 dark:text-slate-100">변환할 이미지 선택</span>
            <span className="text-xs text-slate-500 mt-1">여러 장 선택 가능</span>
            <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(event) => setFiles(Array.from(event.target.files ?? []).filter(validateImageFile))} />
          </label>
          {files.length > 0 && <p className="text-xs font-bold text-slate-600">{files.length}개 파일 선택됨</p>}
          <div className="grid sm:grid-cols-2 gap-3">
            {results.map((result) => (
              <div key={result.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                <p className="truncate text-xs font-bold text-slate-900">{result.name}</p>
                <a href={result.url} download={result.name} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white"><Download className="w-4 h-4" /> 다운로드</a>
              </div>
            ))}
          </div>
        </section>
        <aside className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4 h-fit dark:bg-slate-900 dark:border-slate-800">
          <label className="text-xs font-bold text-slate-600">투명 배경 채움색<input className="mt-1 h-10 w-full rounded-xl border border-slate-200" type="color" value={background} onChange={(e) => setBackground(e.target.value)} /></label>
          <label className="text-xs font-bold text-slate-600">품질 {Math.round(quality * 100)}%<input className="mt-2 w-full" type="range" min={0.5} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} /></label>
          <button onClick={convert} disabled={files.length === 0 || busy} className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white disabled:bg-slate-300">{busy ? '처리 중' : 'JPG로 변환'}</button>
        </aside>
      </div>
    </div>
  );
}
