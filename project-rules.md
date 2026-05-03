# Hex-Text Converter - Project Rules

Đây là file quy tắc dành cho AI (Assistant) ghi nhớ khi làm việc với dự án này.

## 1. Tính chất dự án
- **Loại dự án**: Chrome Extension (Manifest V3).
- **Mục đích**: Chuyển đổi qua lại giữa mã Hex và Text.
- **Tính chất**: Dự án cá nhân, ưu tiên sự nhanh gọn, tiện dụng và hoàn thành tính năng.

## 2. Quy tắc Coding (Coding Guidelines)
- **Cho phép debug thoải mái**: Khuyến khích sử dụng `console.log`, `console.error`, `console.info` ở các vị trí cần thiết (nhận/gửi message, xử lý data, bắt lỗi, v.v.) để dễ dàng theo dõi trên DevTools. Không yêu cầu phải xóa sạch các log này.
- **Tính năng trên hết (Functionality First)**: Ưu tiên code chạy đúng, đơn giản, dễ đọc, dễ sửa. Không cần áp dụng các design patterns rườm rà hay over-engineering.
- **Bảo mật nới lỏng**: Vì là dự án cá nhân, không cần áp dụng các tiêu chuẩn bảo mật quá khắt khe. Tập trung vào logic xử lý và luồng dữ liệu mượt mà.
- **Thử nghiệm mở**: Thoải mái sử dụng và thử nghiệm các Chrome APIs mới (ví dụ như Side Panel API) để tối ưu trải nghiệm sử dụng.
