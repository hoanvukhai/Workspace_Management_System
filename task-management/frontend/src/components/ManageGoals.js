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

const ManageGoals = ({ workspaceId, currentUserRole }) => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    due_date: "",
    progress: 0,
  });
  const token = localStorage.getItem("token");

  const fetchGoals = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/goals/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(res.data);
    } catch (err) {
      console.error("Lỗi lấy mục tiêu:", err);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/auth/goals",
        {
          workspace_id: workspaceId,
          ...newGoal,
          due_date: toMySQLDate(newGoal.due_date),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewGoal({ title: "", description: "", due_date: "", progress: 0 });
      fetchGoals();
    } catch (err) {
      console.error("Lỗi thêm mục tiêu:", err);
    }
  };

  const handleUpdateGoal = async (goalId, updatedFields) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    const safe = v => v === undefined ? null : v;

    const updatedGoal = {
      title: safe(updatedFields.title ?? goal.title),
      description: safe(updatedFields.description ?? goal.description),
      status: safe(updatedFields.status ?? goal.status),
      due_date: toMySQLDate(updatedFields.due_date ?? goal.due_date),
      progress: safe(updatedFields.progress ?? goal.progress),
    };

    try {
      await axios.put(
        `http://localhost:5000/api/auth/goals/${goalId}`,
        updatedGoal,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchGoals();
    } catch (err) {
      console.error("Lỗi cập nhật mục tiêu:", err);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm("Bạn có chắc muốn xóa mục tiêu này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/goals/${goalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGoals();
    } catch (err) {
      console.error("Lỗi xóa mục tiêu:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "in_progress": return "text-yellow-600";
      case "achieved": return "text-green-600";
      case "not_started":
      default: return "text-gray-500";
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [workspaceId]);

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Quản lý mục tiêu</h3>

      {(currentUserRole === "owner" || currentUserRole === "senior") && (
        <form onSubmit={handleAddGoal} className="mb-6 space-y-2">
          <input
            type="text"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            placeholder="Tiêu đề mục tiêu"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            placeholder="Mô tả"
            className="w-full p-2 border rounded"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={newGoal.due_date}
              onChange={(e) => setNewGoal({ ...newGoal, due_date: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={newGoal.progress}
              onChange={(e) => setNewGoal({ ...newGoal, progress: e.target.value })}
              placeholder="Tiến độ (%)"
              className="p-2 border rounded"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Thêm mục tiêu
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <div key={goal.id} className="p-4 border rounded shadow bg-white hover:shadow-lg transition-transform hover:scale-[1.01]">
            <h4 className="text-lg font-bold text-gray-800">{goal.title}</h4>
            <p className="text-sm text-gray-500">Tạo bởi: {goal.user_name}</p>
            <p className="text-sm text-gray-500">Hạn: {goal.due_date ? new Date(goal.due_date).toLocaleDateString() : "Không có"}</p>
            <p className="text-sm mt-1">{goal.description || "Không có mô tả"}</p>
            <p className={`mt-1 font-semibold ${getStatusColor(goal.status)}`}>
              Trạng thái: {goal.status === "achieved" ? "Hoàn thành" : goal.status === "in_progress" ? "Đang thực hiện" : "Chưa bắt đầu"}
            </p>
            <div className="mt-2">
              <div className="h-3 bg-gray-200 rounded overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${goal.progress || 0}%` }}
                />
              </div>
              <p className="text-sm mt-1 text-gray-700">Tiến độ: {goal.progress || 0}%</p>
            </div>

            {(currentUserRole === "owner" || currentUserRole === "senior") && (
              <div className="mt-3 space-y-1">
                <input
                  type="text"
                  defaultValue={goal.title}
                  onBlur={(e) => handleUpdateGoal(goal.id, { title: e.target.value })}
                  className="w-full p-1 border rounded"
                />
                <textarea
                  defaultValue={goal.description}
                  onBlur={(e) => handleUpdateGoal(goal.id, { description: e.target.value })}
                  className="w-full p-1 border rounded"
                />
                <select
                  defaultValue={goal.status}
                  onChange={(e) => handleUpdateGoal(goal.id, { status: e.target.value })}
                  className="w-full p-1 border rounded"
                >
                  <option value="not_started">Chưa bắt đầu</option>
                  <option value="in_progress">Đang thực hiện</option>
                  <option value="achieved">Hoàn thành</option>
                </select>
                <input
                  type="date"
                  defaultValue={goal.due_date}
                  onChange={(e) => handleUpdateGoal(goal.id, { due_date: e.target.value })}
                  className="w-full p-1 border rounded"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  defaultValue={goal.progress}
                  onChange={(e) => handleUpdateGoal(goal.id, { progress: e.target.value })}
                  className="w-full p-1 border rounded"
                />
                <button
                  onClick={() => handleDeleteGoal(goal.id)}
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

export default ManageGoals;
