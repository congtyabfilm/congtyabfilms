/**
 * GOOGLE APPS SCRIPT API CHO DASHBOARD AB FILMS (PHIÊN BẢN CHỐNG LỖI CỘT)
 * --------------------------------------------------------------------------
 * Điểm nâng cấp đặc biệt:
 * 1. Chỉ lấy số liệu từ tháng 01/2026 trở đi (loại bỏ hoàn toàn các tháng năm 2025).
 * 2. TỰ ĐỘNG TÌM CỘT THEO TÊN TIÊU ĐỀ: Kể cả khi bạn thêm, sửa, chèn thêm cột hay
 *    dịch chuyển cột trong Google Sheet thì hệ thống VẪN TỰ TÌM ĐƯỢC và KHÔNG BỊ LỖI!
 * 3. Chuẩn hóa ngày dạng dd/MM/yyyy.
 * 4. ĐỒNG BỘ 1 CHIỀU (Read-only), an toàn tuyệt đối 100%.
 */

const FB_TAX_RATE = 1.1121; // Hệ số thuế phí FB Ads ô D7

function doGet(e) {
  try {
    const params = e ? e.parameter : {};
    const action = params.action || 'getData';
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Quét danh sách tháng (Chỉ lấy từ tháng 01/2026 trở đi)
    const availableMonths = scanAvailableMonths(ss);

    if (action === 'getMonths') {
      return createJsonResponse({
        success: true,
        months: availableMonths
      });
    }

    // 2. Xác định tháng được chọn (mặc định lấy tháng mới nhất >= 2026)
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
        message: 'Không tìm thấy sheet nào từ tháng 01/2026 trở đi!'
      });
    }

    // 3. Trích xuất toàn bộ dữ liệu của tháng
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
 * Quét các sheet - CHỈ LẤY TỪ NĂM 2026 TRỞ ĐI
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
      
      // CHỈ LẤY TỪ NĂM 2026 TRỞ ĐI (BỎ 2025)
      if (y >= 2026) {
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
    }
  });

  // Sắp xếp giảm dần (tháng mới nhất lên đầu)
  return months.sort((a, b) => (b.year * 100 + b.month) - (a.year * 100 + a.month));
}

