import React from 'react';
import { RefreshCw, Settings, Moon, Sun, Calendar, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import type { MonthOption } from '../types/dashboard';

interface HeaderProps {
  selectedMonthId: string;
  availableMonths: MonthOption[];
  onSelectMonth: (monthId: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: string;
  isMock: boolean;
  onOpenSettings: () => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedMonthId,
  availableMonths,
  onSelectMonth,
  onRefresh,
  isRefreshing,
  lastUpdated,
  isMock,
  onOpenSettings,
  isDark,
  onToggleDark
}) => {
  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return 'Vừa xong';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-3 gap-3">
          
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-extrabold shadow-md shadow-emerald-500/20 text-lg tracking-wider">
                AB
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    AB Films
                  </h1>
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Báo cáo Marketing & Sale
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tự động đồng bộ từ Google Spreadsheet
                </p>
              </div>
            </div>

            {/* Mobile Settings & Dark toggle */}
            <div className="flex sm:hidden items-center gap-1.5">
              <button
                onClick={onToggleDark}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                title="Đổi giao diện"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={onOpenSettings}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                title="Cài đặt kết nối Sheet"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Controls: Month Selector, Sync, Connection State */}
          <div className="flex items-center flex-wrap gap-2.5 w-full sm:w-auto justify-end">
            
            {/* Connection Status Pill */}
            <button
              onClick={onOpenSettings}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isMock
                  ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              }`}
              title="Bấm để cấu hình link Google Apps Script"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isMock ? 'Dữ liệu Demo' : 'Google Sheets'}</span>
              {isMock ? (
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              )}
            </button>

            {/* Month Selector Dropdown */}
            <div className="relative flex items-center">
              <div className="absolute left-2.5 pointer-events-none text-slate-400 dark:text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <select
                value={selectedMonthId}
                onChange={(e) => onSelectMonth(e.target.value)}
                className="pl-8 pr-8 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none"
              >
                {availableMonths.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sync Now Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition active:scale-95 disabled:opacity-60"
              title="Đồng bộ dữ liệu tức thì từ Google Sheet"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Đang tải...' : 'Đồng bộ'}</span>
            </button>

            {/* Sync Time badge */}
            <span className="hidden md:inline-block text-[11px] text-slate-400 dark:text-slate-500">
              Lúc {formatTime(lastUpdated)}
            </span>

            {/* Desktop Settings & Dark toggle */}
            <div className="hidden sm:flex items-center gap-1 pl-1 border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={onToggleDark}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
                title={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={onOpenSettings}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
                title="Cài đặt kết nối Sheet"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
