# PetHabits

PetHabits là ứng dụng web phát triển bản thân theo tinh thần Atomic Habits, kết hợp một thú đồng hành tăng trưởng theo những lần bạn hoàn thành thói quen.

## Công nghệ

- Vue 3 + Vite + TypeScript.
- Composition API với `<script setup lang="ts">`.
- Pinia quản lý state và Vue Router quản lý màn hình.
- Vitest cho unit test.
- `localStorage` cho persistence MVP, chưa có backend và đăng nhập.

## Chạy dự án

```bash
npm install
npm run dev
```

Các lệnh kiểm tra:

```bash
npm run type-check
npm run test:unit
npm run build
```

Project hiện chưa cấu hình lint script riêng.

## Các màn hình

- `/` — Hôm nay: danh sách thói quen, check-in, tiến độ ngày và lời khuyến khích.
- `/habits` — Thói quen: tạo, sửa, tạm dừng, kích hoạt, tìm kiếm, lọc và xóa.
- `/companion` — Bạn đồng hành: level, EXP, stage và chỉ số bản sắc.
- `/journey` — Hành trình: lịch sử, filter, tổng thời gian và streak.
- `/settings` — Cài đặt: profile, companion, theme, export/import và reset.

## Dữ liệu cục bộ

Toàn bộ state được lưu bằng một key duy nhất:

```text
atomic-companion-state
```

Dữ liệu có `version`, được validate khi load/import và có migration function. Level, stage, EXP và streak được tính từ lịch sử `habitLogs`, vì vậy xóa hoặc hoàn tác check-in sẽ tính lại tiến trình.

Tại `/settings`:

- **Export JSON** tải một bản sao dữ liệu hiện tại.
- **Import JSON** validate toàn bộ tệp trước khi thay thế state hiện tại.
- **Reset toàn bộ** yêu cầu xác nhận trước khi xóa dữ liệu.

Không lưu secret, token hoặc mật khẩu trong source code hay `localStorage`.

## Cấu trúc chính

```text
src/
├── components/       # Form và card giao diện
├── composables/      # Logic dùng lại như theme
├── constants/        # Nhãn nhóm bản sắc
├── models/           # Interface/type dữ liệu
├── router/            # Vue Router
├── services/         # Persistence service
├── stores/            # Pinia stores
├── utils/             # EXP, level, streak, validation, date
└── views/             # Năm màn hình MVP
```
