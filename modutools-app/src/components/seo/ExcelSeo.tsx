import {
  Copy,
  PlusCircle,
  CheckCircle,
  FileSpreadsheet,
  RefreshCw,
  LayoutGrid,
} from 'lucide-react';

interface ExcelSeoProps {
  toolId?: string;
}

export default function ExcelSeo({ toolId }: ExcelSeoProps) {
  return (
    <article className="mt-12 border-t border-slate-100 pt-10 text-slate-700 bg-slate-50/50 -mx-4 px-4 md:-mx-8 md:px-8 py-10 rounded-2xl">
      <div className="max-w-4xl mx-auto space-y-8">
        {!toolId ? (
          <>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6 text-emerald-800" />
                왜 대다수의 직장인은 ‘엑셀 정리 도구’를 찾을까요?
              </h2>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed space-y-3">
                매일 반복되는 업무 속에서 우리는 수많은 엑셀 파일과 CSV 데이터를 마주합니다. 여러
                사람에게서 취합한 주소록의 전화번호 형식이 제각각이거나, 중복 발송을 막고자 지워야
                하는 이메일 리스트, 웹사이트에서 내려받으면 외계어처럼 깨져서 열리는 CSV 한글
                파일까지.
                <br className="hidden md:inline" />
                기존에는 복잡한 수식을 외우거나 VBA 매크로를 작성해야만 처리가 가능했던 까다로운
                데이터 정재 작업을 클릭 몇 번으로 끝낼 수 있습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-700" />
                  대표적인 엑셀 업무 병목 해소
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  쇼핑몰 정산, 고객 마케팅 문자 발송, 학원 출석부 관리, 공공기관 보고서 취합 등
                  실무에서 가장 빈번하게 발생하는 "노가다성" 수작업을 자동화해 줍니다. 단순한 대용량
                  정리도 몇 초 내에 처리 가능합니다.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-700" />
                  중요한 개인정보 보호 및 완벽보안
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  고객 DB나 기업 내부 매출 정보가 포함된 파일을 외부 클라우드 서버에 전송하고 계셨나요?
                  엑셀 정리 도구는 파일이 서버로 일절 업로드되지 않으며 오직 사용자의 브라우저
                  성능만을 이용해 로컬 환경에서 처리합니다.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {toolId === 'merge-excel' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-800" />
                  여러 개의 엑셀 파일을 하나로 손쉽게 결합하는 노하우
                </h2>
                <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
                  <p>
                    <strong>엑셀 파일 합치기</strong> 기능은 여러 조각으로 나뉘어 있는 매출 자료,
                    부서별 점검표, 대리점 보고서, 혹은 다양한 양식의 CSV/XLSX 원본 파일들을 하나의
                    대형 마스터 파일로 통일시켜 줍니다.
                  </p>
                  <p className="bg-emerald-50 text-emerald-800 p-3.5 rounded-lg text-xs leading-relaxed border border-emerald-100">
                    💡 <strong>실무 팁:</strong> 결합할 때 모든 파일의 헤더(열 이름)가 완전히 일치하지
                    않아도 동일한 이름을 가진 열을 자동으로 찾아 안전하게 병합해 줍니다. 엑셀을
                    켜놓고 Ctrl+C, Ctrl+V를 수백 번씩 눌러 발생했던 실수를 원천 차단해 보세요.
                  </p>
                </div>
              </div>
            )}

            {toolId === 'remove-duplicates' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-800" />
                  중복 명단 및 데이터 중복 행 제거의 핵심 규칙
                </h2>
                <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
                  <p>
                    마케팅 뉴스레터를 단체 발송하기 전에 이메일 주소가 중복되어 있거나, 사내 경품
                    지급 대상자 명단에서 여러 번 기재된 인원을 발라내는 작업은 비용 낭비와
                    컴플레인을 막기 위한 핵심적인 단계입니다.
                  </p>
                  <p>
                    본 도구를 활용하면 <b>특정 기준 컬럼</b>(예: '연락처' 또는 '이메일') 혹은{' '}
                    <b>전체 컬럼이 완벽히 일치하는 행</b>을 골라내어 중복을 마우스 클릭 한 번으로
                    제거하고, 정제된 유일 데이터만을 가볍게 내려받을 수 있습니다.
                  </p>
                </div>
              </div>
            )}

            {toolId === 'phone-cleaner' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-emerald-800" />
                  SMS 시스템 등록을 위한 휴대전화번호 포맷 표준화
                </h2>
                <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
                  <p>
                    누군가는{' '}
                    <code className="text-xs bg-slate-100 p-1 rounded">010-1234-5678</code>, 다른
                    누군가는{' '}
                    <code className="text-xs bg-slate-100 p-1 rounded">01012345678</code>, 외국계
                    직원은{' '}
                    <code className="text-xs bg-slate-100 p-1 rounded">+82-10-1234-5678</code>로
                    번호를 입력합니다. 이대로 단체 문자 발송 솔루션에 연동하면 등록 실패나 발송
                    에러가 빈발합니다.
                  </p>
                  <p>
                    <strong>전화번호 형식 통일</strong> 도구는 공백 제거, 하이픈 정렬, 비정상 전화번호
                    행 탐지 등을 수행하여 원 클릭으로 표준 한국식 휴대전화 포맷(010-XXXX-XXXX 또는
                    하이픈 없는 형태)으로 자동 정제해 드립니다.
                  </p>
                </div>
              </div>
            )}

            {toolId === 'csv-encoding-fix' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-emerald-800" />
                  엑셀에서 한글이 '꿹뛡' 처럼 깨져서 열리는 원인과 해결법
                </h2>
                <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
                  <p>
                    한국의 엑셀 환경은 주로 <strong>CP949/EUC-KR</strong> 완성형 인코딩을 기본으로
                    사용하는 반면, 현대의 많은 웹 시스템이나 모바일 백엔드에서 생성하는 CSV 파일은
                    전세계 표준인 <strong>UTF-8</strong>으로 인코딩됩니다. 이 두 차이로 인해 엑셀에서
                    바로 파일을 열 때 원치 않는 한국어 깨짐 현상이 생깁니다.
                  </p>
                  <p>
                    이 깨진 한글 CSV 도구를 사용하면 파일을 업로드하자마자 인코딩 유형을 알아채어
                    엑셀이 좋아하는 Microsoft 한국어 표준 인코딩으로 깨끗이 디코딩 및 보정해 드립니다.
                  </p>
                </div>
              </div>
            )}

            {toolId === 'split-by-column' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Copy className="w-5 h-5 text-emerald-800" />
                  지사용/담당자별 데이터 컬럼 기준 파일 일괄 분할 관리
                </h2>
                <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
                  <p>
                    만약 수천 명의 전국 고객 목록을 '지역' 또는 '담당 지점장' 기준으로 찢어서 각각의
                    사람들에게 별도 파일로 전송해야 한다면 필터링을 걸고, 복사하고, 새 파일로 저장하는
                    귀찮은 과정을 반복해야만 합니다.
                  </p>
                  <p>
                    지정해주신 특정 '컬럼'(열)의 분류 값을 기준으로 데이터를 완벽히 쪼개며, 각각의
                    쪼개진 결과는 개별 엑셀 파일 이름으로 자동 포장되어 하나의{' '}
                    <strong>ZIP 압축파일</strong>로 한 번에 다운로드해 보관 또는 전달할 수 있습니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
