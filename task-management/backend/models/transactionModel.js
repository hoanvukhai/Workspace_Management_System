const db = require("../config/db");

const createTransaction = async (id, userId, workspaceId, amount, type, category, note, date, payment_method) => {
  const safe = v => v === undefined ? null : v;
  const sql = "INSERT INTO transactions (id, user_id, workspace_id, amount, type, category, note, date, payment_method, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
  await db.execute(sql, [id, userId, workspaceId, amount, type, safe(category), safe(note), date, safe(payment_method)]);
};

const getTransactions = async (workspaceId) => {
  const [rows] = await db.execute(
    "SELECT t.id, t.amount, t.type, t.category, t.note, t.date, t.payment_method, t.created_at, u.name AS user_name FROM transactions t JOIN users u ON t.user_id = u.id WHERE t.workspace_id = ? ORDER BY t.date DESC",
    [workspaceId]
  );
  return rows;
};

const updateTransaction = async (transactionId, amount, type, category, note, date, payment_method) => {
  const safe = v => v === undefined ? null : v;
  const sql = "UPDATE transactions SET amount = ?, type = ?, category = ?, note = ?, date = ?, payment_method = ?, updated_at = NOW() WHERE id = ?";
  await db.execute(sql, [amount, type, safe(category), safe(note), date, safe(payment_method), transactionId]);
};

const deleteTransaction = async (transactionId) => {
  await db.execute("DELETE FROM transactions WHERE id = ?", [transactionId]);
};

module.exports = { createTransaction, getTransactions, updateTransaction, deleteTransaction };