import React, { useState } from 'react';
import { Download, FileDown, CheckCircle, AlertCircle } from 'lucide-react';
import { exportCanvasToBlob, downloadBlob } from '../../lib/thumbnail/canvas';

export interface DownloadButtonProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  defaultFilename: string;
  id?: string;
  hasUploadedImage?: boolean;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  canvasRef,
  defaultFilename,
  id,
}) => {
  const [filename, setFilename] = useState(defaultFilename);
  const [fileFormat, setFileFormat] = useState<'png' | 'jpg'>('png');
  const [jpgQuality, setJpgQuality] = useState<number>(0.92);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownload = async () => {
    setDownloadError(null);
    const canvas = canvasRef.current;
    if (!canvas) {
      setDownloadError('다운로드할 수 있는 템플릿 캔버스가 존재하지 않습니다.');
      return;
    }

    try {
      const extension = fileFormat === 'png' ? '.png' : '.jpg';
      const baseName = filename.replace(/\.(png|jpg|jpeg)$/i, '').trim() || 'cover_image';
      const finalFilename = `thumbkit-${baseName}${extension}`;

      const blob = await exportCanvasToBlob(canvas, fileFormat, jpgQuality);
      downloadBlob(blob, finalFilename);

      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 3500);
    } catch (error) {
      console.error('Download fail:', error);
      setDownloadError('다운로드 파일을 생성하지 못했습니다.');
    }
  };

  return (
    <div
      id={id || 'download-box-panel'}
      className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
          <FileDown className="w-4 h-4 text-emerald-400" />
          <span>최종 가공본 저장 및 다운로드</span>
        </h4>
        <div className="text-[9px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
          Local Canvas Export
        </div>
      </div>

      {downloadError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl p-3 flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{downloadError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
            저장할 파일명
          </label>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="w-full bg-slate-800 text-white px-3 py-2 rounded-xl text-xs border border-slate-700 focus:outline-none focus:border-emerald-500 font-medium"
            placeholder="자유로운 이름 입력"
          />
        </div>

        <div>
          <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
            파일 확장자 규격
          </label>
          <div className="grid grid-cols-2 gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setFileFormat('png')}
              className={`py-1 text-center text-[10px] font-extrabold rounded-lg transition-all ${
                fileFormat === 'png'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PNG (고화질 원본)
            </button>
            <button
              type="button"
              onClick={() => setFileFormat('jpg')}
              className={`py-1 text-center text-[10px] font-extrabold rounded-lg transition-all ${
                fileFormat === 'jpg'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              JPG (용량 압축)
            </button>
          </div>
        </div>
      </div>

      {fileFormat === 'jpg' && (
        <div className="bg-slate-800/50 border border-slate-800 p-3 rounded-xl space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[10px] text-slate-400 font-bold uppercase">
              JPG 이미지 압축 화질 품질
            </label>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              {jpgQuality === 0.92
                ? '고화질 (0.92)'
                : jpgQuality === 0.8
                ? '보통 (0.80)'
                : '네트워크 최적화 (0.65)'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-0.5 bg-slate-800 rounded bg-opacity-70">
            {[
              { label: '고화질 (0.92)', value: 0.92 },
              { label: '보통 (0.80)', value: 0.8 },
              { label: '최소화 (0.65)', value: 0.65 },
            ].map((q) => (
              <button
                key={q.value}
                type="button"
                onClick={() => setJpgQuality(q.value)}
                className={`py-1 text-center text-[9px] font-bold rounded transition-all ${
                  jpgQuality === q.value
                    ? 'bg-slate-700 text-white border border-slate-600'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pt-2">
        <button
          onClick={handleDownload}
          className={`relative group overflow-hidden w-full py-3 px-4 rounded-xl text-xs font-extrabold tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer ${
            downloadSuccess
              ? 'bg-emerald-600 text-white animate-none'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
          }`}
        >
          {downloadSuccess ? (
            <>
              <CheckCircle className="w-4 h-4 animate-bounce shrink-0" />
              <span>무료 고화질 이미지 다운로드를 완료했습니다!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 group-hover:scale-110 transition-transform shrink-0" />
              <span>워터마크 완전히 없는 고화질 이미지로 저장</span>
            </>
          )}
        </button>
      </div>

      <div className="text-[10px] text-slate-400 text-center leading-relaxed">
        ※ <strong>무저장 프라이버시 원칙</strong>에 의해 어떠한 기기 데이터 및 사용자 텍스트가 외부
        서버 파일 디렉토리에 누출/저장되지 않습니다.
      </div>
    </div>
  );
};

export default DownloadButton;
