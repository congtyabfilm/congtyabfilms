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
  roasFB: number;
  roasGG: number;
  roasTotal: number;
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
