# PetHabits

PetHabits là ứng dụng web giúp xây dựng thói quen nhỏ mỗi ngày theo tinh thần Atomic Habits. Mỗi lần bạn hoàn thành một thói quen, bạn nhận EXP để nuôi lớn một người bạn đồng hành.

## Tính năng

- Quản lý thói quen: tạo, sửa, tìm kiếm, lọc, tạm dừng và xóa.
- Check-in theo hai mức: tối thiểu hoặc đầy đủ.
- Theo dõi tiến độ trong ngày, EXP, level và giai đoạn phát triển.
- Theo dõi hành trình, lịch sử check-in, streak và tổng thời gian.
- Tùy biến tên và hình dạng bạn đồng hành: Tròn, Mềm, Tinh thể hoặc Lá.
- Chọn giao diện sáng, tối hoặc theo hệ thống.
- Export/import dữ liệu JSON và reset dữ liệu khi cần.

## Công nghệ

- Vue 3, Vite và TypeScript.
- Composition API với `<script setup lang="ts">`.
- Pinia quản lý state và Vue Router quản lý điều hướng.
- Vitest và Vue Test Utils cho unit test.
- `localStorage` cho persistence MVP; hiện chưa có backend, đăng nhập hoặc đồng bộ cloud.

## Yêu cầu

- Node.js 20 trở lên.
- npm 10 trở lên.

## Cài đặt và chạy local

```bash
git clone https://github.com/hataba123/PetHabits.git
cd PetHabits
npm install
npm run dev
```

Sau đó mở địa chỉ Vite hiển thị trong terminal, thường là:

```text
http://localhost:5173
```

Trên Windows, có thể chạy file `chay-pethabits.bat` để cài dependency và khởi động ứng dụng nếu file này có sẵn trong workspace.

## Hướng dẫn sử dụng

## Cách chơi

PetHabits là một vòng lặp đơn giản: chọn một hành động nhỏ, thực hiện, check-in và dùng EXP nhận được để cùng bạn đồng hành tiến bộ.

### Vòng lặp mỗi ngày

1. Mở màn hình **Hôm nay** để xem các thói quen đang hoạt động.
2. Chọn một thói quen đủ nhỏ để bắt đầu.
3. Thực hiện phiên bản tối thiểu hoặc hoàn thành đầy đủ mục tiêu.
4. Bấm **Check-in** và chọn mức hoàn thành tương ứng.
5. Nhận EXP, theo dõi phần trăm tiến độ trong ngày và tiếp tục với bước tiếp theo.
6. Cuối ngày, vào **Hành trình** để xem lịch sử và streak của mình.

### EXP, level và trưởng thành

Mỗi check-in hợp lệ sẽ cộng EXP theo phần thưởng của thói quen. Tổng EXP được tính từ toàn bộ lịch sử check-in; khi hoàn tác một lần check-in, EXP và level sẽ tự tính lại.

| Level | Giai đoạn | Ý nghĩa |
| --- | --- | --- |
| 1–4 | Trứng | Bắt đầu xây dựng nhịp mới |
| 5–14 | Thú con | Duy trì những hành động nhỏ |
| 15–29 | Thiếu niên | Thói quen bắt đầu vững hơn |
| 30–49 | Trưởng thành | Hệ thống thói quen đã có nền tảng |
| 50+ | Tiến hóa | Thành quả của quá trình bền bỉ |

Hình dạng custom không tự đổi khi lên level. Bạn đồng hành sẽ giữ hình Tròn, Mềm, Tinh thể hoặc Lá mà bạn đã chọn; giai đoạn phát triển và emoji của companion sẽ thay đổi theo level.

### Cách chơi hiệu quả

- Bắt đầu bằng phiên bản tối thiểu, ví dụ đọc 2 phút thay vì đặt mục tiêu quá lớn.
- Ưu tiên xuất hiện đều đặn hơn là chờ một ngày hoàn hảo.
- Dùng mục tiêu tuần nếu lịch sinh hoạt không phù hợp với check-in mỗi ngày.
- Ghi chú khi check-in để nhận ra điều gì giúp bạn duy trì thói quen.
- Nếu bỏ lỡ một ngày, không cần reset; chỉ cần quay lại với một bước nhỏ ở lần tiếp theo.

