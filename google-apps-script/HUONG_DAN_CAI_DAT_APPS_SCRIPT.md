# Hướng Dẫn Cài Đặt Google Apps Script (Web App API)

Chỉ mất **2 phút** để kích hoạt API tự động đồng bộ cho file Google Sheets của bạn.

---

### Bước 1: Mở trình soạn thảo Apps Script
1. Mở file Google Sheets **Báo cáo AB Films** trên trình duyệt.
2. Trên thanh menu trên cùng, bấm chọn: **Tiện ích mở rộng** (Extensions) -> **Apps Script**.
3. Một tab trình duyệt mới sẽ mở ra giao diện soạn thảo code.

---

### Bước 2: Dán mã nguồn API
1. Xóa toàn bộ đoạn code mặc định `function myFunction() { ... }` đang có trong file `Code.gs`.
2. Mở file [**`Code.gs`**](file:///c:/Users/User'/Desktop/trochuyen/dashboard-abfilms/google-apps-script/Code.gs) vừa tạo, copy toàn bộ nội dung và dán vào.
3. Bấm biểu tượng **Lưu (Save / Ctrl + S)** hình đĩa mềm.

---

### Bước 3: Triển khai dưới dạng Web App (Quan trọng nhất)
1. Ở góc trên bên phải, bấm nút màu xanh **Triển khai (Deploy)** -> Chọn **Tùy chọn triển khai mới (New deployment)**.
2. Tại mục *Chọn loại (Select type)*, bấm biểu tượng bánh răng ⚙️ bên cạnh -> Chọn **Ứng dụng web (Web app)**.
3. Điền thông tin cấu hình như sau:
   - **Mô tả (Description)**: `API Dashboard AB Films`
   - **Thực thi dưới dạng (Execute as)**: **Tôi (Me - your email)**
   - **Ai có quyền truy cập (Who has access)**: Chọn **Bất kỳ ai (Anyone)**.
     *(Lưu ý: Bắt buộc chọn "Bất kỳ ai" để trang Web Dashboard có thể đọc dữ liệu mà không cần đăng nhập Google phức tạp).*
4. Bấm nút **Triển khai (Deploy)**.
5. Nếu Google hiện cửa sổ yêu cầu cấp quyền:
   - Chọn tài khoản Google của bạn -> Bấm **Nâng cao (Advanced)** -> Bấm **Đi tới Báo cáo AB Films (không an toàn) / Go to ... (unsafe)** -> Bấm **Cho phép (Allow)**.

---

### Bước 4: Lấy URL Web App và dán vào Dashboard
1. Sau khi triển khai thành công, Google sẽ cung cấp cho bạn một đường link dạng:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```
2. Copy đường link này.
3. Mở trang Dashboard của bạn, dán link này vào ô cấu hình **"Google Apps Script Web App URL"** trên giao diện là hoàn tất!

---

### 💡 Lưu ý khi sang tháng mới:
- Mỗi khi sang tháng mới, bạn chỉ cần nhân bản (duplicate) sheet theo đúng quy tắc tên:
  - `Tháng 10/2026`
  - `Sale tháng 10/2026`
- **Dashboard sẽ tự động nhận diện tháng mới và nhân sự mới** mà bạn KHÔNG cần phải sửa bất kỳ dòng code nào!
