import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Contact,
  User,
  Phone,
  Mail,
  Building,
  Laptop,
  MapPin,
  FileText,
  Sparkles,
  Copy,
  RefreshCw,
  AlertCircle,
  Check,
} from 'lucide-react';
import PrivacyNotice from '../../../components/qr/PrivacyNotice';
import QrPreview from '../../../components/qr/QrPreview';
import DownloadButtons from '../../../components/qr/DownloadButtons';
import QrSeo from '../../../components/seo/QrSeo';
import AdSlot from '../../../components/common/AdSlot';
import { validateVcardInputs, generateVcardString } from './vcardQrUtils';
import { downloadCanvasAsPng, downloadSvgString } from '../../../lib/download';
import QRCode from 'qrcode';

export const VcardQrTool: React.FC = () => {
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [url, setUrl] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');

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

    const inputs = { name, org, title, phone, email, url, address, note };
    const validationResult = validateVcardInputs(inputs);
    if (!validationResult.isValid) {
      setErrorMsg(validationResult.error);
      setQrValue('');
      return;
    }

    setQrValue(generateVcardString(inputs));
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
      downloadCanvasAsPng(offscreenCanvas, `qr-code-vcard-${size}px.png`);
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
      downloadSvgString(svgString, `qr-code-vcard-${size}px.svg`);
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
    setName('');
    setOrg('');
    setTitle('');
    setPhone('');
    setEmail('');
    setUrl('');
    setAddress('');
    setNote('');
    setQrValue('');
    setErrorMsg(null);
    setSize(512);
    setMargin(4);
    setFgColor('#0f172a');
    if (bgColor !== '#ffffff') setBgColor('#ffffff');
    setCopied(false);
  };

  return (
    <div className="space-y-6" id="vcard-qr-tool-root">
      <div className="text-left" id="vcard-qr-intro">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
          <Contact className="text-emerald-600" size={28} />
          <span>명함 QR 만들기</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          이름, 전화번호, 이메일, 회사 정보를 QR코드로 만들어 명함이나 프로필에 넣어보세요.
        </p>
      </div>

      <PrivacyNotice />

      <div className="grid lg:grid-cols-12 gap-8 items-start my-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 text-left">
          <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <span className="w-1.5 h-4 bg-emerald-600 rounded-full inline-block" />
            <span>연락처 정보 입력</span>
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            <p className="text-[11px] text-slate-500 font-medium">
              ※ 이름, 전화번호, 이메일 중 최소 하나 이상을 기입하셔야 완벽한 명함 QR코드가 빌드됩니다.
            </p>

            <div>
              <label htmlFor="vcard-name" className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                <User size={12} className="text-slate-450" />
                <span>이름</span>
              </label>
              <input
                type="text"
                id="vcard-name"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="홍길동"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMsg(null);
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="vcard-org" className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                  <Building size={12} className="text-slate-455" />
                  <span>회사명</span>
                </label>
                <input
                  type="text"
                  id="vcard-org"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder="예: 주식회사 에이아이스튜디오"
                  value={org}
                  onChange={(e) => {
                    setOrg(e.target.value);
                    setErrorMsg(null);
                  }}
                />
              </div>

              <div>
                <label htmlFor="vcard-title" className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                  <User size={12} className="text-slate-455" />
                  <span>직함 / 직급</span>
                </label>
                <input
                  type="text"
                  id="vcard-title"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder="예: 대표이사, 수석 엔지니어"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setErrorMsg(null);
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="vcard-phone" className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                  <Phone size={12} className="text-slate-455" />
                  <span>전화번호</span>
                </label>
                <input
                  type="tel"
                  id="vcard-phone"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                  placeholder="010-1234-5678"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErrorMsg(null);
                  }}
                />
              </div>

              <div>
                <label htmlFor="vcard-email" className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                  <Mail size={12} className="text-slate-455" />
                  <span>이메일</span>
                </label>
                <input
                  type="text"
                  id="vcard-email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                  placeholder="gildong@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMsg(null);
                  }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="vcard-url" className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                <Laptop size={12} className="text-slate-455" />
                <span>웹사이트 (URL)</span>
              </label>
              <input
                type="text"
                id="vcard-url"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                placeholder="https://gildong.com"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setErrorMsg(null);
                }}
              />
            </div>

            <div>
              <label htmlFor="vcard-address" className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                <MapPin size={12} className="text-slate-455" />
                <span>주소</span>
              </label>
              <input
                type="text"
                id="vcard-address"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="서울시 강남구 테헤란로 123"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setErrorMsg(null);
                }}
              />
            </div>

            <div>
              <label htmlFor="vcard-note" className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                <FileText size={12} className="text-slate-455" />
                <span>메모 (Note)</span>
              </label>
              <textarea
                id="vcard-note"
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="예: 미팅 협의차 상시 연락 환영"
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  setErrorMsg(null);
                }}
              />
            </div>

            {errorMsg && (
              <div className="flex items-center space-x-1.5 mt-2 text-xs font-bold text-red-650" id="vcard-error-msg">
                <AlertCircle size={14} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-bold tracking-wide uppercase text-slate-400">QR코드 스타일 설정</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vcard-size-select" className="block text-xs font-bold text-slate-600 mb-1.5">QR 크기</label>
                  <select
                    id="vcard-size-select"
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
                  <label htmlFor="vcard-margin-select" className="block text-xs font-bold text-slate-600 mb-1.5">여백 선택</label>
                  <select
                    id="vcard-margin-select"
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
              id="btn-vcard-generate"
            >
              <Sparkles size={14} />
              <span>명함 QR 만들기</span>
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
              className="flex items-center justify-center space-x-2 py-3 px-4 border border-slate-200 rounded-xl text-xs font-bold text-slate-770 bg-white hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
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
                  <span>vCard 내용 복사</span>
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

      <QrSeo toolId="vcard-qr" />

      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 text-left mt-8" id="related-tools-box">
        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center space-x-2">
          <span>🔗 추천 관련 도구</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/qr/qr-design"
            className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-sm transition-all text-xs font-bold text-slate-700 flex items-center justify-between"
          >
            <span>🎨 QR 꾸미기 도구</span>
            <span className="text-emerald-600 text-[10px]">바로가기 &rarr;</span>
          </Link>
          <Link
            to="/qr/url-qr"
            className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-sm transition-all text-xs font-bold text-slate-700 flex items-center justify-between"
          >
            <span>🔗 URL QR 만들기</span>
            <span className="text-emerald-600 text-[10px]">바로가기 &rarr;</span>
          </Link>
        </div>
      </div>

      <div
        className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 text-left space-y-4 shadow-sm animate-fade-in"
        id="vcard-usage-guidelines"
      >
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <span className="w-1.5 h-4 bg-emerald-600 rounded-full inline-block" />
          <span>명함 QR코드 사용 방법</span>
        </h3>
        <ol className="space-y-2.5 text-xs text-slate-700 pl-1">
          {[
            '이름, 전화번호, 이메일 등 연락처 정보를 입력합니다.',
            'QR코드를 생성합니다. (실시간 미리보기가 작동합니다.)',
            'PNG 또는 SVG로 다운로드합니다.',
            '명함, 포스터, 프로필 페이지에 삽입합니다.',
            '실제 스마트폰으로 스캔 테스트를 합니다.',
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

export default VcardQrTool;
