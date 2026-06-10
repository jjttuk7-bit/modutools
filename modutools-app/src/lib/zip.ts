import JSZip from 'jszip';

export async function createZipBlob(
  files: { name: string; blob: Blob }[],
): Promise<Blob> {
  const zip = new JSZip();
  files.forEach((file) => {
    zip.file(file.name, file.blob);
  });
  return await zip.generateAsync({ type: 'blob' });
}
