import { useState } from "react";
import axios from "axios";

function AddMember({ workspaceId, onMemberAdded, currentUserRole }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleAdd = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/workspace-members/add",
        {
          workspace_id: workspaceId,  // phải trùng với req.body.workspace_id trong controller
          email,
          role: "member",            // hoặc cho người dùng chọn
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message); // thông báo từ backend
      setEmail("");
      onMemberAdded(); // refresh danh sách
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi khi thêm thành viên");
    }
  };

  return (
    <div>
      {currentUserRole === "owner" && (

<div className="bg-white p-4 rounded shadow mb-4">
  <h3 className="font-semibold mb-2">Thêm thành viên mới</h3>
  <div className="flex items-center space-x-2">
    <input
      className="flex-grow border p-2 rounded"
      placeholder="Nhập email thành viên"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <button
      onClick={handleAdd}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
    >
      Thêm
    </button>
  </div>
  {message && <p className="text-sm mt-2 text-gray-600">{message}</p>}
</div>
      )}
</div>
  );
}

export default AddMember;