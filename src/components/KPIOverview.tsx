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
  ArrowDownRight,
  Minus,
  Flame
} from 'lucide-react';
import type { OverviewMetrics, StaffSummary, PeriodMetrics, ComparisonValue, DailyData } from '../types/dashboard';
import { formatVND, formatCompactVND, formatPercent, formatNumber } from '../utils/formatters';

interface KPIOverviewProps {
  overview: OverviewMetrics;
  periodMetrics: PeriodMetrics;
  staffList?: StaffSummary[];
  dailyData?: DailyData[];
  month?: number;
  year?: number;
}

export const KPIOverview: React.FC<KPIOverviewProps> = ({
  overview,
  periodMetrics,
  staffList = [],
  dailyData = [],
  month = 9,
  year = 2026
}) => {
  // Tiến độ mục tiêu toàn tháng
  const percentAchieved = overview.targetRevenue > 0
    ? (overview.totalRevenue / overview.targetRevenue) * 100
    : 0;

  // Tính toán số liệu DỰ BÁO CUỐI THÁNG (Run-rate Projection)
  const currentMonth = month || 9;
  const currentYear = year || 2026;
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate(); // Số ngày thực tế theo tháng dương lịch

  // Tìm ngày có dữ liệu phát sinh lớn nhất trong tháng
  const activeDays = (dailyData || []).filter(
    (d) => d.totalRevenue > 0 || d.fbAdsCostBeforeTax > 0 || d.leads > 0
  );
  const maxDayWithData = activeDays.length > 0
    ? Math.max(...activeDays.map((d) => d.dayIndex || 0))
    : (dailyData?.length || 24);

  // Số ngày đã qua có ghi nhận hoạt động kinh doanh
  const daysPassed = Math.min(daysInMonth, Math.max(1, maxDayWithData));
  // Số ngày còn lại đến hết tháng
  const remainingDays = Math.max(0, daysInMonth - daysPassed);

  // Doanh thu & Chi phí QC đã tích lũy từ đầu tháng
  const totalRevSoFar = overview.totalRevenue;
  const totalAdsSoFar = overview.totalAdsCost;
  const targetRev = overview.targetRevenue > 0 ? overview.targetRevenue : 800000000;

  // PHÂN TÍCH XU HƯỚNG DỰ BÁO ĐỘNG (Dựa trên nhịp độ 7 ngày gần nhất kết hợp cả tháng)
  const recentDays = activeDays.slice(-7);
  const recentDaysCount = recentDays.length > 0 ? recentDays.length : 1;

  // 1. Tốc độ doanh thu: Trọng số 70% nhịp độ 7 ngày gần nhất + 30% trung bình toàn tháng
  const recentSumRev = recentDays.reduce((sum, d) => sum + (d.totalRevenue || 0), 0);
  const recentAvgRev = recentSumRev / recentDaysCount;
  const allAvgRev = daysPassed > 0 ? totalRevSoFar / daysPassed : 0;
  const projectedDailyRevenue = activeDays.length >= 7
    ? Math.round(recentAvgRev * 0.7 + allAvgRev * 0.3)
    : Math.round(allAvgRev);

  // 2. Tốc độ chi phí quảng cáo Facebook: Trọng số 70% ngân sách 7 ngày gần nhất + 30% toàn tháng
  const recentSumFbAds = recentDays.reduce((sum, d) => sum + (d.fbAdsCostAfterTax || 0), 0);
  const recentAvgFbAds = recentSumFbAds / recentDaysCount;
  const allAvgFbAds = daysPassed > 0 ? overview.fbAdsCost / daysPassed : 0;
  const projectedDailyFbAds = activeDays.length >= 7
    ? Math.round(recentAvgFbAds * 0.7 + allAvgFbAds * 0.3)
    : Math.round(allAvgFbAds);

  // 3. Tốc độ chi phí quảng cáo Google: phân bổ bình quân theo ngày
  const dailyGgAds = daysPassed > 0 ? Math.round(overview.ggAdsCost / daysPassed) : 0;

  // Tổng chi phí quảng cáo dự kiến mỗi ngày cho các ngày còn lại
  const projectedDailyAdsCost = projectedDailyFbAds + dailyGgAds;

  // DỰ BÁO 3 CHỈ SỐ CỐT LÕI CUỐI THÁNG:
  // 1. Dự báo Doanh số chốt tháng
  const forecastRevenue = remainingDays > 0
    ? Math.round(totalRevSoFar + (remainingDays * projectedDailyRevenue))
    : totalRevSoFar;

  // 2. Dự báo Chi phí QC đến cuối tháng
  const forecastAdsCost = remainingDays > 0
    ? Math.round(totalAdsSoFar + (remainingDays * projectedDailyAdsCost))
    : totalAdsSoFar;

  // 3. Tỷ lệ Chi phí QC dự kiến chiếm bao nhiêu % trên Doanh thu chốt tháng
  const forecastAdsPercent = forecastRevenue > 0
    ? parseFloat(((forecastAdsCost / forecastRevenue) * 100).toFixed(2))
    : 0;

  // Tỷ lệ % chi phí QC hiện tại để so sánh xu hướng tăng / giảm
  const currentAdsPercent = totalRevSoFar > 0
    ? parseFloat(((totalAdsSoFar / totalRevSoFar) * 100).toFixed(2))
    : 0;
  const diffAdsPercent = parseFloat((forecastAdsPercent - currentAdsPercent).toFixed(2));

  // Chỉ số hỗ trợ phân tích
  const forecastTargetPercent = targetRev > 0
    ? parseFloat(((forecastRevenue / targetRev) * 100).toFixed(1))
    : 0;
  const projectedExtraRevenue = remainingDays * projectedDailyRevenue;
  const projectedExtraAdsCost = remainingDays * projectedDailyAdsCost;
  const neededDailyRevenue = remainingDays > 0
    ? Math.max(0, Math.round((targetRev - totalRevSoFar) / remainingDays))
    : 0;


  // Tìm nhân viên xuất sắc nhất
  const topRevenueStaff = staffList.length > 0
    ? [...staffList].sort((a, b) => b.revenue - a.revenue)[0]
    : null;

  const topClosingStaff = staffList.length > 0
    ? [...staffList].sort((a, b) => b.closingRateLeads - a.closingRateLeads)[0]
    : null;

  // Component hiển thị badge tăng giảm cùng kỳ
  const RenderDeltaBadge = ({
    comparison,
    isCost = false,
    labelSuffix = ''
  }: {
    comparison: ComparisonValue;
    isCost?: boolean;
    labelSuffix?: string;
  }) => {
    if (!comparison.hasPrevious) return null;

    const pct = comparison.percentChange;
    if (pct === 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-md">
          <Minus className="w-3 h-3" />
          <span>0.0%</span>
        </span>
      );
    }

    // Với doanh thu: tăng là tốt (xanh), giảm là xấu (đỏ)
    // Với chi phí: tăng là đỏ, giảm là xanh
    const isPositive = pct > 0;
    const isGood = isCost ? !isPositive : isPositive;

    return (
      <span
        className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
          isGood
            ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-950/70'
            : 'text-rose-700 bg-rose-100 dark:text-rose-300 dark:bg-rose-950/70'
        }`}
        title={`${comparison.diff > 0 ? '+' : ''}${formatVND(comparison.diff)} so với cùng kỳ`}
      >
        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        <span>
          {isPositive ? '+' : ''}
          {pct.toFixed(1)}%
          {labelSuffix}
        </span>
      </span>
    );
  };

  return (
    <div className="space-y-4">
      
      {/* 1. Executive Quick Insights Strip (Ưu tiên hiển thị % Chi Phí theo Doanh Thu) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        
        {/* Box 1: Tiến độ Doanh số */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 dark:from-emerald-950/40 dark:to-teal-950/20 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl p-3 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3.5 h-3.5" />
              Tiến Độ Tháng
            </span>
            <div className="text-lg font-black text-emerald-950 dark:text-emerald-100">
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

        {/* Box 2: TỶ LỆ CHI PHÍ ADS / DOANH THU (ƯU TIÊN THẤY LUÔN) */}
        <div className="bg-gradient-to-br from-rose-50 to-pink-50/60 dark:from-rose-950/40 dark:to-pink-950/20 border border-rose-200/80 dark:border-rose-800/60 rounded-xl p-3 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1">
              <PieChart className="w-3.5 h-3.5" />
              Tổng CP Ads / Doanh Thu
            </span>
            <div className="text-lg font-black text-rose-700 dark:text-rose-400 flex items-baseline gap-1.5">
              <span>{formatPercent(periodMetrics.totalAdsPercent)}</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                ({formatCompactVND(periodMetrics.totalAdsCost.current)})
              </span>
            </div>
            <p className="text-[11px] text-rose-700 dark:text-rose-300">
              FB {formatPercent(periodMetrics.fbAdsPercent)} • GG {formatPercent(periodMetrics.ggAdsPercent)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs">
            %
          </div>
        </div>

        {/* Box 3: Áp Lực Về Đích */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-amber-950/40 dark:to-orange-950/20 border border-amber-200/80 dark:border-amber-800/60 rounded-xl p-3 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              Áp Lực Về Đích
            </span>
            <div className="text-lg font-black text-amber-950 dark:text-amber-100">
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

        {/* Box 4: Ngôi Sao Doanh Số */}
        <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50/60 dark:from-purple-950/40 dark:to-fuchsia-950/20 border border-purple-200/80 dark:border-purple-800/60 rounded-xl p-3 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              Ngôi Sao Doanh Số
            </span>
            <div className="text-lg font-black text-purple-950 dark:text-purple-100 truncate">
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
              <p className="text-xs text-slate-400 font-medium">Tổng chi phí Ads tháng</p>
              <p className="text-base font-bold text-rose-300">
                {formatVND(overview.totalAdsCost)}
                <span className="text-xs font-bold text-rose-400 ml-1">
                  ({formatPercent(overview.totalAdsPercent || ((overview.totalAdsCost / overview.totalRevenue) * 100))})
                </span>
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

      {/* 2b. Executive Month-End Forecast Card (DỰ BÁO XU HƯỚNG CUỐI THÁNG) */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 md:p-6 shadow-xl border-2 border-indigo-500/40 relative overflow-hidden transition-all duration-300">
        
        {/* Glow & Decorative elements */}
        <div className="absolute top-0 right-1/4 -mt-12 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 -mb-10 -mr-10 w-48 h-48 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Forecast Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-indigo-500 flex items-center justify-center shadow-md shadow-indigo-500/30 text-white shrink-0">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  DỰ BÁO XU HƯỚNG CUỐI THÁNG {currentMonth}/{currentYear}
                </h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  Dựa trên nhịp độ thực tế
                </span>
              </div>
              <p className="text-xs text-indigo-200/70">
                Ước tính kết quả toàn tháng dựa trên lịch sử doanh thu & chi phí quảng cáo từ đầu tháng đến nay
              </p>
            </div>
          </div>

          {/* Timeline Pill */}
          <div className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-indigo-900/60 border border-indigo-700/50 text-xs shadow-inner">
            <Calendar className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
            <span className="text-slate-300 font-medium">
              Đã chạy: <b className="text-white font-bold">{daysPassed}/{daysInMonth} ngày</b>
              {remainingDays > 0 ? (
                <> (còn <b className="text-amber-300 font-bold">{remainingDays} ngày</b>)</>
              ) : (
                <span className="text-emerald-300 ml-1 font-bold">• Đã chốt tháng</span>
              )}
            </span>
          </div>
        </div>

        {/* 3 Core Forecast Metrics Cards Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          
          {/* Metric 1: DỰ BÁO DOANH SỐ CHỐT THÁNG */}
          <div className="bg-slate-900/75 backdrop-blur-md rounded-xl p-4 border border-emerald-500/30 relative overflow-hidden group hover:border-emerald-400/60 transition shadow-inner">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-extrabold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Dự Báo Doanh Số Chốt Tháng
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ~{forecastTargetPercent}% KPI
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {formatVND(forecastRevenue)}
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Nhịp độ dự phóng:</span>
                <span className="font-bold text-emerald-400">~{formatCompactVND(projectedDailyRevenue)}/ngày</span>
              </div>
              {remainingDays > 0 && (
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Dự kiến thu thêm {remainingDays} ngày tới:</span>
                  <span className="font-semibold text-slate-200">+{formatCompactVND(projectedExtraRevenue)}</span>
                </div>
              )}
              {/* Mini Target Progress Bar */}
              <div className="pt-1">
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(forecastTargetPercent, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Metric 2: DỰ BÁO CHI PHÍ QC CUỐI THÁNG */}
          <div className="bg-slate-900/75 backdrop-blur-md rounded-xl p-4 border border-rose-500/30 relative overflow-hidden group hover:border-rose-400/60 transition shadow-inner">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-extrabold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-400" />
                Dự Báo Chi Phí QC Cuối Tháng
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                FB & Google
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-black text-rose-300 tracking-tight">
              {formatVND(forecastAdsCost)}
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Chi phí Ads dự phóng:</span>
                <span className="font-bold text-rose-400">~{formatCompactVND(projectedDailyAdsCost)}/ngày</span>
              </div>
              {remainingDays > 0 && (
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Chi thêm {remainingDays} ngày tới:</span>
                  <span className="font-semibold text-rose-200">+{formatCompactVND(projectedExtraAdsCost)}</span>
                </div>
              )}
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-0.5">
                <span>FB: ~{formatCompactVND(projectedDailyFbAds)}/n • GG: ~{formatCompactVND(dailyGgAds)}/n</span>
                <span className="font-medium text-slate-300">Đã chi: {formatCompactVND(totalAdsSoFar)}</span>
              </div>
            </div>
          </div>

          {/* Metric 3: CHI PHÍ DỰ KIẾN CHIẾM % TRÊN DOANH THU */}
          <div className="bg-slate-900/75 backdrop-blur-md rounded-xl p-4 border border-amber-500/30 relative overflow-hidden group hover:border-amber-400/60 transition shadow-inner">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-amber-400" />
                Chi Phí Chiếm % Doanh Thu
              </span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${
                forecastAdsPercent <= 26
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : forecastAdsPercent <= 30
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}>
                {forecastAdsPercent <= 26 ? 'An Toàn' : forecastAdsPercent <= 30 ? 'Cân Đối' : 'Cần Tối Ưu'}
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight flex items-baseline gap-2">
              <span>{formatPercent(forecastAdsPercent)}</span>
              <span className="text-xs font-semibold text-slate-400">/ doanh thu dự báo</span>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">So với hiện tại ({formatPercent(currentAdsPercent)}):</span>
                <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                  diffAdsPercent <= 0
                    ? 'text-emerald-400 bg-emerald-950/60'
                    : 'text-amber-400 bg-amber-950/60'
                }`}>
                  {diffAdsPercent > 0 ? `+${diffAdsPercent.toFixed(2)}%` : `${diffAdsPercent.toFixed(2)}%`}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 leading-relaxed pt-0.5">
                {diffAdsPercent <= 0
                  ? `Tỷ lệ chi phí có xu hướng giảm tối ưu (${diffAdsPercent.toFixed(2)}%) nhờ doanh số chốt đơn tăng tốc.`
                  : `Tỷ lệ chi phí dự kiến biến động nhẹ (+${diffAdsPercent.toFixed(2)}%) do nhịp độ chạy Ads 7 ngày gần đây.`}
              </div>
            </div>
          </div>

        </div>

        {/* Executive Action Note */}
        {remainingDays > 0 ? (
          <div className="relative z-10 mt-4 pt-3.5 border-t border-indigo-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 text-indigo-200">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <b>Nhận định điều hành:</b> Nhịp độ dự kiến ~{formatCompactVND(projectedDailyRevenue)}/ngày sẽ giúp chốt tháng đạt ~{formatCompactVND(forecastRevenue)} ({forecastTargetPercent}% KPI). Để cán mốc 800 triệu, <b>{remainingDays} ngày</b> còn lại cần bứt phá doanh số đạt <b>{formatCompactVND(neededDailyRevenue)}/ngày</b>.
              </span>
            </div>
          </div>
        ) : (
          <div className="relative z-10 mt-4 pt-3.5 border-t border-indigo-800/40 text-xs text-indigo-200">
            <span>🎉 Tháng này đã kết thúc với tổng doanh thu <b>{formatVND(totalRevSoFar)}</b> và chi phí quảng cáo <b>{formatVND(totalAdsSoFar)}</b> ({formatPercent(overview.totalAdsPercent)}% doanh thu).</span>
          </div>
        )}

      </div>

      {/* 3. Grid of 4 Main Cards for Selected Period (Doanh thu & Chi phí có so sánh cùng kỳ) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Card 1: Doanh Thu Tổng & FB trong kỳ */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 shadow-xs border border-slate-200/80 dark:border-slate-700/80 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Tổng Doanh Thu
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatVND(periodMetrics.totalRevenue.current)}
            </div>
            <RenderDeltaBadge comparison={periodMetrics.totalRevenue} />
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              DT Facebook: <b className="text-blue-600 dark:text-blue-400">{formatCompactVND(periodMetrics.fbRevenue.current)}</b>
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              DT Google: <b className="text-amber-600 dark:text-amber-400">{formatCompactVND(periodMetrics.ggRevenue.current)}</b>
            </span>
          </div>
        </div>

        {/* Card 2: Chi phí QC Facebook & % trên Doanh thu FB */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 shadow-xs border border-slate-200/80 dark:border-slate-700/80 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Chi Phí QC Facebook
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatVND(periodMetrics.fbAdsCost.current)}
            </div>
            <RenderDeltaBadge comparison={periodMetrics.fbAdsCost} isCost={true} />
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Chiếm % Tổng Doanh Thu:
              </span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md">
                {formatPercent(periodMetrics.fbAdsPercent)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-dashed border-slate-100 dark:border-slate-700/40">
              <span>Chưa thuế (cột E):</span>
              <b className="text-slate-700 dark:text-slate-200">{formatCompactVND(periodMetrics.fbAdsCostBeforeTax.current)} ({formatVND(periodMetrics.fbAdsCostBeforeTax.current)})</b>
            </div>
          </div>
        </div>

        {/* Card 3: Chi phí QC Google & % trên Doanh thu GG */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 shadow-xs border border-slate-200/80 dark:border-slate-700/80 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Chi Phí QC Google
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatVND(periodMetrics.ggAdsCost.current)}
            </div>
            <RenderDeltaBadge comparison={periodMetrics.ggAdsCost} isCost={true} />
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Chiếm DT Google:
            </span>
            <span className="font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md">
              {formatPercent(periodMetrics.ggAdsPercent)}
            </span>
          </div>
        </div>

        {/* Card 4: TỔNG CHI PHÍ QUẢNG CÁO & TỶ LỆ TRÊN DOANH THU (ƯU TIÊN THẤY LUÔN) */}
        <div className="bg-gradient-to-br from-rose-50/80 to-pink-50/40 dark:from-rose-950/30 dark:to-pink-950/10 rounded-2xl p-4 shadow-xs border-2 border-rose-300/80 dark:border-rose-800/80 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-900 dark:text-rose-300">
              Tổng Chi Phí QC
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <PieChart className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className="text-2xl font-black text-rose-700 dark:text-rose-300 tracking-tight">
              {formatVND(periodMetrics.totalAdsCost.current)}
            </div>
            <RenderDeltaBadge comparison={periodMetrics.totalAdsCost} isCost={true} />
          </div>

          <div className="mt-2.5 pt-2 border-t border-rose-200/60 dark:border-rose-800/60 flex items-center justify-between text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-bold">
              Chiếm % Tổng Doanh Thu:
            </span>
            <span className="font-black text-sm text-white bg-rose-600 px-2.5 py-0.5 rounded-md shadow-xs">
              {formatPercent(periodMetrics.totalAdsPercent)}
            </span>
          </div>
        </div>

      </div>

      {/* 4. Sales Funnel Grid (Khách mới, SĐT, Số đơn, Tỉ lệ chốt) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              Khách mới
            </span>
            <RenderDeltaBadge comparison={periodMetrics.totalLeads} />
          </div>
          <div className="text-xl font-black text-slate-800 dark:text-slate-100">
            {formatNumber(periodMetrics.totalLeads.current)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            CP/Khách: <b className="text-blue-600 dark:text-blue-400">{periodMetrics.totalLeads.current > 0 ? formatVND(Math.round(periodMetrics.fbAdsCostBeforeTax.current / periodMetrics.totalLeads.current)) : '-'}</b>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-teal-500" />
              Số điện thoại
            </span>
            <RenderDeltaBadge comparison={periodMetrics.totalPhones} />
          </div>
          <div className="text-xl font-black text-slate-800 dark:text-slate-100">
            {formatNumber(periodMetrics.totalPhones.current)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            {periodMetrics.totalLeads.current > 0 ? formatPercent((periodMetrics.totalPhones.current / periodMetrics.totalLeads.current) * 100) : '0%'} để lại SĐT
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
              Số Đơn Hàng
            </span>
            <RenderDeltaBadge comparison={periodMetrics.totalOrders} />
          </div>
          <div className="text-xl font-black text-slate-800 dark:text-slate-100">
            {formatNumber(periodMetrics.totalOrders.current)} đơn
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            <Percent className="w-3.5 h-3.5 text-violet-500" />
            <span>Tỉ lệ chốt</span>
          </div>
          <div className="text-xl font-black text-violet-600 dark:text-violet-400">
            {formatPercent(periodMetrics.closingRateLeads)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            {formatPercent(periodMetrics.closingRatePhones)} trên SĐT
          </div>
        </div>

      </div>

    </div>
  );
};
