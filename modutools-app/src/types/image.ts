export interface ImageDataState {
  file: File | null;
  previewUrl: string | null;
  width: number;
  height: number;
}

export interface ImageMeta {
  filename: string;
  type: string;
  size: number;
  width: number;
  height: number;
}

export interface ImageOption {
  backgroundColor: string;
  backgroundType: 'color' | 'gradient' | 'image';
  gradientStart: string;
  gradientEnd: string;
  gradientAngle: number;
  textColor: string;
  textStrokeColor: string;
  textStrokeWidth: number;
  fontFamily: string;
  fontSize: number;
  fontStyle: 'normal' | 'bold' | 'italic';
  textAlignment: 'left' | 'center' | 'right';
  textText: string;
  subtitleText: string;
  subtitleColor: string;
  subtitleSize: number;
  opacity: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  badgeText: string;
  badgeBgColor: string;
  badgeTextColor: string;
  aspectRatioPreset: string;
}
