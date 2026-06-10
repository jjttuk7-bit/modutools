import React, { useState, useRef } from 'react';
import type {
  ImageFitMode,
  TextPosition,
  TextLayerOptions,
} from '../../../types/canvas';
import { blogCoverPresets } from './blogCoverPresets';
import { ImageUploader } from '../../../components/thumbnail/ImageUploader';
import { CanvasPreview } from '../../../components/thumbnail/CanvasPreview';
import { ImageOptionPanel } from '../../../components/thumbnail/ImageOptionPanel';
import { DownloadButton } from '../../../components/thumbnail/DownloadButton';
import { PrivacyNotice } from '../../../components/qr/PrivacyNotice';
import { AdSlot } from '../../../components/common/AdSlot';
import { Wand2, RefreshCw, HelpCircle, BookOpen, Info } from 'lucide-react';

export const BlogCoverTool: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activePresetId, setActivePresetId] = useState<string>('blog-wide');
  const activePreset =
    blogCoverPresets.find((p) => p.id === activePresetId) || blogCoverPresets[0];

  const [backgroundColor, setBackgroundColor] = useState('#059669');
  const [fitMode, setFitMode] = useState<ImageFitMode>('cover');
  const [scale, setScale] = useState<number>(1.0);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);

  const [title, setTitle] = useState('오늘부터 방문자 수\n2배 늘리는 글쓰기 비법');
  const [subtitle, setSubtitle] = useState('네이버 블로그, 티스토리 최적화 가이드 대표사진');
  const [fontSize, setFontSize] = useState<number>(44);
  const [color, setColor] = useState('#ffffff');
  const [useBackground, setUseBackground] = useState(true);
  const [boxBackgroundColor, setBoxBackgroundColor] = useState('rgba(0, 0, 0, 0.7)');
  const [position, setPosition] = useState<TextPosition>('center');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imgWidth, setImgWidth] = useState<number>(0);
  const [imgHeight, setImgHeight] = useState<number>(0);

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
    const selected = blogCoverPresets.find((p) => p.id === presetId);
    if (selected) {
      if (selected.id === 'blog-square') {
        setFontSize(54);
      } else if (selected.id === 'blog-vertical') {
        setFontSize(50);
      } else {
        setFontSize(44);
      }
    }
  };

  const handleReset = () => {
    setActivePresetId('blog-wide');
    setBackgroundColor('#059669');
    setFitMode('cover');
    setScale(1.0);
    setOffsetX(0);
    setOffsetY(0);
    setTitle('블로그 글 제목을 입력하세요');
    setSubtitle('간결하고 클릭율이 상승하는 매력 가치 제안서');
    setFontSize(44);
    setColor('#ffffff');
    setUseBackground(true);
    setBoxBackgroundColor('rgba(0, 0, 0, 0.7)');
    setPosition('center');
    handleClearImage();
  };

  const applyPresetTheme = (theme: 'emerald' | 'warm' | 'minimal' | 'cyberpunk') => {
    switch (theme) {
      case 'emerald':
        setBackgroundColor('#059669');
        setColor('#ffffff');
        setUseBackground(true);
        setBoxBackgroundColor('rgba(2, 44, 34, 0.75)');
        break;
      case 'warm':
        setBackgroundColor('#f97316');
        setColor('#ffffff');
        setUseBackground(true);
        setBoxBackgroundColor('rgba(67, 20, 7, 0.85)');
        break;
      case 'minimal':
        setBackgroundColor('#f1f5f9');
        setColor('#1e293b');
        setUseBackground(true);
        setBoxBackgroundColor('rgba(255, 255, 255, 0.85)');
        break;
      case 'cyberpunk':
        setBackgroundColor('#8b5cf6');
        setColor('#ffffff');
        setUseBackground(true);
        setBoxBackgroundColor('rgba(15, 23, 42, 0.85)');
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
    <div id="blog-cover-editor" className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-905 tracking-tight flex items-center gap-2">
            <span>블로그 대표이미지 만들기</span>
            <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
              멀티 레이아웃 규격 지원
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            인스타용 1:1 정방형, 블로그 서칭 최적 와이드 및 스마트폰용 세로형 규격 카드를 간편하게
            만듭니다.
          </p>
        </div>
      </div>

      <PrivacyNotice />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-250/80 space-y-3 shadow-3xs">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
              <Wand2 className="w-4 h-4 text-emerald-600" />
              <span>블로그 맞춤 고대비 테마 스타일 선택</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => applyPresetTheme('emerald')}
                className="py-2 px-3 border border-slate-100 bg-emerald-50/50 hover:border-emerald-400 text-[10px] font-bold text-emerald-800 rounded-xl transition-all"
              >
                상쾌한 에메랄드
              </button>
              <button
                type="button"
                onClick={() => applyPresetTheme('warm')}
                className="py-2 px-3 border border-slate-150 bg-amber-50/50 hover:border-amber-400 text-[10px] font-bold text-amber-900 rounded-xl transition-all"
              >
                따뜻한 오렌지우드
              </button>
              <button
                type="button"
                onClick={() => applyPresetTheme('minimal')}
                className="py-2 px-3 border border-slate-200 bg-white hover:border-slate-400 text-[10px] font-bold text-slate-700 rounded-xl transition-all"
              >
                미니멀리스트 그레이
              </button>
              <button
                type="button"
                onClick={() => applyPresetTheme('cyberpunk')}
                className="py-2 px-3 border border-slate-100 bg-violet-50/50 hover:border-violet-450 text-[10px] font-bold text-indigo-800 rounded-xl transition-all"
              >
                퍼플 사이버네온
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
            presets={blogCoverPresets}
            activePresetId={activePresetId}
            onPresetChange={handlePresetChange}
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-red-200 px-4 py-2.5 rounded-xl transition-all shadow-3xs active:scale-95"
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

            <DownloadButton
              canvasRef={canvasRef}
              defaultFilename={`blog_${activePreset.id.replace('blog-', '')}_cover`}
              hasUploadedImage={!!imageFile}
            />

            <AdSlot type="rectangle" label="블로그 도구 하단 스폰서 영역" />
          </div>
        </div>
      </div>

      <section className="border-t border-slate-200 pt-10 mt-12 space-y-8">
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex items-start gap-3">
          <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <div className="text-[11px] md:text-xs text-slate-600 leading-relaxed font-semibold">
            ※ 블로그 대표이미지는 이미지뿐만 아니라{' '}
            <strong>배경색 단독 배열과 강력한 텍스트 조합</strong>만으로도 퀄리티 높은 커버를 즉각
            합성하실 수 있습니다. 무겁고 성가신 가입 절차 없이 즉시 최고의 대표이미지를 획득하세요.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight border-b border-slate-105 pb-2 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-emerald-500 rounded-full" />
              <span>블로그 대표이미지가 필요한 경우</span>
            </h3>
            <ul className="space-y-2.5">
              {[
                '네이버 블로그, 티스토리 포스팅 시 통합 검색 피드에서 가장 눈길을 잡아끄는 첫 대표사진 생성이 필요할 때',
                '긴 글 제목이나 핵심 유인 문구가 멀리서 보아도 잘리는 현상 없이 한눈에 들어오는 가독성 썸네일이 원할 때',
                '따로 일러스트 템플릿 툴을 결제하지 않고, 브런치 및 개인 블로그에 올릴 정형화된 시리즈 디자인을 통일할 때',
                '페이스북, 카카오톡 링크 공유 시 나타나는 오픈그래프(OG) 이미지 규격을 완벽 픽셀 빌드할 때',
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
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight border-b border-slate-105 pb-2 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-emerald-500 rounded-full" />
              <span>블로그 대표이미지 만들기 사용 방법</span>
            </h3>
            <ol className="space-y-2.5">
              {[
                '배경으로 쓸 어울리는 스냅샷 사진을 점선 드롭존에 업로드하거나, 심플한 브랜드 칼라로 배경색을 정합니다.',
                '가장 시선을 끄는 강력한 글 제목 내용과 부제목 슬로건 문구를 양식 제약 없이 편안히 입력합니다.',
                "도구 장치에서 용도에 맞춰 '와이드형', '정사각형', '세로형' 프리셋 스위치를 클릭해 비율을 선택합니다.",
                '자막의 정렬 위치 지정(위, 센터, 하단)과 글자 크기 및 색상, 텍스트 가독 구역 검정 박스를 체크해 세부 조정합니다.',
                '디자인 조율 후 PNG 다운로드 또는 JPG 포맷을 선택해 컴퓨터나 스마트폰 저장 공간으로 무료 다운로드합니다.',
              ].map((step, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-600 font-medium flex items-start gap-2.5 leading-relaxed"
                >
                  <span className="w-4.5 h-4.5 text-[9px] bg-emerald-50 border border-emerald-150 text-emerald-700 font-extrabold rounded-full flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="space-y-4 bg-slate-50/50 rounded-2xl p-6 border border-slate-150">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-slate-600" />
            <span>블로그 대표 이미지 제작자 자주 묻는 질문 FAQ</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-1.5 shadow-2xs">
              <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <span className="text-emerald-500 font-mono">Q.</span>
                <span>업로드한 이미지 없이 심플한 배경색과 글자 조합만으로도 대표 고화질 커버 제작이 되나요?</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal font-medium pl-4">
                <strong>네, 완전 가능합니다!</strong> 업로드한 원본 사진이 없어도 깔끔한 브랜드
                색조나 그라데이션 바탕 위에 멋진 타이틀 자막 효과를 주어 세련된 카드뉴스 스타일 대표
                이미지를 빠른 시간 내에 완성하실 수 있습니다.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-1.5 shadow-2xs">
              <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <span className="text-emerald-500 font-mono">Q.</span>
                <span>사용자가 가공 및 타사 업로드 중인 원본 이미지가 노출되거나 서버에 기록에 남지 않는지 안심할 수 있나요?</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal font-medium pl-4">
                업로드 및 가위질 렌더링을 포함한{' '}
                <strong>모든 편집 연산은 원격 네트워크가 아닌 디바이스 브라우저 가상 샌드박스 내부에서만 실시간 처리</strong>
                됩니다. 서버에 저장되지 않아 안심하고 완벽한 프라이버시를 유지하실 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogCoverTool;
