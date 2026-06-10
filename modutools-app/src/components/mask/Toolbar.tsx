import {
  ChevronLeft,
  ChevronRight,
  Undo2,
  Eraser,
  Trash2,
  Download,
  RefreshCw,
} from 'lucide-react';

interface ToolbarProps {
  currentPage: number;
  pageCount: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onUndo: () => void;
  onClearCurrentPage: () => void;
  onClearAll: () => void;
  onDownload: () => void;
  canUndo: boolean;
  hasBoxesOnPage: boolean;
  hasAnyBoxes: boolean;
  isDownloading: boolean;
  currentBoxesCount: number;
  totalBoxesCount: number;
}

export default function Toolbar({
  currentPage,
  pageCount,
  onPrevPage,
  onNextPage,
  onUndo,
  onClearCurrentPage,
  onClearAll,
  onDownload,
  canUndo,
  hasBoxesOnPage,
  hasAnyBoxes,
  isDownloading,
  currentBoxesCount,
  totalBoxesCount,
}: ToolbarProps) {
  return (
    <div
      id="toolbar-panel"
      className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5"
    >
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          페이지 컨트롤
        </h3>
        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
          <button
            id="nav-prev-btn"
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            className={`p-2 rounded-md transition-all cursor-pointer ${
              currentPage <= 1
                ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
                : 'text-slate-700 hover:bg-white hover:text-black hover:shadow-sm'
            }`}
            title="이전 페이지 (Ctrl + Left)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-sm font-medium text-slate-800">
            <span className="text-base font-bold text-slate-900">{currentPage}</span>
            <span className="text-slate-400 px-1">/</span>
            <span>{pageCount}</span>
          </div>

          <button
            id="nav-next-btn"
            onClick={onNextPage}
            disabled={currentPage >= pageCount}
            className={`p-2 rounded-md transition-all cursor-pointer ${
              currentPage >= pageCount
                ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
                : 'text-slate-700 hover:bg-white hover:text-black hover:shadow-sm'
            }`}
            title="다음 페이지 (Ctrl + Right)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            마스킹 도구
          </h3>
          <span className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            현재 {currentBoxesCount}개 / 총 {totalBoxesCount}개
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            id="tool-undo-btn"
            onClick={onUndo}
            disabled={!canUndo}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
              canUndo
                ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
            }`}
            title="마지막으로 그린 마스킹 박스 실행 취소"
          >
            <Undo2 className="w-4 h-4" />
            <span>최근 취소</span>
          </button>

          <button
            id="tool-clear-page-btn"
            onClick={onClearCurrentPage}
            disabled={!hasBoxesOnPage}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
              hasBoxesOnPage
                ? 'bg-white text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300'
                : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
            }`}
            title="현재 보이는 페이지의 모든 마스킹 박스 삭제"
          >
            <Eraser className="w-4 h-4" />
            <span>페이지 비우기</span>
          </button>
        </div>

        <button
          id="tool-clear-all-btn"
          onClick={onClearAll}
          disabled={!hasAnyBoxes}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
            hasAnyBoxes
              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
              : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
          }`}
          title="모든 페이지의 마스킹 텍스트/영역 완전히 비우기"
        >
          <Trash2 className="w-4 h-4" />
          <span>전체 마스킹 완전 삭제</span>
        </button>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <button
          id="tool-download-btn"
          onClick={onDownload}
          disabled={isDownloading}
          className={`w-full flex items-center justify-center gap-2.5 py-4 px-4 rounded-xl text-sm font-bold text-white shadow-md transition-all cursor-pointer hover:shadow-lg active:scale-98 ${
            isDownloading
              ? 'bg-emerald-600 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
          title="가려진 검정 박스가 영구 인쇄된 새로운 PDF를 안전하게 내려받습니다."
        >
          {isDownloading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>PDF 마스킹 파일 생성 중...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5 animate-bounce" />
              <span>마스킹 PDF 다운로드</span>
            </>
          )}
        </button>
        <p className="text-[11px] text-slate-400 text-center mt-2.5 leading-relaxed">
          다운로드된 새로운 파일은 민감정보 수정이 불가능하도록 원본 레이어 위에 완전히 타서
          덮어씌워집니다.
        </p>
      </div>
    </div>
  );
}
