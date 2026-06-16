# Screen Descriptions - FutureBoxes

## Design System

### Màu sắc (Color Palette)

| Token | Hex | Sử dụng |
|---|---|---|
| `primary` | `#6366F1` | Nút chính, FAB, link, trạng thái selected |
| `primary-light` | `#E0E7FF` | Background badge/chip đã chọn, banner thông tin |
| `primary-dark` | `#4F46E5` | Pressed state của primary |
| `background` | `#F5F5F7` | Nền màn hình |
| `surface` | `#FFFFFF` | Nền card, input |
| `text-primary` | `#18181B` | Văn bản chính |
| `text-secondary` | `#71717A` | Văn bản phụ, placeholder, caption, đếm ngược |
| `border` | `#E4E4E7` | Viền input, divider |
| `success` | `#22C55E` | Trạng thái "Yes"/đạt mục tiêu, celebration |
| `danger` | `#EF4444` | Nút xóa, lỗi validation |
| `warning` | `#F59E0B` | Banner nhắc quyền notification |

### Màu icon theo loại hộp (sắc độ của primary + grayscale)

| Loại hộp | Màu | Hex | Icon (Feather) |
|---|---|---|---|
| Hộp Tâm Sự | Indigo đậm | `#4F46E5` | `edit-3` |
| Hộp Mục Tiêu | Indigo nhạt | `#818CF8` | `target` |
| Hộp Kỷ Niệm | Xám trung | `#64748B` | `image` |
| Hộp Nhật Ký Quyết Định | Xám đậm | `#334155` | `compass` |

### Typography (Inter)

| Style | Size/Line height | Weight | Sử dụng |
|---|---|---|---|
| H1 | 24/32 | 700 Bold | Tiêu đề màn hình |
| H2 | 18/24 | 600 Semibold | Tiêu đề section, tên hộp |
| Body | 16/24 | 400 Regular | Nội dung chính |
| Body Medium | 16/24 | 500 Medium | Label, button text |
| Caption | 14/20 | 400 Regular | Helper text, timestamp, character counter |

### Spacing, Radius & Shadow

- Spacing scale (8pt grid): 4, 8, 12, 16, 24, 32, 48
- Border radius: 8px (button/input/chip), 12px (card), 28px (FAB tròn)
- Card shadow: `0px 1px 3px rgba(0,0,0,0.08)`

### Animation Timing

- Transition cơ bản (focus, press, fade): 200-300ms, easing `ease-out`
- Unlock animation (Open Box): ~1.5s, dùng `react-native-reanimated`
- Confetti: 2-3s, dùng `lottie-react-native` hoặc `react-native-confetti-cannon`

---

## Onboarding Screen

### Mục đích
Giới thiệu khái quát 4 loại hộp và xin quyền gửi notification ngay lần đầu mở app.

### Các thành phần chính

1. **Hero Header**
   - Mô tả: Icon app (hộp đơn giản, line-art) ở giữa, bên dưới là tên "FutureBoxes" (H1) và tagline "Gửi điều gì đó cho chính mình trong tương lai" (Body, `text-secondary`)
   - Tương tác: Không có
   - Hiệu ứng: Fade in + slide up nhẹ (translateY 16px → 0) khi màn hình xuất hiện, 300ms

2. **Box Type Grid (2x2)**
   - Mô tả: 4 card giới thiệu ngắn các loại hộp - mỗi card: icon loại hộp (theo bảng màu ở trên) trong vòng tròn nền nhạt, tên loại hộp (Body Medium), mô tả 1 dòng (Caption). Card nền `surface`, radius 12px, shadow card
   - Tương tác: Không tương tác, chỉ minh họa
   - Hiệu ứng: Stagger fade-in từng card, delay 80ms mỗi card

