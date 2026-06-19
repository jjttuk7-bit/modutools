import type { ImageMeta } from '../../types/image';

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('이미지를 불러오지 못했습니다.'));
    image.src = src;
  });
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 0, height: 0 });
    };
    image.src = url;
  });
}

export function validateImageFile(file: File): boolean {
  return ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
}

export async function getImageMeta(file: File): Promise<ImageMeta> {
  const { width, height } = await getImageDimensions(file);

  return {
    filename: file.name,
    type: file.type,
    size: file.size,
    width,
    height,
  };
}

export function formatImageDimensions(width: number, height: number): string {
  if (width === 0 || height === 0) return '-';
  return `${width} x ${height} px`;
}

export function createSafeFilename(
  originalName: string,
  suffix: string,
  extension: string,
): string {
  const dotIndex = originalName.lastIndexOf('.');
  const baseName = dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;
  const safeBase = baseName.replace(/[/\\?%*:|"<>\s]/g, '_');
  const normalizedExt = extension.toLowerCase().replace(/^jpeg$/, 'jpg');
  const extSuffix = normalizedExt.startsWith('.') ? normalizedExt : `.${normalizedExt}`;

  return `${safeBase}${suffix}${extSuffix}`;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function calculateAspectRatio(width: number, height: number): string {
  if (width <= 0 || height <= 0) return '-';

  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}
