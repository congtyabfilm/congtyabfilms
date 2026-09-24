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
  Legend
} from 'recharts';
import type { DailyData } from '../types/dashboard';
import { formatCompactVND, formatVND } from '../utils/formatters';

interface RevenueChartProps {
  dailyData: DailyData[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ dailyData }) => {
  const [viewMode, setViewMode] = useState<'all' | 'revenue' | 'ads'>('all');

  // Chuẩn hóa dữ liệu cho Recharts
  const chartData = dailyData.map((d) => ({
    name: `N.${d.dayIndex}`,
    fullLabel: d.dateLabel,
    dayIndex: d.dayIndex,
    fbRevenue: d.fbRevenue,
    ggRevenue: d.ggRevenue,
    totalRevenue: d.totalRevenue,
    fbAdsCost: d.fbAdsCostAfterTax,
    fbAdsBeforeTax: d.fbAdsCostBeforeTax,
    orders: d.orders,
    leads: d.leads
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[220px]">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 text-sm">
            {data.fullLabel || `Ngày ${data.dayIndex}`}
          </div>
          <div className="flex justify-between items-center text-emerald-400">
            <span>DT Facebook:</span>
            <span className="font-semibold">{formatVND(data.fbRevenue)}</span>
          </div>
          <div className="flex justify-between items-center text-amber-400">
            <span>DT Google:</span>
            <span className="font-semibold">{formatVND(data.ggRevenue)}</span>
          </div>
          <div className="flex justify-between items-center text-sky-300 font-bold pt-0.5 border-t border-slate-800">
            <span>Tổng Doanh Thu:</span>
            <span>{formatVND(data.totalRevenue)}</span>
          </div>
          <div className="flex justify-between items-center text-rose-400 pt-0.5">
            <span>Chi phí QC FB (sau thuế):</span>
            <span className="font-semibold">{formatVND(data.fbAdsCost)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <span>Chưa thuế:</span>
            <span>{formatVND(data.fbAdsBeforeTax)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-300 pt-1 border-t border-slate-800">
            <span>Đơn / Khách mới:</span>
            <span>{data.orders} đơn / {data.leads} khách</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-700/80">
      
      {/* Header and Toggle buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3 border-b border-slate-100 dark:border-slate-700/60">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Biến Động Doanh Thu & Chi Phí Quảng Cáo Theo Từng Ngày
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            So sánh doanh thu FB, Google và chi phí QC FB theo từng ngày trong tháng
          </p>
        </div>

        {/* View Mode Filters */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-xl self-start sm:self-auto text-xs font-medium">
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1 rounded-lg transition ${
              viewMode === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setViewMode('revenue')}
            className={`px-3 py-1 rounded-lg transition ${
              viewMode === 'revenue'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Chỉ Doanh thu
          </button>
          <button
            onClick={() => setViewMode('ads')}
            className={`px-3 py-1 rounded-lg transition ${
              viewMode === 'ads'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Chỉ Chi phí QC
          </button>
        </div>
      </div>

      {/* Chart container */}
      <div className="h-80 w-full pt-4">
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
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: 16, fontSize: '12px' }}
              iconType="circle"
            />

            {(viewMode === 'all' || viewMode === 'revenue') && (
              <>
                <Bar
                  dataKey="fbRevenue"
                  name="DT Facebook"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                  stackId="revenue"
                />
                <Bar
                  dataKey="ggRevenue"
                  name="DT Google + Khác"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                  stackId="revenue"
                />
                <Line
                  type="monotone"
                  dataKey="totalRevenue"
                  name="Tổng Doanh Thu Ngày"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#3b82f6' }}
                  activeDot={{ r: 6 }}
                />
              </>
            )}

            {(viewMode === 'all' || viewMode === 'ads') && (
              <Line
                type="monotone"
                dataKey="fbAdsCost"
                name="Chi phí QC FB (sau thuế)"
                stroke="#f43f5e"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#f43f5e' }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