3. **CTA Button "Bắt đầu"**
   - Mô tả: Nút primary full-width, height 52px, radius 8px, text trắng "Bắt đầu", cố định ở đáy màn hình (an toàn safe-area)
   - Tương tác: Tap → trigger native notification permission dialog → lưu `hasCompletedOnboarding=true` → điều hướng Home
   - Hiệu ứng: Press → scale 0.97 + opacity 0.9

### Navigation
- Đến screen này từ: App khởi động lần đầu (`hasCompletedOnboarding=false`)
- Từ screen này đến: Home Screen

### Ghi chú
- Nếu `hasCompletedOnboarding=true`, screen này không hiển thị lại (kể cả khi sau đó danh sách hộp rỗng - lúc đó Home tự hiển thị Empty State)
- Nếu user từ chối quyền notification, vẫn điều hướng Home bình thường

---

## Home Screen

### Mục đích
Màn hình chính - hiển thị toàn bộ hộp đã tạo, phân biệt theo trạng thái, là điểm vào cho mọi luồng khác.

### Các thành phần chính

1. **Header**
   - Mô tả: Tiêu đề "Hộp của tôi" (H1), căn trái, padding 16px
   - Tương tác: Không
   - Hiệu ứng: Không

2. **Notification Permission Banner** (hiển thị có điều kiện)
   - Mô tả: Banner ngang nền `warning` nhạt (10% opacity), icon chuông + text "Bật thông báo để không bỏ lỡ khi hộp sẵn sàng mở" (Caption) + nút text "Cài đặt" (`primary`) + icon đóng (X) bên phải
   - Tương tác: Tap "Cài đặt" → mở Settings hệ thống của app; Tap (X) → ẩn banner vĩnh viễn (lưu cờ `hasDismissedNotificationBanner`)
   - Hiệu ứng: Slide down từ trên khi xuất hiện, 250ms
   - Điều kiện hiển thị: `permission=denied` AND `hasDismissedNotificationBanner=false`

3. **Box List (FlatList)**
   - Mô tả mỗi **Box Card**:
     - Bên trái: icon loại hộp trong vòng tròn 40x40px nền nhạt theo màu loại hộp
     - Giữa: tiêu đề hộp (H2, truncate 1 dòng)
     - Bên phải/dưới tiêu đề tùy trạng thái:
       - `locked`: text "Còn X ngày" (Caption, `text-secondary`)
       - `ready`: badge nền `primary-light`, chữ `primary` "Sẵn sàng mở" + icon mở khóa nhỏ
       - `opened`: text "Đã mở · dd/mm/yyyy" (Caption, `text-secondary`), card opacity 0.7
   - Tương tác:
     - Tap card → điều hướng theo trạng thái: `locked`/`opened` → Box Detail Screen, `ready` → Open Box Screen
     - Vuốt trái (swipeable row) → hiện nút "Xóa" (nền `danger`, icon thùng rác trắng) → tap để xóa (qua dialog xác nhận)
   - Hiệu ứng:
     - Card `ready`: badge có hiệu ứng pulse nhẹ (scale 1 ↔ 1.05, lặp lại, 1.5s/chu kỳ) để thu hút chú ý
     - List fade-in khi load lần đầu
     - Sắp xếp: `ready` trước → `locked` (theo `unlock_at` gần nhất) → `opened` (theo `unlock_at` gần nhất)

4. **Empty State** (khi danh sách rỗng)
   - Mô tả: Illustration line-art (icon hộp lớn, `text-secondary` nhạt) căn giữa màn hình, bên dưới text "Chưa có hộp nào" (H2) và "Tạo hộp đầu tiên để gửi điều gì đó cho tương lai của bạn" (Body, `text-secondary`), nút CTA "Tạo hộp mới"
   - Tương tác: Tap CTA → Create Box Screen
   - Hiệu ứng: Fade in 300ms

5. **FAB "Tạo hộp mới"**
   - Mô tả: Nút tròn 56x56px, nền `primary`, icon "+" trắng (24px), góc dưới-phải, shadow nổi, cố định khi scroll
   - Tương tác: Tap → Create Box Screen
   - Hiệu ứng: Press → scale 0.95

