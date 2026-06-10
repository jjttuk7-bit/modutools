import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import type {
  ImageFitMode,
  TextPosition,
  TextLayerOptions,
} from '../../../types/canvas';
import { instagramImagePresets } from './instagramImagePresets';
import { ImageUploader } from '../../../components/thumbnail/ImageUploader';
import { CanvasPreview } from '../../../components/thumbnail/CanvasPreview';
import { ImageOptionPanel } from '../../../components/thumbnail/ImageOptionPanel';
import { DownloadButton } from '../../../components/thumbnail/DownloadButton';
import { PrivacyNotice } from '../../../components/qr/PrivacyNotice';
import { AdSlot } from '../../../components/common/AdSlot';
import { Instagram, Wand2, RefreshCw, Check, Layers, BookOpen } from 'lucide-react';

export const InstagramImageTool: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activePresetId, setActivePresetId] = useState<string>('insta-square');
  const activePreset =
    instagramImagePresets.find((p) => p.id === activePresetId) || instagramImagePresets[0];

  const [backgroundColor, setBackgroundColor] = useState('#db2777');
  const [fitMode, setFitMode] = useState<ImageFitMode>('cover');
  const [scale, setScale] = useState<number>(1.0);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);

  const [title, setTitle] = useState('오늘 하루,\n소중한 순간의 조각');
  const [subtitle, setSubtitle] = useState('인생의 아름다운 조각들을 감성 피드로 공유해 보세요');
  const [fontSize, setFontSize] = useState<number>(50);
  const [color, setColor] = useState('#ffffff');
  const [useBackground, setUseBackground] = useState(true);
  const [boxBackgroundColor, setBoxBackgroundColor] = useState('rgba(0, 0, 0, 0.7)');
  const [position, setPosition] = useState<TextPosition>('center');

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
    const selected = instagramImagePresets.find((p) => p.id === presetId);
    if (selected) {
      if (selected.id === 'insta-story') {
        setFontSize(54);
      } else {
        setFontSize(50);
      }
    }
  };

  const handleReset = () => {
    setActivePresetId('insta-square');
    setBackgroundColor('#db2777');
    setFitMode('cover');
    setScale(1.0);
    setOffsetX(0);
    setOffsetY(0);
    setTitle('텍스트를 자유롭게 변경하세요');
    setSubtitle('당신의 일상을 세련되게 담는 감성 카드');
    setFontSize(50);
    setColor('#ffffff');
    setUseBackground(true);
    setBoxBackgroundColor('rgba(0, 0, 0, 0.7)');
    setPosition('center');
    handleClearImage();
  };

  const applyPresetTheme = (theme: 'sunset' | 'softLilac' | 'vogue' | 'minimalWood') => {
    switch (theme) {
      case 'sunset':
        setBackgroundColor('#db2777');
        setColor('#ffffff');
        setUseBackground(true);
        setBoxBackgroundColor('rgba(0, 0, 0, 0.7)');
        break;
      case 'softLilac':
        setBackgroundColor('#8b5cf6');
        setColor('#ffffff');
        setUseBackground(true);
        setBoxBackgroundColor('rgba(88, 28, 135, 0.7)');
        break;
      case 'vogue':
        setBackgroundColor('#111827');
        setColor('#ffffff');
        setUseBackground(true);
        setBoxBackgroundColor('rgba(0, 0, 0, 0.85)');
        break;
      case 'minimalWood':
        setBackgroundColor('#78716c');
        setColor('#ffffff');
        setUseBackground(true);
        setBoxBackgroundColor('rgba(28, 25, 23, 0.65)');
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
    <div id="instagram-image-editor" className="space-y-6">
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
          <div className="w-12 h-12 bg-pink-50 border border-pink-100 rounded-2xl flex items-center justify-center text-pink-600 shrink-0 shadow-3xs">
            <Instagram className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>인스타 이미지 맞추기</span>
              <span className="text-[10px] font-bold text-pink-600 bg-pink-50 border border-pink-100 px-2 py-0.5 rounded-full">
                정사각형/세로피드/스토리
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              인스타그램 피드 규격에 맞춰 잘림이 원천 차단되는 여백 삽입 및 감성 텍스트 문구 레이아웃
              가공 도구입니다.
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

      <AdSlot type="leaderboard" label="인스타 배너 최상단 스폰서 영역" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`lg:col-span-7 space-y-6 ${optionsExpanded ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white rounded-2xl p-5 border border-slate-250/80 space-y-3 shadow-3xs">
            <h4 className="text-xs font-bold text-slate-950 flex items-center gap-1.5 uppercase tracking-wide">
              <Wand2 className="w-4 h-4 text-pink-500" />
              <span>원클릭 피드 무드 테마 프리셋</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => applyPresetTheme('sunset')}
                className="py-2.5 px-3 border border-pink-100 bg-pink-50/40 hover:border-pink-300 text-[10px] font-bold text-pink-700 rounded-xl transition-all"
              >
                핑크 필터 선셋
              </button>
              <button
                type="button"
                onClick={() => applyPresetTheme('softLilac')}
                className="py-2.5 px-3 border border-purple-100 bg-purple-50/40 hover:border-purple-300 text-[10px] font-bold text-purple-700 rounded-xl transition-all"
              >
                퍼플 아카이브
              </button>
              <button
                type="button"
                onClick={() => applyPresetTheme('vogue')}
                className="py-2.5 px-3 border border-slate-200 bg-slate-50/80 hover:border-slate-400 text-[10px] font-bold text-slate-800 rounded-xl transition-all"
              >
                시크 퓨어블랙
              </button>
              <button
                type="button"
                onClick={() => applyPresetTheme('minimalWood')}
                className="py-2.5 px-3 border border-stone-200 bg-stone-50/60 hover:border-stone-400 text-[10px] font-bold text-stone-800 rounded-xl transition-all"
              >
                코지 어스브라운
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
            presets={instagramImagePresets}
            activePresetId={activePresetId}
            onPresetChange={handlePresetChange}
          />

          <div className="flex justify-end pt-2">
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

            <AdSlot type="responsive" label="실시간 캔버스 하단 광고 스폰서" />

            <DownloadButton
              canvasRef={canvasRef}
              defaultFilename={`instagram_${
                activePresetId === 'insta-square'
                  ? 'square'
                  : activePresetId === 'insta-vertical'
                  ? 'vertical'
                  : 'story'
              }`}
              hasUploadedImage={!!imageFile}
            />
          </div>
        </div>
      </div>

      <AdSlot type="responsive" label="SEO 가이드 상단 광고 가로 배너" />

      <section className="border-t border-slate-250 pt-10 mt-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-905 tracking-tight border-b border-slate-150 pb-2 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-pink-500 rounded-full" />
              <span>인스타 이미지 맞추기가 필요한 경우</span>
            </h3>
            <ul className="space-y-2.5">
              {[
                '핸드폰으로 촬영한 가로 세로 다양한 비율의 스냅샷 사진을 정사각형(1:1) 피드 규격에 균일하게 일치시키고 싶을 때',
                '인스타그램 세로 최적화 피드 게시물(4:5)에 맞게 사진 윗부분 아랫부분 잘림없이 고대비 꽉 찬 채우기 하고 싶을 때',
                '인스타 스토리 및 릴스 홍보용(9:16) 세로형 배경 프레임에 원하는 예쁜 필터 및 여백을 씌워 올리고 싶을 때',
                '외주 업체에 비용을 지불하지 않고 본점의 소상공인 일상 사진에 가독성 만점 텍스트 자막 레이어를 합성할 때',
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-600 font-medium flex items-start gap-2 leading-relaxed"
                >
                  <span className="text-pink-500 font-extrabold select-none">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-905 tracking-tight border-b border-slate-150 pb-2 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-pink-500 rounded-full" />
              <span>인스타 이미지 맞추기 에디터 간편 가이드</span>
            </h3>
            <ol className="space-y-2.5">
              {[
                '가장 보여주고 싶은 내 일상 사진을 점선 사각형 박스에 직접 드래그앤드롭하여 업로드합니다.',
                '도구 함에서 정사각형(1085), 세로형 피드(4:5), 릴스 스토리(9:16) 중 적당한 프리셋 버튼을 클릭합니다.',
                '맞춤 방식 필드에서 격자 채움(cover) 및 원본 비율(contain), 강제 늘리기(stretch)를 필요에 부합되게 지정합니다.',
                '배경 밑색 메뉴에서 만약 여백이 생길 경우 들어갈 원본 색깔 팔레트를 클릭해 자유롭게 조율합니다.',
                '타이틀과 서브 설명 배지란에 텍스트를 기재하고 크기와 색상을 지정한 뒤 고손실 JPG 혹은 고화질 PNG로 무료 가공본을 내려받습니다.',
              ].map((step, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-600 font-medium flex items-start gap-2.5 leading-relaxed"
                >
                  <span className="w-4.5 h-4.5 text-[9px] bg-pink-50 border border-pink-150 text-pink-600 font-extrabold rounded-full flex items-center justify-center shrink-0">
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
            <Layers className="w-4 h-4 text-pink-600" />
            <span>상해 권장: 인스타그램 규격 및 최적 해상도 가치제안</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-1">
              <span className="text-[10px] font-extrabold text-neutral-400 block uppercase font-mono">
                Square Feed
              </span>
              <p className="text-xs font-bold text-slate-800">1:1 정사각형 배율</p>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                가장 정석인 1080x1080 해상도로, 모바일 및 PC 썸네일 노출 뷰가 일그러지거나 외곽 흔들림
                없이 가잔 단정히 들어갑니다.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-1">
              <span className="text-[10px] font-extrabold text-neutral-400 block uppercase font-mono">
                Vertical Feed
              </span>
              <p className="text-xs font-bold text-slate-800">4:5 고비율 세로형 피드</p>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                인스타그램 타임라인 스크롤 압박 시 가장 세로 공간 영역을 풍부하게 확보하므로 1:1 대비
                37% 이상 높은 주목율 피드 효과를 끌어냅니다.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-1">
              <span className="text-[10px] font-extrabold text-neutral-400 block uppercase font-mono">
                Story / Reels
              </span>
              <p className="text-xs font-bold text-slate-800">9:16 모바일 꽉 찬 전체화면</p>
              <p className="text-[11px] text-slate-505 leading-relaxed font-semibold">
                전체 단말기 시야각을 완벽 점유하는 스토리 / 릴스 스틸 이미지 가공 규격에 부합하여 세로
                몰입감을 배가합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 bg-slate-50/50 rounded-2xl p-6 border border-slate-150">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>자주 묻는 질문 FAQ</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-1.5 shadow-2xs">
              <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <span className="text-pink-500 font-mono">Q.</span>
                <span>업로드한 내 사생활 및 제품 홍보 사진 정보가 원격지 서버로 수집되나요?</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal font-medium pl-4">
                <strong>아니요! 절대로 어떤 파일도 전송되지 않습니다.</strong> 본 썸네일도구함은
                브라우저 가상 샌드박스의 HTML5 Local Canvas 변환 기법에만 기반을 두고 수백개 이미지를
                다루므로 고객이 직접 파일명 다운로드를 하지 않는 한 외부 어떤 가상서버 장치에도
                수집되거나 노출될 가능성이 없습니다.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-1.5 shadow-2xs">
              <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <span className="text-pink-500 font-mono">Q.</span>
                <span>감성 오프닝 텍스트의 크기와 위치도 조절 가능합니까?</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal font-medium pl-4">
                네! 좌측 옵션 패널을 통해 제목 글꼴 크기를 PX 단위 수치로 미세 조율하거나 자막 화면
                정렬을 `상단`, `센터`, `하단`, `좌하단`, `우하단` 등으로 빠르게 위치 스위칭할 수
                있습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-3xs text-center md:text-left">
          <h4 className="text-xs font-bold text-slate-950 flex items-center justify-center md:justify-start gap-1.5 uppercase">
            <BookOpen className="w-4 h-4 text-pink-500" />
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
            <Link
              to="/thumbnail/store-main-image"
              className="p-3 text-center rounded-xl bg-slate-50 border border-slate-150 hover:border-slate-300 transition-all font-bold text-xs text-slate-700 hover:text-slate-900 hover:shadow-2xs"
            >
              🛍️ 쇼핑몰 상품 이미지 에디터 →
            </Link>
          </div>
        </div>
      </section>

      <AdSlot type="responsive" label="인스타 최하단 마지막 마일 무풍 광고 영역" />
    </div>
  );
};

export default InstagramImageTool;
