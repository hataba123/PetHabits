# Kế hoạch triển khai PetHabits

PetHabits là ứng dụng Vue 3 phát triển bản thân theo tinh thần Atomic Habits, kết hợp một thú đồng hành tăng trưởng theo tiến trình của người dùng.

## Nguyên tắc kỹ thuật

- Vue 3, Vite, TypeScript, Composition API và Pinia.
- Vue Router quản lý năm màn hình chính.
- Toàn bộ dữ liệu MVP lưu trong một key `atomic-companion-state` của `localStorage`.
- Logic nghiệp vụ đặt trong store, service và utility; component tập trung vào hiển thị và tương tác.
- Mỗi phase được kiểm tra bằng type-check, unit test và production build trước khi commit.

## Các phase

0. Khởi tạo Vue, layout và router.
1. Model dữ liệu và persistence có version/migration.
2. Pinia store, hồ sơ người dùng và tên thú đồng hành.
3. Quản lý thói quen và validation.
4. Màn hình hôm nay, check-in và EXP.
5. Level, stage và chỉ số bản sắc.
6. Hành trình, streak và thống kê.
7. Sao lưu dữ liệu, reset và theme.
8. Responsive, accessibility, tài liệu và kiểm tra cuối.