### Navigation
- Đến screen này từ: Onboarding Screen, Create/Edit/Open/Detail Screen (sau khi hoàn tất), App khởi động (lần sau)
- Từ screen này đến: Create Box Screen (FAB hoặc Empty State CTA), Box Detail Screen (tap box `locked`/`opened`), Open Box Screen (tap box `ready`)

### Ghi chú
- Trạng thái mỗi box (`locked`/`ready`/`opened`) và đếm ngược được tính lại mỗi khi Home được focus (`useFocusEffect`), không cần real-time polling
- Dialog xác nhận xóa: "Hành động này không thể hoàn tác" - 2 nút "Hủy" / "Xóa" (nút Xóa màu `danger`)

---

## Create Box Screen

### Mục đích
Tạo hộp mới: chọn loại hộp → điền form đặc thù theo loại → chọn ngày mở → lưu.

### Các thành phần chính

1. **Header**
   - Mô tả: Icon đóng (X) bên trái, tiêu đề "Tạo hộp mới" (H2) ở giữa
   - Tương tác: Tap (X) → nếu đã nhập dữ liệu, hiện dialog xác nhận "Hủy tạo hộp? Dữ liệu sẽ không được lưu" (2 nút Hủy/Đồng ý); nếu chưa nhập gì → quay về Home ngay
   - Hiệu ứng: Không

2. **Bước 1 - Box Type Selector**
   - Mô tả: Grid 2x2, mỗi ô là 1 card chọn loại hộp - icon loại hộp (vòng tròn màu theo bảng), tên loại hộp (Body Medium), mô tả 1 dòng (Caption). Card chưa chọn: border 1px `border`; card chọn: border 2px `primary` + nền `primary-light` nhạt
   - Tương tác: Tap 1 card → card được highlight là `selected`, tự động cuộn xuống/chuyển sang Bước 2 (form tương ứng)
   - Hiệu ứng: Selected card → scale 1.02 + border color transition 200ms

3. **Bước 2 - Dynamic Form** (theo loại đã chọn ở Bước 1)

   **Form Hộp Tâm Sự**
   - Text Input "Tiêu đề" (1 dòng, max 100 ký tự, hiển thị counter `x/100` góc dưới-phải)
   - Textarea "Nội dung" (multi-line, tối thiểu 4 dòng, max 1000 ký tự, placeholder "Hôm nay bạn cảm thấy thế nào?", counter `x/1000`)
   - Text Input "Câu hỏi follow-up (tùy chọn)" - placeholder "Mọi chuyện ổn chứ?", helper text bên dưới (Caption): "Câu hỏi này sẽ hiện ra khi bạn mở hộp"

   **Form Hộp Mục Tiêu**
   - Text Input "Tên mục tiêu" (max 100 ký tự, counter)
   - Textarea "Mô tả chi tiết (tùy chọn)" (max 500 ký tự, counter)
   - Text Input "Câu hỏi follow-up" - tự động điền `Bạn đã đạt được mục tiêu "[Tên mục tiêu]" chưa?` khi user gõ Tên mục tiêu (đồng bộ real-time cho đến khi user tự sửa field này), editable, max 200 ký tự

   **Form Hộp Kỷ Niệm**
   - Image Picker: ô vuông lớn (aspect 1:1, full-width trừ padding), trạng thái rỗng hiển thị icon camera + text "Chọn ảnh" (`text-secondary`); sau khi chọn hiển thị ảnh preview phủ kín ô + icon "đổi ảnh" (pencil) overlay góc dưới-phải
   - Textarea "Ghi chú (tùy chọn)" (max 300 ký tự, counter)
   - Textarea "Lời nhắn cho tương lai" (max 500 ký tự, counter)

   **Form Hộp Nhật Ký Quyết Định**
   - Text Input "Tên quyết định" (max 100 ký tự, counter)
   - Textarea "Bối cảnh / Lý do" (multi-line, tối thiểu 4 dòng, max 1000 ký tự, placeholder "Vì sao bạn đưa ra quyết định này?", counter)

   **Quy ước chung cho input/textarea**: nền `surface`, border 1px `border`, radius 8px, padding 12px; focus → border `primary` 2px; lỗi → border `danger` 2px + text lỗi (Caption, `danger`) phía dưới field

