import React, { useEffect, useState, useCallback } from 'react';
import { Header } from './components/Header';
import { KPIOverview } from './components/KPIOverview';
import { RevenueChart } from './components/RevenueChart';
import { StaffLeaderboard } from './components/StaffLeaderboard';
import { DailyTable } from './components/DailyTable';
import { SettingsModal } from './components/SettingsModal';
import type { DashboardData } from './types/dashboard';
import { fetchDashboardData, getSavedGasUrl } from './services/api';
import { AlertCircle, RefreshCw, FileSpreadsheet } from 'lucide-react';

export const App: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [selectedMonthId, setSelectedMonthId] = useState<string>('9_2026');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);

  // Khởi tạo Dark mode theo hệ điều hành hoặc localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('abfilms_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('abfilms_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('abfilms_theme', 'light');
    }
  };

  // Hàm tải dữ liệu
  const loadData = useCallback(async (monthId?: string, isBackgroundSync: boolean = false) => {
    try {
      if (!isBackgroundSync) setIsLoading(true);
      else setIsRefreshing(true);
      setError(null);

      let targetMonth: number | undefined;
      let targetYear: number | undefined;

      const mId = monthId || selectedMonthId;
      if (mId && mId.includes('_')) {
        const parts = mId.split('_');
        targetMonth = parseInt(parts[0], 10);
        targetYear = parseInt(parts[1], 10);
      }

      const res = await fetchDashboardData(targetMonth, targetYear);
      setData(res);

      if (res.month && res.year) {
        setSelectedMonthId(`${res.month}_${res.year}`);
      }
    } catch (err: any) {
      console.error('Lỗi khi nạp dữ liệu:', err);
      setError(err.message || 'Không thể đồng bộ từ Google Sheets');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedMonthId]);

  // Nạp dữ liệu lần đầu
  useEffect(() => {
    loadData();
  }, []);

  // Tự động làm mới dữ liệu ngầm mỗi 60 giây nếu có link Google Apps Script
  useEffect(() => {
    const gasUrl = getSavedGasUrl();
    if (!gasUrl) return;

    const interval = setInterval(() => {
      loadData(selectedMonthId, true);
    }, 60000);

    return () => clearInterval(interval);
  }, [selectedMonthId, loadData]);

  // Xử lý khi chọn tháng khác từ menu
  const handleSelectMonth = (monthId: string) => {
    setSelectedMonthId(monthId);
    loadData(monthId, false);
  };

  const handleRefresh = () => {
    loadData(selectedMonthId, true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      
      {/* Navigation Header */}
      <Header
        selectedMonthId={selectedMonthId}
        availableMonths={data?.availableMonths || []}
        onSelectMonth={handleSelectMonth}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        lastUpdated={data?.lastUpdated || new Date().toISOString()}
        isMock={!!data?.isMock}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isDark={isDark}
        onToggleDark={toggleDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Error notification if any */}
        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 p-4 rounded-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="font-semibold underline hover:no-underline whitespace-nowrap"
            >
              Kiểm tra cài đặt
            </button>
          </div>
        )}

        {/* Demo Mode banner if not connected to live Sheet */}
        {data?.isMock && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-4 py-2.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>
                <b>Chế độ xem trước (Dữ liệu mẫu Tháng 9/2026):</b> Kết nối với Google Sheet của bạn để tự động đồng bộ realtime.
              </span>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="font-bold underline hover:no-underline text-amber-900 dark:text-amber-200 self-start sm:self-auto"
            >
              Kết nối Google Sheet ngay →
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && !data ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
            <p className="text-sm font-medium">Đang tải dữ liệu từ Google Spreadsheet...</p>
          </div>
        ) : data ? (
          <>
            {/* 1. Core Business KPIs & Budget Banner */}
            <KPIOverview overview={data.overview} />

            {/* 2. Daily Trends & Revenue Chart */}
            <RevenueChart dailyData={data.daily} />

            {/* 3. Sales Team Performance & Auto-detected Staff */}
            <StaffLeaderboard
              staffList={data.staffList}
              totalFbRevenue={data.overview.fbRevenue}
            />

            {/* 4. Detailed Daily Table with Staff Breakdown */}
            <DailyTable
              dailyData={data.daily}
              staffList={data.staffList}
              monthLabel={data.monthLabel}
            />
          </>
        ) : null}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-5 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>AB Films Marketing & Sales Dashboard — Sẵn sàng triển khai lên Vercel</span>
          </div>
          <div>
            Tự động nhận diện Tháng mới & Nhân sự mới từ Google Sheets
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaveAndReload={() => loadData(selectedMonthId, false)}
      />

    </div>
  );
};

export default App;
