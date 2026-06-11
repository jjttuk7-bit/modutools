import { useState } from 'react';
import FileDropzone from '../../../components/excel/FileDropzone';
import PrivacyNotice from '../../../components/excel/PrivacyNotice';
import ResultSummary from '../../../components/excel/ResultSummary';
import DataPreviewTable from '../../../components/excel/DataPreviewTable';
import DownloadButton from '../../../components/excel/DownloadButton';
import AdSlot from '../../../components/common/AdSlot';
import ExcelSeo from '../../../components/seo/ExcelSeo';
import { parseExcelFile, excelToBlob } from '../../../lib/excel/excel';
import { parseCSVFile } from '../../../lib/excel/csv';
import { downloadBlob } from '../../../lib/download';
import { CheckCircle, Sliders, FileSpreadsheet, AlertCircle, RefreshCw } from 'lucide-react';

export default function RemoveDuplicatesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [targetColumn, setTargetColumn] = useState('all');
  const [selectedKeyColumn, setSelectedKeyColumn] = useState('');

  const [isParsing, setIsParsing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [cleanedData, setCleanedData] = useState<any[]>([]);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFilesSelected = async (selected: File[]) => {
    if (selected.length === 0) return;
    const uploadedFile = selected[0];

    const ext = uploadedFile.name.split('.').pop()?.toLowerCase();
    if (ext !== 'xlsx' && ext !== 'xls' && ext !== 'csv') {
      setErrorMessage('XLSX, XLS 또는 CSV 파일만 업로드할 수 있습니다.');
      return;
    }

    setFile(uploadedFile);
    setIsParsing(true);
    setErrorMessage('');
    setIsCompleted(false);
    setResultBlob(null);

    try {
      let parsed: any[] = [];
      if (ext === 'csv') {
        parsed = await parseCSVFile(uploadedFile);
      } else {
        parsed = await parseExcelFile(uploadedFile);
      }

      if (parsed.length === 0) {
        setErrorMessage('처리할 데이터가 없습니다.');
        setIsParsing(false);
        return;
      }

      setData(parsed);
      const cols = Object.keys(parsed[0]).filter((k) => k !== '__rowNum__');
      setColumns(cols);

      if (cols.length > 0) {
        const defaultCol =
          cols.find(
            (c) =>
              c.toLowerCase().includes('phone') ||
              c.includes('전화') ||
              c.includes('연락처') ||
              c.includes('이메일') ||
              c.toLowerCase().includes('email') ||
              c.toLowerCase().includes('id') ||
              c.includes('코드'),
          ) || cols[0];
        setSelectedKeyColumn(defaultCol);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('파일을 분석하는 데 실패했습니다.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleCleanAction = async () => {
    if (data.length === 0) return;
    setIsProcessing(true);
    setErrorMessage('');

    try {
      await new Promise((r) => setTimeout(r, 600));

      const seen = new Set<string>();
      const deduplicated = data.filter((row) => {
        let uniqueKey = '';
        if (targetColumn === 'all') {
          const filteredKeys = Object.keys(row).filter((k) => k !== '__rowNum__');
          const sortedRow = filteredKeys
            .sort()
            .map((k) => `${k}:${row[k]}`)
            .join('|');
          uniqueKey = sortedRow;
        } else {
          uniqueKey = String(
            row[selectedKeyColumn] !== undefined ? row[selectedKeyColumn] : '',
          ).trim();
        }

        if (seen.has(uniqueKey)) {
          return false;
        }
        seen.add(uniqueKey);
        return true;
      });

      setCleanedData(deduplicated);
      const blob = excelToBlob(deduplicated, '중복제거완료');
      setResultBlob(blob);
      setIsCompleted(true);
    } catch (err) {
      console.error(err);
      setErrorMessage('중복을 제어하는 중 시스템 오류가 감지되었습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (resultBlob && file) {
      const origName = file.name.substring(0, file.name.lastIndexOf('.'));
      downloadBlob(resultBlob, `${origName}_중복제거_완료.xlsx`);
    }
  };

  const handleReset = () => {
    setFile(null);
    setData([]);
    setColumns([]);
    setCleanedData([]);
    setResultBlob(null);
    setIsCompleted(false);
    setErrorMessage('');
  };

  const previewHeaders =
    cleanedData.length > 0
      ? [
          { key: 'num', label: '순번' },
          ...Object.keys(cleanedData[0])
            .slice(0, 5)
            .map((k) => ({ key: k, label: k })),
        ]
      : [];

  const previewRows = cleanedData.slice(0, 5).map((row, idx) => ({
    num: idx + 1,
    ...row,
  }));

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-emerald-800" />
          엑셀 중복 제거
        </h2>
        <p className="text-xs md:text-sm text-slate-500 mt-1 leading-relaxed">
          특정 기준 열(연락처, 이메일, ID 등) 혹은 전체 열 내용을 검사하여 완벽하게 동일한 중복
          데이터를 소거합니다.
        </p>
      </div>

      <PrivacyNotice />

      <AdSlot type="responsive" label="ADVERTISEMENT" />

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!file && (
        <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-emerald-800" />
            정리할 엑셀/CSV 파일을 올려주세요
          </h3>
          <FileDropzone onFilesSelected={handleFilesSelected} multiple={false} />
        </div>
      )}

      {isParsing && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3 shadow-xs">
          <RefreshCw className="w-10 h-10 text-emerald-800 animate-spin" />
          <p className="text-xs font-semibold text-slate-600 text-center">
            파일에서 레코드 구조를 정밀 리코딩 중입니다...
          </p>
        </div>
      )}

      {file && data.length > 0 && !isCompleted && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-800" />
              중복 제거 기준 설정
            </h3>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1"
            >
              다시 선택
            </button>
          </div>

          <div className="space-y-4">
            <div
              onClick={() => setTargetColumn('all')}
              className={`p-4 border rounded-xl cursor-pointer transition flex items-start gap-3 ${
                targetColumn === 'all'
                  ? 'border-emerald-800 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                checked={targetColumn === 'all'}
                onChange={() => {}}
                className="mt-1 h-4 w-4 text-emerald-800 border-slate-300 focus:ring-emerald-800"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">전체 열 매칭 중복 제거</span>
                <span className="text-[11px] text-slate-500 block">
                  모든 컬럼의 데이터 내용이 완벽하게 일치하는 완전히 똑같은 행들만 하나로 합칩니다.
                </span>
              </div>
            </div>

            <div
              onClick={() => setTargetColumn('key')}
              className={`p-4 border rounded-xl cursor-pointer transition flex items-start gap-3 ${
                targetColumn === 'key'
                  ? 'border-emerald-800 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                checked={targetColumn === 'key'}
                onChange={() => {}}
                className="mt-1 h-4 w-4 text-emerald-800 border-slate-300 focus:ring-emerald-800"
              />
              <div className="w-full">
                <span className="text-xs font-bold text-slate-800 block">
                  특정 기준 컬럼 지정 제거 (추천)
                </span>
                <span className="text-[11px] text-slate-500 block mb-3">
                  전화번호, 이메일, 성함 등 특정 고유 기준 컬럼이 일관된 데이터를 찾아내 중복을
                  소거합니다. (첫 행 보존)
                </span>

                {targetColumn === 'key' && (
                  <div className="mt-2 text-left" onClick={(e) => e.stopPropagation()}>
                    <label
                      htmlFor="dup-col-select"
                      className="block text-[10px] font-bold text-slate-600 mb-1"
                    >
                      기준이 되는 매칭 열 선택
                    </label>
                    <select
                      id="dup-col-select"
                      value={selectedKeyColumn}
                      onChange={(e) => setSelectedKeyColumn(e.target.value)}
                      className="text-xs font-semibold p-2 bg-white border border-slate-200 rounded-lg outline-none max-w-full"
                    >
                      {columns.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCleanAction}
            disabled={isProcessing}
            className="w-full mt-2 py-3.5 bg-emerald-850 text-white font-bold text-xs rounded-xl hover:bg-emerald-950 active:bg-emerald-950 flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
          >
            {isProcessing ? '빠른 중복 인덱싱 소거 처리 중...' : '중복 항목 깨끗해지기 시작'}
          </button>
        </div>
      )}

      {isProcessing && (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center space-y-4 shadow-xs animate-pulse">
          <div className="w-12 h-12 border-4 border-emerald-850 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-700 text-center leading-relaxed">
            해시 기반 복제 테이블 매핑을 통해 대규모 열 연산을 로컬 메모리에서 처리 중입니다.
          </p>
        </div>
      )}

      {isCompleted && resultBlob && (
        <div className="space-y-6 animate-fade-in">
          <ResultSummary
            beforeRows={data.length}
            afterRows={cleanedData.length}
            fileCount={1}
            errorCount={0}
          />

          <DataPreviewTable
            caption={`중복 제거 완료 데이터 테이블 미리보기 (상위 5개 행 / 남은 행: ${cleanedData.length}행)`}
            headers={previewHeaders}
            rows={previewRows}
          />

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h5 className="text-xs font-bold text-slate-800">
                📥 {file ? file.name.substring(0, file.name.lastIndexOf('.')) : '정리완료'}
                _중복제거_완료.xlsx
              </h5>
              <p className="text-[10px] text-slate-400">
                중복으로 판정된 총 {(data.length - cleanedData.length).toLocaleString()}개 행이
                안전하게 제거되었습니다.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-600 bg-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                다시 시작하기
              </button>
              <DownloadButton onDownload={downloadResult} fileName="중복제거_정리완료.xlsx" />
            </div>
          </div>
        </div>
      )}

      <AdSlot type="leaderboard" label="ADVERTISEMENT" />

      <ExcelSeo toolId="remove-duplicates" />
    </div>
  );
}
