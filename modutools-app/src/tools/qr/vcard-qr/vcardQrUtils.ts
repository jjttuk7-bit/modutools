export interface VcardInputs {
  name: string;
  org?: string;
  title?: string;
  phone?: string;
  email?: string;
  url?: string;
  address?: string;
  note?: string;
}

export interface VcardValidationResult {
  isValid: boolean;
  error: string | null;
}

export function escapeVcardValue(val: string): string {
  if (!val) return '';
  return val
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

export function validateVcardInputs(inputs: VcardInputs): VcardValidationResult {
  const { name, phone, email, url } = inputs;

  const trimmedName = name ? name.trim() : '';
  const trimmedPhone = phone ? phone.trim() : '';
  const trimmedEmail = email ? email.trim() : '';
  const trimmedUrl = url ? url.trim() : '';

  if (!trimmedName && !trimmedPhone && !trimmedEmail) {
    return {
      isValid: false,
      error: '이름, 전화번호, 이메일 중 하나 이상을 입력해주세요.',
    };
  }

  if (trimmedEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return {
        isValid: false,
        error: '이메일 형식을 확인해주세요.',
      };
    }
  }

  if (trimmedUrl) {
    let finalUrl = trimmedUrl;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }
    try {
      new URL(finalUrl);
    } catch {
      return {
        isValid: false,
        error: '웹사이트 주소 형식을 확인해주세요.',
      };
    }
  }

  return {
    isValid: true,
    error: null,
  };
}

export function generateVcardString(inputs: VcardInputs): string {
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];

  if (inputs.name && inputs.name.trim()) {
    lines.push(`FN:${escapeVcardValue(inputs.name.trim())}`);
  }

  if (inputs.org && inputs.org.trim()) {
    lines.push(`ORG:${escapeVcardValue(inputs.org.trim())}`);
  }

  if (inputs.title && inputs.title.trim()) {
    lines.push(`TITLE:${escapeVcardValue(inputs.title.trim())}`);
  }

  if (inputs.phone && inputs.phone.trim()) {
    lines.push(`TEL:${escapeVcardValue(inputs.phone.trim())}`);
  }

  if (inputs.email && inputs.email.trim()) {
    lines.push(`EMAIL:${escapeVcardValue(inputs.email.trim())}`);
  }

  if (inputs.url && inputs.url.trim()) {
    let finalUrl = inputs.url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }
    lines.push(`URL:${escapeVcardValue(finalUrl)}`);
  }

  if (inputs.address && inputs.address.trim()) {
    lines.push(`ADR:${escapeVcardValue(inputs.address.trim())}`);
  }

  if (inputs.note && inputs.note.trim()) {
    lines.push(`NOTE:${escapeVcardValue(inputs.note.trim())}`);
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}
