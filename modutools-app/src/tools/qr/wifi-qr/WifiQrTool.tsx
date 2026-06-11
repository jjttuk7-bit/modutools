import React, { useState } from 'react';
import { Wifi, Sparkles, Eye, EyeOff, Copy, RefreshCw, AlertCircle, Check } from 'lucide-react';
import PrivacyNotice from '../../../components/qr/PrivacyNotice';
import QrPreview from '../../../components/qr/QrPreview';
import DownloadButtons from '../../../components/qr/DownloadButtons';
import QrSeo from '../../../components/seo/QrSeo';
import AdSlot from '../../../components/common/AdSlot';
import { generateWifiString, validateWifiInput } from './wifiQrUtils';
import { downloadCanvasAsPng, downloadSvgString } from '../../../lib/download';
import QRCode from 'qrcode';

export const WifiQrTool: React.FC = () => {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState('WPA');
  const [isHidden, setIsHidden] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [qrValue, setQrValue] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [size, setSize] = useState<number>(512);
  const [margin, setMargin] = useState<number>(4);
  const [fgColor, setFgColor] = useState<string>('#042f2e');
  const [bgColor, setBgColor] = useState<string>('#ffffff');

  const [copied, setCopied] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const validationResult = validateWifiInput(ssid, password, encryption);
    if (!validationResult.isValid) {
      setErrorMsg(validationResult.error);
      setQrValue('');
      return;
    }

    const targetString = generateWifiString(ssid, password, encryption, isHidden);
    setQrValue(targetString);
  };

  const downloadPng = async () => {
    if (!qrValue) return;
    try {
      const offscreenCanvas = document.createElement('canvas');
      await QRCode.toCanvas(offscreenCanvas, qrValue, {
        width: size,
        margin,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: 'H',
      });
      downloadCanvasAsPng(offscreenCanvas, `qr-code-wifi-${size}px.png`);
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
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: 'H',
      });
      downloadSvgString(svgString, `qr-code-wifi-${size}px.svg`);
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
    setSsid('');
    setPassword('');
    setEncryption('WPA');
    setIsHidden(false);
    setShowPassword(false);
    setQrValue('');
    setErrorMsg(null);
    setSize(512);
    setMargin(4);
    setFgColor('#042f2e');
    if (bgColor !== '#ffffff') setBgColor('#ffffff');
    setCopied(false);
  };

  return (
    <div className="space-y-6" id="wifi-qr-tool-root">
      <div className="text-left" id="wifi-qr-intro">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
          <Wifi className="text-emerald-600" size={28} />
          <span>와이파이 QR 만들기</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          매장, 사무실, 강의실 Wi-Fi 접속 정보를 QR코드로 만들어 손쉽게 공유하세요.
        </p>
      </div>

      <PrivacyNotice />

      <div className="grid lg:grid-cols-12 gap-8 items-start my-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 text-left">
          <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <span className="w-1.5 h-4 bg-emerald-600 rounded-full inline-block" />
            <span>Wi-Fi 접속 데이터 입력</span>
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label htmlFor="ssid-input" className="block text-xs font-bold text-slate-600 mb-1.5">
                와이파이 네트워크 이름 (SSID)
              </label>
              <input
                type="text"
                id="ssid-input"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                placeholder="Wi-Fi AP 이름을 정확히 입력하세요"
                value={ssid}
                onChange={(e) => {
                  setSsid(e.target.value);
                  setErrorMsg(null);
                }}
                required
              />
            </div>

            <div>
              <label htmlFor="password-input" className="block text-xs font-bold text-slate-600 mb-1.5">
                비밀번호 (Password)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password-input"
                  className="w-full bg-slate-50 border border-slate-200 pl-4 pr-11 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono rounded-xl disabled:opacity-50"
                  placeholder={
                    encryption === 'nopass' ? '비밀번호가 없는 네트워크입니다' : '비밀번호를 입력하세요'
                  }
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg(null);
                  }}
                  disabled={encryption === 'nopass'}
                />
                {encryption !== 'nopass' && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">암호화 보안 형태</label>
              <div className="grid grid-cols-3 gap-2">
                {['WPA', 'WEP', 'nopass'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setEncryption(mode);
                      if (mode === 'nopass') setPassword('');
                      setErrorMsg(null);
                    }}
                    className={`p-2.5 border rounded-xl text-xs font-bold transition-all ${
                      encryption === mode
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-sm'
                        : 'border-slate-205 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {mode === 'WPA' ? 'WPA/WPA2' : mode === 'WEP' ? 'WEP' : '보안 없음 (Open)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="hidden-network"
                checked={isHidden}
                onChange={(e) => {
                  setIsHidden(e.target.checked);
                  setErrorMsg(null);
                }}
                className="h-4 w-4 rounded border-slate-300 text-emerald-650 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="hidden-network" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                숨겨진 네트워크 (Hidden SSID)
              </label>
            </div>

            {errorMsg && (
              <div className="flex items-center space-x-1.5 mt-2 text-xs font-bold text-red-650" id="wifi-error-msg">
                <AlertCircle size={14} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-bold tracking-wide uppercase text-slate-400">QR코드 스타일 설정</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="size-select-wifi" className="block text-xs font-bold text-slate-600 mb-1.5">
                    QR 크기
                  </label>
                  <select
                    id="size-select-wifi"
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
                  <label htmlFor="margin-select-wifi" className="block text-xs font-bold text-slate-600 mb-1.5">
                    여백 선택
                  </label>
                  <select
                    id="margin-select-wifi"
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
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">전경색 (코드 색상)</label>
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
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">배경색 (바탕 색상)</label>
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
              <label className="block text-xs font-bold text-slate-600 mb-2">기본 꾸미기 테마</label>
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
              id="btn-wifi-generate"
            >
              <Sparkles size={14} />
              <span>와이파이 QR 만들기</span>
            </button>
          </form>

          <AdSlot type="responsive" label="안전한 무료 변환기 운영 후원 광고" />
        </div>

        <div className="lg:col-span-5 flex flex-col space-y-6">
          <QrPreview value={qrValue} fgColor={fgColor} bgColor={bgColor} margin={margin} />

          <DownloadButtons disabled={!qrValue} onDownloadPng={downloadPng} onDownloadSvg={downloadSvg} />

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
                  <span>QR 문자열 복사</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center space-x-2 py-3 px-4 border border-slate-200 rounded-xl text-xs font-bold text-slate-755 bg-slate-100 hover:bg-slate-200 transition-all active:scale-[0.98] cursor-pointer"
              id="btn-new-qr"
            >
              <RefreshCw size={14} className="text-slate-600 shrink-0" />
              <span>새로 만들기</span>
            </button>
          </div>
        </div>
      </div>

      <QrSeo toolId="wifi-qr" />

      <div
        className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 text-left space-y-4 shadow-sm"
        id="wifi-usage-guidelines"
      >
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <span className="w-1.5 h-4 bg-emerald-600 rounded-full inline-block" />
          <span>와이파이 QR코드 사용 방법</span>
        </h3>
        <ol className="space-y-2.5 text-xs text-slate-700 pl-1">
          {[
            'Wi-Fi 이름을 입력합니다.',
            '비밀번호와 암호화 방식을 선택합니다.',
            'QR코드를 생성합니다. (실시간 미리보기가 활성화됩니다.)',
            'PNG 또는 SVG로 다운로드합니다.',
            '스마트폰 카메라로 스캔해 접속이 되는지 확인합니다.',
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

export default WifiQrTool;
