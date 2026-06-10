import type { CanvasPreset } from '../../../types/canvas';

export const blogCoverPresets: CanvasPreset[] = [
  {
    id: 'blog-wide',
    label: '블로그 와이드 (1200x630)',
    width: 1200,
    height: 630,
    description: 'SNS 공유 이미지 및 와이드형 대표이미지에 최적화',
  },
  {
    id: 'blog-square',
    label: '블로그 정사각형 (1080x1080)',
    width: 1080,
    height: 1080,
    description: '모바일 뷰 카드형 대표이미지 및 인스타 겸용 최적화',
  },
  {
    id: 'blog-vertical',
    label: '블로그 세로형 (800x1000)',
    width: 800,
    height: 1000,
    description: '모바일 중심 인포그래픽형 또는 세로형 대표이미지에 최적화',
  },
];
