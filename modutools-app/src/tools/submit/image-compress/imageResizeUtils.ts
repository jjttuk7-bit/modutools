export type ResizeType =
  | 'KEEP_RATIO'
  | 'LONG_EDGE'
  | 'WIDTH_ONLY'
  | 'HEIGHT_ONLY'
  | 'SQUARE_CROP';

export interface ResizeOptions {
  type: ResizeType;
  longEdgeValue: string | number;
  longEdgeCustom: number;
  widthValue: number;
  heightValue: number;
  squareSizeValue: string | number;
  squareSizeCustom: number;
}

export function drawImageToCanvas(
  img: HTMLImageElement,
  options: ResizeOptions,
  needsWhiteBg: boolean,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('브라우저 캔버스 컨텍스트를 사용할 수 없습니다.');
  }

  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;

  let targetW = origW;
  let targetH = origH;

  const type = options.type;

  if (type === 'KEEP_RATIO') {
    targetW = origW;
    targetH = origH;
  } else if (type === 'LONG_EDGE') {
    let limit = 1600;
    if (options.longEdgeValue === 'custom') {
      limit = Number(options.longEdgeCustom) || 1600;
    } else {
      limit = Number(options.longEdgeValue) || 1600;
    }

    const long = Math.max(origW, origH);
    const ratio = limit / long;
    targetW = Math.round(origW * ratio);
    targetH = Math.round(origH * ratio);
  } else if (type === 'WIDTH_ONLY') {
    const limitW = Number(options.widthValue) || origW;
    const ratio = limitW / origW;
    targetW = limitW;
    targetH = Math.round(origH * ratio);
  } else if (type === 'HEIGHT_ONLY') {
    const limitH = Number(options.heightValue) || origH;
    const ratio = limitH / origH;
    targetW = Math.round(origW * ratio);
    targetH = limitH;
  } else if (type === 'SQUARE_CROP') {
    let squareSize = 1000;
    if (options.squareSizeValue === 'custom') {
      squareSize = Number(options.squareSizeCustom) || 1000;
    } else {
      squareSize = Number(options.squareSizeValue) || 1000;
    }
    targetW = squareSize;
    targetH = squareSize;
  }

  canvas.width = targetW;
  canvas.height = targetH;

  if (needsWhiteBg) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetW, targetH);
  }

  if (type === 'SQUARE_CROP') {
    const minEdge = Math.min(origW, origH);
    const sourceX = (origW - minEdge) / 2;
    const sourceY = (origH - minEdge) / 2;
    ctx.drawImage(img, sourceX, sourceY, minEdge, minEdge, 0, 0, targetW, targetH);
  } else {
    ctx.drawImage(img, 0, 0, targetW, targetH);
  }

  return canvas;
}
