import React from 'react';
import { Shield, UserX, Image as ImageIcon, HelpCircle, Palette } from 'lucide-react';

const benefits = [
  {
    icon: UserX,
    title: '회원가입 없이 즉시 사용',
    desc: '귀찮은 아이디/비번 찾기나 가입 대기 없이 즉석에서 1초 만에 바로 쓸 수 있습니다.',
  },
  {
    icon: Shield,
    title: '서버 저장 없이 브라우저 처리',
    desc: '입력된 개인 주소록 비밀번호 등은 서버로 전혀 전송되지 않아 안심하고 만드셔도 됩니다.',
  },
  {
    icon: ImageIcon,
    title: 'PNG / SVG 무제한 내려받기',
    desc: '웹 및 인쇄 매체 모두 대응 가능한 고화질 파일 형식을 제한 없이 무료 제공합니다.',
  },
  {
    icon: HelpCircle,
    title: '자영업자와 실무자 필수 도구',
    desc: '개인 명함부터 매장 와이파이 배너 수립까지 자주 쓰이는 알짜 도구들을 수록했습니다.',
  },
];

const flows = [
  { title: '흐름 A (스마트 홍보)', steps: ['URL QR 만들기', 'QR 꾸미기', 'PNG 다운로드'] },
  {
    title: '흐름 B (매장 관리)',
    steps: ['와이파이 QR 만들기', '매장 안내문에 삽입 및 인쇄'],
  },
  {
    title: '흐름 C (디지털 비즈니스)',
    steps: ['명함 QR 만들기', '포스터/프로필 명함에 통합'],
  },
  {
    title: '흐름 D (신속 데이터화)',
    steps: ['QR 이미지 읽기', '추출 링크 복사', '새로운 QR 만들기'],
  },
];

export const QrHomeContent: React.FC = () => {
  return (
    <div className="space-y-10 mt-10">
      <section
        className="text-left bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-6 md:p-10 shadow-lg relative overflow-hidden"
        id="qr-home-hero"
      >
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <Palette size={300} />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="bg-emerald-500 text-xs font-bold uppercase py-1 px-2.5 rounded-full tracking-wider whitespace-nowrap">
            100% SECURE & LOCAL PROCESS
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            가입 없이 바로 쓰는 안전한 무제한 <br className="sm:hidden" /> QR도구함
          </h2>
          <p className="text-emerald-100 text-xs md:text-sm leading-relaxed font-light">
            매장 Wi-Fi 접속, 모바일 스마트 영접, 비즈니스 디지털명함 축약 등{' '}
            <br className="hidden md:inline" />
            현업에 최우선적으로 필요한 5종의 필수 QR 기능을 수수료 및 가입 유도 없이
            깔끔하게 대접합니다.
          </p>
        </div>
      </section>

      <section
        className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 text-left space-y-6"
        id="qr-home-why-us"
      >
        <div>
          <h3 className="text-lg font-bold text-slate-950">왜 QR도구함인가?</h3>
          <p className="text-xs text-slate-400 mt-1">
            수많은 사이트 중 오직 저희만이 선사하는 타협 없는 원칙입니다.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="flex gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-200"
              >
                <div className="p-3 bg-slate-100 text-slate-700 rounded-xl shrink-0 h-11 w-11 flex items-center justify-center">
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{b.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section
        className="bg-slate-100/60 border border-slate-200 rounded-3xl p-6 md:p-8 text-left space-y-6"
        id="qr-home-workflows"
      >
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            실무에서 자주 쓰이는 QR 생성 흐름
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            다른 사용자들은 이와 같은 구조로 영리하게 비즈니스를 수행하고 계십니다.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {flows.map((flow, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
                {flow.title}
              </h4>
              <ol className="space-y-2 text-xs text-slate-600">
                {flow.steps.map((step, sIdx) => (
                  <li
                    key={sIdx}
                    className="flex items-center space-x-1.5 font-medium"
                  >
                    <span className="w-5 h-5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-full flex items-center justify-center font-mono shrink-0">
                      {sIdx + 1}
                    </span>
                    <span className="truncate">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default QrHomeContent;
