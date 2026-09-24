export interface StaffSummary {
  id: string;
  name: string;
  headerRaw: string;
  target: number;
  revenue: number;
  remaining: number;
  completionRate: number;
  leads: number;
  phones: number;
  orders: number;
  closingRateLeads: number;
  closingRatePhones: number;
}

export interface StaffDailyPerformance {
  leads: number;
  phones: number;
  orders: number;
  revenue: number;
  closingRate: number;
}

export interface DailyData {
  dayIndex: number;
  dateLabel: string;
  fbRevenue: number;
  ggRevenue: number;
  totalRevenue: number;
  fbAdsCostBeforeTax: number;
  fbAdsCostAfterTax: number;
  leads: number;
  phones: number;
  orders: number;
  closingRate: number;
  staff: Record<string, StaffDailyPerformance>;
}

export interface OverviewMetrics {
  budget: number;
  targetRevenue: number;
  totalRevenue: number;
  remainingRevenue: number;
  targetDaily: number;
  fbRevenue: number;
  ggRevenue: number;
  fbAdsCost: number;
  fbAdsCostBeforeTax: number;
  ggAdsCost: number;
  totalAdsCost: number;
  // % Chi phí theo doanh thu (ưu tiên hiển thị)
  fbAdsPercent: number; // Chi phí FB / DT FB %
  ggAdsPercent: number; // Chi phí GG / DT GG %
  totalAdsPercent: number; // Tổng chi phí / Tổng DT %
  totalLeads: number;
  totalPhones: number;
  totalOrders: number;
  costPerOrder: number;
  costPerLead: number;
  closingRateLeads: number;
  closingRatePhones: number;
}

export interface MonthOption {
  id: string;
  month: number;
  year: number;
  label: string;
  overviewSheet: string;
  saleSheet: string | null;
}

export type TimePeriod = 'month' | 'today' | 'yesterday' | 'this_week' | 'last_week';

export interface ComparisonValue {
  current: number;
  previous: number;
  diff: number;
  percentChange: number; // e.g. +15.2 or -8.3
  hasPrevious: boolean;
}

export interface PeriodMetrics {
  periodKey: TimePeriod;
  periodLabel: string;
  comparisonLabel: string;
  // Các chỉ số tính theo kỳ chọn
  totalRevenue: ComparisonValue;
  fbRevenue: ComparisonValue;
  ggRevenue: ComparisonValue;
  fbAdsCost: ComparisonValue;
  fbAdsCostBeforeTax: ComparisonValue;
  ggAdsCost: ComparisonValue;
  totalAdsCost: ComparisonValue;
  totalAdsPercent: number; // % Chi phí trên doanh thu trong kỳ
  fbAdsPercent: number;
  ggAdsPercent: number;
  totalLeads: ComparisonValue;
  totalPhones: ComparisonValue;
  totalOrders: ComparisonValue;
  closingRateLeads: number;
  closingRatePhones: number;
  daysIncluded: number[];
}

export interface DashboardData {
  success: boolean;
  month: number;
  year: number;
  monthLabel: string;
  availableMonths: MonthOption[];
  overview: OverviewMetrics;
  staffList: StaffSummary[];
  daily: DailyData[];
  lastUpdated: string;
  isMock?: boolean;
}
