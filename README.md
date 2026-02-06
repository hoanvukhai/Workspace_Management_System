# DuoTask - Hệ thống Quản lý Workspace

Ứng dụng web full-stack quản lý công việc, ghi chú, lịch trình, chi tiêu và mục tiêu cho cá nhân và nhóm.

## Tổng quan

DuoTask là nền tảng quản lý workspace tích hợp đa chức năng, cho phép người dùng tổ chức công việc, theo dõi tiến độ dự án, quản lý chi tiêu cơ bản và làm việc nhóm hiệu quả với hệ thống phân quyền rõ ràng.

**Demo:** [Live Demo](https://workspace-management-system-ebon.vercel.app/) | **API:** [Backend](https://duotask-api.onrender.com)

## Tính năng chính

- **Quản lý Workspace**: Tạo workspace công khai/riêng tư, phân quyền thành viên (Owner/Editor/Viewer)
- **Task Management**: CRUD tasks, assign cho members, tracking theo status và deadline
- **Notes System**: Ghi chú nhanh với thông tin người tạo và timestamp
- **Calendar Events**: Quản lý sự kiện với reminder và tracking status
- **Financial Tracking**: Ghi nhận thu/chi, báo cáo lợi nhuận tự động
- **Goal Management**: Theo dõi mục tiêu với tiến độ phần trăm
- **Admin Panel**: Quản lý users, phân quyền, search và pagination
- **Authentication**: JWT, email verification, password reset

## Tech Stack

**Backend**
- Node.js + Express.js
- PostgreSQL (production) / MySQL (development)
- JWT Authentication, Bcrypt password hashing
- Nodemailer (email service)

**Frontend**
- React 19 + React Router
- Tailwind CSS
- Axios
- Responsive design

## Cài đặt

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 14 hoặc MySQL >= 8

### Setup

```bash
# Clone repository
git clone https://github.com/yourusername/duotask.git
cd duotask

# Backend setup
cd backend
npm install
cp .env.example .env
# Chỉnh sửa .env với database và email config
npm run dev

# Frontend setup (terminal mới)
cd frontend
npm install
npm start
```

### Environment Variables

Backend `.env`:
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/duotask
JWT_SECRET=your-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

Frontend `.env.development`:
```env
REACT_APP_API_URL=http://localhost:5000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/verify-email` - Xác minh email
- `POST /api/auth/forgot-password` - Quên mật khẩu

### Workspace
- `POST /api/auth/workspaces` - Tạo workspace
- `GET /api/auth/workspaces/:id` - Chi tiết workspace
- `PUT /api/auth/workspaces/:id` - Cập nhật (Owner only)

### Tasks
- `POST /api/auth/tasks/add` - Tạo task (Owner/Editor)
- `GET /api/auth/tasks/:workspace_id` - Danh sách tasks
- `PUT /api/auth/tasks/:task_id` - Cập nhật task

### Admin
- `GET /api/auth/admin/users` - Quản lý users (Admin only)

*Xem chi tiết API documentation trong code comments*

## Database Schema

```sql
Users (id, name, email, password, role, is_verified)
Workspaces (id, created_by, name, is_private, theme_color)
Workspace_Members (id, user_id, workspace_id, role)
Tasks (id, workspace_id, created_by, title, status, deadline)
Notes, Events, Transactions, Goals...
```

## Deployment

**Backend (Render):**
```bash
Build: npm install
Start: npm start
Env: DATABASE_URL, JWT_SECRET, EMAIL_*, FRONTEND_URL
```

**Frontend (Vercel):**
```bash
Build: npm run build
Env: REACT_APP_API_URL
```

## Cấu trúc thư mục

```
task-management/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── models/          # Database queries
│   ├── middleware/      # Auth & admin middleware
│   ├── routes/          # API routes
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Route pages
│   │   └── config/      # API config
│   └── package.json
└── database/            # SQL schemas
```

## Đặc điểm kỹ thuật

- Role-based access control (3 levels: Owner/Editor/Viewer)
- Database abstraction layer (PostgreSQL/MySQL compatibility)
- JWT token authentication với auto-logout
- Email verification và password reset flow
- Responsive UI với Tailwind CSS
- RESTful API design
- MVC architecture pattern

## Contact

**Developer:** Vũ Khải Hoàn

**Email:** balaminmau@gmail.com

**GitHub:** [github.com/hoanvukhai](https://github.com/hoanvukhai)

---
*Dự án phát triển cho mục đích học tập và portfolio*
