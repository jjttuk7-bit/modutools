import { drawImageToCanvas, type ResizeOptions } from './imageResizeUtils';

export type CompressionType = 'SIMPLE' | 'TARGET_SIZE';

export type OutputFormat = 'ORIGINAL' | 'JPEG' | 'WEBP' | 'PNG';

export interface CompressionOptions {
  type: CompressionType;
  simpleQuality: 'HIGH' | 'STANDARD' | 'LOW';
  targetSizeValue: string | number;
  targetSizeCustomValue: number;
  targetSizeCustomUnit: 'KB' | 'MB';
  resize: ResizeOptions;
  outputFormat: OutputFormat;
}

export interface CompressedResultItem {
  id: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  originalWidth: number;
  originalHeight: number;
  compressedWidth: number;
  compressedHeight: number;
  compressedBlob: Blob;
  downloadUrl: string;
}

export function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('이미지 파일을 읽는데 실패했습니다.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('파일 리더 기동 오류가 발생했습니다.'));
    reader.readAsDataURL(file);
  });
}

export const getCanvasBlob = (
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number,
): Promise<Blob> => {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob || new Blob());
      },
      mimeType,
      quality,
    );
  });
};

export function getTargetMimeType(outputFormat: OutputFormat, originalType: string): string {
  if (outputFormat === 'JPEG') return 'image/jpeg';
  if (outputFormat === 'WEBP') return 'image/webp';
  if (outputFormat === 'PNG') return 'image/png';
  if (outputFormat === 'ORIGINAL') {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(originalType)) {
      return originalType;
    }
    return 'image/jpeg';
  }
  return 'image/jpeg';
}

export function getExtensionForMimeType(mimeType: string): string {
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  return 'jpg';
}

export async function compressSingleImage(
  file: File,
  options: CompressionOptions,
  onProgress: (phase: string) => void,
): Promise<CompressedResultItem> {
  onProgress('이미지 확인 중');
  const img = await fileToImage(file);
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;

  const targetMimeType = getTargetMimeType(options.outputFormat, file.type);
  const needsWhiteBg = targetMimeType === 'image/jpeg';

  onProgress('크기 조정 중');
  let currentCanvas = drawImageToCanvas(img, options.resize, needsWhiteBg);

  let qualitySetting = 0.75;
  if (options.type === 'SIMPLE') {
    let limit = 1600;
    if (options.simpleQuality === 'HIGH') {
      qualitySetting = 0.85;
      limit = 2500;
    } else if (options.simpleQuality === 'LOW') {
      qualitySetting = 0.6;
      limit = 1200;
    } else {
      qualitySetting = 0.75;
      limit = 1600;
    }

    const currentW = currentCanvas.width;
    const currentH = currentCanvas.height;
    const long = Math.max(currentW, currentH);
    if (long > limit) {
      const scale = limit / long;
      const resizeCanvas = document.createElement('canvas');
      resizeCanvas.width = Math.round(currentW * scale);
      resizeCanvas.height = Math.round(currentH * scale);
      const rCtx = resizeCanvas.getContext('2d');
      if (rCtx) {
        if (needsWhiteBg) {
          rCtx.fillStyle = '#FFFFFF';
          rCtx.fillRect(0, 0, resizeCanvas.width, resizeCanvas.height);
        }
        rCtx.drawImage(currentCanvas, 0, 0, resizeCanvas.width, resizeCanvas.height);
        currentCanvas = resizeCanvas;
      }
    }
  }

  onProgress('용량 압축 중');
  let finalBlob: Blob;
  let finalWidth = currentCanvas.width;
  let finalHeight = currentCanvas.height;

  if (options.type === 'SIMPLE') {
    finalBlob = await getCanvasBlob(currentCanvas, targetMimeType, qualitySetting);
  } else {
    let targetBytes = 500 * 1024;
    const targetVal = options.targetSizeValue;
    if (targetVal === 'custom') {
      const unit = options.targetSizeCustomUnit;
      const factor = unit === 'MB' ? 1024 * 1024 : 1024;
      targetBytes = (Number(options.targetSizeCustomValue) || 500) * factor;
    } else if (targetVal === '100KB') {
      targetBytes = 100 * 1024;
    } else if (targetVal === '300KB') {
      targetBytes = 300 * 1024;
    } else if (targetVal === '500KB') {
      targetBytes = 500 * 1024;
    } else if (targetVal === '1MB') {
      targetBytes = 1024 * 1024;
    }

    let currentQuality = 0.85;
    let tempBlob = await getCanvasBlob(currentCanvas, targetMimeType, currentQuality);

    let loopProtect = 0;
    while (tempBlob.size > targetBytes && loopProtect < 40) {
      loopProtect++;
      if (currentQuality > 0.41) {
        currentQuality = Math.max(0.4, currentQuality - 0.05);
        tempBlob = await getCanvasBlob(currentCanvas, targetMimeType, currentQuality);
      } else if (currentQuality > 0.35) {
        currentQuality = 0.35;
        tempBlob = await getCanvasBlob(currentCanvas, targetMimeType, currentQuality);
      } else {
        const curW = currentCanvas.width;
        const curH = currentCanvas.height;
        const longSide = Math.max(curW, curH);

        if (longSide * 0.9 < 600) {
          break;
        }

        const nextW = Math.round(curW * 0.9);
        const nextH = Math.round(curH * 0.9);

        const scaleCanvas = document.createElement('canvas');
        scaleCanvas.width = nextW;
        scaleCanvas.height = nextH;
        const sCtx = scaleCanvas.getContext('2d');
        if (sCtx) {
          if (needsWhiteBg) {
            sCtx.fillStyle = '#FFFFFF';
            sCtx.fillRect(0, 0, nextW, nextH);
          }
          sCtx.drawImage(currentCanvas, 0, 0, nextW, nextH);
          currentCanvas = scaleCanvas;
          finalWidth = nextW;
          finalHeight = nextH;
        }

        tempBlob = await getCanvasBlob(currentCanvas, targetMimeType, 0.35);
      }
    }

    finalBlob = tempBlob;
  }

  onProgress('결과 생성 중');
  const randSuffix = Math.random().toString(36).substring(2, 6);
  const ext = getExtensionForMimeType(targetMimeType);
  const baseNameWithoutExt =
    file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  const outputFileName = `compressed_${baseNameWithoutExt}.${ext}`;

  return {
    id: `${Date.now()}-${randSuffix}`,
    name: outputFileName,
    originalSize: file.size,
    compressedSize: finalBlob.size,
    originalWidth: origW,
    originalHeight: origH,
    compressedWidth: finalWidth,
    compressedHeight: finalHeight,
    compressedBlob: finalBlob,
    downloadUrl: URL.createObjectURL(finalBlob),
  };
}
