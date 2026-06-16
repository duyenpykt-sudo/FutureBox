# Database Schema - FutureBoxes

## 1. Tổng quan

- Engine: **SQLite** (qua `expo-sqlite`) - phù hợp lưu trữ local, hỗ trợ query/sort/filter hiệu quả
- Ảnh (Hộp Kỷ Niệm) lưu dưới dạng file trong `FileSystem.documentDirectory`, DB chỉ lưu đường dẫn (`image_uri`)
- Mô hình: 1 bảng `boxes` chứa các field chung, mỗi loại hộp có 1 bảng con quan hệ 1-1 chứa field đặc thù (content + result)
- `status` (locked/ready/opened) và `can_edit` (còn trong 24h hay không) là **giá trị tính toán tại runtime**, KHÔNG lưu trong DB:
  - `opened_at IS NOT NULL` → `opened`
  - `opened_at IS NULL AND unlock_at <= now()` → `ready`
  - ngược lại → `locked`
  - `can_edit = (now() <= created_at + 24h) AND status == 'locked'`

## 2. ERD (Mermaid)

```mermaid
erDiagram
    BOXES ||--o| BOX_LETTERS : "type = letter"
    BOXES ||--o| BOX_GOALS : "type = goal"
    BOXES ||--o| BOX_MEMORIES : "type = memory"
    BOXES ||--o| BOX_DECISIONS : "type = decision"

    BOXES {
        TEXT id PK
        TEXT type
        TEXT title
        TEXT created_at
        TEXT unlock_at
        TEXT opened_at
        TEXT notification_id
        TEXT user_id
        TEXT sync_status
    }
    BOX_LETTERS {
        TEXT box_id PK_FK
        TEXT content
        TEXT follow_up_question
        TEXT answer
    }
    BOX_GOALS {
        TEXT box_id PK_FK
        TEXT goal_name
        TEXT description
        TEXT follow_up_question
        TEXT answer
    }
    BOX_MEMORIES {
        TEXT box_id PK_FK
        TEXT image_uri
        TEXT note
        TEXT message
    }
    BOX_DECISIONS {
        TEXT box_id PK_FK
        TEXT decision_name
        TEXT context
        INTEGER rating
        TEXT reflection
    }
```

## 3. Table Schemas

### 3.1. `boxes` (bảng chung)

| Field | Type | Constraints | Mô tả |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | UUID v4 |
| `type` | TEXT | NOT NULL, CHECK IN ('letter','goal','memory','decision') | Loại hộp |
| `title` | TEXT | NOT NULL, 1-100 ký tự | Tiêu đề hiển thị trong list (= Tiêu đề / Tên mục tiêu / Tên quyết định / Tiêu đề kỷ niệm tùy loại) |
| `created_at` | TEXT | NOT NULL | ISO8601 timestamp lúc tạo |
| `unlock_at` | TEXT | NOT NULL, >= created_at + 1 day | ISO8601 ngày giờ mở hộp |
| `opened_at` | TEXT | NULL | ISO8601 timestamp lúc user mở hộp; NULL = chưa mở |
| `notification_id` | TEXT | NULL | Expo notification identifier để hủy lịch khi sửa/xóa |
| `user_id` | TEXT | NULL | Dự phòng cho cloud sync (Phase 2), NULL ở MVP |
| `sync_status` | TEXT | NULL | Dự phòng cho cloud sync (Phase 2), NULL ở MVP |

### 3.2. `box_letters` (Hộp Tâm Sự, 1-1 với `boxes` khi `type='letter'`)

| Field | Type | Constraints | Mô tả |
|---|---|---|---|
| `box_id` | TEXT | PRIMARY KEY, FK → boxes.id ON DELETE CASCADE | |
| `content` | TEXT | NOT NULL, 1-1000 ký tự | Nội dung tâm sự |
| `follow_up_question` | TEXT | NOT NULL, 1-200 ký tự | Mặc định "Mọi chuyện ổn chứ?" nếu user để trống |
| `answer` | TEXT | NULL, CHECK IN ('yes','no') | Kết quả trả lời, NULL cho đến khi mở hộp |

