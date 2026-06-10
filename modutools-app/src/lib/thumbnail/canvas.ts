import type { ImageFitMode, TextLayerOptions } from '../../types/canvas';

export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  color: string,
  width: number,
  height: number,
): void {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

export function drawImageToCanvas(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  preset: { width: number; height: number },
  fitMode: ImageFitMode,
  scale: number = 1,
  offsetX: number = 0,
  offsetY: number = 0,
): void {
  const { width, height } = preset;
  const imgW = image.width;
  const imgH = image.height;

  ctx.save();

  if (fitMode === 'stretch') {
    const w = width * scale;
    const h = height * scale;
    const x = (width - w) / 2 + offsetX;
    const y = (height - h) / 2 + offsetY;
    ctx.drawImage(image, x, y, w, h);
  } else {
    const imgRatio = imgW / imgH;
    const canvasRatio = width / height;

    let renderW = width;
    let renderH = height;

    if (fitMode === 'cover') {
      if (imgRatio > canvasRatio) {
        renderW = height * imgRatio;
        renderH = height;
      } else {
        renderW = width;
        renderH = width / imgRatio;
      }
    } else {
      if (imgRatio > canvasRatio) {
        renderW = width;
        renderH = width / imgRatio;
      } else {
        renderW = height * imgRatio;
        renderH = height;
      }
    }

    const w = renderW * scale;
    const h = renderH * scale;
    const x = (width - w) / 2 + offsetX;
    const y = (height - h) / 2 + offsetY;

    ctx.drawImage(image, x, y, w, h);
  }

  ctx.restore();
}

export function drawTextLayer(
  ctx: CanvasRenderingContext2D,
  textOptions: TextLayerOptions,
  width: number,
  height: number,
): void {
  if (!textOptions.title || !textOptions.title.trim()) return;

  ctx.save();

  let align: CanvasTextAlign = 'center';
  let x = width / 2;
  let y = height / 2;
  const paddingX = 24;
  const paddingY = 16;

  const fontSize = textOptions.fontSize;
  const subtitleSize = Math.max(14, Math.floor(fontSize * 0.4));

  const titleLines = textOptions.title.split('\n');
  const titleLineHeight = fontSize * 1.25;
  const subtitleLineHeight = subtitleSize * 1.3;

  const titleBlockHeight = titleLines.length * titleLineHeight;
  const subtitleBlockHeight = textOptions.subtitle ? subtitleLineHeight + 12 : 0;
  const totalTextHeight = titleBlockHeight + subtitleBlockHeight;

  const pos = textOptions.position;
  if (pos === 'top') {
    x = width / 2;
    y = height * 0.22 - totalTextHeight / 2;
    align = 'center';
  } else if (pos === 'center') {
    x = width / 2;
    y = height * 0.5 - totalTextHeight / 2;
    align = 'center';
  } else if (pos === 'bottom') {
    x = width / 2;
    y = height * 0.78 - totalTextHeight / 2;
    align = 'center';
  } else if (pos === 'bottom-left') {
    x = width * 0.1;
    y = height * 0.85 - totalTextHeight;
    align = 'left';
  } else if (pos === 'bottom-right') {
    x = width * 0.9;
    y = height * 0.85 - totalTextHeight;
    align = 'right';
  }

  ctx.textAlign = align;
  ctx.textBaseline = 'top';

  ctx.font = `bold ${fontSize}px "Inter", "Nanum Gothic", sans-serif`;

  let maxTitleWidth = 0;
  titleLines.forEach((line) => {
    const w = ctx.measureText(line).width;
    if (w > maxTitleWidth) maxTitleWidth = w;
  });

  let maxSubWidth = 0;
  if (textOptions.subtitle) {
    ctx.font = `500 ${subtitleSize}px "Inter", "Nanum Gothic", sans-serif`;
    maxSubWidth = ctx.measureText(textOptions.subtitle).width;
  }
  const maxTextWidth = Math.max(maxTitleWidth, maxSubWidth);

  if (textOptions.useBackground) {
    const boxW = maxTextWidth + paddingX * 2;
    const boxH = totalTextHeight + paddingY * 2;

    let boxX = x - boxW / 2;
    if (align === 'left') {
      boxX = x - paddingX;
    } else if (align === 'right') {
      boxX = x - boxW + paddingX;
    }
    const boxY = y - paddingY;
    const borderRadius = 8;

    ctx.fillStyle = textOptions.backgroundColor || 'rgba(0, 0, 0, 0.6)';

    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(boxX, boxY, boxW, boxH, borderRadius);
    } else {
      ctx.rect(boxX, boxY, boxW, boxH);
    }
    ctx.fill();
  }

  ctx.fillStyle = textOptions.color;
  ctx.font = `bold ${fontSize}px "Inter", "Nanum Gothic", sans-serif`;

  let currentY = y;
  titleLines.forEach((line) => {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = Math.max(2, Math.floor(fontSize * 0.08));
    ctx.lineJoin = 'round';
    ctx.strokeText(line, x, currentY);

    ctx.fillText(line, x, currentY);
    currentY += titleLineHeight;
  });

  if (textOptions.subtitle) {
    currentY += 12;
    ctx.fillStyle = textOptions.color === '#ffffff' ? '#fde047' : textOptions.color;
    ctx.font = `500 ${subtitleSize}px "Inter", "Nanum Gothic", sans-serif`;

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = Math.max(1.5, Math.floor(subtitleSize * 0.08));
    ctx.lineJoin = 'round';
    ctx.strokeText(textOptions.subtitle, x, currentY);

    ctx.fillText(textOptions.subtitle, x, currentY);
  }

  ctx.restore();
}