4. **Section "Ngày mở hộp"**
   - Mô tả: Tiêu đề section (H2) "Khi nào bạn muốn mở hộp này?". Hàng chip ngang scroll: "1 tuần", "1 tháng", "3 tháng", "1 năm", "Tùy chỉnh". Nếu chọn "Tùy chỉnh" → hiện native date picker, chỉ cho chọn ngày từ ngày mai trở đi. Bên dưới hiển thị text xác nhận "Hộp sẽ mở vào: [dd/mm/yyyy]" (Body Medium)
   - Tương tác: Tap chip → set `unlock_at` tương ứng, chip selected đổi nền `primary` chữ trắng, các chip khác bỏ chọn; "Tùy chỉnh" → mở date picker
   - Hiệu ứng: Chip transition màu nền 150ms

5. **Bottom Bar - Nút Submit**
   - Mô tả: Nút primary full-width, sticky đáy màn hình (trên safe-area), text "Tạo hộp"
   - Tương tác: Tap → validate toàn bộ form theo loại hộp; nếu lỗi → scroll đến field lỗi đầu tiên + hiển thị lỗi inline; nếu hợp lệ → resize/lưu ảnh (nếu có), lưu DB, lên lịch notification, toast "Đã tạo hộp", quay về Home
   - Hiệu ứng: Disabled (nền xám `border`, chữ `text-secondary`) khi form chưa hợp lệ hoặc Bước 1 chưa chọn loại; loading spinner thay icon khi đang lưu

### Navigation
- Đến screen này từ: Home Screen (FAB hoặc Empty State CTA)
- Từ screen này đến: Home Screen (sau khi tạo thành công hoặc hủy)

### Ghi chú
- Hộp Kỷ Niệm: nếu quyền truy cập ảnh/camera bị từ chối → hiển thị inline message trong Image Picker + nút "Mở Cài đặt"
- Toàn bộ form nằm trong `KeyboardAvoidingView` để input không bị bàn phím che

---

## Box Detail Screen

### Mục đích
Xem chi tiết 1 hộp ở trạng thái `locked` (chưa thể xem nội dung, chỉ thấy đếm ngược) hoặc `opened` (xem lại đầy đủ nội dung và kết quả).

### Các thành phần chính

1. **Header**
   - Mô tả: Icon back (←) bên trái, tiêu đề hộp (H2, truncate) ở giữa, icon menu "..." bên phải
   - Tương tác: Tap "←" → Home; Tap "..." → mở Action Sheet trượt lên từ đáy gồm "Chỉnh sửa" (chỉ hiện nếu `canEdit=true` và `status=locked`) và "Xóa" (luôn hiện, màu `danger`)
   - Hiệu ứng: Action Sheet slide up 250ms, nền mờ (overlay) phía sau

2. **Locked View** (`status=locked`)
   - **Box Illustration**: icon lớn (96px) của loại hộp đặt trong vòng tròn nền nhạt theo màu loại hộp, căn giữa màn hình
   - **Countdown Card**: card `surface` bo góc 12px chứa text lớn "Còn lại: X ngày" (H1) và dòng phụ "Mở vào: dd/mm/yyyy" (Body, `text-secondary`)
   - **Info Rows**: 2 dòng "Loại hộp: [tên loại]" và "Ngày tạo: dd/mm/yyyy" (Body)
   - **Nút "Chỉnh sửa"** (chỉ hiện nếu `canEdit=true`): nút outline `primary`, full-width, bên dưới Info Rows
   - Tương tác: Không xem được nội dung; Tap "Chỉnh sửa" → Edit Box Screen
   - Hiệu ứng: Box Illustration có animation lắc nhẹ idle (rotate ±2deg, lặp chậm 3s/chu kỳ) gợi cảm giác "đang chờ"

