import { createCanvas, exportCanvasToBlob, loadImageFromFile } from './canvas';

export interface CompressionOptions {
  maxSizeKB?: number;
  quality?: number;
  maxWidthOrHeight?: number;
  format?: 'jpg' | 'png' | 'webp';
}

export interface CompressionResult {
  blob: Blob;
  width: number;
  height: number;
  qualityUsed: number;
  status: 'smaller' | 'success' | 'best_effort';
}

const MIN_LONG_SIDE = 600;

function getCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('캔버스 컨텍스트를 만들지 못했습니다.');
  }
  return ctx;
}

function getOutputMime(format: 'jpg' | 'png' | 'webp'): string {
  return format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
}

function scaleToMaxDimension(
  width: number,
  height: number,
  maxWidthOrHeight?: number,
): { width: number; height: number } {
  if (!maxWidthOrHeight || (width <= maxWidthOrHeight && height <= maxWidthOrHeight)) {
    return { width, height };
  }

  if (width > height) {
    return {
      width: maxWidthOrHeight,
      height: Math.round((height * maxWidthOrHeight) / width),
    };
  }

  return {
    width: Math.round((width * maxWidthOrHeight) / height),
    height: maxWidthOrHeight,
  };
}

export async function compressToTargetSize(
  file: File,
  targetBytes: number,
  format: 'jpg' | 'png' | 'webp' = 'jpg',
  maxWidthOrHeight?: number,
): Promise<CompressionResult> {
  const image = await loadImageFromFile(file);
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const { width: originalWidth, height: originalHeight } = scaleToMaxDimension(
    sourceWidth,
    sourceHeight,
    maxWidthOrHeight,
  );
  const outputFormat = format === 'png' ? 'png' : format === 'webp' ? 'webp' : 'jpg';
  const outputMime = getOutputMime(outputFormat);

  if (file.size <= targetBytes && file.type === outputMime && !maxWidthOrHeight) {
    return {
      blob: file,
      width: originalWidth,
      height: originalHeight,
      qualityUsed: 1,
      status: 'smaller',
    };
  }

  let quality = 0.9;
  let scale = 1;
  let currentWidth = originalWidth;
  let currentHeight = originalHeight;
  let currentBlob: Blob | null = null;
  let matchesTarget = false;
  const minLongSide = maxWidthOrHeight
    ? Math.min(MIN_LONG_SIDE, maxWidthOrHeight)
    : MIN_LONG_SIDE;

  for (let iteration = 0; iteration < 30; iteration++) {
    currentWidth = Math.round(originalWidth * scale);
    currentHeight = Math.round(originalHeight * scale);

    const longSide = Math.max(currentWidth, currentHeight);
    if (longSide < minLongSide) {
      const ratio = minLongSide / longSide;
      currentWidth = Math.round(currentWidth * ratio);
      currentHeight = Math.round(currentHeight * ratio);
    }

    const canvas = createCanvas(currentWidth, currentHeight);
    try {
      const ctx = getCanvasContext(canvas);
      ctx.drawImage(image, 0, 0, currentWidth, currentHeight);
      currentBlob = await exportCanvasToBlob(canvas, outputFormat, quality);
    } finally {
      canvas.width = 0;
      canvas.height = 0;
    }

    if (currentBlob.size <= targetBytes) {
      matchesTarget = true;
      break;
    }

    if (quality > 0.45) {
      quality = Math.max(0.45, parseFloat((quality - 0.05).toFixed(2)));
    } else {
      if (quality > 0.35) {
        quality = Math.max(0.35, parseFloat((quality - 0.05).toFixed(2)));
      }

      const nextScale = scale * 0.9;
      const nextLongSide = Math.max(originalWidth * nextScale, originalHeight * nextScale);

      if (nextLongSide < minLongSide) {
        if (quality === 0.35) break;
      } else {
        scale = nextScale;
      }
    }
  }

  if (!currentBlob) {
    throw new Error('이미지 압축에 실패했습니다.');
  }

  return {
    blob: currentBlob,
    width: currentWidth,
    height: currentHeight,
    qualityUsed: quality,
    status: matchesTarget ? 'success' : 'best_effort',
  };
}

export async function compressImage(
  file: File,
  options: CompressionOptions,
): Promise<CompressionResult> {
  const image = await loadImageFromFile(file);
  const { width, height } = scaleToMaxDimension(
    image.naturalWidth || image.width,
    image.naturalHeight || image.height,
    options.maxWidthOrHeight,
  );

  const canvas = createCanvas(width, height);
  const format = options.format ?? (file.type === 'image/webp' ? 'webp' : 'jpg');
  const quality = options.quality ?? 0.8;
  const targetBytes = options.maxSizeKB ? options.maxSizeKB * 1024 : Number.POSITIVE_INFINITY;
  let blob: Blob;

  try {
    const ctx = getCanvasContext(canvas);
    ctx.drawImage(image, 0, 0, width, height);
    blob = await exportCanvasToBlob(canvas, format, quality);
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }

  if (blob.size > targetBytes) {
    return compressToTargetSize(file, targetBytes, format, options.maxWidthOrHeight);
  }

  return {
    blob,
    width,
    height,
    qualityUsed: quality,
    status: file.size <= blob.size ? 'best_effort' : 'success',
  };
}
