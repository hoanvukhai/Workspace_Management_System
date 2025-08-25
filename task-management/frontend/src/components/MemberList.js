import { useEffect, useState } from "react";
import axios from "axios";

function MemberList({ workspaceId, currentUserRole }) {
  const [members, setMembers] = useState([]);
  const token = localStorage.getItem("token");
  const currentUserId = JSON.parse(atob(token.split('.')[1])).id;

  const fetchMembers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/auth/workspace-members/${workspaceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMembers(res.data);
    } catch (err) {
      console.error("Lỗi lấy thành viên:", err);
    }
  };

  const handleRemove = async (memberId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thành viên này?")) return;

    try {
      await axios.delete(
        "http://localhost:5000/api/auth/workspace-members/remove",
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { user_id: memberId, workspace_id: workspaceId },
        }
      );
      fetchMembers(); // Refresh lại danh sách
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi xóa thành viên.");
    }
  };

const handleRoleChange = async (memberId, newRole) => {
  try {
    await axios.put(
      "http://localhost:5000/api/auth/workspace-members/role",
      { user_id: memberId, workspace_id: workspaceId, role: newRole },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchMembers(); // Refresh lại danh sách
  } catch (err) {
    alert(err.response?.data?.message || "Lỗi khi thay đổi vai trò.");
  }
};

  useEffect(() => {
    fetchMembers();
  }, [workspaceId]);

  return (
<div className="bg-white p-4 rounded shadow">
  <h3 className="font-semibold text-lg mb-3">Danh sách thành viên</h3>
  <ul className="divide-y divide-gray-200">
    {members.map((m) => (
      <li key={m.id} className="py-2 flex justify-between items-center">
        <div>
          <p className="font-medium text-gray-800">{m.name}</p>
          <p className="text-sm text-gray-500">{m.email}</p>
        </div>
      {currentUserRole === "owner" && (
        <div className="flex items-center space-x-2">
          {m.id === currentUserId || m.role === "owner" ? (
            <span className="text-sm italic text-gray-600">
              {m.role === "member" ? "Viewer" : m.role === "senior" ? "Editor" : "Chủ sở hữu"}
            </span>
          ) : (
            <select
              value={m.role}
              onChange={(e) => handleRoleChange(m.id, e.target.value)}
              className="border p-1 rounded text-sm"
            >
              <option value="member">Viewer</option>
              <option value="senior">Editor</option>
            </select>
          )}

          {m.id !== currentUserId && m.role !== "owner" && (
            <button
              onClick={() => handleRemove(m.id)}
              className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
            >
              Xóa
            </button>
          )}
        </div>
      )}

      </li>
    ))}
  </ul>
</div>

  );
}

export default MemberList;