const { v4: uuidv4 } = require("uuid");
const transactionModel = require("../models/transactionModel");
const db = require("../config/db");

exports.createTransaction = async (req, res) => {
  const { workspace_id, amount, type, category, note, date, payment_method } = req.body;
  try {
    const [member] = await db.execute(
      "SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?",
      [workspace_id, req.user.id]
    );
    if (!member[0]) return res.status(403).json({ message: "Bạn không phải thành viên workspace." });
    if (member[0].role === "member") return res.status(403).json({ message: "Viewer không được thêm giao dịch." });

    const userId = req.user.id;
    const transactionId = uuidv4();
    await transactionModel.createTransaction(transactionId, userId, workspace_id, amount, type, category, note, date, payment_method);
    res.status(201).json({ message: "Giao dịch đã được tạo.", id: transactionId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
};

exports.getTransactions = async (req, res) => {
  const { workspace_id } = req.params;
  try {
    const [workspace] = await db.execute("SELECT * FROM workspaces WHERE id = ?", [workspace_id]);
    if (!workspace[0]) return res.status(404).json({ message: "Workspace not found" });
    const isPublic = workspace[0].is_private === 0;

    if (!isPublic) {
      const [member] = await db.execute(
        "SELECT * FROM workspace_members WHERE workspace_id = ? AND user_id = ?",
        [workspace_id, req.user.id]
      );
      if (!member[0]) return res.status(403).json({ message: "Bạn không có quyền truy cập." });
    }

    const transactions = await transactionModel.getTransactions(workspace_id);
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
};

exports.updateTransaction = async (req, res) => {
  const { transactionId } = req.params;
  const { amount, type, category, note, date, payment_method } = req.body;
  try {
    const [transaction] = await db.execute(
      "SELECT * FROM transactions WHERE id = ?",
      [transactionId]
    );
    if (!transaction[0]) return res.status(404).json({ message: "Giao dịch không tồn tại." });

    const [member] = await db.execute(
      "SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?",
      [transaction[0].workspace_id, req.user.id]
    );
    if (!member[0] || (member[0].role !== "owner" && member[0].role !== "senior")) {
      return res.status(403).json({ message: "Chỉ owner hoặc senior mới có thể sửa giao dịch." });
    }

    await transactionModel.updateTransaction(transactionId, amount, type, category, note, date, payment_method);
    res.json({ message: "Giao dịch đã được cập nhật." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
};

exports.deleteTransaction = async (req, res) => {
  const { transactionId } = req.params;
  try {
    const [transaction] = await db.execute(
      "SELECT * FROM transactions WHERE id = ?",
      [transactionId]
    );
    if (!transaction[0]) return res.status(404).json({ message: "Giao dịch không tồn tại." });

    const [member] = await db.execute(
      "SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?",
      [transaction[0].workspace_id, req.user.id]
    );
    if (!member[0] || (member[0].role !== "owner" && member[0].role !== "senior")) {
      return res.status(403).json({ message: "Chỉ owner hoặc senior mới có thể xóa giao dịch." });
    }

    await transactionModel.deleteTransaction(transactionId);
    res.json({ message: "Giao dịch đã được xóa." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
};