import { PDFDocument } from 'pdf-lib';

export interface ImageFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  previewUrl: string;
}

export type PaperSizeOption = 'A4_PORTRAIT' | 'A4_LANDSCAPE';
export type MarginOption = 'WITH_MARGIN' | 'NO_MARGIN';
export type QualityOption = 'HIGH' | 'STANDARD' | 'LOW';

export interface ConversionOptions {
  paperSize: PaperSizeOption;
  margin: MarginOption;
  quality: QualityOption;
}

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('이미지를 불러오는데 실패했습니다.'));
    img.src = url;
  });
};

export async function compressImageToJpgBytes(
  previewUrl: string,
  qualityOption: QualityOption,
): Promise<{ bytes: Uint8Array; width: number; height: number }> {
  let maxWidth = 1600;
  let quality = 0.75;

  if (qualityOption === 'HIGH') {
    maxWidth = 2000;
    quality = 0.9;
  } else if (qualityOption === 'LOW') {
    maxWidth = 1200;
    quality = 0.55;
  }

  const img = await loadImage(previewUrl);
  let targetWidth = img.naturalWidth || img.width;
  let targetHeight = img.naturalHeight || img.height;

  if (targetWidth > maxWidth) {
    const ratio = maxWidth / targetWidth;
    targetWidth = maxWidth;
    targetHeight = Math.round(targetHeight * ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('브라우저 캔버스를 활성화할 수 없습니다.');
  }

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  const base64 = dataUrl.split(',')[1];
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return { bytes, width: targetWidth, height: targetHeight };
}

export async function generatePhotoToPdf(
  images: ImageFileItem[],
  options: ConversionOptions,
  onProgress: (status: string) => void,
): Promise<Uint8Array> {
  onProgress('이미지 확인 중');

  const pdfDoc = await PDFDocument.create();

  const A4_WIDTH = 595.27;
  const A4_HEIGHT = 841.89;

  let pageWidth = A4_WIDTH;
  let pageHeight = A4_HEIGHT;

  if (options.paperSize === 'A4_LANDSCAPE') {
    pageWidth = A4_HEIGHT;
    pageHeight = A4_WIDTH;
  }

  const margin = options.margin === 'WITH_MARGIN' ? 24 : 0;
  const contentWidth = pageWidth - 2 * margin;
  const contentHeight = pageHeight - 2 * margin;

  onProgress('이미지 압축 중');
  for (let i = 0; i < images.length; i++) {
    const item = images[i];

    const { bytes, width: imgWidth, height: imgHeight } = await compressImageToJpgBytes(
      item.previewUrl,
      options.quality,
    );

    const pdfImage = await pdfDoc.embedJpg(bytes);

    onProgress(`PDF 페이지 생성 중 (${i + 1}/${images.length})`);
    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    const widthRatio = contentWidth / imgWidth;
    const heightRatio = contentHeight / imgHeight;
    const fitScale = Math.min(widthRatio, heightRatio);

    const drawWidth = imgWidth * fitScale;
    const drawHeight = imgHeight * fitScale;

    const drawX = margin + (contentWidth - drawWidth) / 2;
    const drawY = margin + (contentHeight - drawHeight) / 2;

    page.drawImage(pdfImage, {
      x: drawX,
      y: drawY,
      width: drawWidth,
      height: drawHeight,
    });
  }

  onProgress('PDF 저장 중');
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
