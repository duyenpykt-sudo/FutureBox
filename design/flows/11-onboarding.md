# Activity Diagram: Onboarding & Empty State (F11)

## Mô tả

Trải nghiệm lần đầu mở app: giới thiệu 4 loại hộp, xin quyền notification, sau đó vào Home. Nếu danh sách hộp rỗng (lần đầu hoặc đã xóa hết), hiển thị empty state với CTA tạo hộp đầu tiên.

## Diagram

```mermaid
flowchart TD
    A[Mở app lần đầu - chưa từng onboarding] --> B[Hiển thị màn hình giới thiệu: 4 loại hộp + ý nghĩa của FutureBoxes]
    B --> C[User tap 'Bắt đầu']
    C --> D[Chuyển sang luồng xin quyền notification - Flow 10]
    D --> E[Lưu cờ hasCompletedOnboarding=true]
    E --> F[Vào Home]

    G[Mở app các lần sau] --> H{hasCompletedOnboarding?}
    H -->|Chưa| B
    H -->|Rồi| F

    F --> I{Danh sách boxes rỗng?}
    I -->|Có| J[Hiển thị Empty State: minh họa + text ngắn gọn giới thiệu cách dùng + CTA 'Tạo hộp đầu tiên']
    I -->|Không| K[Hiển thị danh sách - Flow 05]

    J --> L[User tap CTA] --> M[Chuyển sang Flow 01 - Tạo hộp]
```

## Quy tắc

- Onboarding chỉ hiển thị 1 lần duy nhất (lưu `hasCompletedOnboarding` trong AsyncStorage/SQLite settings)
- Empty State có thể xuất hiện lại bất kỳ lúc nào sau onboarding nếu user xóa hết tất cả hộp - không phụ thuộc vào `hasCompletedOnboarding`

## Edge cases

- User tap "Bắt đầu" nhưng thoát app trước khi hoàn tất xin quyền notification → khi mở lại app, tiếp tục từ bước xin quyền (chưa set `hasCompletedOnboarding=true`)
