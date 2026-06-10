import React, { useState, useRef } from 'react';
import { Upload, FileImage, Trash2, AlertTriangle, AlertCircle } from 'lucide-react';
import { formatFileSize, validateImageFile } from '../../lib/thumbnail/image';

export interface ImageUploaderProps {
  onImageLoaded: (file: File, previewUrl: string, width: number, height: number) => void;
  onClear: () => void;
  selectedFile: File | null;
  dimensions: { width: number; height: number } | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageLoaded,
  onClear,
  selectedFile,
  dimensions,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLargeFile, setIsLargeFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setErrorMessage(null);
    setIsLargeFile(false);

    const check = validateImageFile(file);
    if (!check.isValid) {
      setErrorMessage(check.errorMessage || '이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    const limitTenMb = 10 * 1024 * 1024;
    if (file.size >= limitTenMb) {
      setIsLargeFile(true);
    }

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          onImageLoaded(file, previewUrl, img.width, img.height);
        };
        img.onerror = () => {
          setErrorMessage('이미지를 읽는 중 문제가 발생했습니다.');
        };
        img.src = previewUrl;
      };
      reader.onerror = () => {
        setErrorMessage('이미지를 읽는 중 문제가 발생했습니다.');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setErrorMessage('이미지를 읽는 중 문제가 발생했습니다.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setErrorMessage(null);
    setIsLargeFile(false);
    onClear();
  };

  return (
    <div id="image-uploader" className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
          <span>배경 사진 업로드</span>
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
            선택형
          </span>
        </label>
        {selectedFile && (
          <button
            id="clear-image-btn"
            onClick={handleRemove}
            className="text-[11px] font-bold text-red-500 hover:text-red-700 flex items-center gap-1 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md transition-all active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>이미지 제거</span>
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 flex items-center gap-2.5 text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span className="text-xs font-semibold">{errorMessage}</span>
        </div>
      )}

      {isLargeFile && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5 text-amber-800">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <span className="text-xs font-semibold">
            이미지 파일이 큽니다. 브라우저 성능에 따라 처리 시간이 걸릴 수 있습니다.
          </span>
        </div>
      )}

      {!selectedFile ? (
        <div
          id="uploader-dropzone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerUpload}
          className={`group border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-slate-800 bg-slate-50'
              : 'border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <Upload className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                그림 파일을 드래그하여 놓거나 클릭하여 선택
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                PNG, JPG, JPEG, WEBP 지원 (원천 서버 전송 및 저장 없음)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div
          id="uploader-success-card"
          className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-xs"
        >
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
            <FileImage className="w-6 h-6 text-slate-650" />
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="font-bold text-xs text-slate-800 truncate">{selectedFile.name}</h5>
            <div className="flex flex-wrap gap-x-2 text-[10px] text-slate-500 mt-0.5 font-medium">
              <span>용량: {formatFileSize(selectedFile.size)}</span>
              <span>•</span>
              <span>
                크기:{' '}
                {dimensions ? `${dimensions.width}x${dimensions.height} px` : '로딩 중'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
