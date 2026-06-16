# UI/UX Design Guidelines - FutureBoxes

> Phong cách: **Dark Glassmorphism + Orange Accent** (reverse-engineered từ thiết kế tham khảo "Hume Smart Home").
> Đây là **nguồn chuẩn (source of truth)** cho design system. Áp dụng cho React Native + Expo, ưu tiên mobile-first.
> Triết lý: nền tối tạo cảm giác "huyền bí / nghi thức" khi mở hộp thời gian; lớp kính mờ gợi sự "ngăn cách giữa hiện tại và tương lai"; accent cam là điểm nhấn cảm xúc/hành động.

---

## 1. Ngôn ngữ thiết kế (Visual Style)

**Phong cách chủ đạo:** Glassmorphism trên nền tối — thẻ (card) là kính mờ bán trong suốt, viền sáng mảnh, bo góc lớn, đổ bóng mềm; nền là gradient tối/ảnh được phủ lớp tối. Một accent màu cam duy nhất cho hành động & trạng thái active.

### 1.1. Bảng màu (Color Palette)

| Token | Hex / Value | Sử dụng |
|---|---|---|
| `accent` | `#FF5A1F` | Hành động chính, toggle ON, slider fill, FAB, CTA, trạng thái selected |
| `accent-pressed` | `#E04A12` | Pressed state của accent |
| `accent-soft` | `rgba(255,90,31,0.16)` | Nền chip/badge active, glow nhẹ quanh element accent |
| `bg-base` | `#0E0F12` | Màu nền tối nền tảng (dưới gradient/ảnh) |
| `bg-gradient` | `#14161B → #0A0B0D` | Gradient nền màn hình (top → bottom) |
| `bg-overlay` | `rgba(8,9,11,0.55)` | Lớp phủ tối trên ảnh nền để đảm bảo contrast |
| `glass-surface` | `rgba(255,255,255,0.08)` | Nền card kính chuẩn (kết hợp blur) |
| `glass-surface-strong` | `rgba(255,255,255,0.12)` | Card nổi bật / được nhấn / modal |
| `glass-border` | `rgba(255,255,255,0.14)` | Viền card kính (1px) |
| `glass-highlight` | `rgba(255,255,255,0.22)` | Viền sáng cạnh trên (gờ kính), tùy chọn |
| `text-primary` | `#FFFFFF` | Tiêu đề, số liệu, nội dung chính |
| `text-secondary` | `rgba(255,255,255,0.64)` | Văn bản phụ, label, đếm ngược, caption |
| `text-tertiary` | `rgba(255,255,255,0.40)` | Placeholder, văn bản bị mờ (hộp "Đã mở") |
| `divider` | `rgba(255,255,255,0.10)` | Đường kẻ phân cách |
| `success` | `#34C759` | Follow-up "Yes", đạt mục tiêu, pin/trạng thái tốt |
| `danger` | `#FF4D4F` | Nút xóa, lỗi validation |
| `warning` | `#FFB020` | Banner nhắc quyền notification |

> **Quy tắc accent:** chỉ dùng cam cho thứ **tương tác được hoặc đang active**. Không tô cam vào văn bản thuần để tránh loãng điểm nhấn.

### 1.2. Màu theo loại hộp (Box Type — tinh chỉnh cho nền tối)

Mỗi loại hộp giữ một hue riêng để nhận diện nhanh; icon dùng màu hue, đặt trong vòng tròn kính `glass-surface`.

| Loại hộp | Màu | Hex | Icon (Feather) |
|---|---|---|---|
| Hộp Tâm Sự | Cam (accent) | `#FF5A1F` | `edit-3` |
| Hộp Mục Tiêu | Teal | `#2DD4BF` | `target` |
| Hộp Kỷ Niệm | Tím | `#A78BFA` | `image` |
| Hộp Nhật Ký Quyết Định | Xanh thép | `#60A5FA` | `compass` |

### 1.3. Typography

- **Font:** `Inter` (đã dùng trong dự án); fallback hệ thống (SF Pro / Roboto). Số liệu dùng biến thể tabular nếu có.
- Trên nền tối, dùng weight 600–700 cho heading để giữ độ rõ; thêm `letterSpacing: -0.2` cho heading lớn.

| Style | Size/Line height | Weight | Sử dụng |
|---|---|---|---|
| Display | 28/34 | 700 Bold | Số liệu nổi bật, tên hộp lớn ở Open Box |
| H1 | 24/32 | 700 Bold | Tiêu đề màn hình |
| H2 | 18/24 | 600 Semibold | Tiêu đề section, tên card |
| Body | 16/24 | 400 Regular | Nội dung chính |
| Body Medium | 16/24 | 500 Medium | Label, button text |
| Caption | 14/20 | 400 Regular | Helper text, timestamp, đếm ngược, counter |
| Overline | 12/16 | 600 Semibold, `letterSpacing 0.8`, UPPERCASE | Nhãn nhỏ phụ ("WELCOME BACK", "THIS WEEK") |

### 1.4. Đặc tả lớp kính (Glass Recipe — bắt buộc)

