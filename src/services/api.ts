import type { DashboardData, StaffSummary } from '../types/dashboard';
import { mockDashboardData } from './mockData';
import { formatDateDDMMYYYY } from '../utils/formatters';

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
    return normalizeDashboardData({
      ...mockDashboardData,
      isMock: true,
      lastUpdated: new Date().toISOString()
    });
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

    return normalizeDashboardData({
      ...json,
      isMock: false
    });
  } catch (err: any) {
    console.warn('Lỗi khi fetch từ Google Apps Script:', err);
    throw new Error(err.message || 'Không thể đồng bộ dữ liệu từ Google Sheet');
  }
}

/**
 * Chuẩn hóa dữ liệu trả về từ Google Sheet:
 * 1. Đảm bảo định dạng ngày luôn là dd/mm/yyyy
 * 2. Tự động phục hồi/tính toán số liệu nhân viên từ dữ liệu hàng ngày nếu hàng tổng bị lệch
 */
function normalizeDashboardData(data: DashboardData): DashboardData {
  if (!data) return data;

  const month = data.month || 9;
  const year = data.year || 2026;

  // 1. Chuẩn hóa định dạng ngày dd/mm/yyyy trong danh sách ngày
  if (data.daily && Array.isArray(data.daily)) {
    data.daily = data.daily.map((d, idx) => ({
      ...d,
      dateLabel: formatDateDDMMYYYY(d.dateLabel, d.dayIndex || idx + 1, month, year)
    }));
  }

  // 2. Tự động kiểm tra và phục hồi số liệu nhân viên từ dữ liệu ngày nếu số liệu tổng là 0
  if (data.staffList && Array.isArray(data.staffList) && data.daily) {
    data.staffList = data.staffList.map((staff: StaffSummary) => {
      // Tính tổng thực tế từ 30 ngày của nhân viên này
      let sumLeads = 0;
      let sumPhones = 0;
      let sumOrders = 0;
      let sumRevenue = 0;

      data.daily.forEach((d) => {
        const s = d.staff ? d.staff[staff.name] : null;
        if (s) {
          sumLeads += s.leads || 0;
          sumPhones += s.phones || 0;
          sumOrders += s.orders || 0;
          sumRevenue += s.revenue || 0;
        }
      });

      // Nếu số liệu tổng của nhân viên là 0 nhưng có số liệu trong các ngày
      const revenue = staff.revenue > 0 ? staff.revenue : sumRevenue;
      const leads = staff.leads > 0 ? staff.leads : sumLeads;
      const phones = staff.phones > 0 ? staff.phones : sumPhones;
      const orders = staff.orders > 0 ? staff.orders : sumOrders;

      const target = staff.target > 0 ? staff.target : 150000000;
      const completionRate = target > 0 ? parseFloat(((revenue / target) * 100).toFixed(2)) : 0;
      const remaining = Math.max(0, target - revenue);
      const closingRateLeads = leads > 0 ? parseFloat(((orders / leads) * 100).toFixed(2)) : 0;
      const closingRatePhones = phones > 0 ? parseFloat(((orders / phones) * 100).toFixed(2)) : 0;

      return {
        ...staff,
        revenue,
        leads,
        phones,
        orders,
        target,
        completionRate,
        remaining,
        closingRateLeads,
        closingRatePhones
      };
    });
  }

  return data;
}
