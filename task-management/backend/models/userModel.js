const db = require("../config/db");
const bcrypt = require("bcryptjs"); // Thêm import bcryptjs

const findUserByEmail = async (email) => {
  const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

const createUser = async (id, name, email, hashedPassword) => {
  const sql = "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)";
  await db.execute(sql, [id, name, email, hashedPassword]);
};

const findUserById = async (id) => {
  const [rows] = await db.query('SELECT id, name, email, avatar_url AS avatar, created_at FROM users WHERE id = ?', [id]);
  return rows[0];
};

const updateVerification = async (email, verificationToken, expires) => {
  await db.execute(
    "UPDATE users SET verification_token = ?, verification_expires = ?, is_verified = FALSE WHERE email = ?",
    [verificationToken, expires, email]
  );
};

const verifyEmail = async (verificationToken) => {
  const [rows] = await db.execute(
    "UPDATE users SET is_verified = TRUE, verification_token = NULL, verification_expires = NULL WHERE verification_token = ? AND verification_expires > NOW()",
    [verificationToken]
  );
  return rows.affectedRows > 0;
};

const updateResetPassword = async (email, resetToken, expires) => {
  await db.execute(
    "UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?",
    [resetToken, expires, email]
  );
};

const resetPassword = async (resetToken, newPassword) => {
  console.log("Resetting password with token:", resetToken); // Debug log
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const [rows] = await db.execute(
    "UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE reset_password_token = ? AND reset_password_expires > NOW()",
    [hashedPassword, resetToken]
  );
  console.log("Affected rows:", rows.affectedRows); // Debug log
  return rows.affectedRows > 0;
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
  updateVerification,
  verifyEmail,
  updateResetPassword,
  resetPassword,
};
