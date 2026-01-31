const db = require("../config/db");
const bcrypt = require("bcryptjs"); // Thêm import bcryptjs

const findUserByEmail = async (email) => {
  const [rows] = await db.execute("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0];
};

const createUser = async (id, name, email, hashedPassword) => {
  const sql = "INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)";
  await db.execute(sql, [id, name, email, hashedPassword]);
};

const findUserById = async (id) => {
  const [rows] = await db.query('SELECT id, name, email, avatar_url AS avatar, created_at FROM users WHERE id = $1', [id]);
  return rows[0];
};

const updateVerification = async (email, verificationToken, expires) => {
  await db.execute(
    "UPDATE users SET verification_token = $1, verification_expires = $2, is_verified = FALSE WHERE email = $3",
    [verificationToken, expires, email]
  );
};

const verifyEmail = async (verificationToken) => {
  const [rows] = await db.execute(
    "UPDATE users SET is_verified = TRUE, verification_token = NULL, verification_expires = NULL WHERE verification_token = $1 AND verification_expires > NOW()",
    [verificationToken]
  );
  return rows.affectedRows > 0;
};

const updateResetPassword = async (email, resetToken, expires) => {
  await db.execute(
    "UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3",
    [resetToken, expires, email]
  );
};

const resetPassword = async (resetToken, newPassword) => {
  console.log("Resetting password with token:", resetToken); // Debug log
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const [rows] = await db.execute(
    "UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE reset_password_token = $2 AND reset_password_expires > NOW()",
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
