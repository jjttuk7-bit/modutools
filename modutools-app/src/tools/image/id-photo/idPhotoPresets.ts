export interface IdPhotoPreset {
  id: string;
  label: string;
  width: number;
  height: number;
  note: string;
}

export const idPhotoPresets: IdPhotoPreset[] = [
  { id: 'resume-3x4', label: '이력서 3x4', width: 354, height: 472, note: '3:4 비율 제출용' },
  { id: 'passport-35x45', label: '여권/면허 3.5x4.5', width: 413, height: 531, note: '3.5x4.5cm 비율' },
  { id: 'square-600', label: '온라인 접수 정사각형', width: 600, height: 600, note: '600x600 px' },
  { id: 'student-400x500', label: '학생증/자격증', width: 400, height: 500, note: '400x500 px' },
];
