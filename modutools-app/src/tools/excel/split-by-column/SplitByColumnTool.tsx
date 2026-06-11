import { useState, useEffect } from 'react';
import FileDropzone from '../../../components/excel/FileDropzone';
import PrivacyNotice from '../../../components/excel/PrivacyNotice';
import ResultSummary from '../../../components/excel/ResultSummary';
import DownloadButton from '../../../components/excel/DownloadButton';
import AdSlot from '../../../components/common/AdSlot';
import ExcelSeo from '../../../components/seo/ExcelSeo';
import {
  parseExcelFile,
  excelToBlob,
  multiSheetExcelToBlob,
} from '../../../lib/excel/excel';
import { parseCSVFile } from '../../../lib/excel/csv';
import { createZipArchive } from '../../../lib/zip';
import { downloadBlob } from '../../../lib/download';
import {
  splitDataByColumn,
  sanitizeFileName,
  type SplitGroup,
} from './splitByColumnUtils';
import {
  Copy,
  Sliders,
  FileSpreadsheet,
  FolderArchive,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

export default function SplitByColumnTool() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);

  const [targetColumn, setTargetColumn] = useState<string>('');
  const [outputStyle, setOutputStyle] = useState<'zip' | 'sheets'>('zip');
  const [emptyValueOption, setEmptyValueOption] = useState<'unclassified' | 'exclude'>(
    'unclassified',
  );
  const [fileNamePrefix, setFileNamePrefix] = useState<string>('');

  const [isParsing, setIsParsing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [splitGroups, setSplitGroups] = useState<SplitGroup[]>([]);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFileName, setResultFileName] = useState<string>('');
  const [stats, setStats] = useState({
    originalRows: 0,
    groupsCount: 0,
    largestGroup: { name: '-', count: 0 },
    emptyRowsCount: 0,
  });

  const handleFilesSelected = async (selected: File[]) => {
    if (selected.length === 0) return;
    const uploadedFile = selected[0];

    const extension = uploadedFile.name.split('.').pop()?.toLowerCase();
    if (extension !== 'xlsx' && extension !== 'xls' && extension !== 'csv') {
      setErrorMessage('XLSX 또는 CSV 파일만 업로드할 수 있습니다.');
      return;
    }

    setFile(uploadedFile);
    setIsParsing(true);
    setErrorMessage('');
    setIsCompleted(false);
    setResultBlob(null);

    const defaultPrefix =
      uploadedFile.name.substring(0, uploadedFile.name.lastIndexOf('.')) || '분할';
    setFileNamePrefix(defaultPrefix);

    try {
      let parsedData: any[] = [];
      if (extension === 'csv') {
        parsedData = await parseCSVFile(uploadedFile);
      } else {
        parsedData = await parseExcelFile(uploadedFile);
      }

      if (parsedData.length === 0) {
        setErrorMessage('처리할 데이터가 없습니다.');
        setIsParsing(false);
        return;
      }

      setData(parsedData);

      const firstRow = parsedData[0];
      const cols = Object.keys(firstRow).filter((k) => k !== '__rowNum__');
      setColumns(cols);

      if (cols.length > 0) {
        const defaultCol =
          cols.find(
            (c) =>
              c.includes('부서') ||
              c.includes('지점') ||
              c.includes('지역') ||
              c.includes('담당') ||
              c.includes('구분') ||
              c.includes('카테고리'),
          ) || cols[0];
        setTargetColumn(defaultCol);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('파일을 해석하는 데 실패했습니다. 올바른 포맷인지 확인해주세요.');
    } finally {
      setIsParsing(false);
    }
  };

  useEffect(() => {
    if (data.length === 0 || !targetColumn) {
      setSplitGroups([]);
      return;
    }

    const groups = splitDataByColumn(data, targetColumn, {
      emptyValueOption,
      prefix: fileNamePrefix,
    });

    setSplitGroups(groups);

    let maxGroup = { name: '-', count: 0 };
    let emptyCount = 0;

    groups.forEach((g) => {
      if (g.rows.length > maxGroup.count) {
        maxGroup = { name: g.key, count: g.rows.length };
      }
      if (g.key === '미분류') {
        emptyCount = g.rows.length;
      }
    });

    setStats({
      originalRows: data.length,
      groupsCount: groups.length,
      largestGroup: maxGroup,
      emptyRowsCount: emptyCount,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, targetColumn, emptyValueOption]);

  const handleSplitAction = async () => {
    if (data.length === 0) {
      setErrorMessage('처리할 데이터가 없습니다.');
      return;
    }
    if (!targetColumn) {
      setErrorMessage('나눌 기준 컬럼을 선택해주세요.');
      return;
    }
    if (splitGroups.length === 0) {
      setErrorMessage('그룹을 만들 수 없습니다.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (outputStyle === 'zip') {
        const filesToZip: { name: string; content: Blob }[] = [];

        splitGroups.forEach((group) => {
          const cleanGroupKey = sanitizeFileName(group.key);
          const safePrefix = sanitizeFileName(fileNamePrefix || '분할');
          const name = `${safePrefix}_${cleanGroupKey}.xlsx`;

          const excelBlob = excelToBlob(group.rows, group.key);
          filesToZip.push({ name, content: excelBlob });
        });

        const zipBlob = await createZipArchive(filesToZip);
        setResultBlob(zipBlob);

        const safeZipPrefix = sanitizeFileName(fileNamePrefix || '결과_분할');
        setResultFileName(`${safeZipPrefix}_일괄분할패키지.zip`);
      } else {
        const sheetMap: { [sheetName: string]: any[] } = {};

        splitGroups.forEach((group) => {
          sheetMap[group.key] = group.rows;
        });

        const unifiedBlob = multiSheetExcelToBlob(sheetMap);
        setResultBlob(unifiedBlob);

        const safePrefix = sanitizeFileName(fileNamePrefix || '결과_시트분할');
        setResultFileName(`${safePrefix}_통합시트분할.xlsx`);
      }

      setIsCompleted(true);
    } catch (err) {
      console.error(err);
      setErrorMessage('결과 파일을 생성하지 못했습니다. 브라우저 메모리가 부족할 수 있습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (resultBlob && resultFileName) {
      downloadBlob(resultBlob, resultFileName);
    }
  };

  const handleReset = () => {
    setFile(null);
    setData([]);
    setColumns([]);
    setSplitGroups([]);
    setResultBlob(null);
    setResultFileName('');
    setIsCompleted(false);
    setErrorMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Copy className="w-6 h-6 text-emerald-800" />
          컬럼 기준 파일 나누기
        </h2>
        <p className="text-xs md:text-sm text-slate-500 mt-1 leading-relaxed">
          대용량 고객명단, 회원주문서, 학적부 대장 등의 데이터 파일(XLSX, CSV)을
          담당자·지역·카테고리 등 원하는 매칭 컬럼 기준으로 완벽하게 분할하여 따로 포장해 줍니다.
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
            <FileSpreadsheet className="w-4 h-4 text-emerald-800" />
            분할 분석할 원본 엑셀 또는 CSV 파일을 선택하세요
          </h3>
          <FileDropzone onFilesSelected={handleFilesSelected} multiple={false} />
        </div>
      )}

      {isParsing && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3 shadow-xs">
          <RefreshCw className="w-10 h-10 text-emerald-800 animate-spin" />
          <p className="text-xs font-semibold text-slate-600 text-center">
            클라이언트 로컬 브라우저 내부에서 데이터 인덱스를 스캔하는 중...
          </p>
        </div>
      )}

      {file && data.length > 0 && !isCompleted && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-800" />
              파일 분할 정밀 설정
            </h3>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1"
            >
              새로 업로드
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="target-col-select"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                나눌 기준 컬럼(열) 이름 선택
              </label>
              <select
                id="target-col-select"
                value={targetColumn}
                onChange={(e) => setTargetColumn(e.target.value)}
                className="w-full text-xs font-medium px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:bg-white outline-none transition"
              >
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block leading-relaxed">
                * 로드된 엑셀문서 첫 번째 행의 머리글 인덱스 목록입니다. 선택 시 자동으로 분류가
                실시간 집계됩니다.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                파일 생성 및 추출 방식 선택
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div
                  onClick={() => setOutputStyle('zip')}
                  className={`p-4 border rounded-xl cursor-pointer transition flex items-start gap-3 ${
                    outputStyle === 'zip'
                      ? 'border-emerald-800 bg-emerald-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="output-style"
                    checked={outputStyle === 'zip'}
                    onChange={() => {}}
                    className="mt-1 h-3.5 w-3.5 text-emerald-800 border-slate-300 focus:ring-emerald-800"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      개별 파일들 생성 후 ZIP 다운로드
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5 leading-relaxed">
                      각 요소를 개별 .xlsx 파일로 분리하고, 이를 결합하여 하나의 압축폴더로 가볍게
                      출력하는 정석 포팅 방식입니다.
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setOutputStyle('sheets')}
                  className={`p-4 border rounded-xl cursor-pointer transition flex items-start gap-3 ${
                    outputStyle === 'sheets'
                      ? 'border-emerald-800 bg-emerald-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="output-style"
                    checked={outputStyle === 'sheets'}
                    onChange={() => {}}
                    className="mt-1 h-3.5 w-3.5 text-emerald-800 border-slate-300 focus:ring-emerald-800"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      단일 파일 내 시트(Sheet)로 분할
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5 leading-relaxed">
                      별도의 여러 파일이 아니라 하나의 마스터 엑셀 문서 내에서 탭(시트)으로 분류별로
                      깔끔하게 가지런히 찢어줍니다.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="prefix-input"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  출력 파일명 접두어 (Prefix)
                </label>
                <input
                  id="prefix-input"
                  type="text"
                  value={fileNamePrefix}
                  onChange={(e) => setFileNamePrefix(e.target.value)}
                  placeholder="예: 고객명단"
                  className="w-full text-xs font-medium px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:bg-white outline-none transition"
                />
              </div>

              <div>
                <label
                  htmlFor="empty-opt-select"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  기준 열이 빈칸(Empty)일 때 처리 방식
                </label>
                <select
                  id="empty-opt-select"
                  value={emptyValueOption}
                  onChange={(e) =>
                    setEmptyValueOption(e.target.value as 'unclassified' | 'exclude')
                  }
                  className="w-full text-xs font-medium px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-800 focus:bg-white outline-none transition"
                >
                  <option value="unclassified">“미분류” 그룹으로 묶어서 가공</option>
                  <option value="exclude">해당 빈값 행들은 분할물에서 전면 제외(필터링)</option>
                </select>
              </div>
            </div>
          </div>

          {splitGroups.length > 0 && (
            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3.5">
              <h4 className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>
                  실시간 분할 수량 분석 ({splitGroups.length}개 유일 분류 감지됨)
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  최상위 8개 정렬 미리보기
                </span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {splitGroups.slice(0, 8).map((grp, index) => (
                  <div
                    key={index}
                    className="bg-white border border-slate-200/60 p-2.5 rounded-lg text-center shadow-2xs"
                  >
                    <span
                      className="block text-[11px] font-bold text-slate-800 truncate"
                      title={grp.key}
                    >
                      {grp.key || '빈값'}
                    </span>
                    <span className="text-[10px] text-emerald-850 font-bold mt-1 block">
                      {grp.rows.length.toLocaleString()}행 (
                      {((grp.rows.length / data.length) * 100).toFixed(1)}%)
                    </span>
                  </div>
                ))}
                {splitGroups.length > 8 && (
                  <div className="bg-slate-100 border border-dashed border-slate-200 p-2.5 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-500">
                    그 외 {splitGroups.length - 8}개 더 있음
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleSplitAction}
            disabled={isProcessing}
            className="w-full mt-2 py-3.5 bg-emerald-850 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Copy className="w-4 h-4" />
            {isProcessing
              ? '고유 서브데이터 추출 및 시트 버퍼 작성 중...'
              : `${splitGroups.length}개 그룹으로 파일 나누기 파일 실행`}
          </button>
        </div>
      )}

      {isProcessing && (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center space-y-4 shadow-xs">
          <div className="w-12 h-12 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-700 text-center leading-relaxed">
            바이너리 메모리아키텍처로 XLSX 문서를 요소별로 압축 인덱싱 중입니다.
            <br />이 가공은 외부 서버를 거치지 않고 오직 사용자의 브라우저 단에서 안전하게
            처리됩니다.
          </p>
        </div>
      )}

      {isCompleted && resultBlob && (
        <div className="space-y-6">
          <div className="bg-emerald-50/50 border border-emerald-100/90 rounded-2xl p-5 flex items-start gap-4 shadow-xs animate-fade-in">
            <FolderArchive className="w-8 h-8 text-emerald-800 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-emerald-950">인코딩 분할 저장 가공 완료</h4>
              <p className="text-xs text-emerald-850 leading-relaxed font-medium">
                우측 기준 분류 <strong>[{targetColumn}]</strong>에서 최종{' '}
                <strong>{splitGroups.length}</strong>개의 고유 요소를 추출하여 안전하게
                쪼갰습니다.
                <br />
                아래에서 각각의 디코딩된 요약 통계지 수치를 확인한 다음 원하시는 기기에 가볍게
                내려받아 사용하세요.
              </p>
            </div>
          </div>

          <ResultSummary
            beforeRows={stats.originalRows}
            afterRows={
              stats.originalRows -
              (emptyValueOption === 'exclude' ? stats.emptyRowsCount : 0)
            }
            fileCount={outputStyle === 'zip' ? splitGroups.length : 1}
            errorCount={0}
          />

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2.5">
              분할 상세 구성 목록 (구분기준: {targetColumn})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                  원본 전체 데이터
                </span>
                <span className="text-base font-bold text-slate-800 mt-1 block">
                  {stats.originalRows.toLocaleString()}개 행
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                  생성될 분류 그룹수
                </span>
                <span className="text-base font-bold text-slate-800 mt-1 block">
                  {stats.groupsCount.toLocaleString()}개
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                  가장 규모가 큰 분류
                </span>
                <span
                  className="text-xs font-bold text-slate-800 mt-1 block truncate"
                  title={stats.largestGroup.name}
                >
                  {stats.largestGroup.name} ({stats.largestGroup.count.toLocaleString()}행)
                </span>
              </div>
            </div>

            <div className="overflow-x-auto max-h-72 border border-slate-100 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 text-[10px] tracking-wider uppercase font-bold">
                    <th className="p-3 pl-4">순번</th>
                    <th className="p-3">분류 고유값 및 매칭 명칭</th>
                    <th className="p-3">수집된 레코드 행 수</th>
                    <th className="p-3">출력 포맷 형태</th>
                    <th className="p-3 pr-4 text-right">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {splitGroups.map((g, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-3 pl-4 text-slate-400 font-normal">{idx + 1}</td>
                      <td className="p-3 text-slate-800 font-bold truncate max-w-xs">{g.key}</td>
                      <td className="p-3 text-emerald-850 font-bold">
                        {g.rows.length.toLocaleString()}행
                      </td>
                      <td className="p-3 text-slate-400 text-[10px]">
                        {outputStyle === 'zip' ? 'XLSX 독립 파일' : '시트(Sheet) 분할 통합'}
                      </td>
                      <td className="p-3 pr-4 text-right text-slate-400 text-[10px]">📦 완성됨</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h5 className="text-xs font-bold text-slate-800 truncate max-w-md">
                📥 {resultFileName}
              </h5>
              <p className="text-[10px] text-slate-400">
                개인정보 보호규정에 입각해 파일은 브라우저에서 다운 시 즉각 휘발 폐기됩니다.
              </p>
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-600 bg-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                새로 만들기
              </button>
              <DownloadButton onDownload={handleDownload} fileName={resultFileName} />
            </div>
          </div>
        </div>
      )}

      <AdSlot type="leaderboard" label="ADVERTISEMENT" />

      <ExcelSeo toolId="split-by-column" />
    </div>
  );
}
