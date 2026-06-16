# Product Requirements Document - FutureBoxes

## 1. Executive Summary

### Tầm nhìn
FutureBoxes là ứng dụng mobile đa nền tảng (iOS & Android) cho phép người dùng tạo các "hộp thời gian" (time capsule) chứa suy nghĩ, cảm xúc, mục tiêu, kỷ niệm hoặc quyết định quan trọng, khóa lại đến một ngày trong tương lai do chính người dùng chọn. Khi đến ngày, hộp được mở ra, người dùng đọc lại nội dung cũ và phản hồi/đánh giá dựa trên góc nhìn hiện tại.

### Mục tiêu
- Giúp người dùng ghi lại và đối chiếu cảm xúc, mục tiêu, kỷ niệm, quyết định theo thời gian
- Tạo trải nghiệm "gửi thư cho chính mình trong tương lai" mang tính cảm xúc, có "nghi thức" (ritual) khi mở hộp
- Khuyến khích thói quen tự phản tư (self-reflection)

### Đối tượng người dùng
Người dùng cá nhân muốn ghi nhật ký, đặt mục tiêu, lưu giữ kỷ niệm và theo dõi quyết định trong cuộc sống.

### Phạm vi MVP
- 4 loại hộp: Hộp Tâm Sự, Hộp Mục Tiêu, Hộp Kỷ Niệm, Hộp Nhật Ký Quyết Định
- Lưu trữ local-first (không cần tài khoản)
- Thông báo đẩy (local) khi hộp đến hạn mở
- Animation mở khóa + hiệu ứng chúc mừng (confetti)

## 2. Tech Stack

- **React Native + Expo** (cross-platform iOS/Android)
- Local storage: AsyncStorage/SQLite (metadata) + FileSystem (ảnh)
- `expo-notifications` cho local push notification
- Data model thiết kế sẵn field dự phòng để hỗ trợ cloud sync ở Phase 2

## 3. Bảng tính năng

| # | Tính năng | Mô tả | Ưu tiên | Phụ thuộc |
|---|---|---|---|---|
| F1 | Tạo Hộp Tâm Sự | Ghi cảm xúc/suy nghĩ hiện tại, đặt câu hỏi follow-up Yes/No | Must | - |
| F2 | Tạo Hộp Mục Tiêu | Đặt mục tiêu, ngày đánh giá, follow-up Yes/No | Must | - |
| F3 | Tạo Hộp Kỷ Niệm | Đính kèm 1 ảnh + ghi chú + lời nhắn | Must | - |
| F4 | Tạo Hộp Nhật Ký Quyết Định | Ghi quyết định + bối cảnh, đánh giá sao sau này | Must | - |
| F5 | Danh sách hộp (Home) | Hiển thị tất cả hộp theo trạng thái: Đang khóa / Sẵn sàng mở / Đã mở | Must | F1-F4 |
| F6 | Mở hộp | Animation mở khóa, xem nội dung, trả lời follow-up/đánh giá | Must | F5 |
| F7 | Hiệu ứng chúc mừng | Confetti khi follow-up = Yes (F1, F2) | Must | F6 |
| F8 | Chỉnh sửa hộp (24h) | Sửa nội dung/ngày mở trong 24h sau khi tạo | Should | F1-F4 |
| F9 | Xóa hộp | Xóa vĩnh viễn 1 hộp (có xác nhận) | Must | F5 |
| F10 | Thông báo đến hạn | Local push notification khi hộp sẵn sàng mở | Must | F1-F4 |
| F11 | Empty state & Onboarding | Màn hình giới thiệu khi chưa có hộp nào | Should | F5 |

## 4. Chi tiết tính năng & Acceptance Criteria

### F1. Tạo Hộp Tâm Sự

**Luồng:**
1. Người dùng chọn "Tạo hộp mới" → chọn loại "Hộp Tâm Sự"
2. Nhập: Tiêu đề (bắt buộc), Nội dung (bắt buộc), Câu hỏi follow-up (tùy chọn, mặc định "Mọi chuyện ổn chứ?")
3. Chọn ngày mở: gợi ý nhanh (1 tuần / 1 tháng / 3 tháng / 1 năm) hoặc tùy chỉnh
4. Xác nhận → tạo hộp với trạng thái "Đang khóa", lên lịch notification (F10)

**Validation:**
- Tiêu đề: bắt buộc, 1-50 ký tự
- Nội dung: bắt buộc, 1-1000 ký tự
- Câu hỏi follow-up: tùy chọn, 0-200 ký tự (mặc định nếu để trống)
- Ngày mở: bắt buộc, >= hôm nay + 1 ngày

