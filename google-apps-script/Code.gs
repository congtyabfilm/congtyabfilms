/**
 * GOOGLE APPS SCRIPT API CHO DASHBOARD AB FILMS
 * -------------------------------------------------------------
 * Chức năng:
 * 1. Tự động nhận diện tất cả các tháng (Sheet "Tháng M/YYYY" & "Sale tháng M/YYYY")
 * 2. Tự động nhận diện danh sách nhân sự Sale (từ cột J trở đi, không giới hạn số lượng nhân viên)
 * 3. Tự động tính toán các chỉ số: Chi phí QC FB (trước/sau thuế), Doanh thu FB/GG, Tỷ lệ chốt, ROAS
 * 4. Trả về chuẩn JSON REST API để Web Dashboard kết nối tức thì không bị lỗi CORS
 */

// Hệ số thuế phí FB Ads (nếu ô D7 chưa tính hoặc tính theo cột E sheet Sale)
const FB_TAX_RATE = 1.1121; 

function doGet(e) {
  try {
    const params = e ? e.parameter : {};
    const action = params.action || 'getData';
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Lấy danh sách các tháng có sẵn trong file Sheet
    const availableMonths = scanAvailableMonths(ss);

    if (action === 'getMonths') {
      return createJsonResponse({
        success: true,
        months: availableMonths
      });
    }

    // 2. Xác định tháng cần lấy dữ liệu (mặc định lấy tháng mới nhất nếu không truyền param)
    let selectedMonth, selectedYear;
    if (params.month && params.year) {
      selectedMonth = parseInt(params.month, 10);
      selectedYear = parseInt(params.year, 10);
    } else if (availableMonths.length > 0) {
      selectedMonth = availableMonths[0].month;
      selectedYear = availableMonths[0].year;
    } else {
      return createJsonResponse({
        success: false,
        message: 'Không tìm thấy sheet định dạng Tháng M/YYYY nào trong bảng tính!'
      });
    }

    // 3. Trích xuất toàn bộ dữ liệu của tháng được chọn
    const data = extractMonthData(ss, selectedMonth, selectedYear, availableMonths);
    return createJsonResponse(data);

  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.toString(),
      stack: error.stack
    });
  }
}

/**
 * Quét toàn bộ các sheet để tìm cặp: "Tháng M/YYYY" và "Sale tháng M/YYYY"
 */
function scanAvailableMonths(ss) {
  const sheets = ss.getSheets();
  const months = [];
  const monthRegex = /^Tháng\s+(\d{1,2})\/(\d{4})$/i;

  sheets.forEach(sheet => {
    const name = sheet.getName().trim();
    const match = name.match(monthRegex);
    if (match) {
      const m = parseInt(match[1], 10);
      const y = parseInt(match[2], 10);
      const saleSheetName = `Sale tháng ${m}/${y}`;
      const saleSheet = ss.getSheetByName(saleSheetName);
      
      months.push({
        id: `${m}_${y}`,
        month: m,
        year: y,
        label: `Tháng ${m < 10 ? '0' + m : m}/${y}`,
        overviewSheet: name,
        saleSheet: saleSheet ? saleSheetName : null
      });
    }
  });

  // Sắp xếp giảm dần theo thời gian (tháng mới nhất lên đầu)
  return months.sort((a, b) => (b.year * 100 + b.month) - (a.year * 100 + a.month));
}

/**
 * Trích xuất dữ liệu chi tiết của 1 tháng
 */
