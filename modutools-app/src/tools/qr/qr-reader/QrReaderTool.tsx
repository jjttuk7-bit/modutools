import React, { useState, useRef } from 'react';
import {
  Scan,
  UploadCloud,
  Copy,
  Check,
  FileText,
  Globe,
  RefreshCw,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PrivacyNotice from '../../../components/qr/PrivacyNotice';
import QrSeo from '../../../components/seo/QrSeo';
import AdSlot from '../../../components/common/AdSlot';
import { decodeQrFromImage } from './qrReaderUtils';

export const QrReaderTool: React.FC = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUrl = (text: string): boolean => {
    try {
      const parsed = new URL(text);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

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
      prepareFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      prepareFile(e.target.files[0]);
    }
  };

  const prepareFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('이미지 파일만 업로드할 수 있습니다.');
      setSelectedFile(null);
      setPreviewUrl(null);
      setScanResult(null);
      return;
    }

    setErrorMsg(null);
    setSelectedFile(file);
    setScanResult(null);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleReadQr = async () => {
    if (!selectedFile) {
      setErrorMsg('이미지를 먼저 업로드해주세요.');
      return;
    }

    setIsReading(true);
    setErrorMsg(null);
    setScanResult(null);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const result = await decodeQrFromImage(selectedFile);
    setIsReading(false);

    if (result.success && result.text) {
      setScanResult(result.text);
    } else {
      setErrorMsg(result.error || 'QR코드를 찾지 못했습니다. 더 선명한 이미지를 사용해보세요.');
    }
  };

  const copyToClipboard = async () => {
    if (!scanResult) return;
    try {
      await navigator.clipboard.writeText(scanResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy error:', err);
    }
  };

  const handleCreateWithContent = () => {
    if (!scanResult) return;
    navigate(`/qr/qr-design?value=${encodeURIComponent(scanResult)}`);
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setScanResult(null);
    setErrorMsg(null);
    setIsReading(false);
    setCopied(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6" id="qr-reader-tool-root">
      <div className="text-left" id="qr-reader-intro">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
          <Scan className="text-emerald-600" size={28} />
          <span>QR 이미지 읽기</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          캡처 이미지나 사진 속 QR코드 내용을 브라우저에서 바로 확인하세요.
        </p>
      </div>

      <PrivacyNotice />

      <div className="grid lg:grid-cols-12 gap-8 items-start my-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 text-left">
          <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <span className="w-1.5 h-4 bg-emerald-600 rounded-full inline-block" />
            <span>스캔할 QR코드 이미지 제공</span>
          </h2>

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all relative overflow-hidden ${
              dragActive
                ? 'border-emerald-500 bg-emerald-50/50'
                : selectedFile
                ? 'border-emerald-300 bg-emerald-50/10'
                : 'border-slate-200 hover:border-emerald-300 bg-slate-50/30'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            {previewUrl ? (
              <div className="flex flex-col items-center justify-center space-y-3" id="img-preview-box">
                <img
                  src={previewUrl}
                  alt="QR 스캔 원본 피드"
                  className="max-h-[160px] object-contain rounded-lg shadow-sm border border-slate-100"
                />
                <div className="text-slate-700 font-medium text-xs truncate max-w-xs bg-white px-3 py-1.5 border border-slate-100 rounded-lg">
                  {selectedFile?.name}
                </div>
                <p className="text-[10px] text-slate-400">
                  오른쪽 [QR 읽기] 버튼을 누르거나, 다른 기기를 선택해 새로운 이미지를 첨부하세요
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full">
                  <UploadCloud size={32} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    QR 이미지 드래그 또는 마우스 클릭으로 첨부
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    PNG, JPG, JPEG, WEBP 이미지 확장자 완벽 지원
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReadQr}
              disabled={!selectedFile || isReading}
              className="flex-1 py-4 px-6 bg-slate-900 border border-transparent text-white rounded-xl font-bold text-xs hover:bg-slate-800 active:scale-[0.99] transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              {isReading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>해독 분석 도는 중...</span>
                </>
              ) : (
                <>
                  <Scan size={14} className="shrink-0" />
                  <span>QR 읽기 (분석 시작)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="py-4 px-5 border border-slate-200 bg-slate-100 font-bold hover:bg-slate-200 text-slate-700 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>지우기</span>
            </button>
          </div>

          {errorMsg && (
            <div
              className="flex items-center space-x-1.5 p-3 rounded-xl bg-red-50 border border-red-100 text-xs font-bold text-red-650"
              id="reader-error-msg"
            >
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <AdSlot type="responsive" label="안전한 무료 변환기 운영 후원 광고" />
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 text-left h-full min-h-[380px] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2 border-b border-slate-100 pb-3 mb-4">
              <span className="w-1.5 h-4 bg-emerald-600 rounded-full inline-block" />
              <span>QR 스캔 결과 상세</span>
            </h3>

            {scanResult ? (
              <div className="space-y-4" id="scan-result-panel">
                <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs mb-2">
                    {isUrl(scanResult) ? <Globe size={14} /> : <FileText size={14} />}
                    <span>추출된 데이터 타입 ({isUrl(scanResult) ? '웹주소 URL' : '일반 텍스트'})</span>
                  </div>
                  <pre className="text-xs text-slate-700 font-mono break-all whitespace-pre-wrap leading-relaxed bg-white p-3.5 rounded-xl border border-slate-100 max-h-[160px] overflow-y-auto select-all">
                    {scanResult}
                  </pre>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-xs bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check size={14} className="text-emerald-600 shrink-0" />
                          <span className="text-emerald-750">복사 완료!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} className="shrink-0" />
                          <span>결과 복사</span>
                        </>
                      )}
                    </button>

                    {isUrl(scanResult) ? (
                      <a
                        href={scanResult}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-1.5 py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-700 transition-all text-center cursor-pointer"
                      >
                        <span>링크 열기</span>
                        <ArrowRight size={12} />
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex items-center justify-center space-x-1.5 py-3 px-4 rounded-xl font-bold text-xs bg-slate-100 text-slate-400 border border-slate-200 disabled:opacity-40"
                      >
                        <span>텍스트 타입</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={handleCreateWithContent}
                    className="w-full py-3 px-4 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>🎨 이 내용으로 이쁜 QR 꾸미기</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 text-slate-400 my-auto h-[200px]">
                <FileText size={40} className="stroke-[1.5] text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-600">첨부된 이미지가 없거나 분석 대기 중입니다</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[170px] leading-relaxed">
                  왼쪽 영역에 QR 이미지(캡처/스크린샷)를 드롭한 뒤, [QR 읽기] 버튼을 눌러주세요.
                </p>
              </div>
            )}
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start space-x-2 text-[10px] text-slate-450 mt-auto leading-relaxed">
            <span className="font-semibold text-emerald-600">안전성:</span>
            <span>
              업로드한 어떤 이미지나 해독 주소 정보도 외부 인터넷망이나 서버에 전달되거나 보존되지 않고
              오직 본인의 크롬 브라우저 안에서만 처리됩니다.
            </span>
          </div>
        </div>
      </div>

      <QrSeo
        toolId="qr-reader"
        title="QR 이미지 읽기가 필요한 경우"
        subtitle="스마트폰 카메라 대체, 브라우저 스크린샷 1초 초고속 해독 방식"
        paragraphs={[
          '• 캡처한 QR코드의 링크를 확인하고 싶을 때',
          '• 사진 속 QR 내용을 복사하고 싶을 때',
          '• 오래된 이미지 속 QR이 어디로 연결되는지 확인하고 싶을 때',
          '• QR코드 내용을 텍스트로 저장하고 싶을 때',
        ]}
        faqs={[
          {
            q: 'QR 이미지를 서버에 업로드하나요?',
            a: '아니요. 이미지는 서버로 업로드되지 않고 브라우저 안에서만 순수 로컬 데이터로 작동하여 100% 프라이버시가 안전합니다.',
          },
          {
            q: 'QR 내용을 복사할 수 있나요?',
            a: '네. 읽은 결과를 편리하고 빠르게 텍스트 클립보드에 바로 복사할 수 있습니다.',
          },
        ]}
      />

      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 text-left mt-8" id="related-tools-box">
        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center space-x-2">
          <span>🔗 추천 관련 도구</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/qr/url-qr"
            className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-sm transition-all text-xs font-bold text-slate-700 flex items-center justify-between"
          >
            <span>🔗 URL QR 만들기</span>
            <span className="text-emerald-600 text-[10px]">바로가기 &rarr;</span>
          </Link>
          <Link
            to="/qr/qr-design"
            className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-sm transition-all text-xs font-bold text-slate-700 flex items-center justify-between"
          >
            <span>🎨 QR 꾸미기 도구</span>
            <span className="text-emerald-600 text-[10px]">바로가기 &rarr;</span>
          </Link>
        </div>
      </div>

      <div
        className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 text-left space-y-4 shadow-sm"
        id="reader-troubleshoot-guidelines"
      >
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <span className="w-1.5 h-4 bg-emerald-600 rounded-full inline-block" />
          <span>QR 이미지가 잘 안 읽힐 때 확인할 점</span>
        </h3>
        <ol className="space-y-2 text-xs text-slate-700 pl-1 leading-relaxed">
          {[
            'QR 이미지가 너무 흐리지 않은지 해상도를 점검하세요.',
            'QR코드의 4면 모서리(특히 세 개의 커다란 사각형 검출 패턴)가 잘리지 않고 다 담겨 있는지 확인하세요.',
            '배경과 QR코드 무늬의 밝기 대비(명암비)가 약하면 인식이 제한될 수 있습니다.',
            '원본 속 QR코드 크기가 너무 작으면 해독에 정밀도가 떨어지니 크기를 소폭 늘려 캡처해 주세요.',
          ].map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
              <p>{tip}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default QrReaderTool;
