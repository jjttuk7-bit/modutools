import { PDFDocument } from 'pdf-lib';

export function parsePageRange(rangeStr: string, maxPages: number): number[] {
  const result: Set<number> = new Set();
  const tokens = rangeStr.split(',');

  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;

    if (trimmed.includes('-')) {
      const parts = trimmed.split('-');
      if (parts.length > 2) {
        throw new Error(
          '올바르지 않은 범위 형식입니다. 하이픈(-)은 범위당 하나씩만 사용할 수 있습니다.',
        );
      }

      const rawStart = parts[0].trim();
      const rawEnd = parts[1].trim();

      let start = 1;
      let end = maxPages;

      if (rawStart) {
        start = parseInt(rawStart, 10);
        if (isNaN(start) || start < 1) {
          throw new Error('시작 페이지 숫자가 잘못되었습니다.');
        }
      }

      if (rawEnd) {
        end = parseInt(rawEnd, 10);
        if (isNaN(end) || end < 1) {
          throw new Error('끝 페이지 숫자가 잘못되었습니다.');
        }
      }

      if (start > maxPages || end > maxPages) {
        throw new Error(`페이지 범위가 원본의 최대 페이지수(${maxPages})를 초과했습니다.`);
      }

      if (start > end) {
        throw new Error(`시작 페이지(${start})는 끝 페이지(${end})보다 클 수 없습니다.`);
      }

      for (let p = start; p <= end; p++) {
        result.add(p);
      }
    } else {
      const pageNum = parseInt(trimmed, 10);
      if (isNaN(pageNum) || pageNum < 1) {
        throw new Error('잘못된 형식의 페이지 번호가 포함되어 있습니다.');
      }
      if (pageNum > maxPages) {
        throw new Error(
          `입력하신 페이지 번호(${pageNum})는 최대 페이지수(${maxPages})를 초과할 수 없습니다.`,
        );
      }
      result.add(pageNum);
    }
  }

  return Array.from(result).sort((a, b) => a - b);
}

export function formatSelectedPages(pages: number[]): string {
  if (pages.length === 0) return '';
  const sorted = [...pages].sort((a, b) => a - b);
  const ranges: string[] = [];

  let start = sorted[0];
  let prev = sorted[0];

  for (let i = 1; i <= sorted.length; i++) {
    const current = sorted[i];
    if (current === prev + 1) {
      prev = current;
    } else {
      if (start === prev) {
        ranges.push(`${start}`);
      } else {
        ranges.push(`${start}-${prev}`);
      }
      if (current !== undefined) {
        start = current;
        prev = current;
      }
    }
  }

  return ranges.join(', ');
}

export async function getPdfLoadMetadata(file: File): Promise<{ pageCount: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, {
    updateMetadata: false,
  });
  return {
    pageCount: pdfDoc.getPageCount(),
  };
}

export async function extractPdfPages(
  file: File,
  pageNumbers: number[],
  onProgress: (phase: string) => void,
): Promise<Blob> {
  if (pageNumbers.length === 0) {
    throw new Error('추출할 페이지가 선택되지 않았습니다.');
  }

  onProgress('PDF 확인 중');
  const arrayBuffer = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
  });

  onProgress('페이지 복사 중');
  const newPdf = await PDFDocument.create();

  const zeroBasedIndices = pageNumbers.map((num) => num - 1);

  const copiedPages = await newPdf.copyPages(srcPdf, zeroBasedIndices);
  copiedPages.forEach((page) => {
    newPdf.addPage(page);
  });

  onProgress('PDF 합치는 중');
  newPdf.setTitle('추출된 PDF 파일');
  newPdf.setProducer('PDF 정리 도구 - PDF 페이지 추출');
  newPdf.setCreator('PDF 정리 도구');

  onProgress('파일 생성 중');
  const newPdfBytes = await newPdf.save();
  const finalBlob = new Blob([newPdfBytes], { type: 'application/pdf' });

  onProgress('완료');
  return finalBlob;
}