export function exportCanvasToBlob(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpg',
  quality: number = 0.92,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas export failed'));
        }
      },
      mimeType,
      format === 'jpg' ? quality : undefined,
    );
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

export function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  strokeWidth: number = 0,
  strokeColor: string = '#000000',
  align: 'left' | 'center' | 'right' = 'center',
): number {
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';

  const lines = text.split('\n').reduce((acc: string[], segment) => {
    return acc.concat(wrapText(ctx, segment, maxWidth));
  }, []);

  lines.forEach((line, index) => {
    const lineY = y + index * lineHeight;

    if (strokeWidth > 0) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineJoin = 'round';
      ctx.strokeText(line, x, lineY);
    }

    ctx.fillText(line, x, lineY);
  });

  return lines.length;
}

export function drawBadge(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerFormatX: number,
  topY: number,
  bgColor: string,
  textColor: string,
  font: string,
  paddingX: number = 18,
  paddingY: number = 8,
  radius: number = 6,
): void {
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const textWidth = ctx.measureText(text).width;
  const badgeWidth = textWidth + paddingX * 2;
  const badgeHeight = 24 + paddingY * 2;

  const startX = centerFormatX - badgeWidth / 2;
  const startY = topY;

  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.moveTo(startX + radius, startY);
  ctx.lineTo(startX + badgeWidth - radius, startY);
  ctx.quadraticCurveTo(startX + badgeWidth, startY, startX + badgeWidth, startY + radius);
  ctx.lineTo(startX + badgeWidth, startY + badgeHeight - radius);
  ctx.quadraticCurveTo(
    startX + badgeWidth,
    startY + badgeHeight,
    startX + badgeWidth - radius,
    startY + badgeHeight,
  );
  ctx.lineTo(startX + radius, startY + badgeHeight);
  ctx.quadraticCurveTo(startX, startY + badgeHeight, startX, startY + badgeHeight - radius);
  ctx.lineTo(startX, startY + radius);
  ctx.quadraticCurveTo(startX, startY, startX + radius, startY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = textColor;
  ctx.fillText(text, centerFormatX, startY + badgeHeight / 2);
}
