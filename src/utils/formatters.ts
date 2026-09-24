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