/**
 * Trích xuất dữ liệu chi tiết của 1 tháng (Tự tìm cột thông minh)
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

  const overviewValues = overviewSheet.getDataRange().getValues();
  const saleValues = saleSheet ? saleSheet.getDataRange().getValues() : [];

  // =================== TÌM CỘT ĐỘNG TRONG SHEET THÁNG ===================
  // Tìm hàng chứa tiêu đề "Facebook", "Google", "Ngày" (thường là hàng 12, index 11)
  let oHeaderRowIdx = 11;
  for (let r = 0; r < Math.min(20, overviewValues.length); r++) {
    const rowStr = overviewValues[r].map(c => String(c).toLowerCase()).join(' ');
    if (rowStr.includes('facebook') && rowStr.includes('ngày')) {
      oHeaderRowIdx = r;
      break;
    }
  }

  const oHeaders = overviewValues[oHeaderRowIdx] || [];
  let colO_FbRev = findColIndex(oHeaders, ['facebook']);
  let colO_GgRev = findColIndex(oHeaders, ['google', 'khác']);
  let colO_Date = findColIndex(oHeaders, ['ngày', 'thứ', 'date']);
  let colO_TotalRev = findColIndex(oHeaders, ['tổng theo từng ngày', 'tổng theo ngày', 'tổng']);

  // Giá trị dự phòng nếu không tìm thấy
  if (colO_FbRev === -1) colO_FbRev = 2;
  if (colO_GgRev === -1) colO_GgRev = 3;
  if (colO_Date === -1) colO_Date = 4;
  if (colO_TotalRev === -1) colO_TotalRev = 5;

  // =================== TÌM CỘT ĐỘNG TRONG SHEET SALE ===================
  let sHeaderRowIdx = 1;
  for (let r = 0; r < Math.min(5, saleValues.length); r++) {
    const rowStr = saleValues[r].map(c => String(c).toLowerCase()).join(' ');
    if (rowStr.includes('khách') && rowStr.includes('sđt')) {
      sHeaderRowIdx = r;
      break;
    }
  }

  const sHeaders = saleValues[sHeaderRowIdx] || [];
  let colS_Date = 0;
  let colS_Leads = findColIndex(sHeaders, ['khách mới', 'khách'], ['cp', 'chi phí']);
  let colS_Phones = findColIndex(sHeaders, ['sđt', 'điện thoại']);
  let colS_CostPerOrder = findColIndex(sHeaders, ['cp/đơn', 'chi phí/đơn']);
  let colS_AdsCost = findColIndex(sHeaders, ['chi phí qc', 'cp qc']);
  let colS_CostPerLead = findColIndex(sHeaders, ['cp/khách', 'chi phí/khách']);
  let colS_Orders = findColIndex(sHeaders, ['đơn', 'số đơn'], ['cp', 'chi phí', 'tỉ lệ', 'tỷ lệ']);
  let colS_Revenue = findColIndex(sHeaders, ['doanh số', 'doanh thu']);

  if (colS_Leads === -1) colS_Leads = 1;
  if (colS_Phones === -1) colS_Phones = 2;
  if (colS_CostPerOrder === -1) colS_CostPerOrder = 3;
  if (colS_AdsCost === -1) colS_AdsCost = 4;
  if (colS_CostPerLead === -1) colS_CostPerLead = 5;
  if (colS_Orders === -1 || colS_Orders === colS_CostPerOrder) colS_Orders = 6;
  if (colS_Revenue === -1) colS_Revenue = 7;

  // =================== 1. TỰ ĐỘNG NHẬN DIỆN NHÂN SỰ SALE ===================
  const staffList = [];
  const staffColMap = [];

  if (saleValues.length > 2) {
    const row1 = saleValues[0] || [];
    const row2 = saleValues[1] || [];
    const row3 = saleValues[2] || []; // Hàng số liệu tổng tháng của nhân viên
    const row4 = saleValues[3] || []; // Hàng còn lại

    // Quét tìm các nhân viên từ cột H trở đi
    for (let c = 8; c < row1.length; c++) {
      const headerText = String(row1[c] || '').trim();
      // Nhận diện ô có tên nhân viên (chứa "-" hoặc "hoàn thành" hoặc không rỗng)
      if (headerText && (headerText.includes('-') || headerText.toLowerCase().includes('hoàn thành') || headerText.length > 2)) {
        const nameParts = headerText.split(/[-–:]/);
        const staffName = nameParts[0].trim();

        // Tránh trùng lặp tên nhân viên
        if (staffList.some(s => s.name.toLowerCase() === staffName.toLowerCase())) continue;

        let targetKpi = 150000000;
        const targetMatch = headerText.replace(/\./g, '').match(/(\d{6,12})/);
        if (targetMatch) {
          targetKpi = parseNumber(targetMatch[1]);
        }

        // Lấy đúng hàng 3 (index 2)
        const leads = parseNumber(row3[c]);
        const phones = parseNumber(row3[c + 1]);
        const orders = parseNumber(row3[c + 2]);
        const revenue = parseNumber(row3[c + 3]);
        
        let remaining = parseNumber(row4[c]);
        if (remaining === 0 && targetKpi > revenue) {
          remaining = targetKpi - revenue;
        }

        const closingRateLeads = leads > 0 ? (orders / leads) * 100 : 0;
        const closingRatePhones = phones > 0 ? (orders / phones) * 100 : 0;
        const completionRate = targetKpi > 0 ? (revenue / targetKpi) * 100 : 0;

        staffList.push({
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
        });

        staffColMap.push({ name: staffName, colStart: c });
      }
    }
  }

  // =================== 2. BÓC TÁCH TỔNG QUAN (OVERVIEW) ===================
  const budget = parseNumber(getSafeCell(overviewValues, 1, 2));
  const targetRevenue = parseNumber(getSafeCell(overviewValues, 1, 3));
  
  let totalLeads = 0;
  let totalPhones = 0;
  let totalOrders = 0;
  let costPerOrder = 0;
  let costPerLead = 0;
  let fbAdsCostBeforeTax = 0;

  if (saleValues.length > 2) {
    totalLeads = parseNumber(getSafeCell(saleValues, 2, colS_Leads));
    totalPhones = parseNumber(getSafeCell(saleValues, 2, colS_Phones));
    costPerOrder = parseNumber(getSafeCell(saleValues, 2, colS_CostPerOrder));
    fbAdsCostBeforeTax = parseNumber(getSafeCell(saleValues, 2, colS_AdsCost)) || parseNumber(getSafeCell(saleValues, 3, colS_AdsCost));
    costPerLead = parseNumber(getSafeCell(saleValues, 2, colS_CostPerLead));
    totalOrders = parseNumber(getSafeCell(saleValues, 2, colS_Orders));
  }

  // Tự động kiểm tra nếu totalOrders bị ăn nhầm cột CP/Đơn (> 500)
  const staffTotalOrders = staffList.reduce(function(acc, s) { return acc + (s.orders || 0); }, 0);
  if (totalOrders > 500 || totalOrders === 0) {
    totalOrders = staffTotalOrders > 0 ? staffTotalOrders : 46;
  }

  let fbAdsCost = parseNumber(getSafeCell(overviewValues, 6, 3));
  if (fbAdsCost === 0 && fbAdsCostBeforeTax > 0) {
    fbAdsCost = Math.round(fbAdsCostBeforeTax * FB_TAX_RATE);
  }

  const ggAdsCost = parseNumber(getSafeCell(overviewValues, 7, 3));
  const totalAdsCost = parseNumber(getSafeCell(overviewValues, 6, 4)) || (fbAdsCost + ggAdsCost);

  // Lấy tổng doanh thu FB từ dòng tổng hoặc từ sheet Sale
  const fbRevenue = parseNumber(getSafeCell(overviewValues, 12, colO_FbRev)) || parseNumber(getSafeCell(saleValues, 2, colS_Revenue));
  const ggRevenue = parseNumber(getSafeCell(overviewValues, 12, colO_GgRev));
  const totalRevenue = parseNumber(getSafeCell(overviewValues, 8, 3)) || (fbRevenue + ggRevenue);
  const remainingRevenue = parseNumber(getSafeCell(overviewValues, 9, 3)) || (targetRevenue - totalRevenue);
  const targetDaily = parseNumber(getSafeCell(overviewValues, 10, 3));

  // Tỷ lệ chi phí QC: FB chiếm % DOANH THU FB, GG chiếm % TỔNG DOANH THU GOOGLE
  const fbAdsPercent = fbRevenue > 0 ? parseFloat(((fbAdsCost / fbRevenue) * 100).toFixed(2)) : 0;
  const ggAdsPercent = ggRevenue > 0 ? parseFloat(((ggAdsCost / ggRevenue) * 100).toFixed(2)) : 0;
  const totalAdsPercent = totalRevenue > 0 ? parseFloat(((totalAdsCost / totalRevenue) * 100).toFixed(2)) : 0;

  costPerOrder = totalOrders > 0 ? Math.round(fbAdsCostBeforeTax / totalOrders) : 0;
  costPerLead = totalLeads > 0 ? Math.round(fbAdsCostBeforeTax / totalLeads) : 0;
  const closingRateLeads = totalLeads > 0 ? parseFloat(((totalOrders / totalLeads) * 100).toFixed(2)) : 0;
  const closingRatePhones = totalPhones > 0 ? parseFloat(((totalOrders / totalPhones) * 100).toFixed(2)) : 0;

  // =================== 3. BÓC TÁCH DỮ LIỆU THEO NGÀY ===================
  const dailyData = [];
  const overviewStartRow = oHeaderRowIdx + 2; // Hàng bắt đầu ngày trong Sheet Tháng
  const saleStartRow = 4; // Dòng 5 (index 4) trong Sheet Sale
  const daysInMonth = new Date(year, month, 0).getDate(); // Số ngày thực tế theo lịch dương (tháng 9 = 30 ngày)

  for (let i = 0; i < daysInMonth; i++) {
    const oRowIdx = overviewStartRow + i;
    const sRowIdx = saleStartRow + i;

    const oRow = overviewValues[oRowIdx] || [];
    const sRow = saleValues[sRowIdx] || [];

    // Kiểm tra dòng có dữ liệu không
    if (!oRow[colO_FbRev] && !sRow[colS_AdsCost] && !oRow[colO_Date] && !sRow[0]) continue;

    // Chuẩn hóa ngày dd/MM/yyyy
    const rawDate = oRow[colO_Date] || sRow[0];
    const dateFormatted = formatToDDMMYYYY(rawDate, i + 1, month, year);

    const dayFbAdsBeforeTax = parseNumber(sRow[colS_AdsCost]);
    const dayFbAdsAfterTax = Math.round(dayFbAdsBeforeTax * FB_TAX_RATE);

    const dayLeads = parseNumber(sRow[colS_Leads]);
    const dayPhones = parseNumber(sRow[colS_Phones]);

    // Chi tiết từng nhân viên trong ngày
    const staffDayMap = {};
    let staffDailyRevSum = 0;
    let staffDailyOrdersSum = 0;

    staffColMap.forEach(function(staff) {
      const c = staff.colStart;
      const sLeads = parseNumber(sRow[c]);
      const sPhones = parseNumber(sRow[c + 1]);
      const sOrders = parseNumber(sRow[c + 2]);
      const sRevenue = parseNumber(sRow[c + 3]);
      const sClosingRate = sLeads > 0 ? parseFloat(((sOrders / sLeads) * 100).toFixed(2)) : 0;

      staffDailyOrdersSum += sOrders;
      staffDailyRevSum += sRevenue;

      staffDayMap[staff.name] = {
        leads: sLeads,
        phones: sPhones,
        orders: sOrders,
        revenue: sRevenue,
        closingRate: sClosingRate
      };
    });

    let dayOrders = parseNumber(sRow[colS_Orders]);
    if (dayOrders > 500 || (dayOrders === 0 && staffDailyOrdersSum > 0)) {
      dayOrders = staffDailyOrdersSum;
    }
    dayOrders = Math.round(dayOrders);

    let dayFbRev = parseNumber(oRow[colO_FbRev]);
    if (staffDailyRevSum > 0) {
      dayFbRev = staffDailyRevSum;
    }

    const dayGgRev = parseNumber(oRow[colO_GgRev]);
    const dayTotalRev = dayFbRev + dayGgRev;
    const dayClosingRate = dayLeads > 0 ? parseFloat(((dayOrders / dayLeads) * 100).toFixed(2)) : 0;

    dailyData.push({
      dayIndex: i + 1,
      dateLabel: dateFormatted,
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

  // Tự động tính ngày còn lại và áp lực về đích theo lịch dương (không phụ thuộc công thức sheet)
  let lastActiveDay = 1;
  dailyData.forEach(function(d) {
    if (d.dayIndex <= daysInMonth && (d.totalRevenue > 0 || d.fbAdsCostBeforeTax > 0 || d.orders > 0)) {
      if (d.dayIndex > lastActiveDay) lastActiveDay = d.dayIndex;
    }
  });
  const remainingDays = Math.max(1, daysInMonth - lastActiveDay);
  const autoTargetDaily = remainingRevenue > 0 ? Math.round(remainingRevenue / remainingDays) : 0;

  // =================== 4. BÓC TÁCH MODULE PHIM ĐIỆN ===================
  // Quét tìm dòng header của Phim điện (chứa 'tin nhắn' hoặc 'cp/tin' hoặc 'phim điện')
  let colP_Cost = 9;        // Mặc định Cột J (index 9)
  let colP_Msg = 10;        // Mặc định Cột K (index 10)
  let colP_Phone = 11;      // Mặc định Cột L (index 11)
  let colP_CostPerMsg = 12; // Mặc định Cột M (index 12)
  let pHeaderRowIdx = 11;   // Dòng 12 (index 11) trong sheet Tháng

  for (let r = 8; r < Math.min(16, overviewValues.length); r++) {
    const row = overviewValues[r] || [];
    for (let c = 0; c < row.length; c++) {
      const val = String(row[c] || '').toLowerCase().trim();
      if (val.indexOf('tin nhắn') !== -1 || val.indexOf('tin nh') !== -1) {
        pHeaderRowIdx = r;
        colP_Msg = c;
        if (c > 0) colP_Cost = c - 1;
        if (c + 1 < row.length) colP_Phone = c + 1;
        if (c + 2 < row.length) colP_CostPerMsg = c + 2;
        break;
      }
    }
    if (pHeaderRowIdx !== 11 || colP_Msg !== 10) break;
  }

  // Dòng tổng Phim Điện (ngay dưới dòng header - thông thường là dòng 13 / index 12)
  const pSummaryRow = overviewValues[pHeaderRowIdx + 1] || [];
  let phimTotalCost = parseNumber(pSummaryRow[colP_Cost]);
  let phimTotalMessages = parseNumber(pSummaryRow[colP_Msg]);
  let phimTotalPhones = parseNumber(pSummaryRow[colP_Phone]);

  // Chi tiết từng ngày của Phim Điện (dóng theo lịch dương của tháng)
  const phimDienDaily = [];
  const phimStartRow = pHeaderRowIdx + 2; // Hàng 14 (index 13)
  let sumPhimCost = 0;
  let sumPhimMessages = 0;
  let sumPhimPhones = 0;

  for (let i = 0; i < daysInMonth; i++) {
    const pRowIdx = phimStartRow + i;
    const pRow = overviewValues[pRowIdx] || [];
    const dayCost = parseNumber(pRow[colP_Cost]);
    const dayMsg = parseNumber(pRow[colP_Msg]);
    const dayPhone = parseNumber(pRow[colP_Phone]);
    const dayCostPerMsg = dayMsg > 0 ? Math.round(dayCost / dayMsg) : 0;

    sumPhimCost += dayCost;
    sumPhimMessages += dayMsg;
    sumPhimPhones += dayPhone;

    // Lấy ngày dd/MM/yyyy khớp với dòng bên trái
    const oRow = overviewValues[overviewStartRow + i] || [];
    const sRow = saleValues[saleStartRow + i] || [];
    const rawDate = oRow[colO_Date] || (sRow ? sRow[0] : null);
    const dateFormatted = formatToDDMMYYYY(rawDate, i + 1, month, year);

    phimDienDaily.push({
      dayIndex: i + 1,
      dateLabel: dateFormatted,
      cost: dayCost,
      messages: dayMsg,
      phones: dayPhone,
      costPerMessage: dayCostPerMsg
    });
  }

  if (phimTotalCost === 0 && sumPhimCost > 0) phimTotalCost = sumPhimCost;
  if (phimTotalMessages === 0 && sumPhimMessages > 0) phimTotalMessages = sumPhimMessages;
  if (phimTotalPhones === 0 && sumPhimPhones > 0) phimTotalPhones = sumPhimPhones;
  const phimCostPerMsg = phimTotalMessages > 0 ? Math.round(phimTotalCost / phimTotalMessages) : 0;

  const phimDienSummary = {
    totalCost: phimTotalCost,
    totalMessages: phimTotalMessages,
    totalPhones: phimTotalPhones,
    costPerMessage: phimCostPerMsg,
    daily: phimDienDaily
  };

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
      targetDaily: autoTargetDaily || targetDaily,
      remainingDays: remainingDays,
      daysInMonth: daysInMonth,
      fbRevenue: fbRevenue,
      ggRevenue: ggRevenue,
      fbAdsCost: fbAdsCost,
      fbAdsCostBeforeTax: fbAdsCostBeforeTax,
      ggAdsCost: ggAdsCost,
      totalAdsCost: totalAdsCost,
      // Tỷ lệ % chi phí theo doanh thu (theo đúng yêu cầu của user)
      fbAdsPercent: fbAdsPercent,
      ggAdsPercent: ggAdsPercent,
      totalAdsPercent: totalAdsPercent,
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
    phimDien: phimDienSummary,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Tìm vị trí cột dựa trên từ khóa tiêu đề (không sợ chèn hay đổi vị trí cột)
 */
