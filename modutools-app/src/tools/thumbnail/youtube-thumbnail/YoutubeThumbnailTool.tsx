import React, { useState, useRef } from 'react';
import type {
  CanvasPreset,
  ImageFitMode,
  TextPosition,
  TextLayerOptions,
} from '../../../types/canvas';
import { youtubeThumbnailPresets } from './youtubeThumbnailPresets';
import { ImageUploader } from '../../../components/thumbnail/ImageUploader';
import { CanvasPreview } from '../../../components/thumbnail/CanvasPreview';
import { ImageOptionPanel } from '../../../components/thumbnail/ImageOptionPanel';
import { DownloadButton } from '../../../components/thumbnail/DownloadButton';
import { PrivacyNotice } from '../../../components/qr/PrivacyNotice';
import { AdSlot } from '../../../components/common/AdSlot';
import { Youtube, Wand2, RefreshCw, HelpCircle, Info } from 'lucide-react';

export const YoutubeThumbnailTool: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [backgroundColor, setBackgroundColor] = useState('#111827');
  const [fitMode, setFitMode] = useState<ImageFitMode>('cover');
  const [scale, setScale] = useState<number>(1.0);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);

  const [title, setTitle] = useState('이 썸네일 하나로\n조회수가 대폭발합니다!');
  const [subtitle, setSubtitle] = useState('초보 유튜버도 3초 만에 만드는 확실한 흥행 치트키');
  const [fontSize, setFontSize] = useState<number>(56);
  const [color, setColor] = useState('#ffffff');
  const [useBackground, setUseBackground] = useState(true);
  const [boxBackgroundColor, setBoxBackgroundColor] = useState('rgba(0, 0, 0, 0.7)');
  const [position, setPosition] = useState<TextPosition>('bottom');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imgWidth, setImgWidth] = useState<number>(0);
  const [imgHeight, setImgHeight] = useState<number>(0);

  const activePreset: CanvasPreset = youtubeThumbnailPresets[0];

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

  const handleReset = () => {
    setBackgroundColor('#111827');
    setFitMode('cover');
    setScale(1.0);
    setOffsetX(0);
    setOffsetY(0);
    setTitle('영상 제목을 입력하세요');
    setSubtitle('마음을 움직이는 최고의 서브 문구');
    setFontSize(56);
    setColor('#ffffff');
    setUseBackground(true);
    setBoxBackgroundColor('rgba(0, 0, 0, 0.7)');
    setPosition('bottom');
    handleClearImage();
  };

  const applyPresetTheme = (theme: 'modernDark' | 'tech' | 'blackPink' | 'brightYellow') => {
    switch (theme) {
      case 'modernDark':
        setBackgroundColor('#1e293b');
        setColor('#ffffff');
        setUseBackground(true);
        setBoxBackgroundColor('rgba(0, 0, 0, 0.8)');
        break;
      case 'tech':
        setBackgroundColor('#0284c7');
        setColor('#ffffff');
        setUseBackground(true);
        setBoxBackgroundColor('rgba(15, 23, 42, 0.85)');
        break;
      case 'blackPink':
        setBackgroundColor('#db2777');
        setColor('#ffffff');
        setUseBackground(true);
        setBoxBackgroundColor('rgba(17, 24, 39, 0.75)');
        break;
      case 'brightYellow':
        setBackgroundColor('#fef08a');
        setColor('#111827');
        setUseBackground(true);
        setBoxBackgroundColor('rgba(239, 68, 68, 0.85)');
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
    <div id="youtube-thumbnail-editor" className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
          <Youtube className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-905 tracking-tight flex items-center gap-2">
            <span>유튜브 썸네일 만들기</span>
            <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
              권장: {activePreset.width}x{activePreset.height} px
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            유튜브, 쇼츠 영상의 가독성을 극대화하는 최적 규격 대표 이미지 에디터입니다.
          </p>
        </div>
      </div>

      <PrivacyNotice />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-250/80 space-y-3 shadow-3xs">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
              <Wand2 className="w-4 h-4 text-slate-700" />
              <span>원클릭 빠른 컬러 분위기 테마</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => applyPresetTheme('modernDark')}
                className="py-2 px-3 border border-slate-200 bg-white hover:border-slate-400 text-[10px] font-bold text-slate-700 rounded-xl transition-all"
              >
                진중한 스틸그레이
              </button>
              <button
                type="button"
                onClick={() => applyPresetTheme('tech')}
                className="py-2 px-3 border border-slate-100 bg-blue-50/50 hover:border-blue-400 text-[10px] font-bold text-blue-800 rounded-xl transition-all"
              >
                테크 마린블루
              </button>
              <button
                type="button"
                onClick={() => applyPresetTheme('blackPink')}
                className="py-2 px-3 border border-slate-100 bg-pink-50/50 hover:border-pink-400 text-[10px] font-bold text-pink-700 rounded-xl transition-all"
              >
                피치 핫핑크
              </button>
              <button
                type="button"
                onClick={() => applyPresetTheme('brightYellow')}
                className="py-2 px-3 border border-slate-150 bg-amber-50/50 hover:border-amber-400 text-[10px] font-bold text-amber-900 rounded-xl transition-all"
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
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 bg-white hover:bg-slate-50 border border-slate-200 hover:border-red-200 px-4 py-2.5 rounded-xl transition-all shadow-3xs active:scale-95"
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
              defaultFilename="youtube_thumbnail"
              hasUploadedImage={!!imageFile}
            />

            <AdSlot type="rectangle" label="유튜브 도구 하단 스폰서 영역" />
          </div>
        </div>
      </div>

      <section className="border-t border-slate-200 pt-10 mt-12 space-y-8">
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex items-start gap-3">
          <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <div className="text-[11px] md:text-xs text-slate-600 leading-relaxed font-medium">
            ※ 유튜브 썸네일은 <strong>16:9 비율의 1280x720 해상도</strong>가 가장 많이 사용되며 최대
            2MB 이내 파일 제출을 권장합니다. 완성품을 다운로드한 후, 유튜브 실제 업로드 미리보기
            창에서 모바일 잘림이 발생하지 않는지 꼭 체크하세요!
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-1 h-3 bg-red-500 rounded-full" />
              <span>유튜브 썸네일 만들기가 필요한 경우</span>
            </h3>
            <ul className="space-y-2.5">
              {[
                '유튜브 동영상 업로드하기 전, 시청자들의 눈을 즉시 사로잡는 대표 썸네일 정방화질 가공 시',
                '영상 핵심 키워드 제목을 크게 강조해 고대비 아웃라인 텍스트 자막형 썸네일 배치가 필요할 때',
                '유튜브 권장 규격인 1280x720 픽셀에 완벽하게 일치하는 고화질 이미지를 즉시 생성하고 싶을 때',
                '코딩 강의, 테크 채널, 개인 브이로그(Vlog), 쇼츠 가로 안내 카드 뉴스를 빠르게 무료 가공할 때',
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-600 font-medium flex items-start gap-2 leading-relaxed"
                >
                  <span className="text-red-500 font-extrabold select-none">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-1 h-3 bg-red-500 rounded-full" />
              <span>유튜브 썸네일 간편 사용 방법</span>
            </h3>
            <ol className="space-y-2.5">
              {[
                "가장 어울리는 영상 대표 프레임 배경 사진을 위 '배경 사진' 점선 박스에 드롭하여 업로드합니다.",
                '우측 패널의 메인 제목과 보조 슬로건 자막 텍스트란에 시청자의 관심을 끌 대박 타이틀을 작성합니다.',
                '이미지 줌배율 슬라이더와 수평/수직 위치 좌표 슬라이더를 당겨가며 피사체의 센터 구도를 확보합니다.',
                'PNG(무손실) 또는 압축 JPG 품질 규격을 알맞게 초이스한 후 저장 폴더로 워터마크 없이 무료 다운로드합니다.',
                "유튜브 스튜디오 동영상 업로드 편집 대시보드의 '미리보기 이미지 업로드' 메뉴에 배치하면 완료됩니다.",
              ].map((step, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-600 font-medium flex items-start gap-2.5 leading-relaxed"
                >
                  <span className="w-4.5 h-4.5 text-[9px] bg-red-50 border border-red-150 text-red-600 font-extrabold rounded-full flex items-center justify-center shrink-0">
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
            <span>유튜브 가이드자 주 질문 답변 FAQ</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-1.5 shadow-2xs">
              <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <span className="text-red-500 font-mono">Q.</span>
                <span>업로드한 이미지가 개인정보 수집 등 서버에 임시 저장되나요?</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal font-medium pl-4">
                <strong>아니요, 절대로 저장되지 않습니다.</strong> 모든 변환은 브라우저 가상
                캔버스(Blob) 위에서 전부 로컬 처리되어 단 1바이트의 창작 소스도 원격 웹서버로
                업로드되지 않으므로 안심하고 안전하게 다운로드하세요.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-1.5 shadow-2xs">
              <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <span className="text-red-500 font-mono">Q.</span>
                <span>정확한 유튜브 썸네일 고화질 가이드 규격은 어떻게 되나요?</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal font-medium pl-4">
                가장 표준인 화면 비율 규격은{' '}
                <strong>1280x720 화소 해상도(종횡비 16:9)</strong>이며, 최소 640픽셀의 가로 규격
                기준을 충족해야 합니다. 포맷은 PNG, JPG 및 GIF 형식을 완전 지원합니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default YoutubeThumbnailTool;
