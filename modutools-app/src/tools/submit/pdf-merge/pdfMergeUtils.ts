import { PDFDocument } from 'pdf-lib';

export async function getPdfPageCount(file: File): Promise<number> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, {
      updateMetadata: false,
    });
    return pdfDoc.getPageCount();
  } catch (error) {
    console.error('PDF 페이지 수를 읽는 과정에서 분석 오류가 발생했습니다:', error);
    return 1;
  }
}

export async function mergePdfFiles(
  files: File[],
  onProgress: (phase: string) => void,
): Promise<{ blob: Blob; pageCount: number }> {
  onProgress('PDF 확인 중');
  const mergedPdf = await PDFDocument.create();
  let totalPageCount = 0;

  for (let i = 0; i < files.length; i++) {
    onProgress(`페이지 복사 중 (${i + 1}/${files.length})`);
    const file = files[i];
    const arrayBuffer = await file.arrayBuffer();

    const srcPdf = await PDFDocument.load(arrayBuffer, {
      ignoreEncryption: true,
    });

    const pageIndices = srcPdf.getPageIndices();
    const copiedPages = await mergedPdf.copyPages(srcPdf, pageIndices);

    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });

    totalPageCount += pageIndices.length;
  }

  onProgress('PDF 합치는 중');
  mergedPdf.setTitle('합쳐진 통합 문서');
  mergedPdf.setProducer('PDF 정리 도구 - PDF 합치기');
  mergedPdf.setCreator('PDF 정리 도구');

  onProgress('파일 생성 중');
  const mergedPdfBytes = await mergedPdf.save();
  const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });

  onProgress('완료');
  return {
    blob,
    pageCount: totalPageCount,
  };
}
