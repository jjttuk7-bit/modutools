export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  type: 'image/png' | 'image/jpeg' = 'image/png',
  quality: number = 0.95,
): void {
  try {
    const dataUrl = canvas.toDataURL(type, type === 'image/jpeg' ? quality : undefined);
    downloadDataUrl(dataUrl, filename);
  } catch (error) {
    console.error('Canvas download error:', error);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          downloadDataUrl(url, filename);
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
      },
      type,
      type === 'image/jpeg' ? quality : undefined,
    );
  }
}
