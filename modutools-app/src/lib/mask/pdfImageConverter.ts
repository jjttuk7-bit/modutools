import { PDFDocument } from 'pdf-lib';

export async function convertImageToPdf(
  imageBytes: ArrayBuffer,
  fileName: string,
): Promise<ArrayBuffer> {
  const mimeType = fileName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
  const blob = new Blob([imageBytes], { type: mimeType });
  const objectUrl = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = async () => {
      try {
        URL.revokeObjectURL(objectUrl);

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('브라우저 그래픽 컨텍스트(Canvas 2D)를 생성하지 못했습니다.');
        }

        ctx.drawImage(img, 0, 0);

        const dataUrl = canvas.toDataURL('image/png');
        const base64Parts = dataUrl.split(',');
        const base64Data = base64Parts[1];

        const binaryString = window.atob(base64Data);
        const len = binaryString.length;
        const normalizedBytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          normalizedBytes[i] = binaryString.charCodeAt(i);
        }

        const pdfDoc = await PDFDocument.create();
        const embeddedImage = await pdfDoc.embedPng(normalizedBytes);

        const { width, height } = embeddedImage.scale(1);
        const page = pdfDoc.addPage([width, height]);

        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width,
          height,
        });

        const pdfBytes = await pdfDoc.save();
        resolve(pdfBytes);
      } catch (err: any) {
        console.error('Image normalization to PDF failed:', err);
        reject(
          new Error(
            `이미지 가공 오류: ${err.message || '이미지를 PDF로 변환하는 데 실패했습니다.'}`,
          ),
        );
      }
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      console.error('HTMLImageElement load error:', err);
      reject(new Error('이미지 원본 로드 실패: 올바른 디지털 이미지 파일인지 확인하십시오.'));
    };

    img.src = objectUrl;
  });
}
