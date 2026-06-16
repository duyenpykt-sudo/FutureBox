# Common Errors & Fixes

## Expo Go / SDK Compatibility

### Expo SDK incompatible với Expo Go
- **Lỗi:** `ERROR Project is incompatible with this version of Expo Go`
- **Nguyên nhân:** Expo Go chỉ chạy đúng SDK version tương ứng (Expo Go 54 = SDK 54). Project dùng SDK cao hơn sẽ bị từ chối.
- **Sửa:** Downgrade project về đúng SDK version:
  1. Cập nhật `package.json`: đổi `expo`, `react`, `react-native` và các community packages về versions tương ứng SDK đích
  2. Chạy `npx expo install --fix` để tự động resolve đúng versions cho tất cả `expo-*` packages
  3. Chạy `npm install --legacy-peer-deps`

---

## Native Module Version Mismatch

### NativeWorklets crash khi load app
- **Lỗi:** `[runtime not ready]: Error: Exception in HostFunction: <unknown>` (stack trace bắt đầu từ `NativeWorklets`)
- **Nguyên nhân:** `expo install --fix` cài `react-native-reanimated@4.1.7` kéo theo `react-native-worklets@0.8.3`, nhưng Expo Go 54 chỉ bundle native worklets `0.5.1` → JS gọi native methods không tồn tại → crash.
- **Sửa:** Pin cứng cả hai package về đúng version native bundled:
  ```json
  "react-native-reanimated": "4.1.1",
  "react-native-worklets": "0.5.1"
  ```
- **Nguyên tắc:** Không dùng `~` hay `^` cho `react-native-worklets` — phải exact version khớp với Expo Go.
- **Cách kiểm tra:** Xem file `node_modules/expo/bundledNativeModules.json` để biết EXACT version native modules mà Expo Go đang bundle.
