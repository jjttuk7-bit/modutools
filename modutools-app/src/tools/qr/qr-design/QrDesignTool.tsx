import React, { useState, useEffect, useRef } from 'react';
import {
  Palette,
  Sparkles,
  UploadCloud,
  Eye,
  RefreshCw,
  AlertCircle,
  Check,
  Image as ImageIcon,
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import PrivacyNotice from '../../../components/qr/PrivacyNotice';
import AdSlot from '../../../components/common/AdSlot';
import QrSeo from '../../../components/seo/QrSeo';
import QRCode from 'qrcode';
import { downloadCanvasAsPng, downloadSvgString } from '../../../lib/download';

export const QrDesignTool: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialValueFromParam = searchParams.get('value') || '';

  const [qrContent, setQrContent] = useState(initialValueFromParam || '');
  const [contentType, setContentType] = useState<'url' | 'text'>('url');
  const [size, setSize] = useState<number>(512);
  const [margin, setMargin] = useState<number>(4);
  const [fgColor, setFgColor] = useState<string>('#0f172a');
  const [bgColor, setBgColor] = useState<string>('#ffffff');

  const [cornerStyle, setCornerStyle] = useState<'square' | 'rounded'>('rounded');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoScale, setLogoScale] = useState<number>(0.18);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialValueFromParam) {
      setQrContent(initialValueFromParam);
    }
  }, [initialValueFromParam]);

  useEffect(() => {
    return () => {
      if (logoUrl) {
        URL.revokeObjectURL(logoUrl);
      }
    };
  }, [logoUrl]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setErrorMsg('로고 이미지 파일만 등록 가능합니다.');
        return;
      }
      setErrorMsg(null);
      setLogoFile(file);

      if (logoUrl) {
        URL.revokeObjectURL(logoUrl);
      }
      const u = URL.createObjectURL(file);
      setLogoUrl(u);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    if (logoUrl) {
      URL.revokeObjectURL(logoUrl);
    }
    setLogoUrl(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const renderStyledQr = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const finalValue = qrContent.trim() || ' ';

    try {
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);

      const qrObj = QRCode.create(finalValue, { errorCorrectionLevel: 'H' });
      const modulesCount = qrObj.modules.size;
      const rawSize = size - margin * 8;
      const cellSize = rawSize / modulesCount;
      const offset = (size - rawSize) / 2;

      ctx.fillStyle = fgColor;

      for (let r = 0; r < modulesCount; r++) {
        for (let c = 0; c < modulesCount; c++) {
          const isDark = qrObj.modules.get(r, c);
          if (!isDark) continue;

          const x = offset + c * cellSize;
          const y = offset + r * cellSize;

          const isTopLeftEye = r < 7 && c < 7;
          const isTopRightEye = r < 7 && c >= modulesCount - 7;
          const isBottomLeftEye = r >= modulesCount - 7 && c < 7;
          const isFinderEye = isTopLeftEye || isTopRightEye || isBottomLeftEye;

          if (isFinderEye) {
            if (cornerStyle === 'rounded') {
              let startRow = 0;
              let startCol = 0;
              if (isTopRightEye) startCol = modulesCount - 7;
              if (isBottomLeftEye) startRow = modulesCount - 7;

              const relR = r - startRow;
              const relC = c - startCol;

              if (relR === 0 || relR === 6 || relC === 0 || relC === 6) {
                ctx.fillStyle = fgColor;
                ctx.fillRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);
              } else if (relR >= 2 && relR <= 4 && relC >= 2 && relC <= 4) {
                ctx.fillStyle = fgColor;
                ctx.beginPath();
                ctx.arc(x + cellSize / 2, y + cellSize / 2, (cellSize / 2) * 0.95, 0, Math.PI * 2);
                ctx.fill();
              }
            } else {
              ctx.fillStyle = fgColor;
              ctx.fillRect(x, y, cellSize, cellSize);
            }
          } else {
            ctx.fillStyle = fgColor;
            if (cornerStyle === 'rounded') {
              ctx.beginPath();
              ctx.arc(x + cellSize / 2, y + cellSize / 2, (cellSize / 2) * 0.85, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.fillRect(x, y, cellSize, cellSize);
            }
          }
        }
      }

      if (logoUrl) {
        const img = new Image();
        img.onload = () => {
          const logoSize = size * logoScale;
          const logoX = (size - logoSize) / 2;
          const logoY = (size - logoSize) / 2;

          ctx.fillStyle = bgColor;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(logoX - 6, logoY - 6, logoSize + 12, logoSize + 12, size * 0.02);
          } else {
            ctx.rect(logoX - 6, logoY - 6, logoSize + 12, logoSize + 12);
          }
          ctx.fill();

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
        };
        img.onerror = () => {
          setErrorMsg('로고 이미지를 읽는 중 문제가 발생했습니다.');
        };
        img.src = logoUrl;
      }
    } catch (err) {
      console.error('Custom QR drawing error:', err);
      setErrorMsg('QR 생성 중 문제가 발생했습니다.');
    }
  };

  useEffect(() => {
    renderStyledQr();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrContent, size, margin, fgColor, bgColor, cornerStyle, logoUrl, logoScale]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas || !qrContent.trim()) {
      setErrorMsg('QR로 만들 내용을 입력해주세요.');
      return;
    }

    try {
      downloadCanvasAsPng(canvas, `designed-qr-${size}px.png`);
      setSuccessMsg('PNG 다운로드 파일이 성공적으로 생성되었습니다!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch {
      setErrorMsg('다운로드 파일을 생성하지 못했습니다.');
    }
  };

  const downloadSvg = async () => {
    if (!qrContent.trim()) {
      setErrorMsg('QR로 만들 내용을 입력해주세요.');
      return;
    }

    try {
      const svgString = await QRCode.toString(qrContent.trim(), {
        type: 'svg',
        width: size,
        margin,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: 'H',
      });
      downloadSvgString(svgString, `designed-qr-${size}px.svg`);
      setSuccessMsg('SVG 다운로드 파일이 성공적으로 생성되었습니다!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch {
      setErrorMsg('다운로드 파일을 생성하지 못했습니다.');
    }
  };

  const fillPresetTheme = (fg: string, bg: string, corner: 'square' | 'rounded') => {
    setFgColor(fg);
    setBgColor(bg);
    setCornerStyle(corner);
  };

  const handleReset = () => {
    setQrContent('');
    setContentType('url');
    setSize(512);
    setMargin(4);
    setFgColor('#0f172a');
    setBgColor('#ffffff');
    setCornerStyle('rounded');
    removeLogo();
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return (
    <div className="space-y-6" id="qr-design-tool-root">
      <div className="text-left" id="qr-design-intro">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
          <Palette className="text-emerald-600" size={28} />
          <span>QR 꾸미기</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          색상, 크기, 여백, 로고를 설정해 브랜드 느낌의 QR코드를 만들어보세요.
        </p>
      </div>

      <PrivacyNotice />

      <div className="grid lg:grid-cols-12 gap-8 items-start my-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 text-left">
          <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <span className="w-1.5 h-4 bg-emerald-600 rounded-full inline-block" />
            <span>나만의 QR 디자인 스타일링</span>
          </h2>

          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="design-content-input" className="block text-xs font-bold text-slate-600">
                  QR코드에 포함할 내용
                </label>
                <div className="flex space-x-2 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setContentType('url');
                      if (!qrContent) setQrContent('https://');
                    }}
                    className={`px-2 py-0.5 rounded-full transition-all ${
                      contentType === 'url'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    웹사이트 주소
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentType('text')}
                    className={`px-2 py-0.5 rounded-full transition-all ${
                      contentType === 'text'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    일반 텍스트
                  </button>
                </div>
              </div>
              <input
                type="text"
                id="design-content-input"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                placeholder={contentType === 'url' ? 'https://example.com' : 'QR로 만들 내용을 입력하세요.'}
                value={qrContent}
                onChange={(e) => {
                  setQrContent(e.target.value);
                  setErrorMsg(null);
                }}
              />
              {!qrContent.trim() && (
                <p className="text-[10px] text-emerald-700 italic mt-1 font-medium">
                  ※ 위 상자에 글이나 링크를 채워 넣으시면 아래 실시간 디자이너 이미지가 자동 갱신됩니다.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <label htmlFor="design-size-select" className="block text-xs font-bold text-slate-600 mb-1.5">
                  QR 크기
                </label>
                <select
                  id="design-size-select"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-750 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={256}>256px × 256px</option>
                  <option value={512}>512px × 512px (기본)</option>
                  <option value={1024}>1024px × 1024px (인쇄용 고해상도)</option>
                </select>
              </div>

              <div>
                <label htmlFor="design-margin-select" className="block text-xs font-bold text-slate-600 mb-1.5">
                  여백 비율
                </label>
                <select
                  id="design-margin-select"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-750 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={0}>여백 없음 (0)</option>
                  <option value={2}>좁게 (2)</option>
                  <option value={4}>보통 (4)</option>
                  <option value={8}>넓게 (8)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">전경 무늬 색상</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    aria-label="Foreground Hex Color Identifier"
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
                <label className="block text-xs font-bold text-slate-600 mb-1.5">코드 배경 색상</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    aria-label="Background Hex Color Identifier"
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

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">모서리 및 도트 스타일</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCornerStyle('square')}
                  className={`p-3 border rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                    cornerStyle === 'square'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  기본 (각진 스타일)
                </button>
                <button
                  type="button"
                  onClick={() => setCornerStyle('rounded')}
                  className={`p-3 border rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                    cornerStyle === 'rounded'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  부드러운 스타일 (둥근 모서리)
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-600">중앙 로고 세팅</label>
                {logoUrl && (
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="text-[10px] text-red-650 font-bold hover:underline"
                  >
                    로고 제거하기
                  </button>
                )}
              </div>

              {!logoUrl ? (
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="border border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-center space-x-2.5"
                >
                  <UploadCloud size={16} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-500">
                    로고 이미지 등록하기 (.png, .jpg)
                  </span>
                  <input
                    type="file"
                    ref={logoInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={logoUrl}
                        alt="Logo Micro preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-700 truncate">{logoFile?.name}</p>
                      <p className="text-[10px] text-slate-400">
                        성공적으로 장착되었습니다. 아래 조절 바로 크기를 미세조정하세요.
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span>로고 크기 조절</span>
                      <span>{Math.round(logoScale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={0.28}
                      step={0.01}
                      value={logoScale}
                      onChange={(e) => setLogoScale(parseFloat(e.target.value))}
                      className="w-full accent-emerald-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 font-bold px-1 mt-0.5">
                      <span>최소 (10%)</span>
                      <span className="text-amber-600">권장 (15%~20%)</span>
                      <span>최대 (28%)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-600 mb-2">원주형 고급 배색 템플릿</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => fillPresetTheme('#1e3a8a', '#eff6ff', 'rounded')}
                  className="p-2 border border-slate-200 rounded-xl text-[10px] font-bold bg-indigo-50/50 hover:bg-indigo-50 text-indigo-900"
                >
                  비즈니스 네이비
                </button>
                <button
                  type="button"
                  onClick={() => fillPresetTheme('#b45309', '#fef3c7', 'rounded')}
                  className="p-2 border border-slate-200 rounded-xl text-[10px] font-bold bg-amber-50/50 hover:bg-amber-50 text-amber-900"
                >
                  클래식 브라운
                </button>
                <button
                  type="button"
                  onClick={() => fillPresetTheme('#be185d', '#fdf2f8', 'rounded')}
                  className="p-2 border border-slate-200 rounded-xl text-[10px] font-bold bg-pink-50/50 hover:bg-pink-50 text-pink-900"
                >
                  팬시 로즈핑크
                </button>
              </div>
            </div>

            {errorMsg && (
              <div
                className="flex items-center space-x-1.5 p-3 rounded-xl bg-red-50 border border-red-100 text-xs font-bold text-red-650"
                id="designer-error-msg"
              >
                <AlertCircle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div
                className="flex items-center space-x-1.5 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-850"
                id="designer-success-msg"
              >
                <Check size={15} />
                <span>{successMsg}</span>
              </div>
            )}
          </div>

          <AdSlot type="responsive" label="안전한 무료 변환기 운영 후원 광고" />
        </div>

        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div
            className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center h-full min-h-[380px]"
            id="design-render-preview"
          >
            <div className="flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4 font-bold">
              <Eye size={12} className="animate-pulse" />
              <span>실시간 디자인 미리보기</span>
            </div>

            <div className="w-[200px] h-[200px] md:w-[240px] md:h-[240px] rounded-2xl overflow-hidden shadow-md flex items-center justify-center transition-all duration-300 relative bg-white border border-slate-100">
              <canvas ref={canvasRef} className="w-full h-full object-contain" id="styled-working-canvas" />
            </div>

            <p className="text-[10px] text-slate-450 mt-4 leading-normal max-w-[210px] font-bold">
              ※ 로고 각인 후에는 안전한 인식을 위해 <strong>실제 스마트폰 카메라 앱</strong>을 켜서 스캔 검증해 보실
              것을 강력히 권장합니다.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={downloadPng}
                disabled={!qrContent.trim()}
                className="flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl font-bold text-xs border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 shadow-sm active:scale-[0.98] disabled:opacity-40 cursor-pointer"
              >
                <ImageIcon size={14} className="shrink-0 text-emerald-700" />
                <span>PNG 다운로드</span>
              </button>

              <button
                onClick={downloadSvg}
                disabled={!qrContent.trim()}
                className="flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl font-bold text-xs border border-emerald-500 bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-40 cursor-pointer"
              >
                <Sparkles size={14} className="shrink-0" />
                <span>SVG 다운로드</span>
              </button>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 px-4 border border-slate-200 bg-slate-100 font-bold hover:bg-slate-200 text-slate-700 text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw size={12} className="text-slate-500" />
              <span>새로 만들기 (꾸미기 초기화)</span>
            </button>
          </div>
        </div>
      </div>

      <QrSeo toolId="qr-design" />

      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 text-left mt-8" id="related-tools-box">
        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center space-x-2">
          <span>🔗 추천 관련 도구</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/qr/url-qr"
            className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-sm transition-all text-xs font-bold text-slate-700 flex items-center justify-between"
          >
            <span>🔗 URL QR 만들기</span>
            <span className="text-emerald-600 text-[10px]">바로가기 &rarr;</span>
          </Link>
          <Link
            to="/qr/wifi-qr"
            className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-sm transition-all text-xs font-bold text-slate-700 flex items-center justify-between"
          >
            <span>📶 와이파이 QR 만들기</span>
            <span className="text-emerald-600 text-[10px]">바로가기 &rarr;</span>
          </Link>
          <Link
            to="/qr/vcard-qr"
            className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-sm transition-all text-xs font-bold text-slate-700 flex items-center justify-between"
          >
            <span>📇 명함 QR 만들기</span>
            <span className="text-emerald-600 text-[10px]">바로가기 &rarr;</span>
          </Link>
        </div>
      </div>

      <div
        className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 text-left space-y-4 shadow-sm animate-fade-in"
        id="design-guidelines-block"
      >
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <span className="w-1.5 h-4 bg-emerald-600 rounded-full inline-block" />
          <span>QR 색상 선택 팁</span>
        </h3>
        <ol className="space-y-2 text-xs text-slate-700 pl-1 leading-relaxed">
          {[
            '어두운 전경색(검정, 네이비, 딥그린)과 밝은 배경색(흰색, 미색, 미백색)을 사용하는 조합을 강력히 권장합니다.',
            '배경색과 QR 색상의 밝기 대비가 낮으면 피사체 대조 해독 에러가 날 수 있게 됩니다.',
            '실제 잉크 인쇄용 출력물 변환시에는 너무 연하거나 파스텔 조 화이트 톤 계열 전경 배색은 피해 주시는 것이 스마트한 디렉션입니다.',
          ].map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
              <p className="font-medium">{tip}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default QrDesignTool;
