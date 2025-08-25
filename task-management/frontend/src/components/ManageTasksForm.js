import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageTasksForm = ({ workspaceId, task, onSave }) => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "not_started",
    deadline: task?.deadline ? new Date(task.deadline).toISOString().split("T")[0] : "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, workspaceId };
      if (task) {
        await axios.put(`http://localhost:5000/api/auth/tasks/${task.id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`http://localhost:5000/api/auth/tasks/add`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSave();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu công việc: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Tiêu đề"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Mô tả"
        className="w-full p-2 border rounded"
      />
      <select
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        className="w-full p-2 border rounded"
      >
        <option value="not_started">Chưa bắt đầu</option>
        <option value="in_progress">Đang thực hiện</option>
        <option value="completed">Hoàn thành</option>
      </select>
      <input
        type="date"
        value={formData.deadline}
        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {task ? "Lưu" : "Thêm"}
        </button>
      </div>
    </form>
  );
};

export default ManageTasksForm;