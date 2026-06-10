import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../lib/theme';

const labelMap = {
  light: '라이트 모드',
  dark: '다크 모드',
  system: '시스템 설정 따름',
} as const;

const nextLabelMap = {
  light: '다크',
  dark: '시스템',
  system: '라이트',
} as const;

export const ThemeToggle: React.FC = () => {
  const { theme, cycleTheme } = useTheme();

  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={`현재 ${labelMap[theme]}. 클릭하면 ${nextLabelMap[theme]} 모드로 전환`}
      title={`${labelMap[theme]} (클릭: ${nextLabelMap[theme]})`}
      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <Icon className="w-4 h-4" />
    </button>
  );
};

export default ThemeToggle;