### 3.3. `box_goals` (Hộp Mục Tiêu, 1-1 với `boxes` khi `type='goal'`)

| Field | Type | Constraints | Mô tả |
|---|---|---|---|
| `box_id` | TEXT | PRIMARY KEY, FK → boxes.id ON DELETE CASCADE | |
| `goal_name` | TEXT | NOT NULL, 1-100 ký tự | Tên mục tiêu |
| `description` | TEXT | NULL, 0-500 ký tự | Mô tả chi tiết |
| `follow_up_question` | TEXT | NOT NULL, 1-200 ký tự | Auto-fill "Bạn đã đạt được mục tiêu '[goal_name]' chưa?", editable |
| `answer` | TEXT | NULL, CHECK IN ('yes','no') | Kết quả trả lời, NULL cho đến khi mở hộp |

### 3.4. `box_memories` (Hộp Kỷ Niệm, 1-1 với `boxes` khi `type='memory'`)

| Field | Type | Constraints | Mô tả |
|---|---|---|---|
| `box_id` | TEXT | PRIMARY KEY, FK → boxes.id ON DELETE CASCADE | |
| `image_uri` | TEXT | NOT NULL | Đường dẫn local file ảnh (đã copy vào app storage, resize ~1080px) |
| `note` | TEXT | NULL, 0-300 ký tự | Ghi chú |
| `message` | TEXT | NOT NULL, 1-500 ký tự | Lời nhắn cho tương lai |

Hộp Kỷ Niệm không có follow-up → không có cột `answer`.

### 3.5. `box_decisions` (Hộp Nhật Ký Quyết Định, 1-1 với `boxes` khi `type='decision'`)

| Field | Type | Constraints | Mô tả |
|---|---|---|---|
| `box_id` | TEXT | PRIMARY KEY, FK → boxes.id ON DELETE CASCADE | |
| `decision_name` | TEXT | NOT NULL, 1-100 ký tự | Tên quyết định |
| `context` | TEXT | NOT NULL, 1-1000 ký tự | Bối cảnh/lý do tại thời điểm quyết định |
| `rating` | INTEGER | NULL, CHECK 1-5 | Đánh giá sao, NULL cho đến khi mở hộp |
| `reflection` | TEXT | NULL, 0-500 ký tự | Ghi chú phản tư |

## 4. Indexing Strategy

| Index | Bảng | Cột | Lý do |
|---|---|---|---|
| `idx_boxes_unlock_at` | boxes | `unlock_at` | Tính toán box "ready", sắp xếp theo ngày mở |
| `idx_boxes_opened_at` | boxes | `opened_at` | Lọc nhanh box đã mở/chưa mở (Home list) |
| `idx_boxes_type` | boxes | `type` | Lọc theo loại hộp khi cần |

`box_id` ở các bảng con đã là PRIMARY KEY nên tự động có index, phục vụ JOIN với `boxes.id`.

## 5. Migration & Versioning

- MVP dùng `PRAGMA user_version` của SQLite để track schema version, bắt đầu từ `1`
- Khi cần thêm cột (vd `user_id`, `sync_status` cho Phase 2 cloud sync), dùng `ALTER TABLE ... ADD COLUMN` với migration script chạy 1 lần lúc app khởi động, kiểm tra `user_version` trước khi áp dụng
- File ảnh: nếu xóa box, phải xóa kèm file tại `image_uri` (xem `design/flows/09-xoa-hop.md`)

## 6. Ví dụ truy vấn chính

```sql
-- Lấy danh sách box kèm trạng thái tính toán, JOIN với bảng con tương ứng theo type
-- (thực hiện ở tầng repository: query boxes trước, sau đó JOIN bảng con theo `type`)
SELECT * FROM boxes ORDER BY
  CASE WHEN opened_at IS NULL AND unlock_at <= datetime('now') THEN 0
       WHEN opened_at IS NULL THEN 1
       ELSE 2 END,
  unlock_at ASC;
```
