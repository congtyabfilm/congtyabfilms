import React, { useState } from 'react';
import {
  Film,
  MessageSquare,
  PhoneCall,
  Coins,
  Target,
  Download,
  Search,
  Sparkles,
  Filter
} from 'lucide-react';
import type { PhimDienSummary, TimePeriod, PeriodMetrics } from '../types/dashboard';
import { formatVND, formatNumber, formatPercent, formatDateDDMMYYYY } from '../utils/formatters';

interface PhimDienModuleProps {
  phimDien?: PhimDienSummary;
  monthLabel: string;
  selectedPeriod?: TimePeriod;
  periodMetrics?: PeriodMetrics | null;
}

export const PhimDienModule: React.FC<PhimDienModuleProps> = ({
  phimDien,
  monthLabel,
  selectedPeriod = 'month',
  periodMetrics
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewScope, setViewScope] = useState<'period' | 'all'>('all');

  // Dữ liệu an toàn dự phòng nếu chưa có dữ liệu phim điện
  const summary = phimDien || {
    totalCost: 0,
    totalMessages: 0,
    totalPhones: 0,
    costPerMessage: 0,
    daily: []
  };

  const dailyList = summary.daily || [];

  // Kiểm tra xem có đang lọc theo kỳ con (Hôm nay, Hôm qua, Tuần này, Tuần trước) không
  const isFilteredByPeriod =
    selectedPeriod !== 'month' &&
    selectedPeriod !== 'last_month' &&
    (periodMetrics?.daysIncluded?.length || 0) > 0;

  const daysIncludedSet = new Set(periodMetrics?.daysIncluded || []);

  // Danh sách các ngày thuộc kỳ đang lọc
  const periodDays = isFilteredByPeriod
    ? dailyList.filter((d) => daysIncludedSet.has(d.dayIndex))
    : dailyList;

  // 1. Tính toán 4 thẻ tổng theo kỳ lọc được chọn ở thanh điều hướng trên đầu
  const activeCost = periodDays.reduce((acc, d) => acc + (d.cost || 0), 0);
  const activeMessages = periodDays.reduce((acc, d) => acc + (d.messages || 0), 0);
  const activePhones = periodDays.reduce((acc, d) => acc + (d.phones || 0), 0);
  const activeCostPerMsg = activeMessages > 0 ? Math.round(activeCost / activeMessages) : 0;
  const activePhoneRate = activeMessages > 0 ? (activePhones / activeMessages) * 100 : 0;

  // 2. Danh sách ngày hiển thị trong bảng (theo phạm vi xem 'all' hoặc 'period')
  const baseTableData = (isFilteredByPeriod && viewScope === 'period') ? periodDays : dailyList;

  // Lọc theo từ khóa ngày tìm kiếm
  const filteredDaily = baseTableData.filter((d) =>
    (d.dateLabel || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xuất file CSV Phim Điện
  const handleExportCSV = () => {
    const headers = [
      'Ngày',
      'Chi phí',
      'Tin nhắn',
      'Số điện thoại (SĐT)',
      '% Để lại SĐT',
      'CP / Tin nhắn'
    ];

    const rows = dailyList.map((d) => [
      `"${formatDateDDMMYYYY(d.dateLabel, d.dayIndex)}"`,
      d.cost,
      d.messages,
      d.phones,
      d.messages > 0 ? `"${formatPercent((d.phones / d.messages) * 100)}"` : '"0%"',
      d.messages > 0 ? Math.round(d.cost / d.messages) : 0
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Phim_Dien_${monthLabel.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="space-y-4">
      {/* Module Title & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent dark:from-amber-950/30 dark:via-orange-950/10 p-4 sm:p-5 rounded-2xl border border-amber-200/60 dark:border-amber-900/40">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Chiến Dịch QC Phim Điện
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <Sparkles className="w-3 h-3" />
                Không gắn Sale
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Facebook Ads Độc Lập
              </span>
              {isFilteredByPeriod && periodMetrics?.periodLabel && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  <Filter className="w-3 h-3" />
                  Đang lọc: {periodMetrics.periodLabel}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Báo cáo hiệu quả chiến dịch quảng cáo Phim điện riêng biệt
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 sm:text-right shrink-0">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {periodMetrics?.periodLabel || monthLabel}
          </span>
          <span className="block text-[11px] text-slate-400">
            {isFilteredByPeriod ? `Dữ liệu lọc ${periodDays.length} ngày` : 'Dữ liệu toàn bộ tháng'}
          </span>
        </div>
      </div>

      {/* 4 Summary Cards - Tự động tính toán theo kỳ đang lọc */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Chi phí */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm relative overflow-hidden group hover:border-amber-300 dark:hover:border-amber-700 transition">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Chi Phí QC</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
            {formatVND(activeCost)}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isFilteredByPeriod ? `Chi phí ${periodMetrics?.periodLabel}` : 'Chi phí cả tháng'}
          </div>
        </div>

        {/* Card 2: Tin nhắn */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm relative overflow-hidden group hover:border-sky-300 dark:hover:border-sky-700 transition">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Tổng Tin Nhắn</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
            {formatNumber(activeMessages)}
            <span className="text-xs font-normal text-slate-500 ml-1">tin</span>
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            Tương tác nhắn tin mới
          </div>
        </div>

        {/* Card 3: Số điện thoại (SĐT) - Hiển thị dạng "20,00% để lại SĐT" theo đúng yêu cầu */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm relative overflow-hidden group hover:border-emerald-300 dark:hover:border-emerald-700 transition">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Số Điện Thoại (SĐT)</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
            {formatNumber(activePhones)}
            <span className="text-xs font-normal text-slate-500 ml-1">SĐT</span>
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            {activeMessages > 0 ? formatPercent(activePhoneRate) : '0%'} để lại SĐT
          </div>
        </div>

        {/* Card 4: Chi phí / Tin nhắn */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm relative overflow-hidden group hover:border-violet-300 dark:hover:border-violet-700 transition">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">CP / Tin Nhắn</span>
            <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-bold text-violet-600 dark:text-violet-400">
            {activeMessages > 0 ? formatVND(activeCostPerMsg) : '-'}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            Chi phí trên mỗi tin nhắn
          </div>
        </div>

      </div>

      {/* Daily Table for Phim Điện */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/80 overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              Chi Tiết Từng Ngày - Phim Điện
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dóng theo ngày trong tháng, chi phí hàng ngày và hiệu quả tin nhắn
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Toggle hiển thị theo kỳ hoặc cả tháng khi đang chọn bộ lọc */}
            {isFilteredByPeriod && (
              <div className="inline-flex rounded-xl p-0.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs">
                <button
                  onClick={() => setViewScope('period')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    viewScope === 'period'
                      ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  Theo kỳ ({periodDays.length})
                </button>
                <button
                  onClick={() => setViewScope('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    viewScope === 'all'
                      ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  Cả tháng ({dailyList.length})
                </button>
              </div>
            )}

            {/* Search box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo ngày..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-700 border-none text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 w-32 sm:w-44"
              />
            </div>

            {/* Export CSV button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition"
              title="Tải bảng dữ liệu Phim Điện về file Excel / CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xuất CSV</span>
            </button>
          </div>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="sm:hidden px-4 py-1.5 bg-amber-50/70 dark:bg-amber-950/30 text-[11px] text-amber-800 dark:text-amber-300 flex items-center justify-between border-b border-amber-100/60 dark:border-amber-900/40">
          <span>👈 Vuốt ngang xem đủ các cột</span>
          <span className="font-semibold">Cột Ngày được cố định</span>
        </div>

        {/* Table content - Đã loại bỏ hoàn toàn phần footer Tổng Cộng theo yêu cầu */}
        <div className="overflow-x-auto relative scroll-smooth">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                <th className="py-3 px-4 sticky left-0 z-20 bg-slate-50 dark:bg-slate-900 shadow-[2px_0_4px_rgba(0,0,0,0.06)] whitespace-nowrap">
                  Ngày
                </th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Chi Phí</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Tin Nhắn</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Số Điện Thoại (SĐT)</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">% Để Lại SĐT</th>
                <th className="py-3 px-4 text-right text-violet-600 dark:text-violet-400 whitespace-nowrap">
                  CP / Tin Nhắn
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredDaily.length > 0 ? (
                filteredDaily.map((row) => {
                  const cpPerMsg = row.messages > 0 ? Math.round(row.cost / row.messages) : 0;
                  const rowPhoneRate = row.messages > 0 ? (row.phones / row.messages) * 100 : 0;
                  const hasData = row.cost > 0 || row.messages > 0 || row.phones > 0;
                  const isDayInPeriod = isFilteredByPeriod && daysIncludedSet.has(row.dayIndex);

                  return (
                    <tr
                      key={row.dayIndex}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition ${
                        isDayInPeriod
                          ? 'bg-amber-100/40 dark:bg-amber-950/40 font-medium'
                          : hasData
                          ? 'bg-amber-50/20 dark:bg-amber-950/10'
                          : ''
                      }`}
                    >
                      <td className={`py-3 px-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap sticky left-0 z-10 shadow-[2px_0_4px_rgba(0,0,0,0.06)] ${
                        isDayInPeriod ? 'bg-amber-100/60 dark:bg-amber-950' : 'bg-white dark:bg-slate-800'
                      }`}>
                        <div className="flex items-center gap-1.5">
                          {formatDateDDMMYYYY(row.dateLabel, row.dayIndex)}
                          {isDayInPeriod && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" title="Ngày trong kỳ lọc" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-medium whitespace-nowrap">
                        {row.cost > 0 ? (
                          <span className="text-amber-600 dark:text-amber-400 font-semibold">
                            {formatVND(row.cost)}
                          </span>
                        ) : (
                          <span className="text-slate-400">0 đ</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {row.messages > 0 ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold text-xs">
                            {formatNumber(row.messages)}
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {row.phones > 0 ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                            {formatNumber(row.phones)}
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {row.messages > 0 ? (
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {formatPercent(rowPhoneRate)}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {cpPerMsg > 0 ? (
                          <span className="font-semibold text-violet-600 dark:text-violet-400">
                            {formatVND(cpPerMsg)}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    {searchTerm ? 'Không tìm thấy ngày phù hợp với từ khóa' : 'Chưa có dữ liệu Phim Điện'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
};
