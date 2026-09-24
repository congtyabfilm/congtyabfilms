import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Target,
  Percent,
  Users,
  PhoneCall,
  ShoppingBag,
  Sparkles,
  PieChart,
  Calendar,
  Zap,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import type { OverviewMetrics, StaffSummary } from '../types/dashboard';
import { formatVND, formatCompactVND, formatPercent, formatNumber } from '../utils/formatters';

interface KPIOverviewProps {
  overview: OverviewMetrics;
  staffList?: StaffSummary[];
}

export const KPIOverview: React.FC<KPIOverviewProps> = ({ overview, staffList = [] }) => {
  const percentAchieved = overview.targetRevenue > 0
    ? (overview.totalRevenue / overview.targetRevenue) * 100
    : 0;

  const adsCostRatio = overview.totalRevenue > 0
    ? (overview.totalAdsCost / overview.totalRevenue) * 100
    : 0;

  const fbRevenueShare = overview.totalRevenue > 0
    ? (overview.fbRevenue / overview.totalRevenue) * 100
    : 0;

  // Tìm nhân viên xuất sắc nhất
  const topRevenueStaff = staffList.length > 0
    ? [...staffList].sort((a, b) => b.revenue - a.revenue)[0]
    : null;

  const topClosingStaff = staffList.length > 0
    ? [...staffList].sort((a, b) => b.closingRateLeads - a.closingRateLeads)[0]
    : null;

  return (
    <div className="space-y-4">
      
      {/* 1. Executive Quick Insights Strip (Vào trang là thấy ngay thông tin cốt lõi) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 dark:from-emerald-950/40 dark:to-teal-950/20 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl p-3 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3.5 h-3.5" />
              Tiến Độ Doanh Số
            </span>
            <div className="text-lg font-extrabold text-emerald-950 dark:text-emerald-100">
              {formatPercent(percentAchieved)}
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
              Đạt {formatCompactVND(overview.totalRevenue)} / 800 tr
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-amber-950/40 dark:to-orange-950/20 border border-amber-200/80 dark:border-amber-800/60 rounded-xl p-3 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              Áp Lực Về Đích
            </span>
            <div className="text-lg font-extrabold text-amber-950 dark:text-amber-100">
              {formatCompactVND(overview.targetDaily)}/ngày
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-400">
              Còn thiếu {formatCompactVND(overview.remainingRevenue)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 dark:from-blue-950/40 dark:to-indigo-950/20 border border-blue-200/80 dark:border-blue-800/60 rounded-xl p-3 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Hiệu Quả Quảng Cáo
            </span>
            <div className="text-lg font-extrabold text-blue-950 dark:text-blue-100">
              ROAS {overview.roasTotal}x
            </div>
            <p className="text-[11px] text-blue-700 dark:text-blue-400">
              Chi {formatCompactVND(overview.totalAdsCost)} Ads ({formatPercent(adsCostRatio)})
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50/60 dark:from-purple-950/40 dark:to-fuchsia-950/20 border border-purple-200/80 dark:border-purple-800/60 rounded-xl p-3 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-purple-800 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              Ngôi Sao Doanh Số
            </span>
            <div className="text-lg font-extrabold text-purple-950 dark:text-purple-100 truncate">
              {topRevenueStaff ? topRevenueStaff.name : 'Trang'}
            </div>
            <p className="text-[11px] text-purple-700 dark:text-purple-400">
              {topRevenueStaff ? `${formatCompactVND(topRevenueStaff.revenue)} (${formatPercent(topRevenueStaff.completionRate)})` : '134,8 tr'}
              {topClosingStaff && ` • Chốt: ${topClosingStaff.name} (${formatPercent(topClosingStaff.closingRateLeads)})`}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
            🏆
          </div>
        </div>

      </div>

      {/* 2. Target Progress Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-indigo-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                Mục Tiêu Tháng
              </span>
              <span className="text-xs text-slate-400">
                Ngân sách dự kiến: {formatCompactVND(overview.budget)}
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-2.5">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {formatVND(overview.totalRevenue)}
              </span>
              <span className="text-sm text-slate-400 font-medium">
                / {formatVND(overview.targetRevenue)}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-500/30">
                {formatPercent(percentAchieved)}
              </span>
            </div>
          </div>

          {/* Quick Metrics in Target Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t lg:border-t-0 lg:border-l border-slate-700/60 pt-4 lg:pt-0 lg:pl-6">
            <div>
              <p className="text-xs text-slate-400 font-medium">Doanh số còn thiếu</p>
              <p className="text-base font-bold text-amber-300">
                {formatVND(overview.remainingRevenue)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Cần đạt mỗi ngày</p>
              <p className="text-base font-bold text-teal-300">
                {formatVND(overview.targetDaily)}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-slate-400 font-medium">Tổng chi phí Ads</p>
              <p className="text-base font-bold text-rose-300">
                {formatVND(overview.totalAdsCost)}
                <span className="text-xs font-normal text-slate-400 ml-1">({formatPercent(adsCostRatio)})</span>
              </p>
            </div>
          </div>

        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-1">
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(percentAchieved, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Grid of 4 Core Business Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Card 1: Facebook Revenue */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 shadow-xs border border-slate-200/80 dark:border-slate-700/80 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Doanh Thu Facebook
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatVND(overview.fbRevenue)}
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Tỷ trọng: <b className="text-blue-600 dark:text-blue-400">{formatPercent(fbRevenueShare)}</b>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
              ROAS: {overview.roasFB}x
            </span>
          </div>
        </div>

        {/* Card 2: Google Revenue + Other */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 shadow-xs border border-slate-200/80 dark:border-slate-700/80 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Doanh Thu Google + Khác
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatVND(overview.ggRevenue)}
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Tỷ trọng: <b className="text-amber-600 dark:text-amber-400">{formatPercent(100 - fbRevenueShare)}</b>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
              ROAS: {overview.roasGG}x
            </span>
          </div>
        </div>

        {/* Card 3: Chi phí QC Facebook */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 shadow-xs border border-slate-200/80 dark:border-slate-700/80 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Chi Phí QC Facebook
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatVND(overview.fbAdsCost)}
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Chưa thuế (Cột E):</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {formatVND(overview.fbAdsCostBeforeTax)}
            </span>
          </div>
        </div>

        {/* Card 4: Chi phí QC Google */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 shadow-xs border border-slate-200/80 dark:border-slate-700/80 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Chi Phí QC Google
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatVND(overview.ggAdsCost)}
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Tỷ lệ trên DT Google:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {overview.ggRevenue > 0 ? formatPercent((overview.ggAdsCost / overview.ggRevenue) * 100) : '0%'}
            </span>
          </div>
        </div>

      </div>

      {/* 4. Sales Funnel & Efficiency Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span>Khách mới</span>
          </div>
          <div className="text-lg font-black text-slate-800 dark:text-slate-100">
            {formatNumber(overview.totalLeads)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            {formatVND(overview.costPerLead)}/khách
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            <PhoneCall className="w-3.5 h-3.5 text-teal-500" />
            <span>Số điện thoại</span>
          </div>
          <div className="text-lg font-black text-slate-800 dark:text-slate-100">
            {formatNumber(overview.totalPhones)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            {overview.totalLeads > 0 ? formatPercent((overview.totalPhones / overview.totalLeads) * 100) : '0%'} tỷ lệ để lại SĐT
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
            <span>Tổng Đơn Hàng</span>
          </div>
          <div className="text-lg font-black text-slate-800 dark:text-slate-100">
            {formatNumber(overview.totalOrders)} đơn
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            {formatVND(overview.costPerOrder)}/đơn
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            <Percent className="w-3.5 h-3.5 text-violet-500" />
            <span>Tỉ lệ chốt (Khách)</span>
          </div>
          <div className="text-lg font-black text-violet-600 dark:text-violet-400">
            {formatPercent(overview.closingRateLeads)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Đơn / Khách mới
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            <Percent className="w-3.5 h-3.5 text-fuchsia-500" />
            <span>Tỉ lệ chốt (SĐT)</span>
          </div>
          <div className="text-lg font-black text-fuchsia-600 dark:text-fuchsia-400">
            {formatPercent(overview.closingRatePhones)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Đơn / Số điện thoại
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>ROAS Tổng</span>
          </div>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
            {overview.roasTotal}x
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Doanh thu / Chi phí Ads
          </div>
        </div>

      </div>

    </div>
  );
};
