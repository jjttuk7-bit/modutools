import Papa from 'papaparse';

export function parseCSVFile(file: File, encoding: string = 'utf-8'): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      if (!buffer) {
        resolve([]);
        return;
      }
      try {
        const cleanEncoding = encoding.toLowerCase().replace(/_/g, '-');
        const decoder = new TextDecoder(cleanEncoding);
        const text = decoder.decode(buffer);

        const results = Papa.parse(text, {
          header: true,
          skipEmptyLines: 'greedy',
        });
        resolve(results.data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

export function csvToBlob(data: any[], appendBOM: boolean = true): Blob {
  const csvString = Papa.unparse(data);
  const content = appendBOM ? '﻿' + csvString : csvString;
  return new Blob([content], { type: 'text/csv;charset=utf-8;' });
}

export function writeCSVFile(data: any[], fileName: string, appendBOM: boolean = true): void {
  const blob = csvToBlob(data, appendBOM);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
