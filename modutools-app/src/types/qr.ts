export type QrCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QrDesignConfig {
  size: number;
  margin: number;
  foreground: string;
  background: string;
  errorCorrectionLevel: QrCorrectionLevel;
  dotsType: 'rounded' | 'dots' | 'classy' | 'extra-rounded' | 'square';
  cornersType: 'square' | 'dot' | 'extra-rounded' | 'outlined';
  logoUrl?: string;
  logoSize?: number;
  logoMargin?: number;
}
