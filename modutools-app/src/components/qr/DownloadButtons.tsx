import React from 'react';
import { FileImage, Layers } from 'lucide-react';

interface DownloadButtonsProps {
  onDownloadPng?: () => void;
  onDownloadSvg?: () => void;
  disabled?: boolean;
}

export const DownloadButtons: React.FC<DownloadButtonsProps> = ({
  onDownloadPng,
  onDownloadSvg,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col space-y-4" id="download-actions-wrapper">
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onDownloadPng}
          disabled={disabled}
          className="flex items-center justify-center space-x-2.5 py-3.5 px-4 rounded-xl font-bold text-sm border shadow-sm transition-all text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border-emerald-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:pointer-events-none"
          id="btn-download-png"
        >
          <FileImage size={18} className="text-emerald-700 shrink-0" />
          <span>PNG 다운로드</span>
        </button>

        <button
          onClick={onDownloadSvg}
          disabled={disabled}
          className="flex items-center justify-center space-x-2.5 py-3.5 px-4 rounded-xl font-bold text-sm border shadow-sm transition-all text-white bg-emerald-600 hover:bg-emerald-700 border-emerald-500 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:pointer-events-none"
          id="btn-download-svg"
        >
          <Layers size={18} className="shrink-0" />
          <span>SVG 다운로드</span>
        </button>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-start space-x-2 text-[11px] text-gray-500 text-left">
        <div className="p-0.5 rounded bg-emerald-100 text-emerald-700 font-bold shrink-0 text-[9px] mt-0.5">
          TIP
        </div>
        <div className="leading-relaxed">
          <p className="font-semibold text-gray-700 mb-0.5">어느 형식을 선택해야 할까요?</p>
          <strong>PNG</strong>는 온라인 홍보물, 블로그, 인쇄 안내장용으로 가장 대중적인 고화질
          이미지 형태입니다.
          <br />
          <strong>SVG</strong>는 일러스트레이터 수정이나 대형 현수막 제작 등에 쓰이는 원본 벡터
          형식입니다.
        </div>
      </div>
    </div>
  );
};

export default DownloadButtons;
