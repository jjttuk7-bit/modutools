export function escapeWifiString(val: string): string {
  if (!val) return '';
  return val.replace(/([\\;,:"])/g, '\\$1');
}

export function generateWifiString(
  ssid: string,
  password?: string,
  encryption: string = 'WPA',
  isHidden: boolean = false,
): string {
  const escapedSsid = escapeWifiString(ssid);
  let wifiStr = `WIFI:S:${escapedSsid};`;

  if (encryption === 'nopass') {
    wifiStr += `T:nopass;`;
  } else {
    const escapedPassword = password ? escapeWifiString(password) : '';
    wifiStr += `T:${encryption};P:${escapedPassword};`;
  }

  if (isHidden) {
    wifiStr += `H:true;`;
  }

  wifiStr += ';';
  return wifiStr;
}

export interface WifiValidationResult {
  isValid: boolean;
  error: string | null;
}

export function validateWifiInput(
  ssid: string,
  password?: string,
  encryption: string = 'WPA',
): WifiValidationResult {
  if (!ssid || !ssid.trim()) {
    return { isValid: false, error: 'Wi-Fi 이름을 입력해주세요.' };
  }

  if (encryption !== 'nopass' && (!password || !password.trim())) {
    return {
      isValid: false,
      error: '암호화 방식이 없음이 아닌 경우 비밀번호를 입력해주세요.',
    };
  }

  return { isValid: true, error: null };
}
