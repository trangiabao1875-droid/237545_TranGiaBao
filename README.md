# Hệ thống quản lý nhân sự - Điện toán đám mây

- Họ tên: Trần Gia Bảo
- MSSV: 237545
- Lớp: DH23TIN09
- Mô tả: Quản lý hồ sơ nhân viên (xem, thêm, tìm kiếm, sửa, xóa).
- Công nghệ: React, Vite, Node.js, Express, MongoDB Atlas, Docker, Docker Hub, Render.

## Chạy môi trường phát triển
1. Tạo MongoDB Atlas database `MSSV_hoten`, collection `employees`, cho phép kết nối từ IP phù hợp.
2. `cd backend && cp .env.example .env` rồi sửa `MONGODB_URI`, `DB_NAME`, `CLIENT_URL` trong `.env` (không commit file này).
3. `npm install && npm run dev` trong thư mục `backend`.
4. Mở terminal khác: `cd frontend && cp .env.example .env && npm install && npm run dev`.
5. Mở http://localhost:5173; kiểm tra API http://localhost:5000/health.


- GitHub repository: https://github.com/trangiabao1875-droid/237545_TranGiaBao.git
- Docker Hub Backend: https://hub.docker.com/repository/docker/237545trangiabao/backend/general
- Docker Hub Frontend: https://hub.docker.com/repository/docker/237545trangiabao/frontend/general
- Render App: https://web-237545.onrender.com
- Render API: https://api-237545.onrender.com
- MongoDB Atlas: mongodb+srv://trangiabao1875_db_user:xFFeKyCMnrBh2vIT@cluster0.v46rbou.mongodb.net/


