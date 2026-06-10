import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import type {
  ImageFitMode,
  TextPosition,
  TextLayerOptions,
} from '../../../types/canvas';
import { storeMainImagePresets } from './storeMainImagePresets';
import { ImageUploader } from '../../../components/thumbnail/ImageUploader';
import { CanvasPreview } from '../../../components/thumbnail/CanvasPreview';
import { ImageOptionPanel } from '../../../components/thumbnail/ImageOptionPanel';
import { DownloadButton } from '../../../components/thumbnail/DownloadButton';
import { PrivacyNotice } from '../../../components/qr/PrivacyNotice';
import { AdSlot } from '../../../components/common/AdSlot';
import {
  ShoppingBag,
  Wand2,
  RefreshCw,
  HelpCircle,
  BookOpen,
  AlertTriangle,
  Layers,
} from 'lucide-react';

export const StoreMainImageTool: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activePresetId, setActivePresetId] = useState<string>('store-square');
  const activePreset =
    storeMainImagePresets.find((p) => p.id === activePresetId) || storeMainImagePresets[0];

  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [fitMode, setFitMode] = useState<ImageFitMode>('contain');
  const [scale, setScale] = useState<number>(1.0);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [fontSize, setFontSize] = useState<number>(48);
  const [color, setColor] = useState('#111827');
  const [useBackground, setUseBackground] = useState(false);
  const [boxBackgroundColor, setBoxBackgroundColor] = useState('rgba(255, 255, 255, 0.9)');
  const [position, setPosition] = useState<TextPosition>('bottom');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imgWidth, setImgWidth] = useState<number>(0);
  const [imgHeight, setImgHeight] = useState<number>(0);

  const [optionsExpanded, setOptionsExpanded] = useState(true);

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
    const selected = storeMainImagePresets.find((p) => p.id === presetId);
    if (selected) {
      if (selected.id === 'store-vertical') {
        setFontSize(52);
      } else {
        setFontSize(48);
      }
    }
  };

  const handleReset = () => {
    setActivePresetId('store-square');
    setBackgroundColor('#ffffff');
    setFitMode('contain');
    setScale(1.0);
    setOffsetX(0);
    setOffsetY(0);
    setTitle('');
    setSubtitle('');
    setFontSize(48);
    setColor('#111827');
    setUseBackground(false);
    setBoxBackgroundColor('rgba(255, 255, 255, 0.9)');
    setPosition('bottom');
    handleClearImage();
  };

  const applyPresetTheme = (
    theme: 'pureWhite' | 'softGray' | 'promoGreen' | 'warningOrange',
  ) => {
    switch (theme) {
      case 'pureWhite':
        setBackgroundColor('#ffffff');
        setColor('#111827');
        setUseBackground(false);
        break;
      case 'softGray':
        setBackgroundColor('#f8fafc');
        setColor('#334155');
        setUseBackground(true);
        setBoxBackgroundColor('rgba(255, 255, 255, 0.85)');
        break;
      case 'promoGreen':
        setBackgroundColor('#10b981');
        setColor('#ffffff');
        setUseBackground(true);
        setBoxBackgroundColor('rgba(6, 78, 59, 0.8)');
        break;
      case 'warningOrange':
        setBackgroundColor('#f97316');
        setColor('#ffffff');
        setUseBackground(true);
        setBoxBackgroundColor('rgba(120, 53, 4, 0.85)');
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
    <div id="store-main-image-editor" className="space-y-6">
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
          <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 shadow-3xs">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-909 tracking-tight flex items-center gap-2">
              <span>스마트스토어 대표이미지 맞추기</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                안심 무중복 보장
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              네이버 스마트스토어, 쿠팡, 카카오 쇼핑몰 등 플랫폼 규격에 정확한 상품 정사각형 컷과 세로
              대표 슬라이드를 빌드하세요.
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

      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-650 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-amber-900">
            플랫폼 대표이미지 가이드라인 권장 유의사항
          </h4>
          <p className="text-[11px] text-amber-700 leading-relaxed mt-1 font-medium">
            상품 대표이미지는 쇼핑몰 플랫폼의 로봇 검수 및 AI 중복이미지 정책과 상품 카테고리 규정에
            따라 다를 수 있습니다. 대부분의 이커머스는{' '}
            <strong>흰색 깔끔한 배경(정사각형 contain 모드)</strong>과 텍스트를 최소화한 썸네일을
            요구하므로, 최종 업로드 전 해당 판매 플랫폼의 최신 쇼핑 이미지 가이드를 먼저 교차 검증하고
            사용해주세요!
          </p>
        </div>
      </div>

      <AdSlot type="leaderboard" label="상세 페이지 배너 상단 중간 영역" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`lg:col-span-7 space-y-6 ${optionsExpanded ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white rounded-2xl p-5 border border-slate-250/80 space-y-3 shadow-3xs">
            <h4 className="text-xs font-bold text-slate-950 flex items-center gap-1.5 uppercase tracking-wide">
              <Wand2 className="w-4 h-4 text-emerald-600" />
              <span>원클릭 추천 상품 바탕색 테마</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => applyPresetTheme('pureWhite')}
                className="py-2.5 px-3 border border-slate-200 bg-white hover:border-slate-400 text-[10px] font-bold text-slate-800 rounded-xl transition-all"
              >
                순백색 스토어 (기본)
              </button>
              <button
                type="button"
                onClick={() => applyPresetTheme('softGray')}
                className="py-2.5 px-3 border border-slate-100 bg-slate-50 hover:border-slate-350 text-[10px] font-bold text-slate-700 rounded-xl transition-all"
              >
                약간 편안한 그레이
              </button>
              <button
                type="button"
                onClick={() => applyPresetTheme('promoGreen')}
                className="py-2.5 px-3 border border-emerald-100 bg-emerald-50/50 hover:border-emerald-350 text-[10px] font-bold text-emerald-800 rounded-xl transition-all"
              >
                기획전 활력 그린
              </button>
              <button
                type="button"
                onClick={() => applyPresetTheme('warningOrange')}
                className="py-2.5 px-3 border border-orange-100 bg-orange-50/50 hover:border-orange-350 text-[10px] font-bold text-orange-800 rounded-xl transition-all"
              >
                혜택 강렬 오렌지
              </button>
            </div>
          </div>

          <ImageUploader
            onImageLoaded={handleImageLoaded}
            onClear={handleClearImage}
            selectedFile={imageFile}
            dimensions={imageFile ? { width: imgWidth, height: imgHeight } : null}
          />

          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase">
              티칭 가이드: 상품 맞춤형 여백 적용
            </h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              * <strong>흰색 여백 추가</strong>를 하려면 배경을 순백색(#ffffff)으로 유지한 상태에서{' '}
              <strong>이미지 맞춤 방식을 전체 보이기(contain)</strong>로 설정해 보세요. 피사체 비율이
              자동으로 찌그러짐 없이 안전하게 조율되어 순백색 마진 가공이 완성됩니다.
            </p>
          </div>

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
            presets={storeMainImagePresets}
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
              width={activePreset.width}
              height={activePreset.height}
              backgroundColor={backgroundColor}
              fitMode={fitMode}
              scale={scale}
              offsetX={offsetX}
              offsetY={offsetY}
              textOptions={textOptions}
              uploadedPreviewUrl={previewUrl}
            />

            <AdSlot type="responsive" label="실시간 캔버스 밑 보조 배너 광고" />

            <DownloadButton
              canvasRef={canvasRef}
              defaultFilename={`store_${
                activePresetId === 'store-square'
                  ? 'square'
                  : activePresetId === 'store-vertical'
                  ? 'vertical'
                  : 'wide'
              }`}
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
              <span className="w-1.5 h-3.5 bg-emerald-500 rounded-full" />
              <span>스마트스토어 대표이미지가 필요한 경우</span>
            </h3>
            <ul className="space-y-2.5">
              {[
                '쇼핑몰 상품 카드를 정사각형(1000x1000) 비율로 맞추고 깔끔한 순백색 여백을 외곽에 자동 균일 부여하고 싶을 때',
                '지저분한 야외 배경의 촬영본에 세련된 브랜드 단색 조를 뒷배경에 감싸 피사체를 극대화시킬 때',
                '쿠팡 소셜, 스마트스토어, 지마켓, 무신사 등 각기 다른 입점사별 규격에 맞는 고포맷의 상품 사진을 일괄 가공할 때',
                '이벤트 기획가로 사용할 가격 혜택 및 무료배송 프로모션 안내 선명한 홍보 배너 글자를 세밀 합성하고 싶을 때',
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-600 font-medium flex items-start gap-2 leading-relaxed"
                >
                  <span className="text-emerald-500 font-extrabold select-none">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-905 tracking-tight border-b border-slate-150 pb-2 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-emerald-500 rounded-full" />
              <span>스마트스토어 대표 이미지 만들기 사용 방법</span>
            </h3>
            <ol className="space-y-2.5">
              {[
                '상단의 상품 사진 영역에 현재 준비된 실제 촬영 이미지 소스 파일을 마우스 드롭하여 업로드합니다.',
                "도구 함에서 '기본 정사각형(1:1)', '와이드 배너', 혹은 '네이버 세로형(4:5)' 중 채널 기준에 맞게 선택합니다.",
                '외곽 순백색 여백을 구성하려면 이미지 맞춤 방식을 전체 보이기(contain)로 설정하고 배경색을 #ffffff로 조율합니다.',
                '어울리는 단어나 특가 마진이 필요하면 글자 및 서브 슬로건 문구란에 가격/특징을 적고 위치와 투명박스를 추가합니다.',
                '완벽한 상품 화질 다운로드를 위해 무손실 PNG 또는 무압축 최상급 JPG 품질을 클릭해 내 컴퓨터로 최종 저장합니다.',
              ].map((step, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-600 font-medium flex items-start gap-2.5 leading-relaxed"
                >
                  <span className="w-4.5 h-4.5 text-[9px] bg-emerald-50 border border-emerald-150 text-emerald-600 font-extrabold rounded-full flex items-center justify-center shrink-0">
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
            <Layers className="w-4 h-4 text-emerald-650" />
            <span>플랫폼별 대표 규격 참고서 (네이버 쇼핑 &amp; 쿠팡 가이드)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-1">
              <span className="text-[10px] font-extrabold text-neutral-400 block uppercase font-mono">
                Naver Smartstore
              </span>
              <p className="text-xs font-bold text-slate-800">네이버 권장 대표 규격</p>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                가장 표준은 가로 세로 1000px 이상의 정사각형 이미지로, 텍스트가 과도하거나 로고가 외곽에
                걸칠 시 상위 노출에 불이익을 입을 수 있습니다.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-1">
              <span className="text-[10px] font-extrabold text-neutral-400 block uppercase font-mono">
                Coupang Rocket
              </span>
              <p className="text-xs font-bold text-slate-800">쿠팡 권장 썸네일 기준</p>
              <p className="text-[11px] text-slate-501 leading-relaxed font-semibold">
                마찬가지로 기본 1000x1000 및 최대 2000px 고화질을 지원하며, 난잡한 그래픽 합성 없이
                오로지 눈에 확 띄는 누끼 이미지 및 순백배경 조율을 최선으로 봅니다.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-1">
              <span className="text-[10px] font-extrabold text-neutral-400 block uppercase font-mono">
                Fashion vertical
              </span>
              <p className="text-xs font-bold text-slate-800">일부 패션 세로형 피드</p>
              <p className="text-[11px] leading-relaxed font-semibold text-slate-500">
                패션, 잡화 등 의류 기획전 전송 시 1000x1250 등의 4:5 모바일 세로 컷을 사용할 때 높은
                비율의 의상 전신 착샷 연출에 유리합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 bg-slate-50/50 rounded-2xl p-6 border border-slate-150">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-slate-650" />
            <span>자주 묻는 질문 FAQ</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-1.5 shadow-2xs">
              <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <span className="text-emerald-500 font-mono">Q.</span>
                <span>정말 상품 원본 소스 이미지가 서버에 전혀 남지 않아 저작권 유출 소지가 없나요?</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal font-medium pl-4">
                <strong>네, 100% 안전을 평생 보장합니다.</strong> 본 썸네일도구함은 브라우저 가상
                메모리상의 HTML5 Canvas 연산에만 기반을 두고 수천개 이미지를 다루므로, 고객이 다운로드
                버튼을 누르는 순간 브라우저 내부 하이퍼텍스트 연결로 다운되며 단 1B의 파일 전송도
                없습니다.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-1.5 shadow-2xs">
              <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <span className="text-emerald-500 font-mono">Q.</span>
                <span>플랫폼별 판매 기준 이미지가 전부 똑같은가요?</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal font-medium pl-4">
                전혀 다를 수 있습니다. 동일한 스퀘어 1000픽셀이라 하더라도 의류 섹션, 식품군 섹션, 쿠팡
                제휴 브랜드관 등 전송 규약에 따라 텍스트 허용 유무 퍼센티지가 다르므로 상단의
                스마트스토어 전용 안내를 최종 숙지해보시기 바랍니다.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-3xs text-center md:text-left">
          <h4 className="text-xs font-bold text-slate-950 flex items-center justify-center md:justify-start gap-1.5 uppercase">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>이런 무료 유용한 도구들과 함께 사용하시면 훨씬 유용합니다</span>
          </h4>
          <p className="text-[11px] text-slate-400 font-medium">
            유형별 고유 가이각을 원클릭 스위칭 교차 이용 가능합니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 pt-1.5">
            <Link
              to="/thumbnail/text-on-image"
              className="p-3 text-center rounded-xl bg-slate-50 border border-slate-150 hover:border-slate-300 transition-all font-bold text-xs text-slate-700 hover:text-slate-900 hover:shadow-2xs"
            >
              ✍️ 이미지에 글자 넣기 도구 →
            </Link>
            <Link
              to="/thumbnail/instagram-image"
              className="p-3 text-center rounded-xl bg-slate-50 border border-slate-150 hover:border-slate-300 transition-all font-bold text-xs text-slate-700 hover:text-slate-900 hover:shadow-2xs"
            >
              📸 인스타 이미지 맞추기 →
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

      <AdSlot type="responsive" label="스토어 도구 최하단 스폰서 마지막 배너 영역" />
    </div>
  );
};

export default StoreMainImageTool;
