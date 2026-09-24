import React from 'react';
import { Award, Target, Users, Phone, ShoppingBag, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import type { StaffSummary } from '../types/dashboard';
import { formatVND, formatCompactVND, formatPercent, formatNumber } from '../utils/formatters';

interface StaffLeaderboardProps {
  staffList: StaffSummary[];
  totalFbRevenue: number;
}

export const StaffLeaderboard: React.FC<StaffLeaderboardProps> = ({ staffList, totalFbRevenue }) => {
  // Sắp xếp nhân viên theo doanh thu giảm dần để xếp hạng
  const sortedStaff = [...staffList].sort((a, b) => b.revenue - a.revenue);

  // Tính tổng doanh số của tất cả nhân sự
  const sumStaffRevenue = staffList.reduce((acc, curr) => acc + curr.revenue, 0);
  const isRevenueMatched = Math.abs(sumStaffRevenue - totalFbRevenue) < 1000;

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return {
          icon: '🥇',
          label: 'Top 1 Doanh Số',
          color: 'from-amber-400 to-yellow-500 text-amber-950 ring-amber-400/50'
        };
      case 1:
        return {
          icon: '🥈',
          label: 'Top 2 Doanh Số',
          color: 'from-slate-300 to-slate-400 text-slate-900 ring-slate-400/50'
        };
      case 2:
        return {
          icon: '🥉',
          label: 'Top 3 Doanh Số',
          color: 'from-amber-600 to-amber-700 text-white ring-amber-600/50'
        };
      default:
        return {
          icon: `#${index + 1}`,
          label: `Hạng ${index + 1}`,
          color: 'from-slate-200 to-slate-300 text-slate-700 dark:from-slate-700 dark:to-slate-800 dark:text-slate-300 ring-slate-300/30'
        };
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Đội Ngũ Kinh Doanh & Tiến Độ KPI
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {staffList.length} Nhân Sự (Tự động nhận diện)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Theo dõi tiến độ hoàn thành chỉ tiêu doanh thu 150tr và 4 chỉ số cốt lõi của từng nhân viên
          </p>
        </div>

        {/* Verification banner: Sum of staff = FB Revenue */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border ${
          isRevenueMatched
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
            : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
        }`}>
          {isRevenueMatched ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span>
            Tổng doanh số Sale: <b>{formatVND(sumStaffRevenue)}</b> = DT Facebook: <b>{formatVND(totalFbRevenue)}</b>
          </span>
        </div>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedStaff.map((staff, idx) => {
          const rank = getRankBadge(idx);
          const percent = staff.completionRate;

          return (
            <div
              key={staff.id}
              className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80 hover:shadow-md transition relative flex flex-col justify-between"
            >
              <div>
                
                {/* Header: Name and Rank Badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center font-bold text-slate-800 dark:text-slate-100 shadow-inner text-base">
                      {staff.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {staff.name}
                      </h4>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Target className="w-3 h-3 text-slate-400" />
                        KPI: {formatCompactVND(staff.target)}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r shadow-xs ${rank.color}`}
                    title={rank.label}
                  >
                    <span>{rank.icon}</span>
                    <span className="hidden sm:inline">{rank.label}</span>
                  </span>
                </div>

                {/* KPI Revenue & Progress Bar */}
                <div className="space-y-1.5 my-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Doanh số đạt:</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {formatVND(staff.revenue)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        percent >= 100
                          ? 'bg-emerald-500'
                          : percent >= 70
                          ? 'bg-teal-500'
                          : percent >= 40
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                    <span>
                      Tiến độ: <b className="text-emerald-600 dark:text-emerald-400">{formatPercent(percent)}</b>
                    </span>
                    <span>
                      Còn lại: <b className="text-rose-500 dark:text-rose-400">{formatCompactVND(staff.remaining)}</b>
                    </span>
                  </div>
                </div>

                {/* 4 Core Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  
                  <div className="bg-slate-50/70 dark:bg-slate-750 p-2 rounded-lg border border-slate-100 dark:border-slate-700/40">
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                      <Users className="w-3 h-3 text-blue-500" />
                      <span>Khách mới</span>
                    </div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {formatNumber(staff.leads)}
                    </div>
                  </div>

                  <div className="bg-slate-50/70 dark:bg-slate-750 p-2 rounded-lg border border-slate-100 dark:border-slate-700/40">
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                      <Phone className="w-3 h-3 text-teal-500" />
                      <span>Số điện thoại</span>
                    </div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {formatNumber(staff.phones)}
                    </div>
                  </div>

                  <div className="bg-slate-50/70 dark:bg-slate-750 p-2 rounded-lg border border-slate-100 dark:border-slate-700/40">
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                      <ShoppingBag className="w-3 h-3 text-emerald-500" />
                      <span>Số Đơn</span>
                    </div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {formatNumber(staff.orders)} đơn
                    </div>
                  </div>

                  <div className="bg-slate-50/70 dark:bg-slate-750 p-2 rounded-lg border border-slate-100 dark:border-slate-700/40">
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                      <TrendingUp className="w-3 h-3 text-violet-500" />
                      <span>Chốt/Khách</span>
                    </div>
                    <div className="text-sm font-bold text-violet-600 dark:text-violet-400">
                      {formatPercent(staff.closingRateLeads)}
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Closing Rate over Phones */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Tỷ lệ chốt trên SĐT:</span>
                <span className="font-bold text-fuchsia-600 dark:text-fuchsia-400">
                  {formatPercent(staff.closingRatePhones)}
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
