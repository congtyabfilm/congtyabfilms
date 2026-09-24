export function formatVND(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '0 đ';
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(value) + ' đ';
}

export function formatCompactVND(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '0';
  if (Math.abs(value) >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(2).replace('.', ',') + ' tỷ';
  }
  if (Math.abs(value) >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace('.', ',') + ' tr';
  }
  if (Math.abs(value) >= 1_000) {
    return (value / 1_000).toFixed(0).replace('.', ',') + ' k';
  }
  return value.toString();
}

export function formatPercent(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '0%';
  return value.toFixed(2).replace('.', ',') + '%';
}

export function formatNumber(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
}

/**
 * Định dạng ngày sang dd/mm/yyyy chuẩn
 * Xử lý mọi trường hợp: Date object string, GMT string, "Thứ Ba, 1 tháng 9", v.v.
 */
export function formatDateDDMMYYYY(
  dateStr: string | undefined | null,
  fallbackDay?: number,
  month?: number,
  year?: number
): string {
  if (!dateStr) {
    if (fallbackDay) {
      const dd = fallbackDay < 10 ? `0${fallbackDay}` : `${fallbackDay}`;
      const mm = month ? (month < 10 ? `0${month}` : `${month}`) : '09';
      const y = year || 2026;
      return `${dd}/${mm}/${y}`;
    }
    return '';
  }

  const str = String(dateStr).trim();

  // Đã là định dạng dd/mm/yyyy chuẩn (ví dụ 01/09/2026)
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    return str;
  }

  // Nếu là dạng GMT string như "Tue Sep 01 2026 00:00:00 GMT+0700 (Giờ Đông Dương)"
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const d = parsed.getDate();
    const m = parsed.getMonth() + 1;
    const y = parsed.getFullYear();
    const dd = d < 10 ? `0${d}` : `${d}`;
    const mm = m < 10 ? `0${m}` : `${m}`;
    return `${dd}/${mm}/${y}`;
  }

  // Dạng "Thứ Ba, 1 tháng 9"
  const match = str.match(/(\d{1,2})\s*(?:tháng|\/|-)\s*(\d{1,2})/i);
  if (match) {
    const d = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const dd = d < 10 ? `0${d}` : `${d}`;
    const mm = m < 10 ? `0${m}` : `${m}`;
    const y = year || 2026;
    return `${dd}/${mm}/${y}`;
  }

  return str;
}