Triển khai bằng `expo-blur` `<BlurView>` (tint `dark`, `intensity` 24–40) bọc nội dung, phủ thêm 1 lớp `glass-surface` + `glass-border`.

- **Card chuẩn:** `BlurView intensity=30` + background `glass-surface` + border `1px glass-border` + radius `24px`.
- **Card nhấn mạnh / modal:** `intensity=40` + `glass-surface-strong`.
- **Gờ sáng (tùy chọn):** border-top hoặc inner highlight `glass-highlight` để mô phỏng cạnh kính.
- **Bóng:** `shadowColor #000`, `opacity 0.35`, `radius 24`, `offset {0,12}` (Android: `elevation 8`).
- **Fallback (không hỗ trợ blur):** dùng `glass-surface-strong` đặc hơn (`rgba(255,255,255,0.12)`) thay cho blur.

---

## 2. Mobile-First Rules

- **Touch target:** tối thiểu `44x44px`. Toggle, icon-button (nút expand ↗, nút đóng) nằm trong vùng chạm ≥44px dù icon nhỏ hơn.
- **Thumb zone:** hành động chính (FAB "Tạo hộp", CTA xác nhận, toggle) đặt ở **nửa dưới màn hình**, cách đáy ≥16px + safe-area. Hành động phá hủy (Xóa) tránh đặt ở vùng ngón cái với tới dễ → đặt trong menu/detail hoặc kèm confirm.
- **Layout:** **single column**. Lề ngang (margin) `20px`. Bố cục Bento cho lưới card (2 cột) chỉ ở các khối ngang nhau (vd grid loại hộp, cặp card Wi-Fi/Cameras kiểu tham khảo).
- **Spacing (8pt grid):** `4, 8, 12, 16, 20, 24, 32, 48`. Padding trong card `16–20px`. Gap giữa các card `12–16px`.
- **Safe area:** dùng `react-native-safe-area-context`; nội dung không đè status bar / home indicator. Nền (gradient/ảnh) tràn full-bleed ra mép.
- **Content priority:** trên cùng = lời chào + danh tính (avatar/tên); kế tiếp = card trạng thái nổi bật (hộp "Sẵn sàng mở"); rồi danh sách hộp; FAB nổi cố định. Thông tin số liệu (đếm ngược) hiển thị to, rõ trong card.

---

## 3. Responsive Strategy

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | < 600px | 1 cột; grid loại hộp 2 cột; card full-width |
| Tablet | 600–1023px | 2 cột nội dung; card tối đa `width 480px`; tăng margin lên `32px` |
| Desktop/Web | ≥ 1024px | Khung giữa `max-width 480–560px` căn giữa (app dạng phone-frame), hoặc layout 2–3 cột nếu mở rộng |

- **Layout adaptation:** mobile dùng `flex` cột; từ tablet trở lên dùng `flexWrap`/grid 2 cột cho danh sách card. Dùng `useWindowDimensions()` để chọn số cột.
- **Media scaling:** ảnh trong Hộp Kỷ Niệm `width: 100%`, `aspectRatio` cố định (vd 4:3), `resizeMode: cover`, bo góc `16px`. Ảnh nền (nếu có) `cover`, luôn phủ `bg-overlay`.
- **Typography scaling:** mobile theo bảng §1.3. Tablet trở lên: nhân heading ×1.1, body giữ nguyên (giữ độ dễ đọc). Tôn trọng `fontScale` của hệ thống (accessibility); test với cỡ chữ lớn.

---

## 4. Component Library (States)

> Mobile không có `hover` thật → `hover` chỉ áp dụng cho bản web; trên mobile bỏ qua hoặc gộp vào `pressed`.

### 4.1. Button

| State | Spec |
|---|---|
| Default (Primary) | Nền `accent`, text trắng `Body Medium`, height `52px`, radius `16px`, full-width |
| Default (Secondary) | Glass: `glass-surface` + border `glass-border`, text trắng |
| Default (Ghost/Text) | Trong suốt, text `accent`, không viền |
| Hover (web) | Sáng hơn 6%, `accent` → lighten |
| Pressed | `scale 0.97` + nền `accent-pressed`; secondary → `glass-surface-strong` |
| Focused | Viền `2px accent` + `accent-soft` glow (a11y / web) |
| Disabled | `opacity 0.4`, không nhận chạm |
| Loading | Ẩn text, hiện spinner trắng giữa nút; giữ kích thước; chặn tap lặp |
| Error/Success | Dùng `danger`/`success` cho nút ngữ cảnh (vd nút Xóa = `danger`) |

### 4.2. Input Field

| State | Spec |
|---|---|
| Default | Nền `glass-surface`, border `1px glass-border`, radius `12px`, text trắng, placeholder `text-tertiary`, padding `14x16` |
| Focused | Border `1.5px accent` + glow `accent-soft`; nhãn (label) đổi sang `text-primary` |
| Filled | Giữ style default; hiện counter ký tự (`Caption`, `text-secondary`) khi có giới hạn |
| Disabled | `opacity 0.4`, không focus được |
| Error/Invalid | Border `1.5px danger`; helper text `danger` `Caption` bên dưới; rung nhẹ (translateX ±4px, 1 nhịp) |
| Success/Valid | Border `success` mảnh + icon check `success` ở cuối field (tùy chọn) |

