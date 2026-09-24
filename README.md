# 🎬 AB Films — Marketing & Sales Dashboard

Trang Dashboard theo dõi và quản trị tự động các chỉ số quảng cáo Facebook, Google và kết quả kinh doanh của đội ngũ Sale AB Films, đồng bộ thời gian thực từ Google Spreadsheet.

---

## 🌟 Tính Năng Nổi Bật

1. **Tự động nhận diện Tháng mới**:
   - Khi bước sang tháng mới, bạn chỉ cần tạo cặp sheet: `Tháng M/YYYY` và `Sale tháng M/YYYY` (ví dụ `Tháng 10/2026` và `Sale tháng 10/2026`).
   - Dashboard tự động quét và nạp tháng mới vào menu chọn tháng mà **không cần sửa bất kỳ dòng code nào**.

2. **Tự động cập nhật Nhân sự Sale linh hoạt**:
   - Không giới hạn 4 nhân viên (*Trang, Cúc, Hường, Khác*), nếu sau này có thêm/bớt nhân viên từ cột J sheet Sale, hệ thống sẽ tự động bóc tách tên, mục tiêu KPI, số liệu ngày và vẽ biểu đồ tương ứng.

3. **Bóc tách chuẩn xác toàn bộ số liệu bài toán**:
   - **Chi phí QC Facebook**: Lấy từ Cột E sheet Sale theo từng ngày, tính tổng tháng chưa thuế (`89.665.407 đ`) và sau thuế/phí (`99.716.899 đ`, hệ số `1.1121` khớp ô D7).
   - **Chi phí QC Google**: Khớp ô D8 (`30.354.820 đ`).
   - **Doanh thu FB & Google**: Từng ngày và lũy kế tháng.
   - **Tổng doanh thu theo từng ngày**: Khớp cột F sheet Tháng.
   - **Tổng doanh thu 4 nhân viên = Doanh thu FB** (khớp 100%).
   - **Tự động tính tỷ lệ chốt**: Tính % chốt trên Khách mới và % chốt trên SĐT.

4. **Đồng bộ thời gian thực & Chế độ xem trước (Demo)**:
   - Sẵn sàng dữ liệu mẫu từ sheet Tháng 9/2026 để xem trước ngay cả khi chưa kết nối.
   - Cơ chế tự động làm mới (Auto-poll 60 giây/lần) + nút [Đồng bộ ngay].

---

## 🚀 Hướng Dẫn Chạy Trên Máy Tính (Local)

1. Mở terminal tại thư mục này:
   ```bash
   cd dashboard-abfilms
   ```
2. Chạy ứng dụng:
   ```bash
   npm run dev
   ```
3. Mở trình duyệt tại địa chỉ: `http://localhost:5173`

---

## ☁️ Hướng Dẫn Tự Deploy Lên Vercel

Dự án đã được cấu hình sẵn file [`vercel.json`](./vercel.json) chuẩn cho Vite + React. Bạn có thể deploy theo 1 trong 2 cách sau:

### Cách 1: Đẩy code lên GitHub và Import vào Vercel (Khuyên dùng)
1. Đẩy thư mục này lên một repository trên GitHub của bạn.
2. Truy cập [vercel.com](https://vercel.com) -> Bấm **Add New...** -> **Project**.
3. Chọn repository vừa tạo. Vercel sẽ tự nhận diện:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Bấm **Deploy**. Sau ~30 giây, bạn sẽ có một tên miền miễn phí (dạng `https://...vercel.app`) xem được trên máy tính và điện thoại.

### Cách 2: Deploy bằng lệnh Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 🔗 Hướng Dẫn Kết Nối Google Spreadsheet (Apps Script)

Xem hướng dẫn chi tiết từng bước có minh họa tại:  
👉 [**`google-apps-script/HUONG_DAN_CAI_DAT_APPS_SCRIPT.md`**](./google-apps-script/HUONG_DAN_CAI_DAT_APPS_SCRIPT.md)

1. Mở Google Sheet → **Tiện ích mở rộng** → **Apps Script**.
2. Copy code từ file [`google-apps-script/Code.gs`](./google-apps-script/Code.gs) dán vào.
3. Bấm **Triển khai (Deploy)** → **Tùy chọn triển khai mới** → Chọn **Ứng dụng web (Web app)**.
4. Chọn quyền truy cập: **Bất kỳ ai (Anyone)**.
5. Copy đường link URL Web App Google cấp và dán vào nút ⚙️ **Cài đặt** trên trang Dashboard.
