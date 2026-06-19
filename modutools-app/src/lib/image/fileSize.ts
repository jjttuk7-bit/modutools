export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const unit = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(unit)), sizes.length - 1);
  const value = bytes / Math.pow(unit, index);

  return `${parseFloat(value.toFixed(2))} ${sizes[index]}`;
}

export function parseTargetSizeToBytes(value: number, unit: 'KB' | 'MB'): number {
  return value * (unit === 'MB' ? 1024 * 1024 : 1024);
}

export function calculateReductionRate(originalBytes: number, resultBytes: number): number {
  if (originalBytes <= 0) return 0;

  const reduction = ((originalBytes - resultBytes) / originalBytes) * 100;
  return Math.max(0, parseFloat(reduction.toFixed(1)));
}