- Counter ký tự bắt buộc cho field có giới hạn (theo validation PRD), đổi sang `danger` khi vượt.

### 4.3. Card (Glass Card)

| State | Spec |
|---|---|
| Default | Theo Glass Recipe §1.4, radius `24px`, padding `16–20px` |
| Pressed (nếu tappable) | `scale 0.98` + nền `glass-surface-strong`, 150ms |
| Highlighted | Hộp "Sẵn sàng mở": viền `accent` `1.5px` + glow `accent-soft` + badge "Mới" nền `accent` |
| Disabled/Muted | Hộp "Đã mở": `opacity 0.6`, text `text-tertiary`, không glow |
| Empty/Placeholder | Card viền **đứt nét** `glass-border` (dashed), nền trong suốt, icon + text gợi ý ở giữa (giống ô "thêm" trong tham khảo) |
| Loading (Skeleton) | Khối glass với shimmer ngang chạy (xem §5) |

**Yếu tố lặp lại trong card (theo tham khảo):**
- Nút **expand ↗** (icon `maximize-2`) góc trên-phải, trong vòng tròn `glass-surface` 32px → mở chi tiết.
- **Toggle switch:** track bo tròn; OFF = `glass-border`/xám; ON = `accent`; núm trắng; animate trượt 200ms.
- **Slider:** track mảnh có vạch chia (tick), fill `accent`, núm trắng tròn; nhãn min/max hai đầu `text-secondary`. (Dùng cho hiển thị tiến trình/đếm ngược dạng thanh nếu cần.)
- **Pill/Chip nổi:** dạng viên thuốc kính bo tròn hết cỡ, icon + giá trị (vd đếm ngược, ngày mở).

---

## 5. Interaction & Motion

**Nguyên tắc:** chuyển động nhanh, mượt, có chủ đích; tôn trọng `prefers-reduced-motion` (tắt animation lớn, giữ fade).

### 5.1. Micro-interactions
- **Press (mọi element tap được):** `scale 0.97–0.98` + opacity 0.9, 120–150ms. Dùng `Pressable` + `react-native-reanimated`.
- **Toggle:** núm trượt + track đổi màu sang `accent` 200ms `ease-out`; haptic nhẹ (`Haptics.selection`).
- **Check / chọn (follow-up Yes/No, chọn loại hộp, sao đánh giá):** scale-bounce nhẹ (0.9→1.05→1) + đổi nền sang `accent-soft`/`accent`; haptic `impactLight`.
- **Sao đánh giá:** tô lần lượt trái→phải khi chọn, mỗi sao pop 80ms stagger.

### 5.2. Motion (chuẩn)
- **Duration:** vi tương tác `120–200ms`; transition giao diện/fade `200–300ms`; chuyển màn hình `300ms`.
- **Easing:** mặc định `ease-out` (`Easing.out(Easing.cubic)`); element vào màn hình `ease-out`, rời màn hình `ease-in`.
- **Unlock animation (Mở hộp):** ~`1.5s`, dùng `react-native-reanimated` — nắp/ổ khóa bật mở + nội dung fade+scale vào. Nền tối tối đa hóa cảm giác "tiết lộ".
- **Confetti (follow-up = Yes):** `2–3s`, `lottie-react-native` hoặc `react-native-confetti-cannon`; màu hạt gồm `accent` + `success` + trắng.

### 5.3. Special Patterns
- **Optimistic UI:** thao tác tạo/xóa/đổi trạng thái cập nhật UI ngay (dữ liệu local-first), rollback + toast `danger` nếu lỗi ghi.
- **Skeleton loading:** dùng card glass + shimmer ngang (gradient sáng chạy trái→phải, 1.2s lặp) cho danh sách hộp khi đọc storage; **không** dùng spinner toàn màn hình.
- **Debounced input:** tìm kiếm/lọc danh sách hộp debounce `300ms`.
- **Pull-to-refresh:** ở Home, spinner màu `accent` trên nền tối; đồng bộ/đọc lại storage.
- **Empty state:** card viền đứt nét + minh họa nhẹ + CTA `accent` "Tạo hộp đầu tiên".
- **Haptics:** dùng cho mở hộp (`impactMedium`), Yes follow-up (`notificationSuccess`), xóa (`impactHeavy` + confirm).

---

## Ghi chú triển khai (React Native)

- Blur: `expo-blur`. Gradient nền: `expo-linear-gradient`. Animation: `react-native-reanimated`. Haptics: `expo-haptics`.
- Tách design tokens thành 1 file `theme.ts` (colors, spacing, radius, typography) để tái sử dụng và đồng bộ với tài liệu này.
- Status bar: dùng `style="light"` (icon sáng) vì nền tối.
- Test contrast: text-primary/secondary trên `glass-surface` phải đạt WCAG AA (≥4.5:1 cho body) — nếu ảnh nền sáng, tăng `bg-overlay`.
