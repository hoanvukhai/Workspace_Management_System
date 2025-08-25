const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const userModel = require("../models/userModel");
const db = require("../config/db");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body; // Thêm confirmPassword
  try {
    // Kiểm tra mật khẩu và confirmPassword khớp
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu và mật khẩu nhập lại không khớp." });
    }

    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Tạo token xác minh trước
    const verificationToken = uuidv4();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 giờ
    const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    await userModel.createUser(id, name, email, hashedPassword);
    await userModel.updateVerification(email, verificationToken, verificationExpires);

    // Thử gửi email trước
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Xác minh email của bạn",
        html: `<p>Vui lòng nhấp vào liên kết sau để xác minh email của bạn: <a href="${verificationLink}">${verificationLink}</a></p><p>Liên kết sẽ hết hạn sau 24 giờ.</p>`,
      });

      res.status(201).json({ message: "Đăng ký thành công. Vui lòng kiểm tra email để xác minh." });

  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    if (!user.is_verified) {
      return res.status(403).json({ message: "Vui lòng xác minh email trước khi đăng nhập." });
    }

    // Kiểm tra trạng thái hoạt động
    if (user.is_active === 0) {
      return res.status(403).json({ message: "Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ admin." });
    }

    // Thêm role vào token
    const [userRole] = await db.execute("SELECT role FROM users WHERE id = ?", [user.id]);
    const role = userRole[0]?.role || "user";

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role } });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const isVerified = await userModel.verifyEmail(token);
    if (isVerified) {
      res.status(200).json({ message: "Email đã được xác minh thành công. Bạn có thể đăng nhập." });
    } else {
      res.status(400).json({ message: "Token xác minh không hợp lệ hoặc đã hết hạn." });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "Email không tồn tại" });

    const resetToken = uuidv4();
    const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // Hết hạn sau 1 giờ
    await userModel.updateResetPassword(email, resetToken, resetExpires);

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Đặt lại mật khẩu",
      html: `<p>Vui lòng nhấp vào liên kết sau để đặt lại mật khẩu: <a href="${resetLink}">${resetLink}</a></p><p>Liên kết sẽ hết hạn sau 1 giờ.</p>`,
    });

    res.status(200).json({ message: "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const getResetPassword = async (req, res) => {
  const { token } = req.query;
  try {
    // Kiểm tra token có hợp lệ không (chỉ kiểm tra tồn tại, không cập nhật)
    const [rows] = await db.execute(
      "SELECT id FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW()",
      [token]
    );
    if (!rows[0]) {
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }
    // Trả về trạng thái thành công để frontend hiển thị form
    res.status(200).json({ message: "Token hợp lệ. Vui lòng nhập mật khẩu mới." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  console.log("Reset password request:", { token, newPassword }); // Debug log
  try {
    const isReset = await userModel.resetPassword(token, newPassword);
    if (isReset) {
      res.status(200).json({ message: "Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập." });
    } else {
      res.status(400).json({ message: "Token đặt lại không hợp lệ hoặc đã hết hạn." });
    }
  } catch (error) {
    console.error("Error in resetPassword:", error); // Log chi tiết lỗi
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [user] = await db.execute("SELECT id, name, email, avatar_url, role, is_active, is_verified, created_at, updated_at FROM users WHERE id = ?", [userId]);
    if (!user[0]) return res.status(404).json({ message: "Người dùng không tìm thấy" });
    res.json(user[0]);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, avatar } = req.body;
    await db.execute("UPDATE users SET name = ?, avatar_url = ? WHERE id = ?", [name, avatar, userId]);
    res.json({ message: "Cập nhật thông tin thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi cập nhật thông tin." });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const [rows] = await db.execute("SELECT password FROM users WHERE id = ?", [userId]);
    if (!rows[0]) return res.status(404).json({ message: "Người dùng không tồn tại." });

    const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu hiện tại không đúng." });

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.execute("UPDATE users SET password = ? WHERE id = ?", [hashed, userId]);

    res.json({ message: "Đổi mật khẩu thành công!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi đổi mật khẩu." });
  }
};

// Thêm chức năng quản lý người dùng cho admin
const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.execute("SELECT id, name, email, avatar_url, is_active, created_at, updated_at, is_verified, role FROM users");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
};

const updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ message: "Vai trò không hợp lệ." });
  }
  try {
    await db.execute("UPDATE users SET role = ? WHERE id = ?", [role, userId]);
    res.json({ message: "Cập nhật vai trò thành công. Vui lòng đăng nhập lại." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi cập nhật vai trò." });
  }
};

const createUser = async (req, res) => {
  const { name, email, password, is_active = 1, avatar_url = null } = req.body;
  try {
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const verificationToken = uuidv4();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await db.execute(
      "INSERT INTO users (id, name, email, password, avatar_url, is_active, is_verified, verification_token, verification_expires, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, name, email, hashedPassword, avatar_url, is_active, 0, verificationToken, verificationExpires, "user"]
    );

    const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Xác minh email của bạn",
      html: `<p>Vui lòng nhấp vào liên kết sau để xác minh email của bạn: <a href="${verificationLink}">${verificationLink}</a></p><p>Liên kết sẽ hết hạn sau 24 giờ.</p>`,
    });

    res.status(201).json({ message: "Người dùng đã được tạo. Email xác minh đã gửi." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi tạo người dùng." });
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, avatar_url, is_active, is_verified, role } = req.body;
  try {
    const [user] = await db.execute("SELECT * FROM users WHERE id = ?", [userId]);
    if (!user[0]) return res.status(404).json({ message: "Người dùng không tìm thấy" });

    await db.execute(
      "UPDATE users SET name = ?, avatar_url = ?, is_active = ?, is_verified = ?, role = ?, updated_at = NOW() WHERE id = ?",
      [name, avatar_url, is_active, is_verified, role, userId]
    );
    res.json({ message: "Cập nhật thông tin người dùng thành công." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi cập nhật người dùng." });
  }
};

const changeUserPassword = async (req, res) => {
  const { userId } = req.params;
  const { newPassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.execute("UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?", [hashedPassword, userId]);
    res.json({ message: "Đổi mật khẩu cho người dùng thành công." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi đổi mật khẩu." });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  let connection;
  try {
    // Lấy connection từ pool
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Kiểm tra quyền admin
    if (req.user.role !== "admin") {
      await connection.rollback();
      return res.status(403).json({ message: "Chỉ admin mới có quyền xóa người dùng." });
    }

    // Kiểm tra xem người dùng có phải là chủ sở hữu duy nhất của workspace nào không
    const [workspaces] = await connection.execute(
      "SELECT id FROM workspaces WHERE created_by = ?",
      [userId]
    );
    for (const workspace of workspaces) {
      const [members] = await connection.execute(
        "SELECT COUNT(*) as count FROM workspace_members WHERE workspace_id = ?",
        [workspace.id]
      );
      if (members[0].count <= 1) {
        await connection.execute("DELETE FROM workspaces WHERE id = ?", [workspace.id]);
      }
    }

    // Xóa dữ liệu liên quan trước
    await connection.execute("DELETE FROM task_assignments WHERE user_id = ?", [userId]);
    await connection.execute("DELETE FROM goals WHERE user_id = ?", [userId]);
    await connection.execute("DELETE FROM transactions WHERE user_id = ?", [userId]);
    await connection.execute("DELETE FROM events WHERE user_id = ?", [userId]);
    await connection.execute("DELETE FROM notes WHERE user_id = ?", [userId]);
    await connection.execute("DELETE FROM tasks WHERE created_by = ?", [userId]);
    await connection.execute("DELETE FROM workspace_members WHERE user_id = ?", [userId]);

    // Xóa người dùng
    const [result] = await connection.execute("DELETE FROM users WHERE id = ?", [userId]);
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    await connection.commit();
    res.json({ message: "Xóa người dùng thành công." });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("Lỗi khi xóa người dùng:", err.message);
    res.status(500).json({ message: "Lỗi server khi xóa người dùng. Vui lòng liên hệ admin." });
  } finally {
    if (connection) connection.release(); // Giải phóng connection sau khi dùng
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  getResetPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
  updateUserRole,
  createUser,
  updateUser,
  changeUserPassword,
  deleteUser,
};