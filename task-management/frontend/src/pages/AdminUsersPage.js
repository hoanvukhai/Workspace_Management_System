import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
//   const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
//   const [newUser, setNewUser] = useState({ name: "", email: "", password: "", avatar_url: "", is_active: 1 });
  const [editUser, setEditUser] = useState({ name: "", avatar_url: "", is_active: 1, is_verified: 0, role: "user" });
  const [password, setPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Thêm state cho tìm kiếm
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [itemsPerPage] = useState(5); // Số bản ghi trên mỗi trang

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      setError("Bạn không có quyền truy cập.");
      setLoading(false);
      if (err.response?.status === 403) navigate("/home");
    }
  };

//   const handleAddUser = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:5000/api/auth/admin/users", newUser, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setShowAddModal(false);
//       setNewUser({ name: "", email: "", password: "", avatar_url: "", is_active: 1 });
//       fetchUsers();
//     } catch (err) {
//       setError("Thêm người dùng thất bại.");
//     }
//   };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/auth/admin/users/${selectedUser.id}`, editUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowEditModal(false);
      fetchUsers();
    } catch (err) {
      setError("Cập nhật người dùng thất bại.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/auth/admin/users/${selectedUser.id}/password`, { newPassword: password }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowPasswordModal(false);
      setPassword("");
    } catch (err) {
      setError("Đổi mật khẩu thất bại.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        await axios.delete(`http://localhost:5000/api/auth/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers();
      } catch (err) {
        setError("Xóa người dùng thất bại.");
      }
    }
  };

// Lọc danh sách người dùng dựa trên searchTerm
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý người dùng</h1>
      {/* Thêm input tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm theo tên hoặc email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full md:w-1/2"
      />
      {/* <button
        onClick={() => setShowAddModal(true)}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
      >
        Thêm người dùng
      </button> */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Tên</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Ảnh đại diện</th>
            <th className="border p-2">Trạng thái</th>
            <th className="border p-2">Ngày tạo</th>
            <th className="border p-2">Ngày cập nhật</th>
            <th className="border p-2">Xác minh</th>
            <th className="border p-2">Vai trò</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id} className="border hover:bg-gray-100 rounded">
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.avatar_url || "Không có"}</td>
              <td className="border p-2">{user.is_active ? "Hoạt động" : "Không hoạt động"}</td>
              <td className="border p-2">{new Date(user.created_at).toLocaleDateString()}</td>
              <td className="border p-2">{new Date(user.updated_at).toLocaleDateString()}</td>
              <td className="border p-2">{user.is_verified ? "Đã xác minh" : "Chưa xác minh"}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2">
                <button
                  onClick={() => { setSelectedUser(user); setEditUser({ ...user, email: undefined, created_at: undefined, updated_at: undefined }); setShowEditModal(true); }}
                  className="bg-blue-600 text-white px-2 py-1 rounded mr-2 hover:bg-blue-700"
                >
                  Sửa
                </button>
                <button
                  onClick={() => { setSelectedUser(user); setShowPasswordModal(true); }}
                  className="bg-yellow-600 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-700"
                >
                  Đổi mật khẩu
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    {/* Phân trang */}
        <div className="mt-4 flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-3 py-1 border rounded ${currentPage === number ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
                {number}
            </button>
            ))}
        </div>
      {/* Modal Thêm người dùng
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Thêm người dùng</h2>
            <form onSubmit={handleAddUser}>
              <div className="mb-4">
                <label className="block text-gray-700">Tên</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Mật khẩu</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Ảnh đại diện URL</label>
                <input
                  type="text"
                  value={newUser.avatar_url}
                  onChange={(e) => setNewUser({ ...newUser, avatar_url: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Trạng thái</label>
                <select
                  value={newUser.is_active}
                  onChange={(e) => setNewUser({ ...newUser, is_active: e.target.value === "1" })}
                  className="w-full p-2 border rounded"
                >
                  <option value={1}>Hoạt động</option>
                  <option value={0}>Không hoạt động</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Thêm
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}

      {/* Modal Sửa người dùng */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Sửa người dùng</h2>
            <form onSubmit={handleEditUser}>
              <div className="mb-4">
                <label className="block text-gray-700">Tên</label>
                <input
                  type="text"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Ảnh đại diện URL</label>
                <input
                  type="text"
                  value={editUser.avatar_url || ""}
                  onChange={(e) => setEditUser({ ...editUser, avatar_url: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Trạng thái</label>
                <select
                  value={editUser.is_active ? "1" : "0"}
                  onChange={(e) => setEditUser({ ...editUser, is_active: e.target.value === "1" })}
                  className="w-full p-2 border rounded"
                >
                  <option value={1}>Hoạt động</option>
                  <option value={0}>Không hoạt động</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Xác minh</label>
                <select
                  value={editUser.is_verified ? "1" : "0"}
                  onChange={(e) => setEditUser({ ...editUser, is_verified: e.target.value === "1" })}
                  className="w-full p-2 border rounded"
                >
                  <option value={1}>Đã xác minh</option>
                  <option value={0}>Chưa xác minh</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Vai trò</label>
                <select
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Lưu
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Đổi mật khẩu */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Đổi mật khẩu</h2>
            <form onSubmit={handleChangePassword}>
              <div className="mb-4">
                <label className="block text-gray-700">Mật khẩu mới</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                  Đổi mật khẩu
                </button>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;