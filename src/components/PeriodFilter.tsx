import React from 'react';
import type { TimePeriod } from '../types/dashboard';
import { Calendar, Clock, BarChart2 } from 'lucide-react';

interface PeriodFilterProps {
  selectedPeriod: TimePeriod;
  onSelectPeriod: (period: TimePeriod) => void;
  periodLabel: string;
  comparisonLabel: string;
}

export const PeriodFilter: React.FC<PeriodFilterProps> = ({
  selectedPeriod,
  onSelectPeriod,
  periodLabel,
  comparisonLabel
}) => {
  const options: { id: TimePeriod; label: string; icon?: React.ReactNode }[] = [
    { id: 'month', label: 'Tháng này' },
    { id: 'today', label: 'Hôm nay' },
    { id: 'yesterday', label: 'Hôm qua' },
    { id: 'this_week', label: 'Tuần này' },
    { id: 'last_week', label: 'Tuần trước' },
    { id: 'last_month', label: 'Tháng trước' }
  ];

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-3.5 shadow-xs border border-slate-200/80 dark:border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-3 transition">
      
      {/* Period Selection Buttons with Mobile Horizontal Scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth flex-nowrap md:flex-wrap pb-1 md:pb-0 -mx-1 px-1">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1.5 shrink-0">
          <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Kỳ xem:
        </span>
        {options.map((opt) => {
          const isActive = selectedPeriod === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelectPeriod(opt.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer shrink-0 whitespace-nowrap min-h-[38px] ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/70 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Active Period & Comparison Context Subtitle */}
      <div className="flex items-center gap-2 text-xs flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200/60 dark:border-emerald-800/40 shrink-0">
          <Calendar className="w-3.5 h-3.5" />
          <span>{periodLabel}</span>
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <BarChart2 className="w-3 h-3 text-slate-400 shrink-0" />
          <span>{comparisonLabel}</span>
        </div>
      </div>

    </div>
  );
};
