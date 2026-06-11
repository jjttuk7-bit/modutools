import type { TableHeader, TableRow } from '../../types/excel';

interface DataPreviewTableProps {
  headers?: TableHeader[];
  rows?: TableRow[];
  caption?: string;
}

export default function DataPreviewTable({
  headers = [
    { key: 'num', label: '순번' },
    { key: 'name', label: '고객명' },
    { key: 'phone', label: '연락처' },
    { key: 'email', label: '이메일' },
    { key: 'branch', label: '구분/지점' },
  ],
  rows = [
    {
      num: 1,
      name: '홍길동',
      phone: '010-1234-5678',
      email: 'hong@example.com',
      branch: '서울 본사',
    },
    {
      num: 2,
      name: '김철수',
      phone: '010-9876-5432',
      email: 'kim@example.com',
      branch: '부산 지사',
    },
    {
      num: 3,
      name: '이영희',
      phone: '010-3333-4444',
      email: 'lee@example.com',
      branch: '광주 지사',
    },
  ],
  caption = '결과 미리보기 (상위 10개 행만 임시 표시)',
}: DataPreviewTableProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-800">{caption}</h4>
        <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
          미리보기 모드
        </span>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {headers.map((header) => (
                <th
                  key={header.key}
                  className="px-4 py-3 font-bold text-slate-700 select-none"
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-emerald-50/15 transition-colors">
                {headers.map((header) => (
                  <td key={header.key} className="px-4 py-3 text-slate-600 font-medium">
                    {row[header.key] !== undefined ? String(row[header.key]) : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
