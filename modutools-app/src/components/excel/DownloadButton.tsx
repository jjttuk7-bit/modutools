import { Download } from 'lucide-react';

interface DownloadButtonProps {
  onDownload: () => void;
  fileName?: string;
  disabled?: boolean;
}

export default function DownloadButton({
  onDownload,
  fileName = '정리완료_엑셀파일.xlsx',
  disabled = false,
}: DownloadButtonProps) {
  return (
    <button
      type="button"
      onClick={onDownload}
      disabled={disabled}
      className={`w-full py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all duration-200 text-sm shadow-xs ${
        disabled
          ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
          : 'bg-emerald-800 hover:bg-emerald-900 text-white border-0 hover:shadow-sm cursor-pointer'
      }`}
    >
      <Download className={`w-4 h-4 ${disabled ? 'text-slate-400' : 'text-emerald-100'}`} />
      <span>{fileName} 다운로드 받기</span>
    </button>
  );
}
