# Activity Diagram: Danh sách hộp - Home (F5)

## Mô tả

Màn hình chính hiển thị tất cả hộp, phân loại theo trạng thái tính toán (locked/ready/opened), cho phép điều hướng đến chi tiết, mở hộp hoặc tạo hộp mới.

## Diagram

```mermaid
flowchart TD
    A[Vào Home / quay lại Home - useFocusEffect] --> B[Load tất cả boxes từ DB kèm bảng con tương ứng]
    B --> C{Danh sách rỗng?}
    C -->|Có| D[Hiển thị Empty State - xem Flow 11]
    C -->|Không| E[Tính status mỗi box: locked/ready/opened, canEdit nếu locked]
    E --> F[Sắp xếp: ready trước -> locked theo unlock_at gần nhất -> opened theo unlock_at gần nhất]
    F --> G[Render danh sách dạng card, mỗi card hiển thị icon loại hộp, tiêu đề, trạng thái]

    G --> H{User tap vào 1 card}
    H -->|status = locked| I[Mở BoxDetailScreen: tiêu đề, loại hộp, ngày tạo, ngày mở, đếm ngược]
    H -->|status = ready| J[Chuyển sang Flow 06 - Mở hộp]
    H -->|status = opened| K[Mở BoxDetailScreen ở chế độ xem lại: hiển thị đầy đủ nội dung + kết quả follow-up/đánh giá - read-only]

    I --> I1{canEdit = true?}
    I1 -->|Có| I2[Hiển thị nút 'Chỉnh sửa' và 'Xóa']
    I1 -->|Không| I3[Chỉ hiển thị nút 'Xóa']
    I2 --> I2a{User tap}
    I2a -->|Chỉnh sửa| L[Chuyển sang Flow 08]
    I2a -->|Xóa| M[Chuyển sang Flow 09]
    I3 --> I3a{User tap Xóa} --> M

    K --> K1{User tap 'Xóa'} --> M

    G --> N[User tap FAB 'Tạo hộp mới'] --> O[Chuyển sang Flow 01]
```

## Card hiển thị theo trạng thái

| Trạng thái | Hiển thị |
|---|---|
| `locked` | Icon loại hộp, tiêu đề, đếm ngược (vd "Còn 5 ngày") |
| `ready` | Highlight nổi bật (badge "Sẵn sàng mở"), icon mở khóa |
| `opened` | Hiển thị mờ/nhạt hơn, icon đã mở |

## Edge cases

- Box vừa chuyển từ `locked` sang `ready` trong khi app đang mở → cập nhật lại khi Home được focus lại (không cần real-time polling)
- Lỗi đọc DB → hiển thị empty state kèm thông báo lỗi nhẹ, cho phép pull-to-refresh thử lại
