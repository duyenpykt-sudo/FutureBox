# Activity Diagram: Chỉnh sửa hộp trong 24h (F8)

## Mô tả

Trong vòng 24h kể từ `created_at`, hộp ở trạng thái `locked` cho phép chỉnh sửa toàn bộ field nội dung (trừ loại hộp). Nếu `unlock_at` thay đổi, lịch notification phải được cập nhật lại.

## Diagram

```mermaid
flowchart TD
    A[BoxDetailScreen của hộp status=locked] --> B{now <= created_at + 24h?}
    B -->|Không| C[Không hiển thị nút 'Chỉnh sửa']
    B -->|Có| D[Hiển thị nút 'Chỉnh sửa']

    D --> E[User tap 'Chỉnh sửa']
    E --> F[Mở EditBoxScreen, pre-fill form theo type - dùng lại layout Flow 01]
    F --> G[User chỉnh nội dung/ảnh/ngày mở/câu hỏi follow-up]
    G --> H{Validate input - cùng rules với Flow 01}
    H -->|Lỗi| I[Hiển thị lỗi inline]
    I --> G
    H -->|Hợp lệ| J{unlock_at có thay đổi?}

    J -->|Có| K[Hủy notification cũ theo notification_id]
    K --> L{Quyền notification đã cấp?}
    L -->|Có| M[Lên lịch notification mới lúc 9:00 sáng ngày unlock_at mới, cập nhật notification_id]
    L -->|Không| N[notification_id = NULL]
    M --> O[Cập nhật record trong boxes + bảng con]
    N --> O

    J -->|Không| O

    O --> P[Toast 'Đã cập nhật hộp', quay về BoxDetailScreen với dữ liệu mới]

    F -.User bấm Hủy.-> Q[Không lưu thay đổi, quay về BoxDetailScreen]
```

## Quy tắc

- KHÔNG cho phép đổi `type` của hộp khi chỉnh sửa
- Nếu hộp đã chuyển sang `ready` hoặc `opened` trước khi user kịp bấm "Chỉnh sửa" (quá 24h hoặc đã đến `unlock_at`) → nút "Chỉnh sửa" không hiển thị, chỉ còn "Xóa"
- Validation rules áp dụng giống hệt Flow 01 theo từng loại hộp

## Edge cases

- Hộp Kỷ Niệm: nếu user chọn ảnh mới → xóa file ảnh cũ khỏi storage sau khi lưu thành công ảnh mới
- `unlock_at` mới phải >= thời điểm sửa + 1 ngày (áp dụng rule giống Flow 01, tính từ "hiện tại" chứ không phải từ `created_at` gốc)