function extractMonthData(ss, month, year, availableMonths) {
  const overviewSheetName = `Tháng ${month}/${year}`;
  const saleSheetName = `Sale tháng ${month}/${year}`;

  const overviewSheet = ss.getSheetByName(overviewSheetName);
  const saleSheet = ss.getSheetByName(saleSheetName);

  if (!overviewSheet) {
    return {
      success: false,
      message: `Không tìm thấy sheet: ${overviewSheetName}`
    };
  }

  // Lấy dữ liệu dạng mảng values từ 2 sheet
  const overviewValues = overviewSheet.getDataRange().getValues();
  const saleValues = saleSheet ? saleSheet.getDataRange().getValues() : [];

  // =================== 1. TỰ ĐỘNG NHẬN DIỆN NHÂN SỰ SALE ===================
  const staffList = [];
  const staffColMap = []; // Lưu vị trí cột bắt đầu của từng nhân viên

  if (saleValues.length > 1) {
    const row1 = saleValues[0] || [];
    const row2 = saleValues[1] || [];
    const row3 = saleValues[2] || [];

    // Nhân viên bắt đầu từ Cột J (Index 9 trong mảng 0-based)
    for (let c = 9; c < row1.length; c += 5) {
      const headerText = String(row1[c] || '').trim();
      if (!headerText) continue;

      // Tách tên nhân viên (ví dụ: "Trang - 150.000.000đ hoàn thành 89,84%" -> "Trang")
      const nameParts = headerText.split(/[-–:]/);
      const staffName = nameParts[0].trim();

      // Trích xuất Target KPI (ví dụ tìm số tiền 150000000)
      let targetKpi = 150000000;
      const targetMatch = headerText.replace(/\./g, '').match(/(\d{6,12})/);
      if (targetMatch) {
        targetKpi = parseNumber(targetMatch[1]);
      }

      // Hàng 2: Khách mới, SĐT, Đơn, Doanh số, Tỷ lệ chốt
      const leads = parseNumber(row2[c]);
      const phones = parseNumber(row2[c + 1]);
      const orders = parseNumber(row2[c + 2]);
      const revenue = parseNumber(row2[c + 3]);
      
      // Hàng 3: Còn lại
      let remaining = parseNumber(row3[c]);
      if (remaining === 0 && targetKpi > revenue) {
        remaining = targetKpi - revenue;
      }

      // Tính tỷ lệ chốt tự động
      const closingRateLeads = leads > 0 ? (orders / leads) * 100 : 0;
      const closingRatePhones = phones > 0 ? (orders / phones) * 100 : 0;
      const completionRate = targetKpi > 0 ? (revenue / targetKpi) * 100 : 0;

      const staffObj = {
        id: `staff_${staffList.length + 1}`,
        name: staffName,
        headerRaw: headerText,
        target: targetKpi,
        revenue: revenue,
        remaining: remaining,
        completionRate: parseFloat(completionRate.toFixed(2)),
        leads: leads,
        phones: phones,
        orders: orders,
        closingRateLeads: parseFloat(closingRateLeads.toFixed(2)),
        closingRatePhones: parseFloat(closingRatePhones.toFixed(2)),
        colStart: c
      };

      staffList.push(staffObj);
      staffColMap.push({ name: staffName, colStart: c });
    }
  }

  // =================== 2. BÓC TÁCH TỔNG QUAN (OVERVIEW) ===================
  // Sheet Tháng M/YYYY:
  // C2: Ngân sách (index [1][2])
  // D2: Dự kiến doanh thu (index [1][3])
  // D7: Chi phí QC FB sau thuế (index [6][3])
  // D8: Chi phí QC GG (index [7][3])
  // E7: Tổng chi phí QC (index [6][4])
  // D9: Doanh số hiện tại (index [8][3])
  // D10: Doanh số còn lại (index [9][3])
  // D11: Doanh số dự kiến/ngày (index [10][3])
  // C13: Doanh thu FB cả tháng (index [12][2])
  // D13: Doanh thu GG + khác (index [12][3])
  
  const budget = parseNumber(getSafeCell(overviewValues, 1, 2));
  const targetRevenue = parseNumber(getSafeCell(overviewValues, 1, 3));
  
  // Chi phí QC FB trước thuế từ sheet Sale E4 hoặc E2
  let fbAdsCostBeforeTax = 0;
  let totalLeads = 0;
  let totalPhones = 0;
  let totalOrders = 0;
  let costPerOrder = 0;
  let costPerLead = 0;

  if (saleValues.length > 3) {
    fbAdsCostBeforeTax = parseNumber(getSafeCell(saleValues, 3, 4)) || parseNumber(getSafeCell(saleValues, 1, 4));
    totalLeads = parseNumber(getSafeCell(saleValues, 1, 1));
    totalPhones = parseNumber(getSafeCell(saleValues, 1, 2));
    costPerOrder = parseNumber(getSafeCell(saleValues, 1, 3));
    costPerLead = parseNumber(getSafeCell(saleValues, 1, 5));
    totalOrders = parseNumber(getSafeCell(saleValues, 1, 6));
  }

  // Chi phí QC FB sau thuế từ D7 hoặc tính bằng fbAdsCostBeforeTax * FB_TAX_RATE
  let fbAdsCost = parseNumber(getSafeCell(overviewValues, 6, 3));
  if (fbAdsCost === 0 && fbAdsCostBeforeTax > 0) {
    fbAdsCost = Math.round(fbAdsCostBeforeTax * FB_TAX_RATE);
  }

  const ggAdsCost = parseNumber(getSafeCell(overviewValues, 7, 3));
  const totalAdsCost = parseNumber(getSafeCell(overviewValues, 6, 4)) || (fbAdsCost + ggAdsCost);

  const fbRevenue = parseNumber(getSafeCell(overviewValues, 12, 2));
  const ggRevenue = parseNumber(getSafeCell(overviewValues, 12, 3));
  const totalRevenue = parseNumber(getSafeCell(overviewValues, 8, 3)) || (fbRevenue + ggRevenue);
  const remainingRevenue = parseNumber(getSafeCell(overviewValues, 9, 3)) || (targetRevenue - totalRevenue);
  const targetDaily = parseNumber(getSafeCell(overviewValues, 10, 3));

  // Tỷ lệ chốt toàn đội
  const closingRateLeads = totalLeads > 0 ? parseFloat(((totalOrders / totalLeads) * 100).toFixed(2)) : 0;
  const closingRatePhones = totalPhones > 0 ? parseFloat(((totalOrders / totalPhones) * 100).toFixed(2)) : 0;

  // ROAS (Doanh thu / Chi phí QC)
  const roasFB = fbAdsCost > 0 ? parseFloat((fbRevenue / fbAdsCost).toFixed(2)) : 0;
  const roasGG = ggAdsCost > 0 ? parseFloat((ggRevenue / ggAdsCost).toFixed(2)) : 0;
  const roasTotal = totalAdsCost > 0 ? parseFloat((totalRevenue / totalAdsCost).toFixed(2)) : 0;

  // =================== 3. BÓC TÁCH DỮ LIỆU THEO NGÀY ===================
  const dailyData = [];
  // Sheet Tháng bắt đầu chi tiết ngày từ dòng 14 (index 13)
  // Sheet Sale bắt đầu chi tiết ngày từ dòng 5 (index 4)
  const overviewStartRow = 13;
  const saleStartRow = 4;
  const maxDays = 31;

  for (let i = 0; i < maxDays; i++) {
    const oRowIdx = overviewStartRow + i;
    const sRowIdx = saleStartRow + i;

    const oRow = overviewValues[oRowIdx] || [];
    const sRow = saleValues[sRowIdx] || [];

    const dateText = String(oRow[4] || sRow[0] || '').trim();
    if (!dateText && !oRow[2] && !sRow[4]) continue;

    // Doanh thu FB & GG theo ngày (Sheet Tháng Cột C, D, F)
    const dayFbRev = parseNumber(oRow[2]);
    const dayGgRev = parseNumber(oRow[3]);
    const dayTotalRev = parseNumber(oRow[5]) || (dayFbRev + dayGgRev);

    // Chi phí QC FB ngày từ Sheet Sale Cột E (chưa thuế)
    const dayFbAdsBeforeTax = parseNumber(sRow[4]);
    const dayFbAdsAfterTax = Math.round(dayFbAdsBeforeTax * FB_TAX_RATE);

    // Chỉ số tổng hợp Sale trong ngày (Sheet Sale B, C, G)
    const dayLeads = parseNumber(sRow[1]);
    const dayPhones = parseNumber(sRow[2]);
    const dayOrders = parseNumber(sRow[6]);
    const dayClosingRate = dayLeads > 0 ? parseFloat(((dayOrders / dayLeads) * 100).toFixed(2)) : 0;

    // Chi tiết từng nhân viên trong ngày
    const staffDayMap = {};
    staffColMap.forEach(staff => {
      const c = staff.colStart;
      const sLeads = parseNumber(sRow[c]);
      const sPhones = parseNumber(sRow[c + 1]);
      const sOrders = parseNumber(sRow[c + 2]);
      const sRevenue = parseNumber(sRow[c + 3]);
      const sClosingRate = sLeads > 0 ? parseFloat(((sOrders / sLeads) * 100).toFixed(2)) : 0;

      staffDayMap[staff.name] = {
        leads: sLeads,
        phones: sPhones,
        orders: sOrders,
        revenue: sRevenue,
        closingRate: sClosingRate
      };
    });

    dailyData.push({
      dayIndex: i + 1,
      dateLabel: dateText || `Ngày ${i + 1}`,
      fbRevenue: dayFbRev,
      ggRevenue: dayGgRev,
      totalRevenue: dayTotalRev,
      fbAdsCostBeforeTax: dayFbAdsBeforeTax,
      fbAdsCostAfterTax: dayFbAdsAfterTax,
      leads: dayLeads,
      phones: dayPhones,
      orders: dayOrders,
      closingRate: dayClosingRate,
      staff: staffDayMap
    });
  }

  return {
    success: true,
    month: month,
    year: year,
    monthLabel: `Tháng ${month < 10 ? '0' + month : month}/${year}`,
    availableMonths: availableMonths,
    overview: {
      budget: budget,
      targetRevenue: targetRevenue,
      totalRevenue: totalRevenue,
      remainingRevenue: remainingRevenue,
      targetDaily: targetDaily,
      fbRevenue: fbRevenue,
      ggRevenue: ggRevenue,
      fbAdsCost: fbAdsCost,
      fbAdsCostBeforeTax: fbAdsCostBeforeTax,
      ggAdsCost: ggAdsCost,
      totalAdsCost: totalAdsCost,
      roasFB: roasFB,
      roasGG: roasGG,
      roasTotal: roasTotal,
      totalLeads: totalLeads,
      totalPhones: totalPhones,
      totalOrders: totalOrders,
      costPerOrder: costPerOrder,
      costPerLead: costPerLead,
      closingRateLeads: closingRateLeads,
      closingRatePhones: closingRatePhones
    },
    staffList: staffList,
    daily: dailyData,
    lastUpdated: new Date().toISOString()
  };
}

// Hàm hỗ trợ đọc an toàn ô dữ liệu
function getSafeCell(matrix, row, col) {
  if (matrix && matrix[row] && matrix[row][col] !== undefined) {
    return matrix[row][col];
  }
  return 0;
}

// Hàm chuẩn hóa chuỗi hoặc số thành kiểu số thực Number
function parseNumber(val) {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const cleaned = String(val).replace(/[^\d.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// Trả về JSON với MIME type chuẩn để tránh lỗi CORS
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
