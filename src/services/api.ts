import type { DashboardData } from '../types/dashboard';
import { mockDashboardData } from './mockData';

const STORAGE_KEY_GAS_URL = 'abfilms_gas_url';

export function getSavedGasUrl(): string {
  if (typeof window === 'undefined') return '';
  const local = localStorage.getItem(STORAGE_KEY_GAS_URL);
  if (local && local.trim()) return local.trim();
  const envUrl = import.meta.env.VITE_GAS_URL;
  if (envUrl && envUrl.trim()) return envUrl.trim();
  return '';
}

export function saveGasUrl(url: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_GAS_URL, url.trim());
}

export async function fetchDashboardData(month?: number, year?: number): Promise<DashboardData> {
  const gasUrl = getSavedGasUrl();

  // Nếu người dùng chưa cấu hình URL Apps Script, dùng mock data thực tế
  if (!gasUrl) {
    console.info('Chưa có URL Google Apps Script, hiển thị dữ liệu mẫu từ sheet Tháng 9/2026');
    return {
      ...mockDashboardData,
      isMock: true,
      lastUpdated: new Date().toISOString()
    };
  }

  try {
    const url = new URL(gasUrl);
    url.searchParams.set('action', 'getData');
    if (month && year) {
      url.searchParams.set('month', month.toString());
      url.searchParams.set('year', year.toString());
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`Lỗi kết nối máy chủ Google (${response.status})`);
    }

    const json = await response.json();
    if (!json || json.success === false) {
      throw new Error(json.message || 'Không thể bóc tách dữ liệu từ Google Sheets');
    }

    return {
      ...json,
      isMock: false
    };
  } catch (err: any) {
    console.warn('Lỗi khi fetch từ Google Apps Script:', err);
    throw new Error(err.message || 'Không thể đồng bộ dữ liệu từ Google Sheet');
  }
}
