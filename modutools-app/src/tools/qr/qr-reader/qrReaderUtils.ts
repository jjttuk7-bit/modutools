import jsQR from 'jsqr';

export interface QrReadingResult {
  success: boolean;
  text: string | null;
  error: string | null;
}

export async function decodeQrFromImage(file: File): Promise<QrReadingResult> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve({
        success: false,
        text: null,
        error: '이미지 파일만 업로드할 수 있습니다.',
      });
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            success: false,
            text: null,
            error: '이미지를 읽는 중 문제가 발생했습니다.',
          });
          return;
        }

        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data) {
          resolve({ success: true, text: code.data, error: null });
        } else {
          resolve({
            success: false,
            text: null,
            error: 'QR코드를 찾지 못했습니다. 더 선명한 이미지를 사용해보세요.',
          });
        }
      } catch (e) {
        console.error('QR decoding error:', e);
        resolve({
          success: false,
          text: null,
          error: '이미지를 읽는 중 문제가 발생했습니다.',
        });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        success: false,
        text: null,
        error: '이미지 파일을 읽는 데 실패했습니다.',
      });
    };

    img.src = objectUrl;
  });
}
