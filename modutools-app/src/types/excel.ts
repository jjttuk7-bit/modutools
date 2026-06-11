export interface CleanedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  rowCount?: number;
  status: 'idle' | 'processing' | 'success' | 'error';
  errorMessage?: string;
  data?: any[];
}

export interface ProcessingResult {
  beforeRows: number;
  afterRows: number;
  removedCount: number;
  filesProcessed: number;
  success: boolean;
  message?: string;
}

export interface TableHeader {
  key: string;
  label: string;
}

export interface TableRow {
  [key: string]: any;
}

export interface TableData {
  headers: TableHeader[];
  rows: TableRow[];
}
