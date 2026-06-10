import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type {
  ImageFitMode,
  TextPosition,
  TextLayerOptions,
} from '../../../types/canvas';
import { textOnImagePresets } from './textOnImagePresets';
import { ImageUploader } from '../../../components/thumbnail/ImageUploader';
import { CanvasPreview } from '../../../components/thumbnail/CanvasPreview';
import { ImageOptionPanel } from '../../../components/thumbnail/ImageOptionPanel';
import { DownloadButton } from '../../../components/thumbnail/DownloadButton';
import { PrivacyNotice } from '../../../components/qr/PrivacyNotice';
import { AdSlot } from '../../../components/common/AdSlot';
import { Type, Wand2, RefreshCw, Check, BookOpen, Layers } from 'lucide-react';

export const TextOnImageTool: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activePresetId, setActivePresetId] = useState<string>('text-original');
  const activePreset =
    textOnImagePresets.find((p) => p.id === activePresetId) || textOnImagePresets[0];

  const [backgroundColor, setBackgroundColor] = useState('#0f172a');
  const [fitMode, setFitMode] = useState<ImageFitMode>('cover');
  const [scale, setScale] = useState<number>(1.0);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);

  const [title, setTitle] = useState('메인 자막 텍스트와 타이틀을\n이곳에 마음껏 입력하세요.');
  const [subtitle, setSubtitle] = useState(
    '단 한 줄의 문구만으로도 방문 유도 가치를 몇 배 상승시킵니다',
  );
  const [fontSize, setFontSize] = useState<number>(56);
  const [color, setColor] = useState('#ffffff');
  const [useBackground, setUseBackground] = useState(true);
  const [boxBackgroundColor, setBoxBackgroundColor] = useState('rgba(0, 0, 0, 0.7)');
  const [position, setPosition] = useState<TextPosition>('center');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imgWidth, setImgWidth] = useState<number>(0);
  const [imgHeight, setImgHeight] = useState<number>(0);

  const [optionsExpanded, setOptionsExpanded] = useState(true);

  const currentCanvasWidth =
    activePreset.id === 'text-original' && imgWidth > 0 ? imgWidth : activePreset.width;
  const currentCanvasHeight =
    activePreset.id === 'text-original' && imgHeight > 0 ? imgHeight : activePreset.height;

  useEffect(() => {
    if (activePreset.id === 'text-original' && imgWidth > 0) {
      setFitMode('contain');
    } else {
      setFitMode('cover');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePresetId, imgWidth]);

  const handleImageLoaded = (file: File, url: string, width: number, height: number) => {
    setImageFile(file);
    setPreviewUrl(url);
    setImgWidth(width);
    setImgHeight(height);
  };

  const handleClearImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setImgWidth(0);
    setImgHeight(0);
  };

  const handlePresetChange = (presetId: string) => {
    setActivePresetId(presetId);
    const selected = textOnImagePresets.find((p) => p.id === presetId);
    if (selected) {
      if (selected.id === 'text-square') {
        setFontSize(54);
      } else if (selected.id === 'text-vertical') {
        setFontSize(50);
      } else {
        setFontSize(56);
      }
    }
  };

  const handleReset = () => {
    setActivePresetId('text-original');
    setBackgroundColor('#0f172a');
    setFitMode('cover');
    setScale(1.0);
    setOffsetX(0);
    setOffsetY(0);
    setTitle('사진 뒤에 마음을 움직이는 타이틀 자막');
    setSubtitle('이곳에 부제목이나 홍보 요약 문구를 적으세요');
    setFontSize(56);
    setColor('#ffffff');
    setUseBackground(true);
    setBoxBackgroundColor('rgba(0, 0, 0, 0.7)');
    setPosition('center');
    handleClearImage();
  };

  const applyPresetTheme = (
    theme: 'modernDark' | 'cyber' | 'softCoral' | 'highContrast',
  ) => {
    switch (theme) {
      case 'modernDark':
        setBackgroundColor('#020617');
        setColor('#ffffff');
        setUseBackground(true);
        setBoxBackgroundColor('rgba(0, 0, 0, 0.85)');
        break;
      case 'cyber':
        setBackgroundColor('#4c1d95');
        setColor('#ffffff');
        setUseBackground(true);
        setBoxBackgroundColor('rgba(15, 23, 42, 0.8)');
        break;
      case 'softCoral':
        setBackgroundColor('#f43f5e');
        setColor('#ffffff');
        setUseBackground(true);
        setBoxBackgroundColor('rgba(136, 19, 55, 0.75)');
        break;
      case 'highContrast':
        setBackgroundColor('#fef08a');
        setColor('#111827');
        setUseBackground(true);
        setBoxBackgroundColor('rgba(185, 28, 28, 0.9)');
        break;
    }
  };

  const textOptions: TextLayerOptions = {
    title,
    subtitle: subtitle || undefined,
    fontSize,
    color,
    useBackground,
    backgroundColor: boxBackgroundColor,
    position,
  };

  return (
    <div id="text-on-image-editor" className="space-y-6">
      <div
        id="trust-alert-strip"
        className="bg-slate-900 text-slate-100 rounded-2xl p-4 border border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
          <p className="text-[11px] md:text-xs font-bold font-sans tracking-wide text-center md:text-left">
            <span>🛡️ 100% 클라이언트 브라우저 로컬 가공 모드 - 극도의 보안 유지</span>
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[10px] text-slate-400 font-extrabold font-mono">
          <span>✔ 이미지는 서버에 저장되지 않습니다.</span>
          <span>✔ 모든 편집은 브라우저 안에서만 진행됩니다.</span>
          <span>✔ 작업한 이미지는 사용자의 기기에만 다운로드됩니다.</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0 shadow-3xs">
            <Type className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-909 tracking-tight flex items-center gap-2">
              <span>이미지에 글자 넣기</span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                정밀 텍스트 레이아웃
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              원본 고화질 사진 규격을 유지하거나 다양한 규격 프리셋 위에 직관적인 안내 가치제안, 타이틀
              글자 문양을 실시간 합성 후 다운로드하세요.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOptionsExpanded(!optionsExpanded)}
          className="md:hidden text-xs bg-slate-100 font-extrabold text-slate-800 px-3.5 py-2 rounded-xl border border-slate-200"
        >
          {optionsExpanded ? '▲ 편집 옵션 숨기기' : '▼ 편집 옵션 펼쳐보기'}
        </button>
      </div>

      <PrivacyNotice />

      <AdSlot type="leaderboard" label="헤더 아래 가로 배너 광고 영역" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`lg:col-span-7 space-y-6 ${optionsExpanded ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white rounded-2xl p-5 border border-slate-250/80 space-y-3 shadow-3xs">
            <h4 className="text-xs font-bold text-slate-905 flex items-center gap-1.5 uppercase tracking-wide">
              <Wand2 className="w-4 h-4 text-indigo-500" />
              <span>원클릭 빠른 단글라 자막 컬러 분위기</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => applyPresetTheme('modernDark')}
                className="py-2.5 px-3 border border-slate-205 bg-white hover:border-slate-400 text-[10px] font-bold text-slate-800 rounded-xl transition-all"
              >
                차분한 스카이크로
              </button>
              <button
                type="button"
                onClick={() => applyPresetTheme('cyber')}
                className="py-2.5 px-3 border border-purple-100 bg-purple-50/40 hover:border-purple-300 text-[10px] font-bold text-purple-800 rounded-xl transition-all"
              >
                네온 퍼플사운드
              </button>
              <button
                type="button"
                onClick={() => applyPresetTheme('softCoral')}
                className="py-2.5 px-3 border border-pink-100 bg-pink-50/40 hover:border-pink-300 text-[10px] font-bold text-pink-800 rounded-xl transition-all"
              >
                새콤달콤 로즈코랄
              </button>
              <button
                type="button"
                onClick={() => applyPresetTheme('highContrast')}
                className="py-2.5 px-3 border border-amber-150 bg-amber-55/30 hover:border-amber-400 text-[10px] font-bold text-amber-900 rounded-xl transition-all"
              >
                고대비 자막 옐로우
              </button>
            </div>
          </div>

          <ImageUploader
            onImageLoaded={handleImageLoaded}
            onClear={handleClearImage}
            selectedFile={imageFile}
            dimensions={imageFile ? { width: imgWidth, height: imgHeight } : null}
          />

          <ImageOptionPanel
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
            fitMode={fitMode}
            setFitMode={setFitMode}
            scale={scale}
            setScale={setScale}
            offsetX={offsetX}
            setOffsetX={setOffsetX}
            offsetY={offsetY}
            setOffsetY={setOffsetY}
            title={title}
            setTitle={setTitle}
            subtitle={subtitle}
            setSubtitle={setSubtitle}
            fontSize={fontSize}
            setFontSize={setFontSize}
            color={color}
            setColor={setColor}
            useBackground={useBackground}
            setUseBackground={setUseBackground}
            boxBackgroundColor={boxBackgroundColor}
            setBoxBackgroundColor={setBoxBackgroundColor}
            position={position}
            setPosition={setPosition}
            showImageControls={!!imageFile}
            presets={textOnImagePresets}
            activePresetId={activePresetId}
            onPresetChange={handlePresetChange}
          />

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-red-200 px-4 py-2.5 rounded-xl transition-all shadow-3xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>편집기 전체 새로 설정 (새로 만들기)</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-6 space-y-6">
            <CanvasPreview
              canvasRef={canvasRef}
              width={currentCanvasWidth}
              height={currentCanvasHeight}
              backgroundColor={backgroundColor}
              fitMode={fitMode}
              scale={scale}
              offsetX={offsetX}
              offsetY={offsetY}
              textOptions={textOptions}
              uploadedPreviewUrl={previewUrl}
            />

            <AdSlot type="responsive" label="실시간 캔버스 하단 광고 구역" />

            <DownloadButton
              canvasRef={canvasRef}
              defaultFilename="text_on_image_export"
              hasUploadedImage={!!imageFile}
            />
          </div>
        </div>
      </div>

      <AdSlot type="responsive" label="SEO 가이드 시작 영역 가로 광고배너" />

      <section className="border-t border-slate-250 pt-10 mt-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-905 tracking-tight border-b border-slate-150 pb-2 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-indigo-500 rounded-full" />
              <span>이미지에 글자를 넣어야 하는 특별한 경우</span>
            </h3>
            <ul className="space-y-2.5">
              {[
                '블로그의 포스팅 대표 대표이미지 한 가운데 수려하고 세련된 포스터 고딕 글꼴의 타이틀 자막을 합성할 때',
                '스마트스토어 주력 판매 상품 사진 위에 스페셜 특가 혜택 및 무료배송 프로모션 공지사항 문구를 기입하고 싶을 때',
                '사내 보조 교육 자료, 포트폴리오 첫 프레임, 웨비나 커버용 핵심 인트로 설명 피드를 무료 가공하고자 할 때',
                'SNS 카드뉴스의 매력을 배가시키기 위해 원본 비율에 기인한 채 고대비 박스가 감싸진 텍스트를 기입하려 할 때',
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-600 font-medium flex items-start gap-2 leading-relaxed"
                >
                  <span className="text-indigo-500 font-extrabold select-none">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-905 tracking-tight border-b border-slate-150 pb-2 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-indigo-500 rounded-full" />
              <span>사진에 글자 집어넣기 간편 조작 가이드</span>
            </h3>
            <ol className="space-y-2.5">
              {[
                "가지고 계신 사진 스냅샷을 위 '파일 선택 및 드롭 박스'에 부드럽게 마우스 업로드합니다.",
                '도구 장치의 비율란에서 원본 비율 유지를 유지하거나 1:1, 유튜브 썸네일(16:9) 프리셋 등을 필요에 따라 정위 지정합니다.',
                '우측 메인 타이틀에 방문자의 호기심을 발동할 안내 제목을 작성합니다. (줄바꿈이 엔터로 안전지원됩니다)',
                '자막 가독 구역 향상을 위해 가독성 배경 박스 사출 스위치를 체크 후 투명 도가 적용된 칼라 박스를 입혀줍니다.',
                '크기와 색 정렬 좌표가 정돈되면 완전 고해상도 PNG 포맷을 선택해 컴퓨터 드라이브로 워터마크 없이 소유합니다.',
              ].map((step, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-600 font-medium flex items-start gap-2.5 leading-relaxed"
                >
                  <span className="w-4.5 h-4.5 text-[9px] bg-indigo-50 border border-indigo-150 text-indigo-600 font-extrabold rounded-full flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-650" />
            <span>사진 고해상도 텍스트 합성 해설 참고서</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-1">
              <span className="text-[10px] font-extrabold text-neutral-400 block uppercase font-mono">
                Original Maintain Ratio
              </span>
              <p className="text-xs font-bold text-slate-800">원본 비율 유지 프리셋</p>
              <p className="text-[11px] leading-relaxed font-semibold text-slate-500">
                업로드한 이미지 고유의 본래 치수 규격을 가상 캔버스가 그대로 취수하므로 이미지 손실 및
                픽셀 깨짐 연산 없이 초고급 화질 합성을 행합니다.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-1">
              <span className="text-[10px] font-extrabold text-neutral-400 block uppercase font-mono">
                Typography Contrast
              </span>
              <p className="text-xs font-bold text-slate-800">고조대 색상 매트 조율</p>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                뒷배경과 글자 사이의 아웃라인 경계를 위해 텍스트 뒤에 30%~70% 투명 블랙 배경 박스를
                전착시켜 멀리서 보아도 명확하게 핵심 문장을 인식시킵니다.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-1">
              <span className="text-[10px] font-extrabold text-neutral-400 block uppercase font-mono">
                Multi Ratio Cover
              </span>
              <p className="text-xs font-bold text-slate-800">그 외 4개 표준 비율</p>
              <p className="text-[11px] leading-relaxed font-semibold text-slate-500">
                네이버 및 구글 피드, 그리고 모바일 최강 4:5 및 유튜브 썸네일에 부합하도록 고유 뷰를
                다각적으로 확장 적용할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 bg-slate-50/50 rounded-2xl p-6 border border-slate-150">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-650" />
            <span>이미지 텍스트 합성 자주 묻는 질문 FAQ</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-1.5 shadow-2xs">
              <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <span className="text-indigo-500 font-mono">Q.</span>
                <span>파일 저장 후에도 이미지 영역의 글자를 다시 수정할 수 있나요?</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal font-medium pl-4">
                <strong>저장하기 직전 단계에는 마음껏 실시간 수정이 가능합니다!</strong> 다만, 로컬
                캔버스에 구워 내어 기기로 내려받은 이미지 파일(.png/.jpg)은 하나의 단일 가공 평면이
                되므로 컴퓨터에 저장된 후 편집하려면 본 사이트를 다시 방문하셔서 신규 가공을
                진행하셔야 합니다.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-1.5 shadow-2xs">
              <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <span className="text-indigo-500 font-mono">Q.</span>
                <span>업로드한 이미지가 클라우드 공간이나 외부 서버에 노출 및 기록이 남나요?</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal font-medium pl-4">
                아니요! 파일 관리 서버가 탑재되지 않은 독립적 순수 로컬 클라이언트 플랫폼이므로
                사용자의 하드웨어 브라우저 상에서만 안전한 가상 버퍼링을 실행하므로 프라이버시가
                안전하게 지켜집니다.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-3xs text-center md:text-left">
          <h4 className="text-xs font-bold text-slate-950 flex items-center justify-center md:justify-start gap-1.5 uppercase">
            <BookOpen className="w-4 h-4 text-indigo-550" />
            <span>이런 무료 유용한 도구들과 함께 사용하시면 훨씬 유용합니다</span>
          </h4>
          <p className="text-[11px] text-slate-400 font-medium">
            유형별 고유 가이각을 원클릭 스위칭 교차 이용 가능합니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 pt-1.5">
            <Link
              to="/thumbnail/store-main-image"
              className="p-3 text-center rounded-xl bg-slate-50 border border-slate-150 hover:border-slate-300 transition-all font-bold text-xs text-slate-700 hover:text-slate-900 hover:shadow-2xs"
            >
              🛍️ 쇼핑몰 대표이미지 맞춤 →
            </Link>
            <Link
              to="/thumbnail/instagram-image"
              className="p-3 text-center rounded-xl bg-slate-50 border border-slate-150 hover:border-slate-300 transition-all font-bold text-xs text-slate-700 hover:text-slate-900 hover:shadow-2xs"
            >
              📸 인스타 이미지 가공 →
            </Link>
            <Link
              to="/thumbnail/blog-cover"
              className="p-3 text-center rounded-xl bg-slate-50 border border-slate-150 hover:border-slate-300 transition-all font-bold text-xs text-slate-700 hover:text-slate-900 hover:shadow-2xs"
            >
              📚 블로그 대표이미지 제작 →
            </Link>
            <Link
              to="/thumbnail/youtube-thumbnail"
              className="p-3 text-center rounded-xl bg-slate-50 border border-slate-150 hover:border-slate-300 transition-all font-bold text-xs text-slate-700 hover:text-slate-900 hover:shadow-2xs"
            >
              🎥 유튜브 썸네일 생성 →
            </Link>
          </div>
        </div>
      </section>

      <AdSlot type="responsive" label="이미지 글자 넣기 최하단 마지막 마일 광고 슬롯" />
    </div>
  );
};

export default TextOnImageTool;
