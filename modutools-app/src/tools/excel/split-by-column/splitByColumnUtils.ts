export function sanitizeFileName(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, '_').trim();
}

export interface SplitGroup {
  key: string;
  rows: any[];
}

export interface SplitOptions {
  emptyValueOption: 'unclassified' | 'exclude';
  prefix: string;
}

export function splitDataByColumn(
  data: any[],
  columnName: string,
  options: SplitOptions,
): SplitGroup[] {
  if (!columnName || data.length === 0) return [];

  const groups: { [key: string]: any[] } = {};

  const actualColumnName =
    Object.keys(data[0]).find((k) => k.trim() === columnName.trim()) || columnName;

  data.forEach((row) => {
    const val = row[actualColumnName];

    const isEmpty = val === undefined || val === null || String(val).trim() === '';

    let groupKey = '';
    if (isEmpty) {
      if (options.emptyValueOption === 'exclude') {
        return;
      } else {
        groupKey = '미분류';
      }
    } else {
      groupKey = String(val).trim();
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(row);
  });

  return Object.entries(groups).map(([key, rows]) => ({
    key,
    rows,
  }));
}