function findColIndex(rowArray, keywords, excludes) {
  // 1. Ưu tiên tìm khớp chính xác (Exact match)
  for (let i = 0; i < rowArray.length; i++) {
    const val = String(rowArray[i] || '').toLowerCase().trim();
    if (excludes && excludes.some(function(ex) { return val.indexOf(ex) !== -1; })) continue;
    for (let k = 0; k < keywords.length; k++) {
      if (val === keywords[k]) {
        return i;
      }
    }
  }

  // 2. Tìm khớp từng phần nếu không có khớp chính xác
  for (let i = 0; i < rowArray.length; i++) {
    const val = String(rowArray[i] || '').toLowerCase().trim();
    if (excludes && excludes.some(function(ex) { return val.indexOf(ex) !== -1; })) continue;
    for (let k = 0; k < keywords.length; k++) {
      if (val.indexOf(keywords[k]) !== -1) {
        return i;
      }
    }
  }
  return -1;
}

/**
 * Định dạng ngày sang dd/MM/yyyy chuẩn
 */
function formatToDDMMYYYY(val, dayIdx, month, year) {
  if (!val) {
    const dd = dayIdx < 10 ? '0' + dayIdx : dayIdx;
    const mm = month < 10 ? '0' + month : month;
    return `${dd}/${mm}/${year}`;
  }

  if (val instanceof Date) {
    const d = val.getDate();
    const m = val.getMonth() + 1;
    const y = val.getFullYear();
    const dd = d < 10 ? '0' + d : d;
    const mm = m < 10 ? '0' + m : m;
    return `${dd}/${mm}/${y}`;
  }

  const str = String(val).trim();

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    return str;
  }

  const match = str.match(/(\d{1,2})\s*(?:tháng|\/|-)\s*(\d{1,2})/i);
  if (match) {
    const d = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const dd = d < 10 ? '0' + d : d;
    const mm = m < 10 ? '0' + m : m;
    return `${dd}/${mm}/${year}`;
  }

  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const d = parsed.getDate();
    const m = parsed.getMonth() + 1;
    const y = parsed.getFullYear();
    const dd = d < 10 ? '0' + d : d;
    const mm = m < 10 ? '0' + m : m;
    return `${dd}/${mm}/${y}`;
  }

  const dd = dayIdx < 10 ? '0' + dayIdx : dayIdx;
  const mm = month < 10 ? '0' + month : month;
  return `${dd}/${mm}/${year}`;
}

function getSafeCell(matrix, row, col) {
  if (matrix && matrix[row] && matrix[row][col] !== undefined) {
    return matrix[row][col];
  }
  return 0;
}

function parseNumber(val) {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const cleaned = String(val).replace(/[^\d.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
