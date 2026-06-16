# Activity Diagram: Tạo hộp (F1-F4)

## Mô tả

Người dùng chọn loại hộp (Tâm Sự / Mục Tiêu / Kỷ Niệm / Quyết Định), điền form tương ứng, chọn ngày mở, sau đó hệ thống lưu hộp và lên lịch thông báo.

## Diagram

```mermaid
flowchart TD
    A[User: Tap FAB 'Tạo hộp mới' tại Home] --> B{Chọn loại hộp}

    B -->|Hộp Tâm Sự| C1[Form: Tiêu đề*, Nội dung*, Câu hỏi follow-up optional]
    B -->|Hộp Mục Tiêu| C2[Form: Tên mục tiêu*, Mô tả optional, Câu hỏi follow-up auto-fill]
    B -->|Hộp Kỷ Niệm| C3[Chọn 1 ảnh từ thư viện/camera]
    B -->|Hộp Nhật Ký Quyết Định| C4[Form: Tên quyết định*, Bối cảnh/lý do*]

    C3 --> P{Có quyền truy cập ảnh/camera?}
    P -->|Từ chối| P1[Hiển thị hướng dẫn cấp quyền trong Settings]
    P1 --> C3
    P -->|Cho phép| C3a[Form: Ghi chú optional, Lời nhắn*]

    C1 --> D[Chọn ngày mở: gợi ý nhanh 1 tuần/1 tháng/3 tháng/1 năm hoặc tùy chỉnh]
    C2 --> D
    C3a --> D
    C4 --> D

    D --> E{Validate input theo loại hộp}
    E -->|Lỗi| F[Hiển thị lỗi inline tại field tương ứng, giữ nguyên form]
    F --> D
    E -->|Hợp lệ| G[Resize/compress ảnh nếu là Hộp Kỷ Niệm, copy vào app storage]
    G --> H[Lưu record vào bảng boxes + bảng con tương ứng, opened_at=NULL]
    H --> I{Quyền notification đã cấp?}
    I -->|Có| J[Lên lịch local notification lúc 9:00 sáng ngày unlock_at, lưu notification_id]
    I -->|Không| K[Bỏ qua, dựa vào highlight trong Home]
    J --> L[Toast 'Đã tạo hộp', quay về Home]
    K --> L

    A -.User bấm Hủy/Back giữa chừng.-> M[Hiển thị xác nhận 'Hủy tạo hộp?']
    M -->|Xác nhận| N[Không lưu gì, quay về Home]
    M -->|Tiếp tục nhập| D
```

## Validation rules theo loại hộp

| Loại hộp | Field | Rule |
|---|---|---|
| Tâm Sự | Tiêu đề | bắt buộc, 1-100 ký tự |
| | Nội dung | bắt buộc, 1-1000 ký tự |
| | Câu hỏi follow-up | optional, 0-200 ký tự (mặc định "Mọi chuyện ổn chứ?" nếu trống) |
| Mục Tiêu | Tên mục tiêu | bắt buộc, 1-100 ký tự |
| | Mô tả | optional, 0-500 ký tự |
| | Câu hỏi follow-up | bắt buộc (auto-fill, editable), 1-200 ký tự |
| Kỷ Niệm | Ảnh | bắt buộc, đúng 1 ảnh |
| | Ghi chú | optional, 0-300 ký tự |
| | Lời nhắn | bắt buộc, 1-500 ký tự |
| Quyết Định | Tên quyết định | bắt buộc, 1-100 ký tự |
| | Bối cảnh/lý do | bắt buộc, 1-1000 ký tự |
| Tất cả | Ngày mở | bắt buộc, >= hôm nay + 1 ngày |

## Edge cases

- Người dùng từ chối quyền ảnh/camera → vẫn ở lại bước chọn ảnh, không cho tiếp tục đến khi có ảnh
- Resize/compress ảnh thất bại → hiển thị lỗi, cho phép chọn lại ảnh khác
- Quyền notification chưa cấp (denied ở Onboarding) → hộp vẫn được tạo bình thường, chỉ không có push notification
