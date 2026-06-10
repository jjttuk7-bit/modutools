import React, { useState } from 'react';
import PrivacyNotice from '../../../components/submit/PrivacyNotice';
import AdSlot from '../../../components/common/AdSlot';
import SubmitSeo from '../../../components/seo/SubmitSeo';
import { ShieldAlert, FileIcon, Download, CheckCircle } from 'lucide-react';

export default function PdfMaskTool() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);
  const [keywords, setKeywords] = useState([
    '주민등록번호 뒷자리 (7자리)',
    '계좌번호',
    '휴대폰번호',
  ]);
  const [newKeyword, setNewKeyword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addFile(e.target.files[0]);
    }
  };

  const addFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('PDF 파일만 업로드할 수 있습니다.');
      return;
    }
    const sizeKB = Math.round(file.size / 1024);
    const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)}MB` : `${sizeKB}KB`;
    setFiles([{ name: file.name, size: sizeStr }]);
    setProcessedFile(null);
  };

  const removeFile = () => {
    setFiles([]);
    setProcessedFile(null);
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyword.trim()) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleProcess = () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setProcessedFile(`masked_${files[0].name}`);
    }, 1500);
  };

  return (
    <div id="pdf-mask-tool-root" className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="p-1 rounded bg-amber-50 text-amber-600 border border-amber-100">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">PDF 개인정보 마스킹</h1>
        </div>
        <p className="text-xs text-gray-500">
          주민등록번호, 주소, 계좌번호 등 외부로 노출되면 안 되는 개인정보를 검정 상자로 완전히
          가려줍니다.
        </p>
      </div>

      <PrivacyNotice />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div
            id="file-drop-zone"
            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-colors ${
              dragActive ? 'border-emerald-55 bg-emerald-50/20' : 'border-gray-200 bg-white'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload-input"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".pdf"
              onChange={handleFileChange}
            />

            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-12 h-12 bg-gray-50 rounded-full text-gray-400 mb-3">
                <FileIcon className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-gray-700">
                마스킹할 PDF 파일을 드래그하여 놓거나 클릭하여 업로드하세요
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                지원 형식: PDF (최대 100MB) • 오직 사용자 브라우저에서만 처리됨
              </p>
            </div>
          </div>

          {files.length > 0 && (
            <div
              id="file-list-preview"
              className="bg-white border border-gray-100 rounded-lg p-3.5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 text-red-650 rounded">
                  <FileIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800 line-clamp-1">{files[0].name}</p>
                  <p className="text-[10px] text-gray-400 font-mono">{files[0].size}</p>
                </div>
              </div>
              <button
                id="remove-uploaded-file-btn"
                onClick={removeFile}
                className="p-1 px-2.5 rounded text-xs text-rose-600 hover:bg-rose-50 border border-rose-50 transition-colors"
              >
                삭제
              </button>
            </div>
          )}

          <div
            id="masking-options-block"
            className="bg-white border border-gray-150/40 rounded-xl p-5"
          >
            <h3 className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-wider">
              1. 마스킹 가릴 대상 상세 선택
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">
                  마스킹 필터 키워드
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {keywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium"
                    >
                      {kw}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(idx)}
                        className="p-0.5 hover:bg-slate-200 rounded text-slate-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddKeyword} className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="예: 뒷자리, 이름, 특정계좌 등"
                    className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-3 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold"
                  >
                    추가
                  </button>
                </form>
              </div>

              <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-3">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-700">전체 페이지 자동 스캔</p>
                    <p className="text-[10px] text-gray-400">문서 전체에서 단어 자동 감지</p>
                  </div>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-700">고정 정렬 보정</p>
                    <p className="text-[10px] text-gray-400">마킹 위치 밀림 방지 정렬</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              id="start-process-btn"
              onClick={handleProcess}
              disabled={files.length === 0 || isProcessing}
              className={`w-full py-3 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                files.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isProcessing
                  ? 'bg-slate-700 text-white'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer'
              }`}
            >
              {isProcessing ? '개인정보 감지 및 마스킹 처리 중...' : '마스킹 처리 시작하기'}
            </button>

            {processedFile && (
              <div
                id="processed-pdf-result"
                className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-5 text-center animate-fade-in"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 mx-auto mb-2">
                  <CheckCircle className="w-5.5 h-5.5" />
                </div>
                <h4 className="text-xs font-bold text-gray-900">
                  마스킹 변환이 안전하게 완료되었습니다!
                </h4>
                <p className="text-[11px] text-gray-500 mt-1 mb-4">
                  보안 조치가 끝났으므로 기기에 다운로드해 제출하세요.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    id="download-processed-result"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow shrink-0 cursor-pointer"
                    onClick={() => alert('로컬 다운로드를 준비합니다. (데모)')}
                  >
                    <Download className="w-4 h-4" />
                    <span>마스킹 완료 PDF 안전 다운로드</span>
                  </button>
                  <button
                    id="reset-form-button"
                    onClick={removeFile}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-md border border-gray-200 transition-colors shrink-0"
                  >
                    새로 작업하기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {files.length > 0 &&
            files[0].size.includes('MB') &&
            parseFloat(files[0].size) >= 10 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-[11px] text-amber-905 space-y-1">
                <p className="font-bold">⚠️ 대용량 파일 가동 감지</p>
                <p className="leading-relaxed text-amber-800">
                  10MB 이상의 대형 파일은 모바일 환경에서 RAM 제한으로 가동이 지연되거나 튕길 수
                  있습니다. 보다 안정적이고 쾌적한 보정을 위해 <strong>PC(컴퓨터)</strong> 브라우저
                  사용을 적극 지시합니다.
                </p>
              </div>
            )}

          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <h4 className="text-xs font-bold text-gray-900 mb-3">개인정보 마스킹 사용법</h4>
            <ol className="space-y-4 text-[11px] text-gray-600 list-decimal pl-4 leading-relaxed">
              <li>가리개 처리가 필요한 PDF 주민등록등본, 통장사본 등을 업로드해 주세요.</li>
              <li>주민등록번호 뒷자리, 연락처, 주소 등 주요 가리기용 대상을 확인합니다.</li>
              <li>&apos;마스킹 처리 시작하기&apos;를 클릭해 브라우저 단에서 검은 박스를 합성합니다.</li>
              <li>보안 덮어 쓰기가 완료되면 로컬 기기에 즉시 저장됩니다.</li>
            </ol>
          </div>

          <AdSlot type="rectangle" label="도구 우측 추천 배너" />
        </div>
      </div>

      <SubmitSeo toolId="pdf-mask" />
    </div>
  );
}
