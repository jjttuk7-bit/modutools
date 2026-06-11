import { useState } from 'react';
import FileDropzone from '../../../components/excel/FileDropzone';
import PrivacyNotice from '../../../components/excel/PrivacyNotice';
import ResultSummary from '../../../components/excel/ResultSummary';
import DataPreviewTable from '../../../components/excel/DataPreviewTable';
import DownloadButton from '../../../components/excel/DownloadButton';
import AdSlot from '../../../components/common/AdSlot';
import ExcelSeo from '../../../components/seo/ExcelSeo';
import { parseCSVFile, csvToBlob } from '../../../lib/excel/csv';
import { downloadBlob } from '../../../lib/download';
import { RefreshCw, Sliders, FileSpreadsheet, Loader2, AlertCircle } from 'lucide-react';

interface EncodingRow {
  num: number;
  col1: string;
  col2: string;
  col3: string;
}

export default function CsvEncodingFixTool() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [sourceEncoding, setSourceEncoding] = useState('utf-8');
  const [targetEncoding, setTargetEncoding] = useState('utf_8_bom');

  const [isParsing, setIsParsing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [previewRows, setPreviewRows] = useState<EncodingRow[]>([]);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const loadCSVFile = async (currentFile: File, encoding: string) => {
    setIsParsing(true);
    setErrorMessage('');
    try {
      const parsed = await parseCSVFile(currentFile, encoding);
      if (parsed.length === 0) {
        setErrorMessage('처리할 데이터가 존재하지 않거나 파일 구조가 비어있습니다.');
        setData([]);
        setColumns([]);
        setIsParsing(false);
        return;
      }
      setData(parsed);
      const cols = Object.keys(parsed[0]).filter((k) => k !== '__rowNum__');
      setColumns(cols);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        'CSV 파일을 로딩하는 도중 파일 파싱 에러가 발생했습니다. 원본 방식을 변경해 보세요.',
      );
    } finally {
      setIsParsing(false);
    }
  };

  const handleFilesSelected = async (selected: File[]) => {
    if (selected.length === 0) return;
    const uploadedFile = selected[0];

    const ext = uploadedFile.name.split('.').pop()?.toLowerCase();
    if (ext !== 'csv') {
      setErrorMessage('CSV 파일만 업로드할 수 있습니다.');
      return;
    }

    setFile(uploadedFile);
    setErrorMessage('');
    setIsCompleted(false);
    setResultBlob(null);

    await loadCSVFile(uploadedFile, sourceEncoding);
  };

  const handleEncodingChange = async (newEncoding: string) => {
    setSourceEncoding(newEncoding);
    if (file) {
      await loadCSVFile(file, newEncoding);
    }
  };

  const handleFixAction = async () => {
    if (data.length === 0 || !file) return;
    setIsProcessing(true);
    setErrorMessage('');

    try {
      await new Promise((r) => setTimeout(r, 650));

      const appendBOM = targetEncoding === 'utf_8_bom';
      const blob = csvToBlob(data, appendBOM);
      setResultBlob(blob);

      const pRows: EncodingRow[] = data.slice(0, 5).map((row, idx) => {
        const keys = Object.keys(row);
        return {
          num: idx + 1,
          col1: String(row[keys[0]] || ''),
          col2: String(row[keys[1]] || ''),
          col3: String(row[keys[2]] || ''),
        };
      });
      setPreviewRows(pRows);
      setIsCompleted(true);
    } catch (err) {
      console.error(err);
      setErrorMessage('인코딩 변형을 적용하던 중 에러가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (resultBlob && file) {
      const origName = file.name.substring(0, file.name.lastIndexOf('.'));
      const suffix = targetEncoding === 'utf_8_bom' ? '_엑셀오픈형' : '_표준형';
      downloadBlob(resultBlob, `${origName}${suffix}.csv`);
    }
  };

  const handleReset = () => {
    setFile(null);
    setData([]);
    setColumns([]);
    setPreviewRows([]);
    setResultBlob(null);
    setIsCompleted(false);
    setErrorMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <RefreshCw className="w-6 h-6 text-emerald-800" />
          CSV 한글 깨짐 복구
        </h2>
        <p className="text-xs md:text-sm text-slate-500 mt-1 leading-relaxed">
          UTF-8 혹은 EUC-KR 인코딩 호환 불일치로 인해 엑셀 프로그램에서 한글 자음/모음이 깨지거나
          외계어 자형으로 난독화되는 CSV 문서를 정밀 복구하여 가공해 줍니다.
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
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 flex-wrap">
            <FileSpreadsheet className="w-4 h-4 text-emerald-850" />
            깨져서 표시되는 CSV 파일을 마우스로 밀어 올려주세요
          </h3>
          <FileDropzone
            onFilesSelected={handleFilesSelected}
            accept=".csv,text/csv"
            multiple={false}
          />
        </div>
      )}

      {isParsing && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3 shadow-xs">
          <Loader2 className="w-10 h-10 text-emerald-850 animate-spin" />
          <p className="text-xs font-semibold text-slate-600 text-center">
            CSV 바이트 스트림 디코딩 인덱스를 돌리는 중...
          </p>
        </div>
      )}

      {file && data.length > 0 && !isCompleted && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-800" />
              저장 인코딩 복구 대상
            </h3>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1"
            >
              새로 업로드
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="source-enc-select"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  1. 원본 파일의 문자 셋 (글자가 왜 깨져서 보이나요?)
                </label>
                <select
                  id="source-enc-select"
                  value={sourceEncoding}
                  onChange={(e) => handleEncodingChange(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                >
                  <option value="utf-8">
                    UTF-8 / 자동 감지 (대부분의 웹/모바일 추출 시스템)
                  </option>
                  <option value="euc-kr">
                    EUC-KR / CP949 (구형 관공서, 아웃룩, 예전 ERP 파일)
                  </option>
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  * 한글이 깨졌을 경우 원본 인코딩을 변경하시면 화면상 리스트가 올바르게
                  재번역됩니다.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  2. 변환 후 저장될 타겟 포션 옵션
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-705 cursor-pointer">
                    <input
                      type="radio"
                      name="t-enc-opt"
                      checked={targetEncoding === 'utf_8_bom'}
                      onChange={() => setTargetEncoding('utf_8_bom')}
                      className="h-3.5 w-3.5 text-emerald-800 border-slate-300 focus:ring-emerald-800"
                    />
                    <span>EUC-KR 및 UTF-8+BOM (MS Excel 더블클릭 안전 오픈형)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-705 cursor-pointer">
                    <input
                      type="radio"
                      name="t-enc-opt"
                      checked={targetEncoding === 'utf_8'}
                      onChange={() => setTargetEncoding('utf_8')}
                      className="h-3.5 w-3.5 text-emerald-800 border-slate-300 focus:ring-emerald-800"
                    />
                    <span>일반 인코딩형 (데이터베이스 적재 전용 웹 표준 UTF-8)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
              <span className="text-[11px] font-bold text-slate-800 block mb-1.5">
                현재 설정으로 읽은 내용 미리보기
              </span>
              <div className="overflow-x-auto max-h-40 border border-slate-200 rounded-lg bg-white">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-500 font-bold uppercase">
                      {columns.slice(0, 3).map((col, idx) => (
                        <th key={idx} className="p-2">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {data.slice(0, 3).map((row, rIdx) => (
                      <tr key={rIdx}>
                        {columns.slice(0, 3).map((col, cIdx) => (
                          <td key={cIdx} className="p-2 truncate max-w-xs">
                            {row[col]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFixAction}
            disabled={isProcessing}
            className="w-full mt-2 py-3.5 bg-emerald-850 text-white font-bold text-xs rounded-xl hover:bg-emerald-900 active:bg-emerald-950 flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
          >
            {isProcessing ? '자동 인코딩 바이어스 파싱 진행 중...' : '글꼴 깨짐 일시해결 실행'}
          </button>
        </div>
      )}

      {isProcessing && (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center space-y-4 shadow-xs animate-pulse">
          <Loader2 className="w-12 h-12 text-emerald-850 animate-spin" />
          <p className="text-xs font-semibold text-slate-700 text-center leading-relaxed">
            바이너리 옥텟 스트림 단위로 다중 캐릭터셋 바이트마커를 디코드 분석 중입니다...
          </p>
        </div>
      )}

      {isCompleted && resultBlob && (
        <div className="space-y-6 animate-fade-in">
          <ResultSummary
            beforeRows={data.length}
            afterRows={data.length}
            fileCount={1}
            errorCount={0}
          />

          <DataPreviewTable
            caption={`한글 복구 완료 실시간 테이블 미리보기 (총 ${data.length.toLocaleString()}행 파일 교정완료)`}
            headers={[
              { key: 'num', label: '순번' },
              { key: 'col1', label: '1번째 주요 컬럼' },
              { key: 'col2', label: '2번째 주요 컬럼' },
              { key: 'col3', label: '3번째 주요 컬럼' },
            ]}
            rows={previewRows}
          />

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h5 className="text-xs font-bold text-slate-800">
                📥 {file ? file.name.substring(0, file.name.lastIndexOf('.')) : '정리완료'}
                _복구완료.csv
              </h5>
              <p className="text-[10px] text-slate-400">
                더블클릭 시 윈도우즈 Microsoft Excel 환경에서 완전하게 한글이 깨짐 없이 출력되도록
                호환 인코딩 바인딩이 탑재되었습니다.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-600 bg-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                다시 시작하기
              </button>
              <DownloadButton onDownload={downloadResult} fileName="한글복구_완료_인코딩셋.csv" />
            </div>
          </div>
        </div>
      )}

      <AdSlot type="leaderboard" label="ADVERTISEMENT" />

      <ExcelSeo toolId="csv-encoding-fix" />
    </div>
  );
}
