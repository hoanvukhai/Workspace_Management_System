import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaLock, FaLockOpen, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const WorkspaceList = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [newWorkspace, setNewWorkspace] = useState({ name: "", description: "", is_private: false });
  const [editWorkspace, setEditWorkspace] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/workspaces", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkspaces(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/workspaces", newWorkspace, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewWorkspace({ name: "", description: "", is_private: false });
      fetchWorkspaces();
    } catch (err) {
      alert("Lỗi khi tạo không gian: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteWorkspace = async (workspaceId, createdBy) => {
    const userId = JSON.parse(atob(token.split('.')[1])).id;
    if (createdBy !== userId) return alert("Chỉ chủ sở hữu mới có thể xóa!");

    if (window.confirm("Bạn có chắc muốn xóa không gian này?")) {
      try {
        await axios.delete(`http://localhost:5000/api/auth/workspaces/${workspaceId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchWorkspaces();
      } catch (err) {
        alert("Lỗi khi xóa không gian: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleUpdateWorkspace = async (e) => {
    e.preventDefault();
    if (!editWorkspace) return;

    try {
      await axios.put(`http://localhost:5000/api/auth/workspaces/${editWorkspace.id}`, {
        name: editWorkspace.name,
        description: editWorkspace.description,
        is_private: editWorkspace.is_private,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEditWorkspace(null);
      fetchWorkspaces();
    } catch (err) {
      alert("Lỗi khi cập nhật: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Danh sách Không gian làm việc</h1>

        <form onSubmit={handleCreateWorkspace} className="bg-white shadow p-4 rounded-lg mb-6 w-full flex flex-col md:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Tên không gian"
            value={newWorkspace.name}
            onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
            required
            className="w-3/4 md:flex-1 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Mô tả"
            value={newWorkspace.description}
            onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
            className="w-3/4 md:flex-1 p-2 border border-gray-300 rounded"
          />
          <label className="flex items-center gap-2 text-gray-600">
            <input
              type="checkbox"
              checked={newWorkspace.is_private}
              onChange={(e) => setNewWorkspace({ ...newWorkspace, is_private: e.target.checked })}
            />
            Riêng tư
          </label>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2">
            <FaPlus size={16} /> Tạo mới
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((ws) => (
<div key={ws.id} className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition">
  <Link to={`/workspaces/${ws.id}`}>
    
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-xl font-semibold text-gray-800">{ws.name}</h2>
      <span className={`text-xs px-2 py-1 rounded-full ${ws.is_private ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
        {ws.is_private ? "Riêng tư" : "Công khai"}
      </span>
    </div>
    
    <p className="text-gray-600 mb-2 italic">{ws.description || "Không có mô tả"}</p>
    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
      <span className="truncate">👤 Người tạo: <span className="font-medium">{ws.created_by_name || "Không rõ"}</span></span>
      <span className="italic">{new Date(ws.created_at).toLocaleDateString()}</span>
    </div>
  </Link>

  {ws.created_by === JSON.parse(atob(token.split('.')[1])).id && (
    <div className="flex gap-2">
      <button
        onClick={() => setEditWorkspace({ ...ws })}
        className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
      >
        <FaEdit size={16} /> Sửa
      </button>
      <button
        onClick={() => handleDeleteWorkspace(ws.id, ws.created_by)}
        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
      >
        <FaTrash size={16} /> Xóa
      </button>
    </div>
  )}
</div>

          ))}
        </div>

        {editWorkspace && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h2 className="text-xl font-bold mb-4">Chỉnh sửa Không gian</h2>
              <form onSubmit={handleUpdateWorkspace} className="space-y-3">
                <input
                  type="text"
                  value={editWorkspace.name}
                  onChange={(e) => setEditWorkspace({ ...editWorkspace, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="text"
                  value={editWorkspace.description}
                  onChange={(e) => setEditWorkspace({ ...editWorkspace, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={editWorkspace.is_private}
                    onChange={(e) => setEditWorkspace({ ...editWorkspace, is_private: e.target.checked })}
                  />
                  Riêng tư
                </label>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setEditWorkspace(null)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                    Hủy
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceList;
