import React, { useState, useEffect } from "react";
import axios from "axios";

function toMySQLDate(dt) {
  if (!dt) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dt)) return dt;
  const d = new Date(dt);
  if (isNaN(d.getTime())) return null;
  return d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
}

function formatVND(amount) {
  return Number(amount).toLocaleString("vi-VN") + " VND";
}

const ManageTransactions = ({ workspaceId, currentUserRole }) => {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    type: "income",
    category: "",
    note: "",
    date: "",
    payment_method: "cash",
  });
  const token = localStorage.getItem("token");

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/transactions/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error("Lỗi lấy giao dịch:", err);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/auth/transactions",
        {
          workspace_id: workspaceId,
          ...newTransaction,
          date: toMySQLDate(newTransaction.date),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTransaction({ amount: "", type: "income", category: "", note: "", date: "", payment_method: "cash" });
      fetchTransactions();
    } catch (err) {
      console.error("Lỗi thêm giao dịch:", err);
    }
  };

  const handleUpdateTransaction = async (transactionId, updatedFields) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    const safe = v => v === undefined ? null : v;

    const updatedTransaction = {
      amount: safe(updatedFields.amount ?? transaction.amount),
      type: safe(updatedFields.type ?? transaction.type),
      category: safe(updatedFields.category ?? transaction.category),
      note: safe(updatedFields.note ?? transaction.note),
      date: toMySQLDate(updatedFields.date ?? transaction.date),
      payment_method: safe(updatedFields.payment_method ?? transaction.payment_method),
    };

    try {
      await axios.put(
        `http://localhost:5000/api/auth/transactions/${transactionId}`,
        updatedTransaction,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTransactions();
    } catch (err) {
      console.error("Lỗi cập nhật giao dịch:", err);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm("Bạn có chắc muốn xóa giao dịch này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/transactions/${transactionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTransactions();
    } catch (err) {
      console.error("Lỗi xóa giao dịch:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [workspaceId]);

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Quản lý giao dịch</h3>

      {(currentUserRole === "owner" || currentUserRole === "senior") && (
        <form onSubmit={handleAddTransaction} className="mb-6 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="number"
              step="1"
              min="0"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value.replace(/\D/g, "") })}
              placeholder="Số tiền"
              className="p-2 border rounded"
              required
            />
            <select
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
              className="p-2 border rounded"
            >
              <option value="income">Thu</option>
              <option value="expense">Chi</option>
            </select>
          </div>
          <input
            type="text"
            value={newTransaction.category}
            onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
            placeholder="Danh mục"
            className="w-full p-2 border rounded"
          />
          <textarea
            value={newTransaction.note}
            onChange={(e) => setNewTransaction({ ...newTransaction, note: e.target.value })}
            placeholder="Ghi chú"
            className="w-full p-2 border rounded"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <select
              value={newTransaction.payment_method}
              onChange={(e) => setNewTransaction({ ...newTransaction, payment_method: e.target.value })}
              className="p-2 border rounded"
            >
              <option value="cash">Tiền mặt</option>
              <option value="bank_card">Thẻ ngân hàng</option>
              <option value="mobile_app">Ứng dụng di động</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Thêm giao dịch
          </button>
        </form>
      )}

      {/* Hiển thị danh sách giao dịch */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {transactions.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded shadow border ${t.type === "income" ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300"} hover:shadow-lg transition-transform hover:scale-[1.01]`}
          >
            <h4 className="text-lg font-bold text-gray-800">
              {t.type === "income" ? "Thu" : "Chi"}: {formatVND(t.amount)} VND
            </h4>
            <p className="text-sm text-gray-600">
              Ngày: {new Date(t.date).toLocaleDateString()} | Người tạo: {t.user_name}
            </p>
            <p className="text-sm">Danh mục: <strong>{t.category || "Không có"}</strong></p>
            <p className="text-sm">Ghi chú: {t.note || "Không có"}</p>
            <p className="text-sm">Thanh toán: {t.payment_method}</p>

            {(currentUserRole === "owner" || currentUserRole === "senior") && (
              <div className="mt-3 space-y-1">
                <input
                  type="number"
                  step="1"
                  defaultValue={t.amount}
                  onBlur={(e) => handleUpdateTransaction(t.id, { amount: e.target.value })}
                  className="w-full p-1 border rounded"
                />
                <select
                  defaultValue={t.type}
                  onChange={(e) => handleUpdateTransaction(t.id, { type: e.target.value })}
                  className="w-full p-1 border rounded"
                >
                  <option value="income">Thu</option>
                  <option value="expense">Chi</option>
                </select>
                <input
                  type="text"
                  defaultValue={t.category}
                  onBlur={(e) => handleUpdateTransaction(t.id, { category: e.target.value })}
                  className="w-full p-1 border rounded"
                />
                <textarea
                  defaultValue={t.note}
                  onBlur={(e) => handleUpdateTransaction(t.id, { note: e.target.value })}
                  className="w-full p-1 border rounded"
                />
                <input
                  type="date"
                  defaultValue={t.date}
                  onChange={(e) => handleUpdateTransaction(t.id, { date: e.target.value })}
                  className="w-full p-1 border rounded"
                />
                <select
                  defaultValue={t.payment_method}
                  onChange={(e) => handleUpdateTransaction(t.id, { payment_method: e.target.value })}
                  className="w-full p-1 border rounded"
                >
                  <option value="cash">Tiền mặt</option>
                  <option value="bank_card">Thẻ ngân hàng</option>
                  <option value="mobile_app">Ứng dụng di động</option>
                </select>
                <button
                  onClick={() => handleDeleteTransaction(t.id)}
                  className="w-full mt-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageTransactions;
