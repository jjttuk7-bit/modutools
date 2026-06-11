import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, AlertTriangle, Trash2 } from 'lucide-react';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
}

export default function FileDropzone({
  onFilesSelected,
  accept = '.xlsx, .xls, .csv',
  multiple = true,
  maxFiles = 20,
}: FileDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const validateFiles = (files: File[]): File[] => {
    setErrorMsg(null);
    let validFiles: File[] = [];

    for (const file of files) {
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (accept.includes(ext)) {
        validFiles.push(file);
      } else {
        setErrorMsg(`지원하지 않는 파일 형식입니다: ${file.name}`);
      }
    }

    if (!multiple && validFiles.length > 1) {
      validFiles = [validFiles[0]];
    }

    if (validFiles.length > maxFiles) {
      setErrorMsg(`최대 ${maxFiles}개 파일까지만 업로드 가능합니다.`);
      validFiles = validFiles.slice(0, maxFiles);
    }

    return validFiles;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files) as File[];
      const approved = validateFiles(droppedFiles);
      if (approved.length > 0) {
        const update = multiple ? [...selectedFiles, ...approved] : approved;
        setSelectedFiles(update);
        onFilesSelected(approved);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const chosen = Array.from(e.target.files) as File[];
      const approved = validateFiles(chosen);
      if (approved.length > 0) {
        const update = multiple ? [...selectedFiles, ...approved] : approved;
        setSelectedFiles(update);
        onFilesSelected(approved);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (idx: number) => {
    const updated = [...selectedFiles];
    updated.splice(idx, 1);
    setSelectedFiles(updated);
    onFilesSelected(updated);
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`border-2 border-dashed rounded-2xl p-6 md:p-10 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[220px] group ${
          isDragActive
            ? 'border-emerald-600 bg-emerald-50/50'
            : 'border-slate-200 bg-slate-50/30 hover:border-emerald-300 hover:bg-emerald-50/20'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
        />

        <div className="w-16 h-16 bg-white rounded-full shadow-xs flex items-center justify-center text-slate-400 group-hover:text-emerald-600 mb-4 transition">
          <Upload className="w-7 h-7" />
        </div>

        <h3 className="text-base font-bold text-slate-800 mb-1">
          합칠 파일들을 여기에 드래그하거나 클릭하여 선택하세요
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          XLSX, CSV 파일 형식 지원 (최대 {maxFiles}개 파일, 브라우저 로컬 가동)
        </p>

        <button
          type="button"
          className="py-2.5 px-6 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-emerald-800 hover:text-white transition-all shadow-xs"
        >
          기기에서 파일 선택
        </button>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-800 p-3.5 rounded-xl text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <span className="text-xs font-bold text-slate-800">
              선택한 파일 목록 ({selectedFiles.length}개)
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedFiles([]);
                onFilesSelected([]);
              }}
              className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 font-bold"
            >
              전체 지우기
            </button>
          </div>
          <div className="space-y-2 max-h-[160px] overflow-y-auto">
            {selectedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-slate-50/60 p-2.5 rounded-lg border border-slate-100 text-xs hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-medium text-slate-700 truncate max-w-[200px] md:max-w-md">
                    {file.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
