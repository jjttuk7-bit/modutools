export function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateWifi(ssid: string): string | null {
  if (!ssid.trim()) {
    return 'Wi-Fi 이름을 입력해주세요.';
  }
  return null;
}
