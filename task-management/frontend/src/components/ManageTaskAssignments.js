import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageTaskAssignments = ({ taskId, workspaceId, onSave }) => {
  const token = localStorage.getItem("token");
  const [assignments, setAssignments] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    fetchAssignments();
    fetchAvailableMembers();
  }, [taskId, workspaceId]);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/task-assignments/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAvailableMembers = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/workspace-members/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableMembers(res.data.filter(m => !assignments.some(a => a.user_id === m.id)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssign = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/task-assignments/add",
        { task_id: taskId, user_id: selectedUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedUserId("");
      fetchAssignments();
      fetchAvailableMembers();
      onSave();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi gán công việc.");
    }
  };

  const handleRemove = async (assignmentId) => {
    if (!window.confirm("Bạn có chắc muốn xóa gán này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/task-assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAssignments();
      fetchAvailableMembers();
      onSave();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi xóa gán.");
    }
  };

  return (
    <div className="p-2">
      {/* Form gán thành viên */}
      <div className="mb-4">
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="border p-1 mr-2"
        >
          <option value="">Chọn thành viên</option>
          {availableMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name} ({member.email})
            </option>
          ))}
        </select>
        <button
          onClick={handleAssign}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          disabled={!selectedUserId}
        >
          Gán
        </button>
      </div>

      {/* Danh sách gán */}
      <h2 className="font-bold text-lg mb-2">Đã gán:</h2>
      <ul>
        {assignments.map((assignment) => (
          <li key={assignment.id} className="mb-1">
            <strong>{assignment.name}</strong> ({assignment.email})
            <button
              onClick={() => handleRemove(assignment.id)}
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageTaskAssignments;