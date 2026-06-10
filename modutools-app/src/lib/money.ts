export function formatNumber(value: number | string, selectSuffix = false): string {
  const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  if (isNaN(num)) return '0';

  const formatted = new Intl.NumberFormat('ko-KR', {
    maximumFractionDigits: 2,
  }).format(num);

  return selectSuffix ? `${formatted}원` : formatted;
}

export function parseMoneyString(value: string): number {
  const cleaned = value.replace(/[^0-9]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

export function parseMoney(value: string): number {
  return parseMoneyString(value);
}

export function formatMoney(value: number): string {
  return formatNumber(value);
}

export function roundWon(value: number): number {
  return Math.round(value);
}

export function calculateVatFromSupply(supplyAmount: number, vatRate: number) {
  const roundedSupply = roundWon(supplyAmount);
  const vatAmount = roundWon(roundedSupply * (vatRate / 100));
  const totalAmount = roundedSupply + vatAmount;
  return {
    supplyAmount: roundedSupply,
    vatRate,
    vatAmount,
    totalAmount,
  };
}

export function calculateSupplyFromTotal(totalAmount: number, vatRate: number) {
  const roundedTotal = roundWon(totalAmount);
  const supplyAmount = roundWon(roundedTotal / (1 + vatRate / 100));
  const vatAmount = roundedTotal - supplyAmount;
  return {
    totalAmount: roundedTotal,
    vatRate,
    supplyAmount,
    vatAmount,
  };
}

export function formatToKoreanWord(num: number): string {
  if (num === 0) return '영 원';
  if (num < 0) return '마이너스 ' + formatToKoreanWord(Math.abs(num));

  const units = ['', '만', '억', '조', '경'];
  const numberParts: string[] = [];
  let temp = num;
  let unitIndex = 0;

  while (temp > 0) {
    const part = temp % 10000;
    if (part > 0) {
      numberParts.unshift(`${formatFourDigits(part)}${units[unitIndex]}`);
    }
    temp = Math.floor(temp / 10000);
    unitIndex++;
  }

  return numberParts.join(' ').trim() + ' 원';
}

function formatFourDigits(num: number): string {
  const digits = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  const positions = ['', '십', '백', '천'];
  let result = '';
  let temp = num;
  let pos = 0;

  while (temp > 0) {
    const digit = temp % 10;
    if (digit > 0) {
      if (pos > 0 && digit === 1) {
        result = positions[pos] + result;
      } else {
        result = digits[digit] + positions[pos] + result;
      }
    }
    temp = Math.floor(temp / 10);
    pos++;
  }

  return result;
}

export function formatToKoreanWordSimple(num: number): string {
  if (!num) return '';
  if (num < 0) return '마이너스 금액';

  const ok = Math.floor(num / 100000000);
  const remainderOk = num % 100000000;
  const man = Math.floor(remainderOk / 10000);
  const remainderMan = remainderOk % 10000;

  const parts: string[] = [];
  if (ok > 0) parts.push(`${ok}억`);
  if (man > 0) {
    const formattedMan =
      remainderMan > 0 ? `${man}만 ${formatNumber(remainderMan)}` : `${man}만`;
    parts.push(formattedMan);
  } else if (remainderMan > 0) {
    parts.push(`${formatNumber(remainderMan)}`);
  }

  return parts.length > 0 ? `${parts.join(' ')} 원` : '';
}