3. **Opened View** (`status=opened`)
   - Hiển thị tĩnh (read-only), nội dung theo loại hộp:
     - **Tâm Sự / Mục Tiêu**: card nội dung gốc (Body) với header "Bạn đã viết vào ngày dd/mm/yyyy:"; bên dưới là card "Câu hỏi: [follow_up_question]" + "Trả lời của bạn:" kèm badge kết quả (`success` nền nhạt + chữ "Có" nếu yes, `border` nền + chữ "Chưa" nếu no)
     - **Kỷ Niệm**: ảnh hiển thị full-width (radius 12px) ở trên cùng, bên dưới là "Ghi chú: ..." và "Lời nhắn: ..." (Body)
     - **Nhật Ký Quyết Định**: card bối cảnh quyết định gốc (Body); bên dưới là Star Rating hiển thị tĩnh (vd ★★★★☆ 4/5) + "Ghi chú phản tư: ..." (nếu có)
   - Tương tác: Scroll để đọc toàn bộ nội dung
   - Hiệu ứng: Không có animation đặc biệt

### Navigation
- Đến screen này từ: Home Screen (tap box `locked` hoặc `opened`)
- Từ screen này đến: Home Screen (back hoặc sau khi xóa), Edit Box Screen (nút "Chỉnh sửa", chỉ từ Locked View)

### Ghi chú
- Box ở trạng thái `ready` KHÔNG vào màn hình này - tap vào sẽ vào thẳng Open Box Screen
- Dialog xác nhận xóa giống Home Screen: "Hành động này không thể hoàn tác"

---

## Open Box Screen

### Mục đích
Trải nghiệm "nghi thức" mở hộp khi đã đến hạn: animation mở khóa → hiển thị nội dung cũ → thu thập phản hồi/đánh giá → hiệu ứng kết quả.

### Các thành phần chính

1. **Unlock Animation** (full-screen, chạy đầu tiên khi vào màn hình)
   - Mô tả: Icon ổ khóa/hộp lớn (120px) căn giữa trên nền `background`
   - Tương tác: Không tương tác, tự động chạy
   - Hiệu ứng: Sequence ~1.5s dùng `react-native-reanimated`: (1) icon rung nhẹ 300ms (shake), (2) "bật mở" - icon ổ khóa scale 1 → 1.2 rồi fade out trong khi icon nắp hộp mở (rotate -30deg) scale lên, (3) toàn màn hình fade sang Content Reveal (300ms)

2. **Content Reveal** (sau animation, nội dung khác nhau theo loại hộp)

   **Tâm Sự / Mục Tiêu**
   - Card "X ngày trước, bạn đã viết:" (Caption) + nội dung gốc (Body, Tâm Sự hiển thị `content`; Mục Tiêu hiển thị `goal_name` + `description`)
   - Card "Câu hỏi": hiển thị `follow_up_question` (H2)
   - 2 nút lớn cạnh nhau (50/50): "Chưa" (outline `border`) và "Có" (nền `success`)
   - Tương tác: Tap "Có"/"Chưa" → lưu `answer`, chuyển sang Result View tương ứng
   - Hiệu ứng: Card slide up + fade in (300ms) ngay sau unlock animation

   **Kỷ Niệm**
   - Ảnh hiển thị lớn (gần full-width, radius 12px)
   - Bên dưới: "Ghi chú: ..." và "Lời nhắn: ..." (Body)
   - Nút "Đóng" full-width ở cuối
   - Tương tác: Tap "Đóng" → lưu `opened_at=now`, quay về Home (KHÔNG có Result View)
   - Hiệu ứng: Ảnh fade-in + scale 0.95 → 1 (300ms)

   **Nhật Ký Quyết Định**
   - Card hiển thị `decision_name` (H2) + `context` (Body)
   - Star Rating component: 5 icon ngôi sao (32px), tap để chọn 1-5, sao đã chọn tô màu `primary`, chưa chọn viền `border`
   - Textarea "Ghi chú phản tư (tùy chọn)" (max 500 ký tự)
   - Nút "Hoàn tất" full-width, disabled cho đến khi chọn ít nhất 1 sao
   - Tương tác: Tap sao thứ N → tô màu sao 1..N; Tap "Hoàn tất" → lưu `rating`, `reflection`, `opened_at=now`, quay về Home (không có Result View)
   - Hiệu ứng: Sao vừa chọn có hiệu ứng "pop" (scale 1 → 1.3 → 1, 200ms)