**Edge cases:**
- Không nhập câu hỏi follow-up → dùng câu mặc định "Mọi chuyện ổn chứ?"
- Hủy giữa chừng → không lưu hộp

### F2. Tạo Hộp Mục Tiêu

**Luồng:**
1. Chọn loại "Hộp Mục Tiêu"
2. Nhập: Tên mục tiêu (bắt buộc), Mô tả chi tiết (tùy chọn), chọn ngày đánh giá
3. Câu hỏi follow-up tự động sinh: "Bạn đã đạt được mục tiêu '[Tên mục tiêu]' chưa?" - người dùng có thể chỉnh sửa
4. Xác nhận → tạo hộp "Đang khóa", lên lịch notification (F10)

**Validation:**
- Tên mục tiêu: bắt buộc, 1-100 ký tự
- Mô tả chi tiết: tùy chọn, 0-500 ký tự
- Câu hỏi follow-up: bắt buộc (auto-fill, editable), 1-200 ký tự
- Ngày mở: bắt buộc, >= hôm nay + 1 ngày

### F3. Tạo Hộp Kỷ Niệm

**Luồng:**
1. Chọn loại "Hộp Kỷ Niệm"
2. Chọn 1 ảnh (thư viện hoặc chụp mới) - app copy ảnh vào local storage riêng của app
3. Nhập: Ghi chú (tùy chọn), Lời nhắn cho tương lai (bắt buộc)
4. Chọn ngày mở
5. Xác nhận → tạo hộp "Đang khóa", lên lịch notification (F10)

**Validation:**
- Ảnh: bắt buộc, đúng 1 ảnh, định dạng jpg/png, resize/compress trước khi lưu (max ~1080px chiều dài)
- Ghi chú: tùy chọn, 0-300 ký tự
- Lời nhắn: bắt buộc, 1-500 ký tự
- Ngày mở: bắt buộc, >= hôm nay + 1 ngày

**Edge cases:**
- Người dùng từ chối quyền truy cập ảnh/camera → hiển thị hướng dẫn cấp quyền trong Settings thiết bị
- Hộp Kỷ Niệm không có follow-up → khi mở (F6) chỉ hiển thị lại ảnh + ghi chú + lời nhắn, chuyển trạng thái "Đã mở" ngay

### F4. Tạo Hộp Nhật Ký Quyết Định

**Luồng:**
1. Chọn loại "Hộp Nhật Ký Quyết Định"
2. Nhập: Tên quyết định (bắt buộc), Bối cảnh/lý do đưa ra quyết định (bắt buộc)
3. Chọn ngày đánh giá lại
4. Xác nhận → tạo hộp "Đang khóa", lên lịch notification (F10)

**Validation:**
- Tên quyết định: bắt buộc, 1-100 ký tự
- Bối cảnh/lý do: bắt buộc, 1-1000 ký tự
- Ngày mở: bắt buộc, >= hôm nay + 1 ngày

### F5. Danh sách hộp (Home)

**Mô tả:**
- Hiển thị tất cả hộp dạng card/list, mỗi card gồm: icon loại hộp, tiêu đề/tên, trạng thái
- Trạng thái hiển thị:
  - **Đang khóa**: đếm ngược thời gian còn lại (vd "còn 5 ngày")
  - **Sẵn sàng mở**: highlight nổi bật (màu/badge "Mới")
  - **Đã mở**: hiển thị mờ/nhạt hơn, có thể xem lại
- Sắp xếp mặc định: Sẵn sàng mở → Đang khóa (ngày mở gần nhất trước) → Đã mở (ngày mở gần nhất trước)
- Nút nổi (FAB) "Tạo hộp mới" luôn hiển thị

**Acceptance:**
- Tap hộp "Đang khóa" → xem chi tiết read-only: loại hộp, tiêu đề, ngày tạo, ngày mở, đếm ngược. KHÔNG xem được nội dung bên trong
- Tap hộp "Sẵn sàng mở" → vào luồng F6 (Mở hộp)
- Tap hộp "Đã mở" → xem lại toàn bộ nội dung + kết quả follow-up/đánh giá (read-only)

### F6. Mở hộp

**Luồng:**
1. Người dùng tap vào hộp "Sẵn sàng mở"
2. Hiển thị animation "mở khóa" (ổ khóa mở/nắp hộp bật ra), khoảng 1-2 giây
3. Hiển thị nội dung theo loại hộp:
   - **Hộp Tâm Sự / Mục Tiêu**: nội dung cũ + câu hỏi follow-up Yes/No
   - **Hộp Kỷ Niệm**: ảnh + ghi chú + lời nhắn (không có follow-up)
   - **Hộp Nhật Ký Quyết Định**: mô tả quyết định cũ + form đánh giá sao (1-5) + ghi chú phản tư (tùy chọn)
