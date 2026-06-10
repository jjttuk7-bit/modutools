export interface UrlValidationResult {
  isValid: boolean;
  formattedUrl: string;
  error: string | null;
}

export function formatAndValidateUrl(urlInput: string): UrlValidationResult {
  let trimmed = urlInput.trim();

  if (!trimmed || trimmed === 'https://' || trimmed === 'http://') {
    return { isValid: false, formattedUrl: '', error: 'URL을 입력해주세요.' };
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname;

    if (!host || !host.includes('.') || host.split('.').filter(Boolean).length < 2) {
      return {
        isValid: false,
        formattedUrl: trimmed,
        error: '올바른 URL 형식인지 확인해주세요.',
      };
    }

    return { isValid: true, formattedUrl: trimmed, error: null };
  } catch {
    return {
      isValid: false,
      formattedUrl: trimmed,
      error: '올바른 URL 형식인지 확인해주세요.',
    };
  }
}
