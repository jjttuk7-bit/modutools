export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image: ' + e));
    img.src = src;
  });
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function calculateFitDimensions(
  imgWidth: number,
  imgHeight: number,
  containerWidth: number,
  containerHeight: number,
): { width: number; height: number } {
  const imgRatio = imgWidth / imgHeight;
  const containerRatio = containerWidth / containerHeight;

  if (imgRatio > containerRatio) {
    return {
      width: containerWidth,
      height: containerWidth / imgRatio,
    };
  }
  return {
    width: containerHeight * imgRatio,
    height: containerHeight,
  };
}

export async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  const url = await fileToDataUrl(file);
  return await loadImage(url);
}

export function getImageMeta(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        reject(new Error('Failed to read image dimensions'));
      };
      img.src = src;
    };
    reader.onerror = () => reject(new Error('Failed to read image metadata'));
    reader.readAsDataURL(file);
  });
}

export function validateImageFile(file: File): {
  isValid: boolean;
  errorMessage: string | null;
} {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      errorMessage: '이미지 파일만 업로드할 수 있습니다. (PNG, JPG, JPEG, WEBP)',
    };
  }
  return { isValid: true, errorMessage: null };
}

export function formatImageSize(width: number, height: number): string {
  return `${width}x${height} px`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
