import type { CanvasPreset } from '../../../types/canvas';

export const storeMainImagePresets: CanvasPreset[] = [
  {
    id: 'store-square',
    label: '기본 정사각형 (1000x1000)',
    width: 1000,
    height: 1000,
    description: '스마트스토어, 쿠팡 등 대표 권장 상품 이미지 (1:1)',
  },
  {
    id: 'store-wide',
    label: '와이드 홍보배너 (1200x900)',
    width: 1200,
    height: 900,
    description: '상세페이지 최상단 공지 및 행사 요약용 와이드형 (4:3)',
  },
  {
    id: 'store-vertical',
    label: '네이버 세로형 (1000x1250)',
    width: 1000,
    height: 1250,
    description: '모바일 패션/뷰티 카테고리 최적화 세로 비율 상품 이미지 (4:5)',
  },
];
