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
import { Phone, Sliders, Smartphone, AlertCircle, RefreshCw } from 'lucide-react';

interface PhoneCleanRow {
  num: number;
  name: string;
  org_phone: string;
  new_phone: string;
  status: string;
}

export default function PhoneCleanerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [phoneColumn, setPhoneColumn] = useState('');
  const [nameColumn, setNameColumn] = useState('');
  const [formatStyle, setFormatStyle] = useState<'hyphen' | 'compact'>('hyphen');

  const [isParsing, setIsParsing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [, setCleanedData] = useState<any[]>([]);
  const [previewRows, setPreviewRows] = useState<PhoneCleanRow[]>([]);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const [stats, setStats] = useState({
    total: 0,
    corrected: 0,
    errors: 0,
  });

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
        const pCol =
          cols.find(
            (c) =>
              c.includes('전화') ||
              c.includes('연락') ||
              c.includes('휴대폰') ||
              c.includes('핸드폰') ||
              c.toLowerCase().includes('phone') ||
              c.toLowerCase().includes('tel'),
          ) || cols[0];
        setPhoneColumn(pCol);

        const nCol =
          cols.find(
            (c) =>
              c.includes('이름') ||
              c.includes('성함') ||
              c.includes('고객명') ||
              c.toLowerCase().includes('name'),
          ) || cols[0];
        setNameColumn(nCol);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('파일을 해석하는 중 에러가 발생했습니다.');
    } finally {
      setIsParsing(false);
    }
  };

  const cleanPhoneNumber = (
    raw: string,
    style: 'hyphen' | 'compact',
  ): { cleaned: string; isCorrected: boolean; isError: boolean } => {
    if (!raw) return { cleaned: '', isCorrected: false, isError: false };

    const original = raw;
    let digits = raw.replace(/[^0-9+]/g, '');

    if (digits.startsWith('+82')) {
      digits = '0' + digits.substring(3);
    } else if (digits.startsWith('82') && digits.length > 10) {
      digits = '0' + digits.substring(2);
    }

    digits = digits.replace(/[^0-9]/g, '');

    if (digits.length < 8 || digits.length > 12) {
      return { cleaned: raw + ' (길이이상)', isCorrected: false, isError: true };
    }

    if (style === 'compact') {
      const isCorrected = digits !== original;
      return { cleaned: digits, isCorrected, isError: false };
    }

    let formatted = '';
    if (digits.startsWith('02')) {
      if (digits.length === 9) {
        formatted = `${digits.substring(0, 2)}-${digits.substring(2, 5)}-${digits.substring(5)}`;
      } else if (digits.length === 10) {
        formatted = `${digits.substring(0, 2)}-${digits.substring(2, 6)}-${digits.substring(6)}`;
      } else {
        return { cleaned: digits + ' (확인필요)', isCorrected: false, isError: true };
      }
    } else {
      if (digits.length === 10) {
        formatted = `${digits.substring(0, 3)}-${digits.substring(3, 6)}-${digits.substring(6)}`;
      } else if (digits.length === 11) {
        formatted = `${digits.substring(0, 3)}-${digits.substring(3, 7)}-${digits.substring(7)}`;
      } else {
        return { cleaned: digits + ' (확인필요)', isCorrected: false, isError: true };
      }
    }

    return {
      cleaned: formatted,
      isCorrected: formatted !== original,
      isError: false,
    };
  };

  const handleCleanAction = async () => {
    if (data.length === 0 || !phoneColumn) return;
    setIsProcessing(true);
    setErrorMessage('');

    try {
      await new Promise((r) => setTimeout(r, 600));

      let corrCount = 0;
      let errCount = 0;

      const cleaned = data.map((row) => {
        const rawPhone = String(row[phoneColumn] || '').trim();
        const { cleaned: phoneOut, isCorrected, isError } = cleanPhoneNumber(
          rawPhone,
          formatStyle,
        );

        if (isCorrected) corrCount++;
        if (isError) errCount++;

        return {
          ...row,
          [phoneColumn]: phoneOut,
        };
      });

      setCleanedData(cleaned);

      const pRows: PhoneCleanRow[] = data.slice(0, 10).map((row, idx) => {
        const nameVal = row[nameColumn] ? String(row[nameColumn]) : '고객_' + (idx + 1);
        const rawPhone = String(row[phoneColumn] || '');
        const { cleaned: phoneOut, isError } = cleanPhoneNumber(rawPhone, formatStyle);

        let statText = '✅ 표준유지';
        if (isError) {
          statText = '⚠️ 체크필요';
        } else if (phoneOut !== rawPhone) {
          statText = '✅ 자동교정';
        }

        return {
          num: idx + 1,
          name: nameVal,
          org_phone: rawPhone,
          new_phone: phoneOut,
          status: statText,
        };
      });

      setPreviewRows(pRows);

      setStats({
        total: data.length,
        corrected: corrCount,
        errors: errCount,
      });

      const blob = excelToBlob(cleaned, '연락처정리');
      setResultBlob(blob);
      setIsCompleted(true);
    } catch (err) {
      console.error(err);
      setErrorMessage('보정을 처리하는 데 실패했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (resultBlob && file) {
      const origName = file.name.substring(0, file.name.lastIndexOf('.'));
      downloadBlob(resultBlob, `${origName}_연락처정리_완료.xlsx`);
    }
  };

  const handleReset = () => {
    setFile(null);
    setData([]);
    setColumns([]);
    setCleanedData([]);
    setPreviewRows([]);
    setResultBlob(null);
    setIsCompleted(false);
    setErrorMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Phone className="w-6 h-6 text-emerald-800" />
          전화번호 형식 통일
        </h2>
        <p className="text-xs md:text-sm text-slate-500 mt-1 leading-relaxed">
          여백, 특수기호, 앞자리 국제번호 (+82) 등이 제각각 섞인 휴대폰 연락처를 일정한 규칙 한
          가지 형태로 자동 보정합니다.
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
            <Smartphone className="w-4 h-4 text-emerald-800" />
            정리정돈할 연락처 파일(XLSX/CSV)을 올려주세요
          </h3>
          <FileDropzone onFilesSelected={handleFilesSelected} multiple={false} />
        </div>
      )}

      {isParsing && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3 shadow-xs">
          <RefreshCw className="w-10 h-10 text-emerald-800 animate-spin" />
          <p className="text-xs font-semibold text-slate-600 text-center">
            연락처 데이터 인프라 스캔 및 로컬 로딩 중...
          </p>
        </div>
      )}

      {file && data.length > 0 && !isCompleted && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-800" />
              원하는 표시 양식 정의 및 타겟 열 지정
            </h3>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1"
            >
              새로 지정
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="phone-col-select"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                전화번호 열 선택
              </label>
              <select
                id="phone-col-select"
                value={phoneColumn}
                onChange={(e) => setPhoneColumn(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
              >
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="name-col-select"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                이름 열 선택 (선택 사항)
              </label>
              <select
                id="name-col-select"
                value={nameColumn}
                onChange={(e) => setNameColumn(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
              >
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div
              onClick={() => setFormatStyle('hyphen')}
              className={`p-4 border rounded-xl cursor-pointer transition flex items-start gap-3 ${
                formatStyle === 'hyphen'
                  ? 'border-emerald-800 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                checked={formatStyle === 'hyphen'}
                onChange={() => {}}
                className="mt-1 h-3.5 w-3.5 text-emerald-800 border-slate-300 focus:ring-emerald-800"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">하이픈 포함 포맷</span>
                <span className="text-[10px] text-emerald-850 font-mono mt-1 block font-bold text-slate-900">
                  010-1234-5678
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  문자 발송 폼, 일반 인쇄 업무 시 표준형
                </span>
              </div>
            </div>

            <div
              onClick={() => setFormatStyle('compact')}
              className={`p-4 border rounded-xl cursor-pointer transition flex items-start gap-3 ${
                formatStyle === 'compact'
                  ? 'border-emerald-800 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                checked={formatStyle === 'compact'}
                onChange={() => {}}
                className="mt-1 h-3.5 w-3.5 text-emerald-800 border-slate-300 focus:ring-emerald-800"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  숫자만 남기기 (컴팩트)
                </span>
                <span className="text-[10px] text-emerald-850 font-mono mt-1 block font-bold text-slate-900">
                  01012345678
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  시스템 일괄 등록 및 API 데이터 전송 전용
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCleanAction}
            disabled={isProcessing}
            className="w-full mt-2 py-3 bg-emerald-850 text-white font-bold text-xs rounded-xl hover:bg-emerald-900 active:bg-emerald-950 flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
          >
            {isProcessing ? '정밀 정재 정렬을 계산 중입니다...' : '전화번호 일관 수정 시작!'}
          </button>
        </div>
      )}

      {isProcessing && (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center space-y-4 shadow-xs animate-pulse">
          <div className="w-12 h-12 border-4 border-emerald-850 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-700 text-center leading-relaxed">
            정규식 패키지를 적용하여 비정상 휴대전화 숫자의 유효성을 심사 중입니다...
          </p>
        </div>
      )}

      {isCompleted && resultBlob && (
        <div className="space-y-6 animate-fade-in">
          <ResultSummary
            beforeRows={stats.total}
            afterRows={stats.total - stats.errors}
            fileCount={1}
            errorCount={stats.errors}
          />

          <DataPreviewTable
            caption={`전화번호 정재 결과 보기 (상위 10개 행 미리보기 / 총 ${stats.total.toLocaleString()}행)`}
            headers={[
              { key: 'num', label: '순번' },
              { key: 'name', label: '이름' },
              { key: 'org_phone', label: '수정 전 연락처 (원본)' },
              { key: 'new_phone', label: '수정 후 일괄 정리' },
              { key: 'status', label: '처리상태' },
            ]}
            rows={previewRows}
          />

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h5 className="text-xs font-bold text-slate-800">
                📥 {file ? file.name.substring(0, file.name.lastIndexOf('.')) : '정리완료'}
                _연락처정리_완료.xlsx
              </h5>
              <p className="text-[10px] text-slate-400">
                정리된 총 {stats.corrected.toLocaleString()}개 행의 자릿수 및 포맷이 표준화되었습니다.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-600 bg-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                다시 시작하기
              </button>
              <DownloadButton onDownload={downloadResult} fileName="전화번호정리_연락처셋.xlsx" />
            </div>
          </div>
        </div>
      )}

      <AdSlot type="leaderboard" label="ADVERTISEMENT" />

      <ExcelSeo toolId="phone-cleaner" />
    </div>
  );
}
