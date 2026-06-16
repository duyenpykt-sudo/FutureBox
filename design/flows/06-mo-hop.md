# Activity Diagram: Mở hộp & Hiệu ứng chúc mừng (F6-F7)

## Mô tả

Khi hộp ở trạng thái "Sẵn sàng mở", người dùng tap vào để xem animation mở khóa, sau đó xem nội dung và phản hồi (follow-up Yes/No hoặc đánh giá sao) tùy theo loại hộp.

## Diagram

```mermaid
flowchart TD
    A[User tap hộp 'Sẵn sàng mở'] --> B[Hiển thị animation mở khóa - 1-2s]
    B --> C{type?}

    C -->|letter / goal| D[Hiển thị nội dung cũ + câu hỏi follow-up Yes/No]
    D --> E{User chọn đáp án}
    E -->|Yes| F[Lưu answer='yes', opened_at=now]
    F --> G[Hiệu ứng confetti toàn màn hình + thông điệp khích lệ]
    E -->|No| H[Lưu answer='no', opened_at=now]
    H --> I[Hiển thị thông điệp động viên nhẹ nhàng - không confetti]

    C -->|memory| J[Hiển thị ảnh + ghi chú + lời nhắn]
    J --> K[User tap 'Đóng' / 'Xong']
    K --> L[Lưu opened_at=now]

    C -->|decision| M[Hiển thị mô tả quyết định + bối cảnh cũ]
    M --> N[Hiển thị form đánh giá: chọn 1-5 sao + ghi chú phản tư optional]
    N --> O{User đã chọn sao?}
    O -->|Chưa| P[Disable nút 'Hoàn tất']
    P --> N
    O -->|Đã chọn| Q[User tap 'Hoàn tất']
    Q --> R[Lưu rating, reflection, opened_at=now]

    G --> S[User tap 'Đóng' -> quay về Home]
    I --> S
    L --> S
    R --> S
    S --> T[Box hiển thị trạng thái 'Đã mở' tại Home]
```

## Quy tắc

- Sau khi `opened_at` được set, KHÔNG cho phép thay đổi `answer`/`rating`/`reflection` nữa (read-only vĩnh viễn)
- Hộp Kỷ Niệm (`memory`) không có bước phản hồi, chuyển `opened_at` ngay khi user xem xong
- Hộp Quyết Định (`decision`) bắt buộc chọn rating (1-5) trước khi hoàn tất; `reflection` là optional

## Edge cases

- User thoát giữa chừng (trước khi bấm Hoàn tất/Đóng) ở `letter`/`goal`/`decision` → KHÔNG lưu `opened_at`, hộp vẫn ở trạng thái "Sẵn sàng mở" để mở lại sau
- Hộp Kỷ Niệm: nếu file ảnh bị thiếu/lỗi (vd bị xóa khỏi storage ngoài ý muốn) → hiển thị placeholder ảnh lỗi, vẫn cho phép xem ghi chú/lời nhắn và đóng hộp bình thường
