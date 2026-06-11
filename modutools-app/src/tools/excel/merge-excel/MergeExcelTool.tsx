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
import { PlusCircle, Settings, FileSpreadsheet, AlertCircle, RefreshCw } from 'lucide-react';

export default function MergeExcelTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [mergeOption, setMergeOption] = useState('headers');
  const [errorMessage, setErrorMessage] = useState('');

  const [mergedData, setMergedData] = useState<any[]>([]);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [totalRowsBefore, setTotalRowsBefore] = useState(0);

  const handleFilesSelected = (selected: File[]) => {
    const valid = selected.filter((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return extension === 'xlsx' || extension === 'xls' || extension === 'csv';
    });

    if (valid.length < selected.length) {
      setErrorMessage('XLSX, XLS 또는 CSV 파일만 추가할 수 있습니다.');
    } else {
      setErrorMessage('');
    }

    setFiles(valid);
    setIsCompleted(false);
    setResultBlob(null);
  };

  const handleMergeAction = async () => {
    if (files.length < 2) {
      setErrorMessage('병합하기 위해 최소 2개 이상의 파일을 업로드해주세요.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');
    setMergedData([]);

    try {
      const allDataArrays: any[][] = [];
      let rowCountBefore = 0;

      for (const file of files) {
        const ext = file.name.split('.').pop()?.toLowerCase();
        let rows: any[] = [];

        if (ext === 'csv') {
          rows = await parseCSVFile(file);
        } else {
          rows = await parseExcelFile(file);
        }

        rowCountBefore += rows.length;

        const enriched = rows.map((r) => ({
          __origin_file__: file.name,
          ...r,
        }));
        allDataArrays.push(enriched);
      }

      setTotalRowsBefore(rowCountBefore);

      const merged: any[] = [];
      if (mergeOption === 'headers') {
        const allKeys = new Set<string>();
        allDataArrays.forEach((arr) => {
          if (arr.length > 0) {
            Object.keys(arr[0]).forEach((k) => {
              if (k !== '__rowNum__' && k !== '__origin_file__') {
                allKeys.add(k);
              }
            });
          }
        });

        allDataArrays.forEach((arr) => {
          arr.forEach((row) => {
            const normalizedRow: any = { '출처 파일명': row.__origin_file__ };
            allKeys.forEach((key) => {
              normalizedRow[key] = row[key] !== undefined && row[key] !== null ? row[key] : '';
            });
            merged.push(normalizedRow);
          });
        });
      } else {
        const firstCols =
          allDataArrays[0].length > 0
            ? Object.keys(allDataArrays[0][0]).filter(
                (k) => k !== '__rowNum__' && k !== '__origin_file__',
              )
            : [];

        allDataArrays.forEach((arr) => {
          arr.forEach((row) => {
            const normalizedRow: any = { '출처 파일명': row.__origin_file__ };
            firstCols.forEach((col) => {
              normalizedRow[col] = row[col] !== undefined && row[col] !== null ? row[col] : '';
            });
            merged.push(normalizedRow);
          });
        });
      }

      setMergedData(merged);
      const blob = excelToBlob(merged, '병합완료_시트');
      setResultBlob(blob);
      setIsCompleted(true);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        '파일 병합을 진행하는 중 오류가 발생했습니다. 헤더가 없는 파일이 존재하거나 파일 내부 손상을 확인해주세요.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (resultBlob) {
      downloadBlob(resultBlob, '병합완료_데이터셋.xlsx');
    }
  };

  const handleReset = () => {
    setFiles([]);
    setIsCompleted(false);
    setResultBlob(null);
    setMergedData([]);
    setErrorMessage('');
  };

  const previewHeaders =
    mergedData.length > 0
      ? [
          { key: 'num', label: '순번' },
          ...Object.keys(mergedData[0])
            .slice(0, 5)
            .map((k) => ({ key: k, label: k })),
        ]
      : [];

  const previewRows = mergedData.slice(0, 5).map((row, idx) => ({
    num: idx + 1,
    ...row,
  }));

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-emerald-800" />
          엑셀 파일 합치기
        </h2>
        <p className="text-xs md:text-sm text-slate-500 mt-1 leading-relaxed">
          여러 XLSX, XLS, CSV 파일 데이터를 열 기준으로 깔끔하게 정렬하여 하나의 엑셀 파일로
          병합합니다.
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

      {!isCompleted && (
        <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-emerald-850" />
            합칠 엑셀/CSV 파일들을 올려주세요 (최소 2개 이상)
          </h3>
          <FileDropzone onFilesSelected={handleFilesSelected} multiple={true} maxFiles={30} />
          {files.length > 0 && (
            <div className="text-[11px] text-slate-400">
              * 현재 선택된 파일: {files.length}개 ({files.map((f) => f.name).join(', ')})
            </div>
          )}
        </div>
      )}

      {files.length >= 2 && !isCompleted && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
            <Settings className="w-4 h-4 text-emerald-800" />
            병합 옵션 선택
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <input
                id="merge-headers"
                name="merge-opt"
                type="radio"
                checked={mergeOption === 'headers'}
                onChange={() => setMergeOption('headers')}
                className="mt-1 h-4 w-4 text-emerald-800 border-slate-300 focus:ring-emerald-800"
              />
              <label htmlFor="merge-headers" className="cursor-pointer">
                <span className="text-xs font-bold text-slate-800 block">
                  동일한 열 이름(헤더) 매칭하여 결합 (권장)
                </span>
                <span className="text-[11px] text-slate-500 block">
                  열들의 위치가 달라도 열 이름을 찾아 세로로 쌓습니다. 일치하지 않는 열은 빈칸으로
                  정돈됩니다.
                </span>
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input
                id="merge-position"
                name="merge-opt"
                type="radio"
                checked={mergeOption === 'position'}
                onChange={() => setMergeOption('position')}
                className="mt-1 h-4 w-4 text-emerald-800 border-slate-300 focus:ring-emerald-800"
              />
              <label htmlFor="merge-position" className="cursor-pointer">
                <span className="text-xs font-bold text-slate-800 block">
                  첫 번째 파일 형식에 맞춰서 아래로 이어붙이기
                </span>
                <span className="text-[11px] text-slate-500 block">
                  첫 번째 파일의 포맷 기준으로 나머지 데이터 행을 단순 세로 병합합니다.
                </span>
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={handleMergeAction}
            disabled={isProcessing}
            className="w-full mt-2 py-3 bg-emerald-850 text-white font-bold text-xs rounded-xl hover:bg-emerald-900 active:bg-emerald-950 flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
          >
            {isProcessing ? '병합 및 데이터 정밀 분석 중...' : `${files.length}개 파일 병합 실행하기`}
          </button>
        </div>
      )}

      {isProcessing && (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center space-y-4 shadow-xs animate-pulse">
          <RefreshCw className="w-10 h-10 text-emerald-800 animate-spin" />
          <p className="text-xs font-semibold text-slate-700 text-center leading-relaxed">
            파일 헤더 구조를 대조하고 중복성을 소거하여 최적화 병합 중입니다.
            <br />이 처리는 서버를 거치지 않고 오직 사용자 PC 브라우저 안에서만 안전하고 빠르게
            처리됩니다.
          </p>
        </div>
      )}

      {isCompleted && resultBlob && (
        <div className="space-y-6 animate-fade-in">
          <ResultSummary
            beforeRows={totalRowsBefore}
            afterRows={mergedData.length}
            fileCount={files.length}
            errorCount={0}
          />

          <DataPreviewTable
            caption={`병합 데이터 실시간 미리보기 (상위 5개 행 / 열: 총 ${
              Object.keys(mergedData[0]).length
            }개)`}
            headers={previewHeaders}
            rows={previewRows}
          />

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h5 className="text-xs font-bold text-slate-800">
                📥 병합완료_데이터셋.xlsx ({mergedData.length.toLocaleString()}행 취합됨)
              </h5>
              <p className="text-[10px] text-slate-400 leading-normal">
                병합된 결과물에서 각 고유 열들이 깔끔하게 매칭 정리되었습니다.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-600 bg-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                새로 시작하기
              </button>
              <DownloadButton onDownload={downloadResult} fileName="병합완료_데이터셋.xlsx" />
            </div>
          </div>
        </div>
      )}

      <AdSlot type="leaderboard" label="ADVERTISEMENT" />

      <ExcelSeo toolId="merge-excel" />
    </div>
  );
}
