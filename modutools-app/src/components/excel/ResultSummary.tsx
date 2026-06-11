import { CopyCheck, FileCheck2, ShieldAlert } from 'lucide-react';

interface ResultSummaryProps {
  beforeRows?: number;
  afterRows?: number;
  fileCount?: number;
  errorCount?: number;
  timeSpentMs?: number;
}

export default function ResultSummary({
  beforeRows = 120,
  afterRows = 104,
  fileCount = 3,
  errorCount = 0,
  timeSpentMs = 120,
}: ResultSummaryProps) {
  const removedCount = beforeRows - afterRows;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
        <CopyCheck className="w-4 h-4 text-emerald-700" />
        작업 성공 결과 요약
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            불러온 파일 수
          </span>
          <div className="flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            <span className="text-base font-bold text-slate-800">{fileCount}개</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            정리 전 행 수
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold text-slate-400 line-through">{beforeRows}</span>
            <span className="text-[10px] text-slate-400">행</span>
          </div>
        </div>

        <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/60">
          <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-1">
            정리 후 유효 행 수
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold text-emerald-800">{afterRows}</span>
            <span className="text-[10px] text-emerald-700 font-bold">행</span>
          </div>
        </div>

        <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100/60">
          <span className="text-[10px] uppercase font-bold text-amber-700 block mb-1">
            정리 정제 건수
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold text-amber-800">
              {removedCount > 0 ? `-${removedCount}` : '없음'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1">
        <span>로컬에서 {timeSpentMs}ms 만에 즉시 정리 연산을 마쳤습니다.</span>
        {errorCount > 0 && (
          <div className="flex items-center gap-1 text-rose-600 font-bold bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-100">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>경고: {errorCount}개 행 포맷 유효치 않음</span>
          </div>
        )}
      </div>
    </div>
  );
}
