import * as XLSX from 'xlsx';

export function parseExcelFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          resolve([]);
          return;
        }

        let workbook: XLSX.WorkBook;
        if (typeof data === 'string') {
          workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        } else {
          workbook = XLSX.read(data, { type: 'array', cellDates: true });
        }

        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          resolve([]);
          return;
        }

        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        resolve(jsonData);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

export function excelToBlob(data: any[], sheetName: string = 'Sheet1'): Blob {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  const cleanName = sheetName.replace(/[\/\\?*:[\]]/g, '_').substring(0, 31) || 'Sheet1';
  XLSX.utils.book_append_sheet(workbook, worksheet, cleanName);

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

export function multiSheetExcelToBlob(sheets: { [sheetName: string]: any[] }): Blob {
  const workbook = XLSX.utils.book_new();

  Object.entries(sheets).forEach(([rawName, data]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    let cleanName = rawName.replace(/[\/\\?*:[\]]/g, '_').substring(0, 31);
    if (!cleanName || cleanName.trim() === '') {
      cleanName = 'Sheet';
    }

    let finalName = cleanName;
    let index = 1;
    while (workbook.SheetNames.includes(finalName)) {
      const suffix = `_${index}`;
      finalName = cleanName.substring(0, 31 - suffix.length) + suffix;
      index++;
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, finalName);
  });

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

export function writeExcelFile(data: any[], fileName: string): void {
  const blob = excelToBlob(data);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
