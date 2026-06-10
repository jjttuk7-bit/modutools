export interface ViewportLike {
  convertToPdfPoint(x: number, y: number): [number, number];
  convertToViewportPoint(x: number, y: number): [number, number];
}

export function convertCanvasToPdf(
  canvasX: number,
  canvasY: number,
  canvasWidth: number,
  canvasHeight: number,
  viewport: ViewportLike,
) {
  const [pX1, pY1] = viewport.convertToPdfPoint(canvasX, canvasY);
  const [pX2, pY2] = viewport.convertToPdfPoint(canvasX + canvasWidth, canvasY + canvasHeight);

  const x = Math.min(pX1, pX2);
  const y = Math.min(pY1, pY2);
  const width = Math.abs(pX1 - pX2);
  const height = Math.abs(pY1 - pY2);

  return { x, y, width, height };
}

export function convertPdfToCanvas(
  pdfX: number,
  pdfY: number,
  pdfWidth: number,
  pdfHeight: number,
  viewport: ViewportLike,
) {
  const [canvasX1, canvasY1] = viewport.convertToViewportPoint(pdfX, pdfY + pdfHeight);
  const [canvasX2, canvasY2] = viewport.convertToViewportPoint(pdfX + pdfWidth, pdfY);

  const x = Math.min(canvasX1, canvasX2);
  const y = Math.min(canvasY1, canvasY2);
  const width = Math.abs(canvasX1 - canvasX2);
  const height = Math.abs(canvasY1 - canvasY2);

  return { x, y, width, height };
}
