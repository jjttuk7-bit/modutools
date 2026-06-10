import type { CanvasPreset } from '../../../types/canvas';

export const instagramImagePresets: CanvasPreset[] = [
  {
    id: 'insta-square',
    label: '인스타 정사각형 (1080x1080)',
    width: 1080,
    height: 1080,
    description: '인스타그램 표준 정방형 피드 게시물 (1:1)',
  },
  {
    id: 'insta-vertical',
    label: '인스타 세로 피드 (1080x1350)',
    width: 1080,
    height: 1350,
    description: '스마트폰 화면을 꽉 채우는 세로형 피드 게시물 (4:5)',
  },
  {
    id: 'insta-story',
    label: '인스타 스토리/릴스 (1080x1920)',
    width: 1080,
    height: 1920,
    description: '전체 화면 스토리 및 릴스 동영상 커버 규격 (9:16)',
  },
];
