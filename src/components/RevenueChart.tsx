import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart
} from 'recharts';
import type { DailyData, StaffSummary, OverviewMetrics } from '../types/dashboard';
import { formatCompactVND, formatVND, formatPercent } from '../utils/formatters';
import { BarChart3, PieChart as PieIcon, Users, Calendar } from 'lucide-react';

interface RevenueChartProps {
  dailyData: DailyData[];
  staffList?: StaffSummary[];
  overview?: OverviewMetrics;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({
  dailyData,
  staffList = [],
  overview
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'channels' | 'staff'>('daily');
  const [dailyFilter, setDailyFilter] = useState<'all' | 'revenue' | 'ads'>('all');

  // Chuẩn hóa dữ liệu biểu đồ ngày
  const chartData = dailyData.map((d) => {
    // d.dateLabel đã được chuẩn hóa dạng dd/mm/yyyy (ví dụ: 01/09/2026)
    const shortLabel = d.dateLabel && d.dateLabel.includes('/')
      ? d.dateLabel.split('/').slice(0, 2).join('/') // Lấy "01/09"
      : `N.${d.dayIndex}`;

    return {
      name: shortLabel,
      fullLabel: d.dateLabel,
      dayIndex: d.dayIndex,
      fbRevenue: d.fbRevenue,
      ggRevenue: d.ggRevenue,
      totalRevenue: d.totalRevenue,
      fbAdsCost: d.fbAdsCostAfterTax,
      fbAdsBeforeTax: d.fbAdsCostBeforeTax,
      orders: d.orders,
      leads: d.leads
    };
  });

  // Dữ liệu Donut Chart Doanh thu
  const revenueChannelData = [
    { name: 'Facebook', value: overview?.fbRevenue || 329387900, color: '#10b981' },
    { name: 'Google + Khác', value: overview?.ggRevenue || 180659600, color: '#f59e0b' }
  ];

  // Dữ liệu Donut Chart Chi phí Ads
  const adsCostChannelData = [
    { name: 'Facebook Ads', value: overview?.fbAdsCost || 99716899, color: '#6366f1' },
    { name: 'Google Ads', value: overview?.ggAdsCost || 30354820, color: '#f43f5e' }
  ];

  // Dữ liệu Bar Chart so sánh Sale
  const staffChartData = staffList.map((s) => ({
    name: s.name,
    revenue: s.revenue,
    target: s.target,
    completionRate: s.completionRate,
    orders: s.orders,
    leads: s.leads
  }));

  const CustomDailyTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-2xl border border-slate-700 text-xs space-y-1.5 min-w-[220px]">
          <div className="font-extrabold text-slate-100 border-b border-slate-800 pb-1 flex items-center justify-between text-sm">
            <span>Ngày {data.fullLabel}</span>
            <span className="text-[11px] text-slate-400 font-normal">N.{data.dayIndex}</span>
          </div>
          <div className="flex justify-between items-center text-emerald-400">
            <span>DT Facebook:</span>
            <span className="font-bold">{formatVND(data.fbRevenue)}</span>
          </div>
          <div className="flex justify-between items-center text-amber-400">
            <span>DT Google + Khác:</span>
            <span className="font-bold">{formatVND(data.ggRevenue)}</span>
          </div>
          <div className="flex justify-between items-center text-sky-300 font-extrabold pt-1 border-t border-slate-800">
            <span>Tổng Doanh Thu:</span>
            <span>{formatVND(data.totalRevenue)}</span>
          </div>
          <div className="flex justify-between items-center text-rose-400 pt-1">
            <span>Chi phí QC FB (sau thuế):</span>
            <span className="font-bold">{formatVND(data.fbAdsCost)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <span>Chưa thuế (cột E):</span>
            <span>{formatVND(data.fbAdsBeforeTax)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-300 pt-1 border-t border-slate-800">
            <span>Đơn / Khách mới:</span>
            <span className="font-semibold text-emerald-300">{data.orders} đơn / {data.leads} khách</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 shadow-xs border border-slate-200/80 dark:border-slate-700/80 space-y-4">
      
      {/* Top Header & Chart Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-3 border-b border-slate-100 dark:border-slate-700/60">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Phân Tích Dữ Liệu & Biểu Đồ
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Theo dõi xu hướng ngày, cơ cấu doanh thu theo kênh và thi đua đội ngũ sale
          </p>
        </div>

        {/* 3 Main Analytics Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'daily'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Theo Ngày (30 ngày)</span>
          </button>

          <button
            onClick={() => setActiveTab('channels')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'channels'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Cơ Cấu FB vs GG</span>
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Thi Đua 4 Sale</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DAILY TREND CHART */}
      {activeTab === 'daily' && (
        <div className="space-y-3">
          
          {/* Daily Metric Filter */}
          <div className="flex justify-end gap-1 text-xs">
            <button
              onClick={() => setDailyFilter('all')}
              className={`px-2.5 py-1 rounded-md transition font-medium ${
                dailyFilter === 'all'
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setDailyFilter('revenue')}
              className={`px-2.5 py-1 rounded-md transition font-medium ${
                dailyFilter === 'revenue'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              Chỉ Doanh Thu
            </button>
            <button
              onClick={() => setDailyFilter('ads')}
              className={`px-2.5 py-1 rounded-md transition font-medium ${
                dailyFilter === 'ads'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              Chỉ Chi Phí Ads
            </button>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatCompactVND(v)}
                />
                <Tooltip content={<CustomDailyTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 14, fontSize: '12px' }} iconType="circle" />

                {(dailyFilter === 'all' || dailyFilter === 'revenue') && (
                  <>
                    <Bar
                      dataKey="fbRevenue"
                      name="DT Facebook"
                      fill="#10b981"
                      radius={[3, 3, 0, 0]}
                      maxBarSize={24}
                      stackId="rev"
                    />
                    <Bar
                      dataKey="ggRevenue"
                      name="DT Google + Khác"
                      fill="#f59e0b"
                      radius={[3, 3, 0, 0]}
                      maxBarSize={24}
                      stackId="rev"
                    />
                    <Line
                      type="monotone"
                      dataKey="totalRevenue"
                      name="Tổng DT Ngày"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      dot={{ r: 2.5, fill: '#3b82f6' }}
                      activeDot={{ r: 5 }}
                    />
                  </>
                )}

                {(dailyFilter === 'all' || dailyFilter === 'ads') && (
                  <Line
                    type="monotone"
                    dataKey="fbAdsCost"
                    name="Chi phí QC FB (sau thuế)"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 2.5, fill: '#f43f5e' }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TAB 2: CHANNEL DONUT CHARTS */}
      {activeTab === 'channels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
          
          {/* Revenue Breakdown */}
          <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 flex flex-col items-center">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Cơ Cấu Doanh Thu Theo Kênh
            </h4>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueChannelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {revenueChannelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatVND(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-around w-full text-xs font-semibold pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-emerald-600 dark:text-emerald-400">
                FB: {formatCompactVND(overview?.fbRevenue)} ({formatPercent(overview?.totalRevenue ? ((overview?.fbRevenue || 0) / overview.totalRevenue) * 100 : 64.6)})
              </span>
              <span className="text-amber-600 dark:text-amber-400">
                Google: {formatCompactVND(overview?.ggRevenue)} ({formatPercent(overview?.totalRevenue ? ((overview?.ggRevenue || 0) / overview.totalRevenue) * 100 : 35.4)})
              </span>
            </div>
          </div>

          {/* Ads Cost Breakdown */}
          <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 flex flex-col items-center">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Cơ Cấu Chi Phí Quảng Cáo
            </h4>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={adsCostChannelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {adsCostChannelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatVND(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-around w-full text-xs font-semibold pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-indigo-600 dark:text-indigo-400">
                FB: {formatCompactVND(overview?.fbAdsCost)} (ROAS: {overview?.roasFB}x)
              </span>
              <span className="text-rose-600 dark:text-rose-400">
                Google: {formatCompactVND(overview?.ggAdsCost)} (ROAS: {overview?.roasGG}x)
              </span>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: STAFF COMPARISON BAR CHART */}
      {activeTab === 'staff' && (
        <div className="space-y-2 py-2">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            So sánh doanh số thực tế của 4 nhân sự kinh doanh so với chỉ tiêu KPI 150.000.000 đ
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={staffChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatCompactVND(v)}
                />
                <Tooltip
                  formatter={(value: any, name?: any) => [
                    formatVND(value),
                    String(name) === 'revenue' ? 'Doanh số đạt' : 'Mục tiêu KPI'
                  ]}
                />
                <Legend wrapperStyle={{ paddingTop: 10, fontSize: '12px' }} />
                <Bar dataKey="revenue" name="Doanh số đạt" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={48} />
                <Bar dataKey="target" name="Mục tiêu KPI (150tr)" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
};
