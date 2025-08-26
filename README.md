# Hệ Thống Quản Lý Không Gian Làm Việc

## Giới thiệu

Dự án này là một hệ thống quản lý không gian làm việc toàn diện, được thiết kế để hỗ trợ cá nhân và các nhóm nhỏ (như gia đình, nhóm học tập hoặc đội ngũ khởi nghiệp) tổ chức công việc, ghi chú, sự kiện, mục tiêu và giao dịch trên một nền tảng tích hợp. Dự án khắc phục tình trạng phân mảnh thông tin từ nhiều ứng dụng khác nhau bằng cách cung cấp các công cụ tích hợp cho không gian làm việc cá nhân và nhóm.

Hệ thống cho phép người dùng tạo không gian làm việc cá nhân, quản lý thành viên với phân quyền dựa trên vai trò, giao nhiệm vụ, theo dõi sự kiện và mục tiêu, cũng như xử lý các giao dịch tài chính. Được phát triển như một phần của đồ án liên ngành tại Đại học Phenikaa, dự án tập trung vào giao diện thân thiện, bảo mật và khả năng mở rộng.

### Động lực chính:
- Khắc phục hạn chế của các công cụ hiện có như Trello (quản lý nhiệm vụ), Notion (ghi chú), Google Calendar (sự kiện) và Money Lover (tài chính) bằng cách tích hợp chúng thành một hệ thống liền mạch.
- Hỗ trợ cộng tác linh hoạt cho các nhóm nhỏ với các tính năng như phân quyền (chủ sở hữu, thành viên) và đồng bộ dữ liệu.
- Đảm bảo trải nghiệm người dùng nhất quán giữa không gian cá nhân và nhóm.

## Tính năng

### Yêu cầu chức năng
- **Xác thực và phân quyền**:
  - Đăng ký, đăng nhập, xác minh email, đặt lại mật khẩu và quản lý hồ sơ người dùng.
  - Phân quyền dựa trên vai trò: Admin (quản lý toàn hệ thống), Chủ sở hữu không gian (kiểm soát toàn bộ không gian), Thành viên (truy cập giới hạn theo quyền).

- **Quản lý không gian làm việc**:
  - Tạo, chỉnh sửa, xóa không gian với tùy chọn hiển thị công khai/tư nhân.
  - Tùy chỉnh chi tiết không gian như tên, mô tả và giao diện (ví dụ: màu sắc).

- **Quản lý thành viên**:
  - Mời người dùng vào không gian và phân vai trò (chủ sở hữu, chỉnh sửa viên, người xem).
  - Xem, cập nhật hoặc xóa thành viên; tìm kiếm theo tên hoặc vai trò.

- **Quản lý nhiệm vụ**:
  - Tạo, giao, cập nhật và xóa nhiệm vụ với trạng thái (chưa làm, đang làm, đã hoàn thành).
  - Gán nhiệm vụ cho thành viên cụ thể để theo dõi cộng tác.

- **Quản lý ghi chú**:
  - Thực hiện CRUD (tạo, đọc, cập nhật, xóa) cho ghi chú cá nhân và nhóm.

- **Quản lý sự kiện**:
  - Lập lịch, chỉnh sửa và đồng bộ hóa sự kiện hoặc lịch trong không gian.

- **Quản lý mục tiêu**:
  - Đặt, theo dõi và cập nhật mục tiêu cá nhân hoặc nhóm.

- **Quản lý giao dịch**:
  - Ghi nhận và quản lý các giao dịch tài chính liên quan đến không gian (ví dụ: chi phí nhóm).

- **Tính năng Admin**:
  - Quản lý toàn bộ người dùng: Xem, chỉnh sửa, xóa; đặt lại mật khẩu qua giao diện admin.

- **Tìm kiếm và Thống kê**:
  - Tìm kiếm và lọc (theo thời gian, trạng thái, tiêu đề) trên bảng điều khiển.
  - Thống kê cơ bản dưới dạng biểu đồ (số lượng nhiệm vụ, giao dịch, v.v.).

### Yêu cầu phi chức năng
- **Hiệu suất**: Thiết kế đáp ứng trên các thiết bị từ 320px đến 1920px; tải nhanh với truy vấn được tối ưu.
- **Bảo mật**: Sử dụng JWT để xác thực; xác minh email; kiểm soát truy cập dựa trên vai trò.
- **Tính dễ sử dụng**: Giao diện trực quan với Tailwind CSS; điều hướng nhất quán.
- **Khả năng mở rộng**: Kiến trúc mô-đun để dễ dàng mở rộng (ví dụ: thêm hỗ trợ di động với Flutter trong tương lai).

### Ràng buộc
- **Triển khai**: Sử dụng công nghệ mã nguồn mở; không sao chép mã độc quyền.
- **Đạo đức**: Tôn trọng quyền riêng tư người dùng; chỉ sử dụng nguồn tài nguyên hợp pháp.
- **Pháp lý**: Tuân thủ tiêu chuẩn bảo vệ dữ liệu; trích dẫn rõ ràng tài liệu tham khảo.

## Thiết kế hệ thống

### Use Cases
Hệ thống bao gồm các kịch bản sử dụng cho admin và người dùng:
- Admin: Quản lý người dùng, đặt lại mật khẩu, giám sát hệ thống.
- Người dùng: Xác thực, quản lý hồ sơ cá nhân, tạo/quản lý không gian, giao nhiệm vụ, v.v.