4. Người dùng phản hồi (nếu có) → lưu kết quả, trạng thái hộp chuyển "Đã mở"
5. Nếu follow-up = Yes (Tâm Sự/Mục Tiêu) → kích hoạt F7 (confetti)

**Validation:**
- Đánh giá sao (Hộp Quyết Định): bắt buộc chọn 1-5 sao trước khi hoàn tất
- Ghi chú phản tư (Hộp Quyết Định): tùy chọn, 0-500 ký tự

**Acceptance:**
- Sau khi trả lời follow-up/đánh giá → kết quả được lưu vĩnh viễn, không thể sửa lại
- Hộp Kỷ Niệm: chuyển "Đã mở" ngay khi xem xong, không cần input

### F7. Hiệu ứng chúc mừng

- Follow-up = "Yes" (Hộp Tâm Sự/Mục Tiêu) → animation confetti toàn màn hình + thông điệp khích lệ
- Follow-up = "No" → thông điệp động viên nhẹ nhàng, không có confetti

### F8. Chỉnh sửa hộp (trong 24h)

- Trong vòng 24h kể từ thời điểm tạo, hộp ở trạng thái "Đang khóa" hiển thị nút "Chỉnh sửa"
- Cho phép sửa toàn bộ field đã nhập (nội dung, ảnh, ngày mở, câu hỏi follow-up), KHÔNG đổi được loại hộp
- Sau 24h, nút "Chỉnh sửa" tự động ẩn
- Sửa ngày mở → cập nhật lại lịch notification (hủy lịch cũ, tạo lịch mới)

**Validation:** áp dụng lại toàn bộ validation rules tương ứng như khi tạo mới (F1-F4)

### F9. Xóa hộp

- Áp dụng cho hộp ở mọi trạng thái (Đang khóa / Sẵn sàng mở / Đã mở)
- Yêu cầu xác nhận qua dialog: "Hành động này không thể hoàn tác"
- Xóa cả ảnh đính kèm khỏi local storage và hủy notification đã lên lịch (nếu có)

### F10. Thông báo đến hạn

- Khi tạo/sửa hộp, app lên lịch local notification vào đúng ngày mở (9:00 sáng giờ địa phương)
- Nội dung: "Hộp [Tiêu đề] của bạn đã sẵn sàng để mở!"
- Nếu người dùng từ chối quyền notification → app vẫn hoạt động bình thường, dựa vào highlight tại F5; hiển thị banner nhắc bật quyền trong Settings (hiển thị 1 lần)
- Notification được lên lịch lại nếu app bị kill/khởi động lại thiết bị

### F11. Empty state & Onboarding

- Khi chưa có hộp nào: hiển thị màn hình giới thiệu ngắn gọn về 4 loại hộp + CTA "Tạo hộp đầu tiên"
- Lần đầu mở app: xin quyền notification (có thể bỏ qua)

## 5. Non-functional Requirements

| Loại | Yêu cầu |
|---|---|
| Performance | Mở app < 2s; animation mở hộp/confetti chạy mượt 60fps |
| Offline | Hoạt động hoàn toàn offline, không cần kết nối mạng |
| Data persistence | Dữ liệu không mất khi tắt app/restart thiết bị |
| Platform | iOS 13+, Android 8+ |
| Storage | Ảnh resize/compress (~max 1080px) trước khi lưu để tiết kiệm dung lượng |
| Localization | Tiếng Việt (MVP); tách riêng text strings để dễ thêm ngôn ngữ sau |
| Scalability | Data model có field dự phòng (vd `userId`, `syncStatus`) để hỗ trợ cloud sync Phase 2 |
| Reliability | Notification được đảm bảo lên lịch lại sau khi app/thiết bị restart |

## 6. Assumptions & Constraints

- Ứng dụng dành cho 1 người dùng/thiết bị, không có đăng nhập/tài khoản trong MVP
- Không hỗ trợ chia sẻ hộp cho người khác
- Không hỗ trợ đính kèm video/audio
- Múi giờ dựa theo cài đặt thiết bị; không xử lý trường hợp người dùng chỉnh giờ hệ thống để mở sớm
- Không có lớp bảo mật riêng (PIN/Face ID) - dựa vào khóa màn hình thiết bị
- Ngôn ngữ giao diện: Tiếng Việt

## 7. Out of scope (Phase 2 / Tương lai)

- Đồng bộ cloud & đăng nhập tài khoản
- Bảo mật bổ sung (PIN/Face ID/vân tay)
- Chia sẻ hộp với bạn bè/gia đình
- Đính kèm nhiều ảnh, video, audio
- Đa ngôn ngữ (English)
- Widget màn hình chính
