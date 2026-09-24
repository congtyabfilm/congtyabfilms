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
    { id: 'month', label: 'Toàn tháng' },
    { id: 'today', label: 'Hôm nay' },
    { id: 'yesterday', label: 'Hôm qua' },
    { id: 'this_week', label: 'Tuần này' },
    { id: 'last_week', label: 'Tuần trước' }
  ];

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-3.5 shadow-xs border border-slate-200/80 dark:border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-3 transition">
      
      {/* Period Selection Buttons */}
      <div className="flex items-center flex-wrap gap-1.5">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Kỳ xem:
        </span>
        {options.map((opt) => {
          const isActive = selectedPeriod === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelectPeriod(opt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer ${
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
      <div className="flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200/60 dark:border-emerald-800/40">
          <Calendar className="w-3.5 h-3.5" />
          <span>{periodLabel}</span>
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <BarChart2 className="w-3 h-3 text-slate-400" />
          <span>{comparisonLabel}</span>
        </div>
      </div>

    </div>
  );
};
