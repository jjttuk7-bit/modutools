import React from 'react';
import type { ImageFitMode, TextPosition, CanvasPreset } from '../../types/canvas';
import { Sliders, Type, Layout, Image as ImageIcon, Move } from 'lucide-react';

export interface ImageOptionPanelProps {
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  fitMode: ImageFitMode;
  setFitMode: (mode: ImageFitMode) => void;
  scale: number;
  setScale: (scale: number) => void;
  offsetX: number;
  setOffsetX: (x: number) => void;
  offsetY: number;
  setOffsetY: (y: number) => void;

  title: string;
  setTitle: (text: string) => void;
  subtitle: string;
  setSubtitle: (text: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  color: string;
  setColor: (color: string) => void;
  useBackground: boolean;
  setUseBackground: (use: boolean) => void;
  boxBackgroundColor: string;
  setBoxBackgroundColor: (color: string) => void;
  position: TextPosition;
  setPosition: (pos: TextPosition) => void;

  showImageControls: boolean;
  presets?: CanvasPreset[];
  activePresetId?: string;
  onPresetChange?: (presetId: string) => void;
}

const colorPresets = [
  '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0',
  '#111827', '#1e293b', '#334155', '#475569',
  '#ef4444', '#f97316', '#eab308', '#10b981',
  '#06b6d4', '#3b82f6', '#6366f1', '#a855f7',
  '#ec4899', '#f43f5e', '#10b981', '#14b8a6',
];

export const ImageOptionPanel: React.FC<ImageOptionPanelProps> = ({
  backgroundColor,
  setBackgroundColor,
  fitMode,
  setFitMode,
  scale,
  setScale,
  offsetX,
  setOffsetX,
  offsetY,
  setOffsetY,

  title,
  setTitle,
  subtitle,
  setSubtitle,
  fontSize,
  setFontSize,
  color,
  setColor,
  useBackground,
  setUseBackground,
  boxBackgroundColor,
  setBoxBackgroundColor,
  position,
  setPosition,

  showImageControls,
  presets,
  activePresetId,
  onPresetChange,
}) => {
  return (
    <div id="image-option-panel" className="space-y-6">
      {presets && presets.length > 1 && onPresetChange && (
        <div className="bg-white rounded-2xl p-5 border border-slate-250/80 space-y-3.5 shadow-3xs">
          <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
            <Layout className="w-4 h-4 text-slate-700" />
            <span>도구 규격 / 비율 선택</span>
          </h4>
          <div className="flex flex-col gap-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onPresetChange(preset.id)}
                className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-center gap-0.5 ${
                  activePresetId === preset.id
                    ? 'border-slate-900 bg-slate-900/5 text-slate-900 font-extrabold'
                    : 'border-slate-100 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{preset.label}</span>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded-md">
                    {preset.width} x {preset.height}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{preset.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-5 border border-slate-250/80 space-y-4 shadow-3xs">
        <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
          <Sliders className="w-4 h-4 text-slate-700" />
          <span>배경 및 이미지 레이아웃</span>
        </h4>

        <div className="space-y-3">
          <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wide">
            배경 밑색 지정
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-250 text-xs font-mono font-medium lowercase focus:ring-1 focus:ring-slate-900 focus:outline-none"
              placeholder="#ffffff"
            />
          </div>

          <div className="grid grid-cols-10 gap-1.5 pt-1">
            {colorPresets.map((preset, idx) => (
              <button
                key={`${preset}-${idx}`}
                type="button"
                onClick={() => setBackgroundColor(preset)}
                className={`w-5.5 h-5.5 rounded-md border transition-all ${
                  backgroundColor.toLowerCase() === preset.toLowerCase()
                    ? 'border-slate-900 scale-110 shadow-3xs ring-1 ring-slate-800'
                    : 'border-slate-200 hover:scale-105'
                }`}
                style={{ backgroundColor: preset }}
                title={preset}
              />
            ))}
          </div>
        </div>

        {showImageControls ? (
          <div className="border-t border-slate-150 pt-4 space-y-4">
            <h5 className="text-[10px] text-slate-400 font-bold tracking-wider uppercase flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>업로드 이미지 조정 수치 설정</span>
            </h5>

            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-1.5">
                이미지 채우기 맞춤 방식
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                {[
                  { label: '꽉 채우기 (cover)', value: 'cover' as ImageFitMode },
                  { label: '전체 보이기 (contain)', value: 'contain' as ImageFitMode },
                  { label: '늘리기 (stretch)', value: 'stretch' as ImageFitMode },
                ].map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => setFitMode(mode.value)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all ${
                      fitMode === mode.value
                        ? 'bg-slate-900 text-white shadow-3xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold mb-1">
                <span>크기 배율 (확대 / 축소)</span>
                <span className="font-mono text-slate-800">{scale.toFixed(2)}배</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-800"
              />
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/50 space-y-3">
              <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <Move className="w-3 h-3" />
                <span>정밀 위치 팬 수평/수직조정 (X, Y 오프셋)</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                    <span>X축 위치 좌표 (가로)</span>
                    <span className="font-mono text-slate-800">{offsetX} px</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="-600"
                      max="600"
                      value={offsetX}
                      onChange={(e) => setOffsetX(parseInt(e.target.value))}
                      className="flex-1 h-1 bg-slate-200/80 rounded-lg appearance-none cursor-pointer accent-slate-700"
                    />
                    <input
                      type="number"
                      value={offsetX}
                      onChange={(e) => setOffsetX(parseInt(e.target.value) || 0)}
                      className="w-14 text-center px-1 py-0.5 text-[10px] border border-slate-200 rounded font-medium bg-white text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                    <span>Y축 위치 좌표 (세로)</span>
                    <span className="font-mono text-slate-800">{offsetY} px</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="-600"
                      max="600"
                      value={offsetY}
                      onChange={(e) => setOffsetY(parseInt(e.target.value))}
                      className="flex-1 h-1 bg-slate-200/80 rounded-lg appearance-none cursor-pointer accent-slate-700"
                    />
                    <input
                      type="number"
                      value={offsetY}
                      onChange={(e) => setOffsetY(parseInt(e.target.value) || 0)}
                      className="w-14 text-center px-1 py-0.5 text-[10px] border border-slate-200 rounded font-medium bg-white text-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-medium leading-normal">
              배경 이미지를 아직 업로드하지 않았습니다. 배경 단색 채우기로 대표 이미지 도구를 바로
              변환하거나 아래 사진을 업로드하세요.
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-250/80 space-y-4 shadow-3xs">
        <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
          <Type className="w-4 h-4 text-slate-700" />
          <span>텍스트 내용 및 스타일 설정</span>
        </h4>

        <div className="space-y-1">
          <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wide">
            메인 제목 텍스트 (엔터로 줄바꿈 지원)
          </label>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예시: 대박 나는 브이로그 레시피 대공개"
            rows={3}
            className="w-full text-slate-900 px-3 py-2 rounded-xl text-xs border border-slate-250 focus:ring-1 focus:ring-slate-900 focus:outline-none whitespace-pre-wrap font-semibold"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wide">
            보조 자막 / 슬로건 자막
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="예시: 단 5분 만에 마스터하는 비밀 노하우"
            className="w-full text-slate-900 px-3 py-2.5 rounded-xl text-xs border border-slate-250 focus:ring-1 focus:ring-slate-900 focus:outline-none font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-3.5 pt-1.5 border-t border-slate-150">
          <div className="col-span-2">
            <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide mb-1">
              자막 레이어 화면 위치 정렬
            </label>
            <div className="grid grid-cols-5 gap-1 bg-slate-150 p-1 rounded-xl text-center">
              {[
                { label: '상단', value: 'top' as TextPosition },
                { label: '중앙', value: 'center' as TextPosition },
                { label: '하단', value: 'bottom' as TextPosition },
                { label: '좌하단', value: 'bottom-left' as TextPosition },
                { label: '우하단', value: 'bottom-right' as TextPosition },
              ].map((pos) => (
                <button
                  key={pos.value}
                  type="button"
                  onClick={() => setPosition(pos.value)}
                  className={`py-1 rounded-lg text-[9px] font-extrabold transition-all truncate ${
                    position === pos.value
                      ? 'bg-slate-900 text-white shadow-3xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">
              제목 글자 크기
            </label>
            <div className="flex gap-1.5 items-center">
              <input
                type="number"
                min="12"
                max="180"
                value={fontSize}
                onChange={(e) => setFontSize(Math.max(12, parseInt(e.target.value) || 24))}
                className="w-full text-center px-1.5 py-1.5 text-xs text-slate-800 border border-slate-250 rounded-xl bg-white font-extrabold focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 shrink-0 font-bold">PX</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">
              자막 글자 색상
            </label>
            <div className="flex items-center gap-1">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-7 h-7.5 rounded-lg border border-slate-200 cursor-pointer p-0"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-1.5 py-1.5 text-[10px] font-mono border border-slate-200 rounded-lg lowercase bg-white"
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div className="col-span-2 pt-2 border-t border-slate-100 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">
                텍스트 자막 가독성 검정 배경 박스 레이어 사용
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useBackground}
                  onChange={(e) => setUseBackground(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
              </label>
            </div>

            {useBackground && (
              <div className="bg-slate-50 border p-3 rounded-xl flex items-center justify-between gap-3">
                <span className="text-[10px] text-slate-400 font-bold">배경 박스 투명 색상</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={boxBackgroundColor.startsWith('rgba') ? '#000000' : boxBackgroundColor}
                    onChange={(e) => setBoxBackgroundColor(e.target.value)}
                    className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0"
                  />
                  <select
                    value={boxBackgroundColor}
                    onChange={(e) => setBoxBackgroundColor(e.target.value)}
                    className="text-[10px] font-semibold border border-slate-200 rounded p-1 bg-white text-slate-700 focus:outline-none"
                  >
                    <option value="rgba(0, 0, 0, 0.7)">반투명 블랙 (70%)</option>
                    <option value="rgba(0, 0, 0, 0.4)">약간 투명 블랙 (40%)</option>
                    <option value="rgba(0, 0, 0, 0.95)">불투명에 가까운 블랙 (95%)</option>
                    <option value="rgba(255, 255, 255, 0.7)">반투명 화이트 (70%)</option>
                    <option value="rgba(239, 68, 68, 0.7)">반투명 레드 (70%)</option>
                    <option value="rgba(34, 197, 94, 0.7)">반투명 그린 (70%)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageOptionPanel;
