# Hướng dẫn bảo trì PetHabits

- Giữ thay đổi nhỏ, không refactor ngoài phạm vi.
- Dùng Vue 3 với `<script setup lang="ts">`, Composition API và Pinia.
- Không truy cập `localStorage` trực tiếp trong component; dùng persistence service/store.
- Không dùng `any` nếu không bắt buộc.
- Không thêm backend giả, secret hoặc dữ liệu nhạy cảm.
- Sau thay đổi quan trọng, chạy `npm run type-check`, `npm run test:unit` và `npm run build`.
- Không commit `node_modules`, `dist` hoặc file môi trường chứa secret.
