import type { CanvasPreset } from '../../../types/canvas';

export const textOnImagePresets: CanvasPreset[] = [
  {
    id: 'text-original',
    label: '원본 비율 유지',
    width: 1200,
    height: 800,
    description: '업로드한 이미지 고유 해상도 비율 그대로 투명 텍스트 합성',
  },
  {
    id: 'text-square',
    label: '정사각형 (1080x1080)',
    width: 1080,
    height: 1080,
    description: '인스타 피드 및 블로그 일상 카드뉴스 비율 (1:1)',
  },
  {
    id: 'text-wide',
    label: '와이드형 (1200x630)',
    width: 1200,
    height: 630,
    description: 'SNS 홍보 카드, 페이스북, 블로그 와이드 타이틀 정보성 배너 (19:10)',
  },
  {
    id: 'text-youtube',
    label: '유튜브 썸네일 (1280x720)',
    width: 1280,
    height: 720,
    description: '16:9 규격 유튜브 비디오 인트로 배너 비율',
  },
  {
    id: 'text-vertical',
    label: '인스타 세로 피드 (1080x1350)',
    width: 1080,
    height: 1350,
    description: '모바일 화면 비중을 최대로 높인 세로형 광고 비율 (4:5)',
  },
];
