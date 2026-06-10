import { PDFDocument, rgb } from 'pdf-lib';
import type { MaskBox } from '../../types/mask';

export async function applyMaskToPdf(
  originalPdfBytes: ArrayBuffer,
  maskBoxes: MaskBox[],
): Promise<Uint8Array> {
  if (originalPdfBytes.byteLength === 0) {
    throw new Error('마스킹할 원본 PDF 데이터가 메모리에서 소실되었습니다. (Detached buffer)');
  }

  const pdfDoc = await PDFDocument.load(originalPdfBytes.slice(0), {
    ignoreEncryption: true,
    throwOnInvalidObject: false,
  });
  const pages = pdfDoc.getPages();

  for (const box of maskBoxes) {
    const pageIndex = box.pageNumber - 1;
    if (pageIndex < 0 || pageIndex >= pages.length) {
      continue;
    }

    const page = pages[pageIndex];

    page.drawRectangle({
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
      color: rgb(0, 0, 0),
    });
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