### 1. Khai báo hồ sơ

Vào **Cài đặt** để nhập tên hiển thị và câu mô tả phiên bản bạn muốn trở thành. Nội dung này sẽ xuất hiện ở màn hình **Hôm nay**.

### 2. Tạo thói quen

Vào **Thói quen**, chọn **Tạo thói quen** và nhập:

- Tên thói quen và mô tả.
- Nhóm bản sắc muốn rèn luyện.
- Mục tiêu theo ngày hoặc theo tuần.
- Phiên bản tối thiểu, tức hành động nhỏ nhất có thể thực hiện.
- EXP nhận được sau mỗi lần hoàn thành.

### 3. Check-in mỗi ngày

Ở màn hình **Hôm nay**, chọn **Check-in** bên cạnh thói quen. Bạn có thể ghi nhận mức **Tối thiểu** khi chỉ hoàn thành phiên bản nhỏ nhất hoặc **Đầy đủ** khi hoàn thành trọn mục tiêu.

Nếu check-in nhầm, vào danh sách các lần đã ghi nhận và chọn **Hoàn tác**. EXP và tiến trình sẽ được tính lại từ lịch sử.

### 4. Tùy biến bạn đồng hành

Vào **Cài đặt → Chọn hình dạng yêu thích**. Bấm vào một lựa chọn để lưu ngay. Hình dạng mới sẽ được dùng đồng bộ ở màn hình Hôm nay và Bạn đồng hành.

Tên bạn đồng hành được đổi trong phần **Đặt tên cho người bạn nhỏ**.

### 5. Sao lưu và khôi phục

Tại **Cài đặt → Sao lưu & khôi phục**:

- **Export JSON**: tải dữ liệu hiện tại về máy.
- **Import JSON**: khôi phục từ một file backup hợp lệ.
- **Reset toàn bộ**: xóa toàn bộ hồ sơ, thói quen, lịch sử và tiến trình sau khi xác nhận.

Nên export dữ liệu định kỳ vì dữ liệu MVP chỉ được lưu trên thiết bị hiện tại.

## Các màn hình

| Đường dẫn | Mục đích |
| --- | --- |
| `/` | Hôm nay, check-in và tiến độ ngày |
| `/habits` | Tạo và quản lý thói quen |
| `/companion` | EXP, level, giai đoạn và chỉ số bản sắc |
| `/journey` | Lịch sử, filter, streak và thống kê |
| `/settings` | Hồ sơ, bạn đồng hành, theme và dữ liệu |

## Kiểm tra chất lượng

```bash
npm run type-check
npm run test:unit
npm run build
```

Project hiện chưa có script lint riêng.

## Dữ liệu và bảo mật

Toàn bộ state MVP được lưu bằng một key duy nhất trong `localStorage`:

```text
atomic-companion-state
```

Dữ liệu có version, được validate khi load/import và có migration cho các phiên bản cũ. Ứng dụng không chứa secret, token hoặc mật khẩu.

## Cấu trúc chính

```text
src/
├── components/       # Component giao diện dùng lại
├── composables/      # Logic dùng lại như theme
├── constants/        # Nhãn và cấu hình cố định
├── models/           # Interface và type dữ liệu
├── router/           # Vue Router
├── services/         # Persistence service
├── stores/            # Pinia stores
├── utils/             # EXP, level, streak, validation, date
└── views/             # Các màn hình chính
```

## Đóng góp

1. Tạo branch cho thay đổi mới.
2. Giữ thay đổi nhỏ và bám theo cấu trúc hiện tại.
3. Chạy type-check, unit test và build trước khi tạo pull request.
4. Không commit `node_modules`, `dist` hoặc file môi trường chứa secret.
