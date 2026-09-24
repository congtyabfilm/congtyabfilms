import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  Search,
  Users
} from 'lucide-react';
import type { DailyData, StaffSummary } from '../types/dashboard';
import { formatVND, formatPercent, formatNumber, formatDateDDMMYYYY } from '../utils/formatters';

interface DailyTableProps {
  dailyData: DailyData[];
  staffList: StaffSummary[];
  monthLabel: string;
}

export const DailyTable: React.FC<DailyTableProps> = ({ dailyData, staffList, monthLabel }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  // Lọc theo từ khóa ngày
  const filteredData = dailyData.filter((d) =>
    d.dateLabel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleRow = (dayIndex: number) => {
    setExpandedDay(expandedDay === dayIndex ? null : dayIndex);
  };

  // Xuất file CSV
  const handleExportCSV = () => {
    const headers = [
      'Ngày',
      'Chi phí QC FB',
      'CP/Khách',
      'Doanh thu Facebook',
      'Doanh thu Google',
      'Tổng Doanh Thu Ngày',
      'Khách mới',
      'SĐT',
      'Đơn',
      'Tỷ lệ chốt (%)'
    ];

    const rows = dailyData.map((d) => [
      `"${formatDateDDMMYYYY(d.dateLabel, d.dayIndex)}"`,
      d.fbAdsCostBeforeTax,
      d.leads > 0 ? Math.round(d.fbAdsCostBeforeTax / d.leads) : 0,
      d.fbRevenue,
      d.ggRevenue,
      d.totalRevenue,
      d.leads,
      d.phones,
      Math.round(d.orders),
      `"${formatPercent(d.closingRate)}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bao_cao_${monthLabel.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/80 overflow-hidden">
      
      {/* Table Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Bảng Số Liệu Chi Tiết Theo Từng Ngày
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Bấm vào từng dòng để xem chi tiết kết quả kinh doanh của 4 nhân viên trong ngày đó
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo ngày..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-700 border-none text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-36 sm:w-48"
            />
          </div>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition"
            title="Tải bảng dữ liệu về file Excel / CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xuất CSV</span>
          </button>
        </div>
      </div>

      {/* Mobile Swipe Hint */}
      <div className="sm:hidden px-4 py-1.5 bg-emerald-50/60 dark:bg-emerald-950/30 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between border-b border-emerald-100/60 dark:border-emerald-900/40">
        <span>👈 Vuốt ngang xem đủ các cột</span>
        <span className="font-semibold">Cột Ngày được cố định</span>
      </div>

      {/* Table content */}
      <div className="overflow-x-auto relative scroll-smooth">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider">
              <th className="py-3 px-4 sticky left-0 z-20 bg-slate-50 dark:bg-slate-900 shadow-[2px_0_4px_rgba(0,0,0,0.06)] whitespace-nowrap">Ngày</th>
              <th className="py-3 px-3 text-right whitespace-nowrap">Chi Phí QC FB</th>
              <th className="py-3 px-3 text-right whitespace-nowrap">CP/Khách</th>
              <th className="py-3 px-3 text-right whitespace-nowrap">DT Facebook</th>
              <th className="py-3 px-3 text-right whitespace-nowrap">DT Google</th>
              <th className="py-3 px-3 text-right text-emerald-600 dark:text-emerald-400 whitespace-nowrap">Tổng DT Ngày</th>
              <th className="py-3 px-3 text-center whitespace-nowrap">Khách mới</th>
              <th className="py-3 px-3 text-center whitespace-nowrap">SĐT</th>
              <th className="py-3 px-3 text-center whitespace-nowrap">Đơn</th>
              <th className="py-3 px-3 text-center whitespace-nowrap">Tỷ lệ chốt</th>
              <th className="py-3 px-2 text-center w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {filteredData.map((row) => {
              const isExpanded = expandedDay === row.dayIndex;
              const cpPerLead = row.leads > 0 ? Math.round(row.fbAdsCostBeforeTax / row.leads) : 0;
              return (
                <React.Fragment key={row.dayIndex}>
                  <tr
                    onClick={() => toggleRow(row.dayIndex)}
                    className={`group cursor-pointer transition hover:bg-slate-50/80 dark:hover:bg-slate-700/40 ${
                      isExpanded ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : ''
                    }`}
                  >
                    <td className={`py-3 px-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap sticky left-0 z-10 shadow-[2px_0_4px_rgba(0,0,0,0.06)] transition-colors ${
                      isExpanded
                        ? 'bg-emerald-50 dark:bg-emerald-950'
                        : 'bg-white dark:bg-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-700'
                    }`}>
                      {formatDateDDMMYYYY(row.dateLabel, row.dayIndex)}
                    </td>
                    <td className="py-3 px-3 text-right text-rose-600 dark:text-rose-400 font-medium whitespace-nowrap">
                      {formatVND(row.fbAdsCostBeforeTax)}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                      {cpPerLead > 0 ? formatVND(cpPerLead) : '-'}
                    </td>
                    <td className="py-3 px-3 text-right text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap">
                      {formatVND(row.fbRevenue)}
                    </td>
                    <td className="py-3 px-3 text-right text-amber-600 dark:text-amber-400 font-medium whitespace-nowrap">
                      {formatVND(row.ggRevenue)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
                      {formatVND(row.totalRevenue)}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700 dark:text-slate-300">
                      {formatNumber(row.leads)}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700 dark:text-slate-300">
                      {formatNumber(row.phones)}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-white">
                      {row.orders > 0 ? (
                        <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px]">
                          {Math.round(row.orders)}
                        </span>
                      ) : (
                        '0'
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-violet-600 dark:text-violet-400">
                      {formatPercent(row.closingRate)}
                    </td>
                    <td className="py-3 px-2 text-center text-slate-400">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 inline" />
                      ) : (
                        <ChevronDown className="w-4 h-4 inline" />
                      )}
                    </td>
                  </tr>

                  {/* Expanded Row: 4 Staff Details on that Day */}
                  {isExpanded && (
                    <tr className="bg-slate-50/90 dark:bg-slate-900/70">
                      <td colSpan={11} className="py-3 px-4 sm:px-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                            <Users className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Chi tiết doanh số nhân sự ngày {formatDateDDMMYYYY(row.dateLabel, row.dayIndex)}:</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                            {staffList.map((staff) => {
                              const sData = row.staff[staff.name] || {
                                leads: 0,
                                phones: 0,
                                orders: 0,
                                revenue: 0,
                                closingRate: 0
                              };

                              return (
                                <div
                                  key={staff.id}
                                  className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs shadow-xs"
                                >
                                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700/50 pb-1 mb-1.5">
                                    <span>{staff.name}</span>
                                    <span className="text-emerald-600 dark:text-emerald-400">
                                      {formatVND(sData.revenue)}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                                    <div>
                                      Khách: <b className="text-slate-800 dark:text-slate-200">{sData.leads}</b>
                                    </div>
                                    <div>
                                      SĐT: <b className="text-slate-800 dark:text-slate-200">{sData.phones}</b>
                                    </div>
                                    <div>
                                      Đơn: <b className="text-slate-800 dark:text-slate-200">{sData.orders}</b>
                                    </div>
                                  </div>
                                  <div className="text-[11px] text-slate-400 pt-1 mt-1 border-t border-slate-50 dark:border-slate-700/30 flex justify-between">
                                    <span>Tỉ lệ chốt:</span>
                                    <span className="font-semibold text-violet-600 dark:text-violet-400">
                                      {formatPercent(sData.closingRate)}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