3. **Result View** (chỉ áp dụng cho Tâm Sự / Mục Tiêu, hiển thị sau khi chọn Có/Chưa)
   - **Nếu "Có"**: animation confetti phủ toàn màn hình, ở giữa là text lớn "Tuyệt vời!" (H1) + dòng phụ động viên (Body), nút "Đóng"
   - **Nếu "Chưa"**: không có confetti, text "Không sao cả, hãy tiếp tục cố gắng!" (H1) + dòng phụ (Body), nút "Đóng"
   - Tương tác: Tap "Đóng" → lưu `opened_at=now`, quay về Home
   - Hiệu ứng: Confetti chạy 2-3s rồi tự dừng (rơi từ trên xuống, nhiều màu); user có thể tap "Đóng" trước khi confetti kết thúc

### Navigation
- Đến screen này từ: Home Screen (tap box `status=ready`)
- Từ screen này đến: Home Screen (sau khi hoàn tất - "Đóng")

### Ghi chú
- Nếu user thoát giữa chừng (back/home gesture trước khi tap "Có"/"Chưa"/"Hoàn tất"/"Đóng") → KHÔNG lưu `opened_at`, hộp vẫn ở trạng thái `ready` khi quay lại, và sẽ chạy lại Unlock Animation từ đầu lần sau
- Sau khi `opened_at` được lưu, mở lại hộp sẽ vào Box Detail Screen (Opened View), không vào lại màn hình này

---

## Edit Box Screen

### Mục đích
Cho phép chỉnh sửa nội dung/ngày mở của hộp `locked` trong vòng 24h kể từ lúc tạo.

### Các thành phần chính

- Tái sử dụng layout "Bước 2 - Dynamic Form" và "Section Ngày mở hộp" từ Create Box Screen, với khác biệt:
  1. **Header**: tiêu đề "Chỉnh sửa hộp" (H2) thay vì "Tạo hộp mới"
  2. **Type Label** (read-only): hiển thị loại hộp dạng badge tĩnh ở đầu form (icon + tên loại), KHÔNG cho đổi loại hộp - không có Box Type Selector
  3. **Form fields**: pre-fill toàn bộ giá trị hiện tại của hộp
  4. **Bottom Bar**: nút "Lưu thay đổi" thay vì "Tạo hộp"

### Navigation
- Đến screen này từ: Box Detail Screen (nút "Chỉnh sửa", chỉ hiện khi `canEdit=true`)
- Từ screen này đến: Box Detail Screen (sau khi lưu hoặc hủy)

### Ghi chú
- Validation giống hệt Create Box Screen theo loại hộp tương ứng
- Nếu `unlock_at` thay đổi → hủy notification cũ và lên lịch notification mới (xử lý ngầm, không cần UI riêng)
- Hộp Kỷ Niệm: nếu chọn ảnh mới → ảnh cũ bị xóa khỏi storage sau khi lưu thành công
- Tap (X)/back với thay đổi chưa lưu → dialog xác nhận "Hủy thay đổi?"
