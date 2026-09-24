import React, { useEffect, useState, useCallback } from 'react';
import { Header } from './components/Header';
import { KPIOverview } from './components/KPIOverview';
import { RevenueChart } from './components/RevenueChart';
import { StaffLeaderboard } from './components/StaffLeaderboard';
import { DailyTable } from './components/DailyTable';
import type { DashboardData } from './types/dashboard';
import { fetchDashboardData, getSavedGasUrl } from './services/api';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [selectedMonthId, setSelectedMonthId] = useState<string>('9_2026');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
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

  // Tự động làm mới dữ liệu ngầm mỗi 60 giây
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors font-sans antialiased">
      
      {/* Navigation Header */}
      <Header
        selectedMonthId={selectedMonthId}
        availableMonths={data?.availableMonths || []}
        onSelectMonth={handleSelectMonth}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        lastUpdated={data?.lastUpdated || new Date().toISOString()}
        isMock={!!data?.isMock}
        isDark={isDark}
        onToggleDark={toggleDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        
        {/* Error notification if any */}
        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 p-4 rounded-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadData(selectedMonthId, false)}
              className="font-bold underline hover:no-underline whitespace-nowrap cursor-pointer"
            >
              Thử tải lại
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && !data ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
            <p className="text-sm font-semibold">Đang tải dữ liệu từ Google Spreadsheet...</p>
          </div>
        ) : data ? (
          <>
            {/* 1. Quick Insights & Core Business KPIs */}
            <KPIOverview
              overview={data.overview}
              staffList={data.staffList}
            />

            {/* 2. Interactive Charts (Xu hướng ngày, Cơ cấu kênh, Thi đua sale) */}
            <RevenueChart
              dailyData={data.daily}
              staffList={data.staffList}
              overview={data.overview}
            />

            {/* 3. Sales Team Performance & 4 Auto-detected Staff */}
            <StaffLeaderboard
              staffList={data.staffList}
              totalFbRevenue={data.overview.fbRevenue}
            />

            {/* 4. Detailed Daily Table with Staff Breakdown (dd/mm/yyyy) */}
            <DailyTable
              dailyData={data.daily}
              staffList={data.staffList}
              monthLabel={data.monthLabel}
            />
          </>
        ) : null}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-4 text-xs text-slate-500 dark:text-slate-400 transition-colors mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-md bg-white p-0.5 border border-slate-200 flex items-center justify-center">
              <img src="/logo.png" alt="AB Films" className="h-full w-full object-contain" />
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              AB Films Dashboard
            </span>
            <span className="text-slate-400">• Báo Cáo Marketing & Doanh Số Tự Động</span>
          </div>
          <div>
            Tự động nhận diện Tháng mới & Nhân sự mới từ Google Sheets
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