Các sơ đồ Use-case chi tiết (tổng quan, xác thực, quản lý không gian) có trong báo cáo dự án.

### Mô hình lớp và đối tượng
- Các lớp chính: User, Workspace, WorkspaceMember, Task, TaskAssignment, Note, Event, Goal, Transaction.
- Quan hệ: Một-nhiều (ví dụ: Không gian đến Thành viên), Nhiều-nhiều (ví dụ: Nhiệm vụ đến Phân công).

### Sơ đồ tuần tự
- Bao gồm các luồng như đăng nhập, đặt lại mật khẩu, tạo không gian, quản lý thành viên, v.v.

### Cơ sở dữ liệu
- Cơ sở dữ liệu MySQL với các bảng cho người dùng, không gian, nhiệm vụ, sự kiện, mục tiêu, ghi chú, giao dịch và thành viên.
- Cấu trúc chuẩn hóa để đảm bảo tính toàn vẹn dữ liệu.

### Giao diện người dùng
- Các trang: Đăng nhập/Đăng ký, Trang chủ/Bảng điều khiển, Hồ sơ, Chi tiết Không gian, Quản lý người dùng Admin.
- Các thành phần: Danh sách nhiệm vụ, Danh sách thành viên, Modal chỉnh sửa, Spinner tải.

## Công nghệ sử dụng

- **Frontend**: React.js, Tailwind CSS, React Icons.
- **Backend**: Node.js, Express.js.
- **Cơ sở dữ liệu**: MySQL (quản lý qua MySQL Workbench).
- **Khác**: JWT cho xác thực, Nodemailer cho email, Vite cho công cụ xây dựng.

## Cấu trúc dự án
<img width="300" height="750" alt="image" src="https://github.com/user-attachments/assets/89a901d4-f2f7-43b7-a257-17e199611a32" />
<img width="330" height="750" alt="image" src="https://github.com/user-attachments/assets/ab9c3100-4d57-4a21-bb10-f59d39f2e6dc" />
<img width="300" height="200" alt="image" src="https://github.com/user-attachments/assets/3c5fbb85-c72b-4725-b603-1728220a4f44" />



## Hướng dẫn cài đặt

1. **Yêu cầu trước**:
   - Node.js (phiên bản 14+)
   - MySQL Server
   - Git

2. **Clone kho lưu trữ**:
git clone <repository-url>
cd task-management</repository-url>

3. **Cài đặt Backend**:
- Di chuyển đến `backend/`
- Cài đặt dependencies: `npm install`
- Tạo file `.env` với các biến (ví dụ: DB_HOST, DB_USER, JWT_SECRET, EMAIL_USER)
- Cài đặt cơ sở dữ liệu MySQL: Nhập schema SQL từ file dự án.
- Chạy server: `npm start`

4. **Cài đặt Frontend**:
- Di chuyển đến `frontend/`
- Cài đặt dependencies: `npm install`
- Chạy ứng dụng: `npm run dev`

5. **Cấu hình cơ sở dữ liệu**:
- Sử dụng MySQL Workbench để tạo cơ sở dữ liệu và bảng dựa trên schema (ví dụ: users, workspaces, tasks).

## Hướng dẫn sử dụng

- **Đăng ký/Đăng nhập**: Truy cập qua trang `/register` hoặc `/login`.
- **Tạo không gian**: Từ bảng điều khiển trang chủ, tạo không gian mới và mời thành viên.
- **Quản lý nhiệm vụ/Ghi chú/Sự kiện**: Điều hướng đến chi tiết không gian và sử dụng các thành phần quản lý.
- **Quyền Admin**: Admin có thể quản lý người dùng từ bảng điều khiển admin.

Để xem demo, tham khảo video dự án hoặc ảnh chụp màn hình trong báo cáo.

## Kế hoạch dự án và làm việc nhóm

Dự án được thực hiện trong 8 tuần với phương pháp lấy cảm hứng từ Agile:
- Họp tuần qua Google Meet.
- Theo dõi công việc trên Trello/GitHub Issues.
- Chia sẻ tài liệu trên Google Drive.

Thành viên nhóm: Vũ Khải Hoàn (21012316), Định Trọng Việt Phú (21012321). Hướng dẫn bởi TS. Nguyễn Thị Thùy Liên.

## Học tập và cải tiến tương lai

- **Kiến thức đã học**: React, Node.js, MySQL, thực hành Agile.
- **Tương lai**: Thêm ứng dụng di động với Flutter; phân tích nâng cao; tích hợp lịch bên ngoài.

## Tài liệu tham khảo

- Trello: www.trello.com
- Notion: www.notion.so
- Google Calendar: calendar.google.com
- Money Lover: www.moneylover.me
- Tài liệu bổ sung: Sơ đồ Use-case (thinhnotes.com), Sơ đồ lớp (innovirtual.de), Sơ đồ tuần tự (codelearn.io), ERD (thinhnotes.com), Tài liệu React (react.dev), Tailwind CSS (tailwindcss.com), Node.js (nodejs.org), Express.js (expressjs.com), React Icons (react-icons.github.io), MySQL Workbench (dev.mysql.com).
