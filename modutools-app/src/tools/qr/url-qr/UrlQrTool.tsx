import React, { useState } from 'react';
import { Link2, Sparkles, Copy, RefreshCw, AlertCircle, Check } from 'lucide-react';
import PrivacyNotice from '../../../components/qr/PrivacyNotice';
import QrPreview from '../../../components/qr/QrPreview';
import DownloadButtons from '../../../components/qr/DownloadButtons';
import QrSeo from '../../../components/seo/QrSeo';
import AdSlot from '../../../components/common/AdSlot';
import { formatAndValidateUrl } from './urlQrUtils';
import { downloadCanvasAsPng, downloadSvgString } from '../../../lib/download';
import QRCode from 'qrcode';

export const UrlQrTool: React.FC = () => {
  const [url, setUrl] = useState('https://');
  const [qrValue, setQrValue] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [size, setSize] = useState<number>(512);
  const [margin, setMargin] = useState<number>(4);
  const [fgColor, setFgColor] = useState<string>('#0f172a');
  const [bgColor, setBgColor] = useState<string>('#ffffff');

  const [copied, setCopied] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const validationResult = formatAndValidateUrl(url);
    if (!validationResult.isValid) {
      setErrorMsg(validationResult.error);
      setQrValue('');
      return;
    }

    setUrl(validationResult.formattedUrl);
    setQrValue(validationResult.formattedUrl);
  };

  const downloadPng = async () => {
    if (!qrValue) return;
    try {
      const offscreenCanvas = document.createElement('canvas');
      await QRCode.toCanvas(offscreenCanvas, qrValue, {
        width: size,
        margin,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: 'H',
      });
      downloadCanvasAsPng(offscreenCanvas, `qr-code-url-${size}px.png`);
    } catch (err) {
      console.error('PNG download error:', err);
    }
  };

  const downloadSvg = async () => {
    if (!qrValue) return;
    try {
      const svgString = await QRCode.toString(qrValue, {
        type: 'svg',
        width: size,
        margin,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: 'H',
      });
      downloadSvgString(svgString, `qr-code-url-${size}px.svg`);
    } catch (err) {
      console.error('SVG download error:', err);
    }
  };

  const copyToClipboard = async () => {
    if (!qrValue) return;
    try {
      await navigator.clipboard.writeText(qrValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard error:', err);
    }
  };

  const handleReset = () => {
    setUrl('https://');
    setQrValue('');
    setErrorMsg(null);
    setSize(512);
    setMargin(4);
    setFgColor('#0f172a');
    if (bgColor !== '#ffffff') setBgColor('#ffffff');
    setCopied(false);
  };

  return (
    <div className="space-y-6" id="url-qr-tool-root">
      <div className="text-left" id="url-qr-intro">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
          <Link2 className="text-emerald-600" size={28} />
          <span>URL QR 만들기</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          웹사이트, 블로그, 스마트스토어, 유튜브, 구글폼 링크를 QR코드로 바꾸세요.
        </p>
      </div>

      <PrivacyNotice />

      <div className="grid lg:grid-cols-12 gap-8 items-start my-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 text-left">
          <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <span className="w-1.5 h-4 bg-emerald-600 rounded-full inline-block" />
            <span>연결 주소 및 디자인 설정</span>
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label
                htmlFor="url-input"
                className="block text-xs font-bold text-slate-600 mb-1.5"
              >
                연결할 웹사이트 주소 (URL)
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="url-input"
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono ${
                    errorMsg ? 'border-red-300 focus:ring-red-500' : 'border-slate-200'
                  }`}
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setErrorMsg(null);
                  }}
                  required
                />
              </div>

              {errorMsg && (
                <div
                  className="flex items-center space-x-1.5 mt-2 text-xs font-bold text-red-650"
                  id="url-error-msg"
                >
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <p className="text-[11px] text-slate-450 mt-1.5 pl-1 leading-relaxed">
                스마트폰 카메라로 스캔 시 즉시 해당 웹페이지로 자동 연동됩니다.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-bold tracking-wide uppercase text-slate-400">
                QR코드 스타일 설정
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="size-select"
                    className="block text-xs font-bold text-slate-600 mb-1.5"
                  >
                    QR 크기
                  </label>
                  <select
                    id="size-select"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-750 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={256}>256px × 256px</option>
                    <option value={512}>512px × 512px (기본)</option>
                    <option value={1024}>1024px × 1024px (고해상도)</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="margin-select"
                    className="block text-xs font-bold text-slate-600 mb-1.5"
                  >
                    여백 선택
                  </label>
                  <select
                    id="margin-select"
                    value={margin}
                    onChange={(e) => setMargin(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-750 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={0}>여백 없음 (0)</option>
                    <option value={2}>좁은 여백 (2)</option>
                    <option value={4}>보통 여백 (4)</option>
                    <option value={8}>넓은 여백 (8)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    전경색 (코드 색상)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-10 h-9 p-0 bg-transparent border border-slate-200 rounded-lg cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      aria-label="Foreground Hex Color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 text-xs font-mono font-bold text-slate-700 uppercase focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    배경색 (바탕 색상)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-9 p-0 bg-transparent border border-slate-200 rounded-lg cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      aria-label="Background Hex Color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 text-xs font-mono font-bold text-slate-700 uppercase focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-600 mb-2">
                기본 꾸미기 테마
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFgColor('#065f46');
                    setBgColor('#ffffff');
                  }}
                  className={`p-2.5 border rounded-xl text-[11px] font-bold text-center transition-all ${
                    fgColor === '#065f46' && bgColor === '#ffffff'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  시그니처 딥그린
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFgColor('#000000');
                    setBgColor('#ffffff');
                  }}
                  className={`p-2.5 border rounded-xl text-[11px] font-bold text-center transition-all ${
                    fgColor === '#000000' && bgColor === '#ffffff'
                      ? 'border-slate-800 bg-slate-50 text-slate-950 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  클래식 매트블랙
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFgColor('#1d4ed8');
                    setBgColor('#faf5ff');
                  }}
                  className={`p-2.5 border rounded-xl text-[11px] font-bold text-center transition-all ${
                    fgColor === '#1d4ed8' && bgColor === '#faf5ff'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-950 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  오션 블루스카이
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 active:scale-[0.99] transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
              id="btn-url-generate"
            >
              <Sparkles size={14} />
              <span>QR코드 생성하기</span>
            </button>
          </form>

          <AdSlot type="responsive" label="안전한 무료 변환기 운영 후원 광고" />
        </div>

        <div className="lg:col-span-5 flex flex-col space-y-6">
          <QrPreview value={qrValue} fgColor={fgColor} bgColor={bgColor} margin={margin} />

          <DownloadButtons
            disabled={!qrValue}
            onDownloadPng={downloadPng}
            onDownloadSvg={downloadSvg}
          />

          <div className="grid grid-cols-2 gap-3" id="qr-secondary-actions">
            <button
              type="button"
              onClick={copyToClipboard}
              disabled={!qrValue}
              className="flex items-center justify-center space-x-2 py-3 px-4 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              id="btn-copy-content"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-600 shrink-0" />
                  <span className="text-emerald-700">복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy size={14} className="text-slate-500 shrink-0" />
                  <span>내용 복사</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center space-x-2 py-3 px-4 border border-slate-200 rounded-xl text-xs font-bold text-slate-750 bg-slate-100 hover:bg-slate-200 transition-all active:scale-[0.98] cursor-pointer"
              id="btn-new-qr"
            >
              <RefreshCw size={14} className="text-slate-600 shrink-0" />
              <span>새로 만들기</span>
            </button>
          </div>
        </div>
      </div>

      <QrSeo
        toolId="url-qr"
        title="URL QR코드가 필요한 경우"
        subtitle="고객 접점을 극대화하는 가장 직관적이고 효율적인 오프라인 연결 수단"
        paragraphs={[
          '• 웹사이트 주소를 포스터에 넣을 때',
          '• 블로그나 스마트스토어 링크를 공유할 때',
          '• 유튜브 영상이나 채널을 안내할 때',
          '• 구글폼, 설문, 예약 링크를 공유할 때',
          '• 행사 안내 페이지를 QR로 연결할 때',
        ]}
        faqs={[
          {
            q: 'URL이 서버에 저장되나요?',
            a: '아니요. 입력한 URL은 서버에 저장되지 않고 브라우저에서만 QR로 변환됩니다.',
          },
          {
            q: 'QR코드는 무료로 다운로드할 수 있나요?',
            a: '네. PNG와 SVG 형식으로 다운로드할 수 있습니다.',
          },
          { q: '인쇄용으로는 어떤 형식이 좋나요?', a: '인쇄용은 SVG 형식이 더 적합합니다.' },
        ]}
      />

      <div
        className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 text-left space-y-4 shadow-sm"
        id="url-usage-guidelines"
      >
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <span className="w-1.5 h-4 bg-emerald-600 rounded-full inline-block" />
          <span>URL QR코드 사용 방법</span>
        </h3>
        <ol className="space-y-2.5 text-xs text-slate-700 pl-1">
          {[
            'QR로 만들 URL을 입력합니다.',
            'QR 크기와 색상을 선택합니다.',
            'QR코드를 생성합니다. (실시간 미리보기가 활성화됩니다.)',
            'PNG 또는 SVG로 다운로드합니다.',
            '실제 스마트폰 카메라로 스캔 테스트를 합니다.',
          ].map((step, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-5 h-5 bg-emerald-50 text-emerald-700 font-bold rounded-full flex items-center justify-center shrink-0 font-mono text-[10px]">
                {idx + 1}
              </span>
              <p className="mt-0.5">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default UrlQrTool;
