import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
// @ts-expect-error vite ?url import
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export async function loadPdfDocument(
  arrayBuffer: ArrayBuffer,
): Promise<pdfjsLib.PDFDocumentProxy> {
  const version = pdfjsLib.version || '6.0.227';
  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    useSystemFonts: true,
    cMapUrl: `https://unpkg.com/pdfjs-dist@${version}/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${version}/standard_fonts/`,
  });
  return loadingTask.promise;
}

export function renderPdfPage(
  pdfDoc: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  scale: number = 1.3,
): { promise: Promise<any>; cancel: () => void } {
  let cancelled = false;
  let renderTask: any = null;

  const promise = (async () => {
    const page = await pdfDoc.getPage(pageNumber);
    if (cancelled) {
      throw new Error('Render cancelled');
    }

    const viewport = page.getViewport({ scale });

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas 2D context is not available');
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
      canvasContext: context,
      viewport,
      canvas,
    };

    renderTask = page.render(renderContext);

    await renderTask.promise;

    return viewport;
  })();

  return {
    promise,
    cancel: () => {
      cancelled = true;
      if (renderTask) {
        try {
          renderTask.cancel();
        } catch {
          // ignore
        }
      }
    },
  };
}
