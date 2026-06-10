export interface CanvasTemplate {
  id: string;
  name: string;
  backgroundColor: string;
  gradientStart?: string;
  gradientEnd?: string;
  gradientAngle?: number;
  textColor: string;
  subtitleColor: string;
  fontFamily: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  textAlignment: 'left' | 'center' | 'right';
  fontStyle?: 'normal' | 'bold' | 'italic';
}

export type CanvasPreset = {
  id: string;
  label: string;
  width: number;
  height: number;
  description: string;
};

export type ImageFitMode = 'cover' | 'contain' | 'stretch';

export type DownloadFormat = 'png' | 'jpg';

export type TextPosition =
  | 'top'
  | 'center'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right';

export type TextLayerOptions = {
  title: string;
  subtitle?: string;
  fontSize: number;
  color: string;
  useBackground: boolean;
  backgroundColor: string;
  position: TextPosition;
};

export type CanvasEditState = {
  preset: CanvasPreset;
  fitMode: ImageFitMode;
  backgroundColor: string;
  scale: number;
  offsetX: number;
  offsetY: number;
  text: TextLayerOptions;
};
