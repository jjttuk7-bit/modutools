import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';

interface FileUploaderProps {
  fileName: string | null;
  fileSize: number | null;
  pageCount: number | null;
  onFileSelect: (file: File, buffer: ArrayBuffer) => void;
  onClear: () => void;
  externalError?: string | null;
  onClearExternalError?: () => void;
}

export default function FileUploader({
  fileName,
  fileSize,
  pageCount,
  onFileSelect,
  onClear,
  externalError,
  onClearExternalError,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFile = (file: File) => {
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    const isValidType =
      file.type === 'application/pdf' ||
      file.type.startsWith('image/') ||
      lowerName.endsWith('.pdf') ||
      lowerName.endsWith('.png') ||
      lowerName.endsWith('.jpg') ||
      lowerName.endsWith('.jpeg');

    if (!isValidType) {
      setErrorMsg('PDF 또는 이미지(PNG, JPG, JPEG) 파일만 마스킹할 수 있습니다.');
      return;
    }

    setErrorMsg(null);
    onClearExternalError?.();

    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      if (buffer) {
        onFileSelect(file, buffer);
      } else {
        setErrorMsg('파일을 읽는 과정에서 오류가 발생했습니다.');
      }
    };
    reader.onerror = () => {
      setErrorMsg('파일을 로드하지 못했습니다. 손상되었는지 확인하세요.');
    };
    reader.readAsArrayBuffer(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div id="file-uploader-section" className="w-full">
      {!fileName ? (
        <div
          id="dropzone"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={triggerFileInput}
          className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99] shadow-inner'
              : 'border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-50'
          }`}
        >
          <input
            id="pdf-file-input"
            type="file"
            ref={fileInputRef}
            onChange={onFileInputChange}
            accept=".pdf,application/pdf,.png,image/png,.jpg,.jpeg,image/jpeg"
            className="hidden"
          />
          <div
            id="upload-icon-wrapper"
            className="p-4 bg-white rounded-full shadow-sm mb-4 border border-slate-100"
          >
            <Upload className="w-8 h-8 text-slate-500" />
          </div>
          <span className="text-sm font-semibold text-slate-800 mb-1">
            마스킹할 문서 or 이미지를 올려주세요
          </span>
          <span className="text-xs text-slate-500 mb-2">
            드래그 앤 드롭 또는 클릭하여 선택 (PDF, JPG, PNG 지원)
          </span>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] text-slate-600 font-medium">
              100% 브라우저 자체 보안 처리
            </span>
          </div>

          {(errorMsg || externalError) && (
            <div
              id="uploader-error"
              className="mt-4 flex items-center gap-2 text-rose-600 text-[11px] font-medium bg-rose-50 px-3 py-2.5 rounded-lg border border-rose-100 max-w-sm text-left"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg || externalError}</span>
            </div>
          )}
        </div>
      ) : (
        <div
          id="file-loaded-banner"
          className="bg-slate-900 text-slate-100 rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 shrink-0">
                <FileText className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p
                  className="text-sm font-medium text-white truncate max-w-[200px] sm:max-w-md"
                  title={fileName}
                >
                  {fileName}
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 mt-1">
                  <span>크기: {fileSize ? formatBytes(fileSize) : '-'}</span>
                  <span>•</span>
                  <span>총 {pageCount || '-'} 페이지</span>
                </div>
              </div>
            </div>
            <button
              id="clear-file-btn"
              onClick={onClear}
              className="p-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 transition-all flex items-center gap-1 cursor-pointer shrink-0"
              title="다른 파일 업로드"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>교체</span>
            </button>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1.5 rounded-lg border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>이 파일은 서버에 전송되지 않으며, 기기 내부에서 안전하게 실행 중입니다.</span>
          </div>
        </div>
      )}
    </div>
  );
}
