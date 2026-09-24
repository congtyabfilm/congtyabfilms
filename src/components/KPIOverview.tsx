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
  PieChart
} from 'lucide-react';
import type { OverviewMetrics } from '../types/dashboard';
import { formatVND, formatCompactVND, formatPercent, formatNumber } from '../utils/formatters';

interface KPIOverviewProps {
  overview: OverviewMetrics;
}

export const KPIOverview: React.FC<KPIOverviewProps> = ({ overview }) => {
  const percentAchieved = overview.targetRevenue > 0
    ? (overview.totalRevenue / overview.targetRevenue) * 100
    : 0;

  const adsCostRatio = overview.totalRevenue > 0
    ? (overview.totalAdsCost / overview.totalRevenue) * 100
    : 0;

  const fbRevenueShare = overview.totalRevenue > 0
    ? (overview.fbRevenue / overview.totalRevenue) * 100
    : 0;

  return (
    <div className="space-y-4">
      
      {/* Target Progress Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-indigo-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Target className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                Mục Tiêu Doanh Thu Tháng
              </h2>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white tracking-tight">
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
              <p className="text-xs text-slate-400">Doanh số còn thiếu</p>
              <p className="text-base font-bold text-amber-300">
                {formatCompactVND(overview.remainingRevenue)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Mục tiêu cần đạt/ngày</p>
              <p className="text-base font-bold text-teal-300">
                {formatCompactVND(overview.targetDaily)}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-slate-400">Tổng chi phí Ads</p>
              <p className="text-base font-bold text-rose-300">
                {formatCompactVND(overview.totalAdsCost)}
                <span className="text-xs font-normal text-slate-400 ml-1">({formatPercent(adsCostRatio)})</span>
              </p>
            </div>
          </div>

        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-2">
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(percentAchieved, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of 6 Core Business Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Facebook Revenue (Ảnh 2 - Mục 3) */}
        <div className="bg-white dark:bg-slate-800/90 rounded-xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-700/80 relative hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Doanh Thu Facebook</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {formatVND(overview.fbRevenue)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Tỷ trọng: <b className="text-blue-600 dark:text-blue-400">{formatPercent(fbRevenueShare)}</b>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              ROAS: {overview.roasFB}x
            </span>
          </div>
        </div>

        {/* Card 2: Google Revenue + Other (Ảnh 2 - Mục 4) */}
        <div className="bg-white dark:bg-slate-800/90 rounded-xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-700/80 relative hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Doanh Thu Google + Khác</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {formatVND(overview.ggRevenue)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Tỷ trọng: <b className="text-amber-600 dark:text-amber-400">{formatPercent(100 - fbRevenueShare)}</b>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              ROAS: {overview.roasGG}x
            </span>
          </div>
        </div>

        {/* Card 3: Chi phí QC Facebook (Ảnh 2 - Mục 1 & Ảnh 4) */}
        <div className="bg-white dark:bg-slate-800/90 rounded-xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-700/80 relative hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Chi Phí QC Facebook</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {formatVND(overview.fbAdsCost)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Chưa thuế (Cột E):</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {formatVND(overview.fbAdsCostBeforeTax)}
            </span>
          </div>
        </div>

        {/* Card 4: Chi phí QC Google (Ảnh 2 - Mục 2) */}
        <div className="bg-white dark:bg-slate-800/90 rounded-xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-700/80 relative hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Chi Phí QC Google</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {formatVND(overview.ggAdsCost)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Tỷ lệ trên DT Google:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {overview.ggRevenue > 0 ? formatPercent((overview.ggAdsCost / overview.ggRevenue) * 100) : '0%'}
            </span>
          </div>
        </div>

      </div>

      {/* Row 2: Funnel & Efficiency Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span>Khách mới</span>
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {formatNumber(overview.totalLeads)}
          </div>
          <div className="text-[11px] text-slate-400">
            {formatVND(overview.costPerLead)}/khách
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <PhoneCall className="w-3.5 h-3.5 text-teal-500" />
            <span>Số điện thoại</span>
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {formatNumber(overview.totalPhones)}
          </div>
          <div className="text-[11px] text-slate-400">
            {overview.totalLeads > 0 ? formatPercent((overview.totalPhones / overview.totalLeads) * 100) : '0%'} tỷ lệ để lại SĐT
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
            <span>Tổng Đơn Hàng</span>
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {formatNumber(overview.totalOrders)} đơn
          </div>
          <div className="text-[11px] text-slate-400">
            {formatVND(overview.costPerOrder)}/đơn
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Percent className="w-3.5 h-3.5 text-violet-500" />
            <span>Tỉ lệ chốt (Khách)</span>
          </div>
          <div className="text-lg font-bold text-violet-600 dark:text-violet-400">
            {formatPercent(overview.closingRateLeads)}
          </div>
          <div className="text-[11px] text-slate-400">
            Đơn / Khách mới
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Percent className="w-3.5 h-3.5 text-fuchsia-500" />
            <span>Tỉ lệ chốt (SĐT)</span>
          </div>
          <div className="text-lg font-bold text-fuchsia-600 dark:text-fuchsia-400">
            {formatPercent(overview.closingRatePhones)}
          </div>
          <div className="text-[11px] text-slate-400">
            Đơn / Số điện thoại
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>ROAS Tổng</span>
          </div>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {overview.roasTotal}x
          </div>
          <div className="text-[11px] text-slate-400">
            Doanh thu / Chi phí Ads
          </div>
        </div>

      </div>

    </div>
  );
};
