import type { DashboardData } from '../types/dashboard';

export const mockDashboardData: DashboardData = {
  success: true,
  month: 9,
  year: 2026,
  monthLabel: "Tháng 09/2026",
  isMock: true,
  availableMonths: [
    {
      id: "9_2026",
      month: 9,
      year: 2026,
      label: "Tháng 09/2026",
      overviewSheet: "Tháng 9/2026",
      saleSheet: "Sale tháng 9/2026"
    },
    {
      id: "8_2026",
      month: 8,
      year: 2026,
      label: "Tháng 08/2026",
      overviewSheet: "Tháng 8/2026",
      saleSheet: "Sale tháng 8/2026"
    },
    {
      id: "7_2026",
      month: 7,
      year: 2026,
      label: "Tháng 07/2026",
      overviewSheet: "Tháng 7/2026",
      saleSheet: "Sale tháng 7/2026"
    }
  ],
  overview: {
    budget: 120000000,
    targetRevenue: 800000000,
    totalRevenue: 510047500,
    remainingRevenue: 289952500,
    targetDaily: 41421786,
    fbRevenue: 329387900,
    ggRevenue: 180659600,
    fbAdsCost: 99716899,
    fbAdsCostBeforeTax: 89665407,
    ggAdsCost: 30354820,
    totalAdsCost: 130071719,
    fbAdsPercent: 30.27,
    ggAdsPercent: 16.80,
    totalAdsPercent: 25.50,
    totalLeads: 2461,
    totalPhones: 116,
    totalOrders: 46,
    costPerOrder: 1949248,
    costPerLead: 36435,
    closingRateLeads: 1.87,
    closingRatePhones: 39.66
  },
  staffList: [
    {
      id: "staff_1",
      name: "Trang",
      headerRaw: "Trang - 150.000.000đ hoàn thành 89,84%",
      target: 150000000,
      revenue: 134766000,
      remaining: 15234000,
      completionRate: 89.84,
      leads: 816,
      phones: 58,
      orders: 16,
      closingRateLeads: 1.96,
      closingRatePhones: 27.59
    },
    {
      id: "staff_2",
      name: "Cúc",
      headerRaw: "Cúc - 150.000.000đ hoàn thành 70,08%",
      target: 150000000,
      revenue: 105125000,
      remaining: 44875000,
      completionRate: 70.08,
      leads: 646,
      phones: 28,
      orders: 12,
      closingRateLeads: 1.86,
      closingRatePhones: 42.86
    },
    {
      id: "staff_3",
      name: "Hường",
      headerRaw: "Hường - 150.000.000đ hoàn thành 59,66%",
      target: 150000000,
      revenue: 89496900,
      remaining: 60503100,
      completionRate: 59.66,
      leads: 645,
      phones: 28,
      orders: 18,
      closingRateLeads: 2.79,
      closingRatePhones: 64.29
    },
    {
      id: "staff_4",
      name: "Khác",
      headerRaw: "Khác - 150.000.000đ hoàn thành 0,00%",
      target: 150000000,
      revenue: 0,
      remaining: 150000000,
      completionRate: 0.0,
      leads: 354,
      phones: 2,
      orders: 0,
      closingRateLeads: 0.0,
      closingRatePhones: 0.0
    }
  ],
  daily: [
    {
      dayIndex: 1,
      dateLabel: "Thứ Ba, 1 tháng 9",
      fbRevenue: 0,
      ggRevenue: 0,
      totalRevenue: 0,
      fbAdsCostBeforeTax: 4146661,
      fbAdsCostAfterTax: 4611502,
      leads: 115,
      phones: 4,
      orders: 0,
      closingRate: 0.0,
      staff: {
        "Trang": { leads: 16, phones: 4, orders: 0, revenue: 0, closingRate: 0.0 },
        "Cúc": { leads: 8, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 },
        "Hường": { leads: 10, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 },
        "Khác": { leads: 79, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 }
      }
    },
    {
      dayIndex: 2,
      dateLabel: "Thứ Tư, 2 tháng 9",
      fbRevenue: 0,
      ggRevenue: 0,
      totalRevenue: 0,
      fbAdsCostBeforeTax: 4041037,
      fbAdsCostAfterTax: 4494037,
      leads: 119,
      phones: 4,
      orders: 0,
      closingRate: 0.0,
      staff: {
        "Trang": { leads: 15, phones: 2, orders: 0, revenue: 0, closingRate: 0.0 },
        "Cúc": { leads: 10, phones: 2, orders: 0, revenue: 0, closingRate: 0.0 },
        "Hường": { leads: 18, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 },
        "Khác": { leads: 75, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 }
      }
    },
    {
      dayIndex: 3,
      dateLabel: "Thứ Năm, 3 tháng 9",
      fbRevenue: 14932000,
      ggRevenue: 0,
      totalRevenue: 14932000,
      fbAdsCostBeforeTax: 4487141,
      fbAdsCostAfterTax: 4990150,
      leads: 149,
      phones: 5,
      orders: 2,
      closingRate: 1.34,
      staff: {
        "Trang": { leads: 39, phones: 3, orders: 2, revenue: 14932000, closingRate: 5.13 },
        "Cúc": { leads: 39, phones: 1, orders: 0, revenue: 0, closingRate: 0.0 },
        "Hường": { leads: 38, phones: 1, orders: 0, revenue: 0, closingRate: 0.0 },
        "Khác": { leads: 33, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 }
      }
    },
    {
      dayIndex: 4,
      dateLabel: "Thứ Sáu, 4 tháng 9",
      fbRevenue: 26944000,
      ggRevenue: 1767000,
      totalRevenue: 28711000,
      fbAdsCostBeforeTax: 4148142,
      fbAdsCostAfterTax: 4613149,
      leads: 110,
      phones: 9,
      orders: 4,
      closingRate: 3.64,
      staff: {
        "Trang": { leads: 55, phones: 5, orders: 2, revenue: 21386000, closingRate: 3.64 },
        "Cúc": { leads: 20, phones: 2, orders: 0, revenue: 0, closingRate: 0.0 },
        "Hường": { leads: 27, phones: 2, orders: 2, revenue: 5558000, closingRate: 7.41 },
        "Khác": { leads: 8, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 }
      }
    },
    {
      dayIndex: 5,
      dateLabel: "Thứ Bảy, 5 tháng 9",
      fbRevenue: 15879900,
      ggRevenue: 20266000,
      totalRevenue: 36145900,
      fbAdsCostBeforeTax: 3764615,
      fbAdsCostAfterTax: 4186628,
      leads: 92,
      phones: 3,
      orders: 3,
      closingRate: 3.26,
      staff: {
        "Trang": { leads: 49, phones: 3, orders: 1, revenue: 5320000, closingRate: 2.04 },
        "Cúc": { leads: 32, phones: 0, orders: 1, revenue: 8525000, closingRate: 3.13 },
        "Hường": { leads: 3, phones: 0, orders: 1, revenue: 2034800, closingRate: 33.33 },
        "Khác": { leads: 8, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 }
      }
    },
    {
      dayIndex: 6,
      dateLabel: "Chủ Nhật, 6 tháng 9",
      fbRevenue: 10292000,
      ggRevenue: 14265000,
      totalRevenue: 24557000,
      fbAdsCostBeforeTax: 3975161,
      fbAdsCostAfterTax: 4420777,
      leads: 115,
      phones: 7,
      orders: 3,
      closingRate: 2.61,
      staff: {
        "Trang": { leads: 76, phones: 5, orders: 2, revenue: 10292000, closingRate: 2.63 },
        "Cúc": { leads: 26, phones: 2, orders: 0, revenue: 0, closingRate: 0.0 },
        "Hường": { leads: 0, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 },
        "Khác": { leads: 13, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 }
      }
    },
    {
      dayIndex: 7,
      dateLabel: "Thứ Hai, 7 tháng 9",
      fbRevenue: 9400000,
      ggRevenue: 34554000,
      totalRevenue: 43954000,
      fbAdsCostBeforeTax: 4555853,
      fbAdsCostAfterTax: 5066564,
      leads: 133,
      phones: 7,
      orders: 3,
      closingRate: 2.26,
      staff: {
        "Trang": { leads: 32, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 },
        "Cúc": { leads: 35, phones: 4, orders: 1, revenue: 3969000, closingRate: 2.86 },
        "Hường": { leads: 54, phones: 3, orders: 2, revenue: 5431000, closingRate: 3.70 },
        "Khác": { leads: 12, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 }
      }
    },
    {
      dayIndex: 8,
      dateLabel: "Thứ Ba, 8 tháng 9",
      fbRevenue: 4622000,
      ggRevenue: 2268000,
      totalRevenue: 6890000,
      fbAdsCostBeforeTax: 4111781,
      fbAdsCostAfterTax: 4572712,
      leads: 105,
      phones: 5,
      orders: 1,
      closingRate: 0.95,
      staff: {
        "Trang": { leads: 28, phones: 2, orders: 0, revenue: 0, closingRate: 0.0 },
        "Cúc": { leads: 24, phones: 1, orders: 0, revenue: 0, closingRate: 0.0 },
        "Hường": { leads: 49, phones: 2, orders: 1, revenue: 4622000, closingRate: 2.04 },
        "Khác": { leads: 4, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 }
      }
    },
    {
      dayIndex: 9,
      dateLabel: "Thứ Tư, 9 tháng 9",
      fbRevenue: 1814000,
      ggRevenue: 2734000,
      totalRevenue: 4548000,
      fbAdsCostBeforeTax: 2901450,
      fbAdsCostAfterTax: 3226703,
      leads: 62,
      phones: 2,
      orders: 1,
      closingRate: 1.61,
      staff: {
        "Trang": { leads: 15, phones: 1, orders: 0, revenue: 0, closingRate: 0.0 },
        "Cúc": { leads: 27, phones: 1, orders: 1, revenue: 1814000, closingRate: 3.70 },
        "Hường": { leads: 16, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 },
        "Khác": { leads: 4, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 }
      }
    },
    {
      dayIndex: 10,
      dateLabel: "Thứ Năm, 10 tháng 9",
      fbRevenue: 2016000,
      ggRevenue: 2432000,
      totalRevenue: 4448000,
      fbAdsCostBeforeTax: 2963112,
      fbAdsCostAfterTax: 3295277,
      leads: 74,
      phones: 1,
      orders: 1,
      closingRate: 1.35,
      staff: {
        "Trang": { leads: 17, phones: 0, orders: 1, revenue: 2016000, closingRate: 5.88 },
        "Cúc": { leads: 38, phones: 1, orders: 0, revenue: 0, closingRate: 0.0 },
        "Hường": { leads: 17, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 },
        "Khác": { leads: 2, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 }
      }
    },
    {
      dayIndex: 11,
      dateLabel: "Thứ Sáu, 11 tháng 9",
      fbRevenue: 10895000,
      ggRevenue: 0,
      totalRevenue: 10895000,
      fbAdsCostBeforeTax: 3794851,
      fbAdsCostAfterTax: 4220254,
      leads: 94,
      phones: 5,
      orders: 2,
      closingRate: 2.13,
      staff: {
        "Trang": { leads: 30, phones: 3, orders: 1, revenue: 2995000, closingRate: 3.33 },
        "Cúc": { leads: 24, phones: 1, orders: 0, revenue: 0, closingRate: 0.0 },
        "Hường": { leads: 31, phones: 1, orders: 1, revenue: 7900000, closingRate: 3.23 },
        "Khác": { leads: 9, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 }
      }
    },
    {
      dayIndex: 12,
      dateLabel: "Thứ Bảy, 12 tháng 9",
      fbRevenue: 53132000,
      ggRevenue: 17948000,
      totalRevenue: 71080000,
      fbAdsCostBeforeTax: 4099184,
      fbAdsCostAfterTax: 4558703,
      leads: 109,
      phones: 4,
      orders: 2,
      closingRate: 1.83,
      staff: {
        "Trang": { leads: 48, phones: 2, orders: 1, revenue: 51100000, closingRate: 2.08 },
        "Cúc": { leads: 24, phones: 1, orders: 0, revenue: 0, closingRate: 0.0 },
        "Hường": { leads: 23, phones: 1, orders: 1, revenue: 2032000, closingRate: 4.35 },
        "Khác": { leads: 14, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 }
      }
    },
    {
      dayIndex: 13,
      dateLabel: "Chủ Nhật, 13 tháng 9",
      fbRevenue: 5227000,
      ggRevenue: 9857000,
      totalRevenue: 15084000,
      fbAdsCostBeforeTax: 3588103,
      fbAdsCostAfterTax: 3990329,
      leads: 87,
      phones: 2,
      orders: 1,
      closingRate: 1.15,
      staff: {
        "Trang": { leads: 0, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 },
        "Cúc": { leads: 27, phones: 1, orders: 0, revenue: 0, closingRate: 0.0 },
        "Hường": { leads: 59, phones: 1, orders: 1, revenue: 5227000, closingRate: 1.69 },
        "Khác": { leads: 1, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 }
      }
    },
    {
      dayIndex: 14,
      dateLabel: "Thứ Hai, 14 tháng 9",
      fbRevenue: 0,
      ggRevenue: 24801000,
      totalRevenue: 24801000,
      fbAdsCostBeforeTax: 3619831,
      fbAdsCostAfterTax: 4025614,
      leads: 89,
      phones: 5,
      orders: 0,
      closingRate: 0.0,
      staff: {
        "Trang": { leads: 23, phones: 2, orders: 0, revenue: 0, closingRate: 0.0 },
        "Cúc": { leads: 23, phones: 1, orders: 0, revenue: 0, closingRate: 0.0 },
        "Hường": { leads: 40, phones: 2, orders: 0, revenue: 0, closingRate: 0.0 },
        "Khác": { leads: 3, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 }
      }
    },
    {
      dayIndex: 15,
      dateLabel: "Thứ Ba, 15 tháng 9",
      fbRevenue: 8923000,
      ggRevenue: 10693800,
      totalRevenue: 19616800,
      fbAdsCostBeforeTax: 4070912,
      fbAdsCostAfterTax: 4527261,
      leads: 113,
      phones: 6,
      orders: 3,
      closingRate: 2.65,
      staff: {
        "Trang": { leads: 25, phones: 0, orders: 1, revenue: 3220000, closingRate: 4.0 },
        "Cúc": { leads: 34, phones: 2, orders: 1, revenue: 3052000, closingRate: 2.94 },
        "Hường": { leads: 49, phones: 4, orders: 1, revenue: 2651000, closingRate: 2.04 },
        "Khác": { leads: 5, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 }
      }
    },
    {
      dayIndex: 16,
      dateLabel: "Thứ Tư, 16 tháng 9",
      fbRevenue: 19874000,
      ggRevenue: 7106000,
      totalRevenue: 26980000,
      fbAdsCostBeforeTax: 4109326,
      fbAdsCostAfterTax: 4570081,
      leads: 121,
      phones: 3,
      orders: 3,
      closingRate: 2.48,
      staff: {
        "Trang": { leads: 33, phones: 0, orders: 2, revenue: 15053000, closingRate: 6.06 },
        "Cúc": { leads: 49, phones: 1, orders: 0, revenue: 0, closingRate: 0.0 },
        "Hường": { leads: 32, phones: 1, orders: 1, revenue: 4821000, closingRate: 3.13 },
        "Khác": { leads: 7, phones: 1, orders: 0, revenue: 0, closingRate: 0.0 }
      }
    },
    {
      dayIndex: 17,
      dateLabel: "Thứ Năm, 17 tháng 9",
      fbRevenue: 3596000,
      ggRevenue: 957000,
      totalRevenue: 4553000,
      fbAdsCostBeforeTax: 3848402,
      fbAdsCostAfterTax: 4279808,
      leads: 115,
      phones: 5,
      orders: 2,
      closingRate: 1.74,
      staff: {
        "Trang": { leads: 45, phones: 3, orders: 0, revenue: 0, closingRate: 0.0 },
        "Cúc": { leads: 55, phones: 2, orders: 1, revenue: 1380000, closingRate: 1.82 },
        "Hường": { leads: 1, phones: 0, orders: 1, revenue: 2216000, closingRate: 100.0 },
        "Khác": { leads: 13, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 }
      }
    },
    {
      dayIndex: 18,
      dateLabel: "Thứ Sáu, 18 tháng 9",
      fbRevenue: 9211000,
      ggRevenue: 5142600,
      totalRevenue: 14353600,
      fbAdsCostBeforeTax: 3735102,
      fbAdsCostAfterTax: 4153807,
      leads: 107,
      phones: 10,
      orders: 3,
      closingRate: 2.80,
      staff: {
        "Trang": { leads: 32, phones: 3, orders: 1, revenue: 1800000, closingRate: 3.13 },
        "Cúc": { leads: 40, phones: 4, orders: 2, revenue: 7411000, closingRate: 5.0 },
        "Hường": { leads: 26, phones: 2, orders: 0, revenue: 0, closingRate: 0.0 },
        "Khác": { leads: 9, phones: 1, orders: 0, revenue: 0, closingRate: 0.0 }
      }
    },
    {
      dayIndex: 19,
      dateLabel: "Thứ Bảy, 19 tháng 9",
      fbRevenue: 71140000,
      ggRevenue: 0,
      totalRevenue: 71140000,
      fbAdsCostBeforeTax: 4293761,
      fbAdsCostAfterTax: 4775092,
      leads: 127,
      phones: 9,
      orders: 2,
      closingRate: 1.57,
      staff: {
        "Trang": { leads: 74, phones: 8, orders: 0, revenue: 0, closingRate: 0.0 },
        "Cúc": { leads: 13, phones: 0, orders: 1, revenue: 63220000, closingRate: 7.69 },
        "Hường": { leads: 25, phones: 1, orders: 1, revenue: 7920000, closingRate: 4.0 },
        "Khác": { leads: 15, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 }
      }
    },
    {
      dayIndex: 20,
      dateLabel: "Chủ Nhật, 20 tháng 9",
      fbRevenue: 12369000,
      ggRevenue: 0,
      totalRevenue: 12369000,
      fbAdsCostBeforeTax: 3709148,
      fbAdsCostAfterTax: 4124943,
      leads: 96,
      phones: 6,
      orders: 3,
      closingRate: 3.13,
      staff: {
        "Trang": { leads: 55, phones: 6, orders: 1, revenue: 3021000, closingRate: 1.82 },
        "Cúc": { leads: 26, phones: 0, orders: 2, revenue: 9348000, closingRate: 7.69 },
        "Hường": { leads: 0, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 },
        "Khác": { leads: 15, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 }
      }
    },
    {
      dayIndex: 21,
      dateLabel: "Thứ Hai, 21 tháng 9",
      fbRevenue: 18577000,
      ggRevenue: 0,
      totalRevenue: 18577000,
      fbAdsCostBeforeTax: 4183124,
      fbAdsCostAfterTax: 4652052,
      leads: 119,
      phones: 4,
      orders: 1,
      closingRate: 0.84,
      staff: {
        "Trang": { leads: 25, phones: 1, orders: 0, revenue: 0, closingRate: 0.0 },
        "Cúc": { leads: 30, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 },
        "Hường": { leads: 57, phones: 3, orders: 1, revenue: 18577000, closingRate: 1.75 },
        "Khác": { leads: 7, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 }
      }
    },
    {
      dayIndex: 22,
      dateLabel: "Thứ Ba, 22 tháng 9",
      fbRevenue: 20009000,
      ggRevenue: 0,
      totalRevenue: 20009000,
      fbAdsCostBeforeTax: 3838174,
      fbAdsCostAfterTax: 4268433,
      leads: 102,
      phones: 5,
      orders: 4,
      closingRate: 3.92,
      staff: {
        "Trang": { leads: 25, phones: 3, orders: 1, revenue: 3631000, closingRate: 4.0 },
        "Cúc": { leads: 24, phones: 1, orders: 2, revenue: 6406000, closingRate: 8.33 },
        "Hường": { leads: 49, phones: 1, orders: 1, revenue: 9972000, closingRate: 2.04 },
        "Khác": { leads: 4, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 }
      }
    },
    {
      dayIndex: 23,
      dateLabel: "Thứ Tư, 23 tháng 9",
      fbRevenue: 7637000,
      ggRevenue: 0,
      totalRevenue: 7637000,
      fbAdsCostBeforeTax: 3680536,
      fbAdsCostAfterTax: 4093124,
      leads: 108,
      phones: 5,
      orders: 2,
      closingRate: 1.85,
      staff: {
        "Trang": { leads: 55, phones: 2, orders: 0, revenue: 0, closingRate: 0.0 },
        "Cúc": { leads: 18, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 },
        "Hường": { leads: 21, phones: 3, orders: 2, revenue: 7637000, closingRate: 9.52 },
        "Khác": { leads: 14, phones: 0, orders: 0, revenue: 0, closingRate: 0.0 }
      }
    }
  ],
  lastUpdated: new Date().toISOString()
};
