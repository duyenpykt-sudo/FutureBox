# Activity Diagram: Xóa hộp (F9)

## Mô tả

Cho phép xóa vĩnh viễn 1 hộp ở bất kỳ trạng thái nào (locked/ready/opened), kèm dọn dẹp file ảnh và notification đã lên lịch.

## Diagram

```mermaid
flowchart TD
    A[User tap 'Xóa' từ BoxDetailScreen] --> B[Hiển thị dialog xác nhận: 'Hành động này không thể hoàn tác']
    B --> C{User xác nhận?}
    C -->|Hủy| D[Đóng dialog, không làm gì, ở lại BoxDetailScreen]
    C -->|Xác nhận xóa| E{type = memory và có image_uri?}

    E -->|Có| F[Xóa file ảnh khỏi FileSystem theo image_uri]
    E -->|Không| G[Bỏ qua bước xóa file]
    F --> H{notification_id != NULL?}
    G --> H

    H -->|Có| I[Hủy notification đã lên lịch theo notification_id]
    H -->|Không| J[Bỏ qua]
    I --> K[Xóa record trong bảng con + bảng boxes - CASCADE]
    J --> K

    K --> L[Toast 'Đã xóa hộp']
    L --> M[Quay về Home, danh sách tự refresh]
```

## Edge cases

- Xóa file ảnh thất bại (file không tồn tại) → bỏ qua lỗi, vẫn tiếp tục xóa record DB (không chặn thao tác xóa của user)
- Hủy notification thất bại (đã hết hạn/không tồn tại) → bỏ qua lỗi, vẫn tiếp tục xóa record DB
- Xóa hộp đang ở trạng thái `ready` → đồng thời đảm bảo notification (nếu chưa bắn) bị hủy để tránh hiển thị thông báo cho hộp không còn tồn tại
