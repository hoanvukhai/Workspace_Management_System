import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../components/Modal";
import { FaUser  } from "react-icons/fa"; // Thêm icon từ react-icons

const ProfilePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    if (!token) {
      setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setEditName(res.data.name || "");
      setEditAvatar(res.data.avatar_url || "");
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi tải thông tin tài khoản.");
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/auth/me",
        { name: editName, avatar: editAvatar },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser({ ...user, name: editName, avatar: editAvatar });
      setIsEditModalOpen(false);
      setSuccess("Cập nhật thông tin thành công!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setErrors(err.response?.data?.message || "Lỗi khi cập nhật thông tin.");
      setTimeout(() => setErrors(""), 3000);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrors("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      setTimeout(() => setErrors(""), 3000);
      return;
    }
    try {
      await axios.put(
        "http://localhost:5000/api/auth/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsChangePasswordModalOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Đổi mật khẩu thành công!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setErrors(err.response?.data?.message || "Lỗi khi đổi mật khẩu.");
      setTimeout(() => setErrors(""), 3000);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>Không tìm thấy thông tin tài khoản</p>;

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Tài khoản của tôi</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center md:items-start">
            <div className="relative">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-200"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                  <FaUser className="text-gray-600 text-5xl" />
                </div>
              )}
            </div>
            <div className="mt-4 text-left">
              <p><strong className="text-gray-600">Tên:</strong> {user.name}</p>
              <p><strong className="text-gray-600">Email:</strong> {user.email}</p>
              <p><strong className="text-gray-600">Ngày tham gia:</strong> {new Date(user.created_at || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex justify-end items-start space-x-4">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Chỉnh sửa thông tin
            </button>
            <button
              onClick={() => setIsChangePasswordModalOpen(true)}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Chỉnh sửa thông tin</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700">Tên</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Link Avatar</label>
            <input
              type="url"
              value={editAvatar}
              onChange={(e) => setEditAvatar(e.target.value)}
              placeholder="Nhập URL ảnh (ví dụ: https://example.com/image.jpg)"
              className="w-full p-2 border rounded"
            />
            {editAvatar && (
              <div className="mt-2">
                <img
                  src={editAvatar}
                  alt="Preview Avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => { e.target.style.display = 'none'; setError("URL ảnh không hợp lệ."); }}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleSaveProfile}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Lưu thay đổi
            </button>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isChangePasswordModalOpen} onClose={() => setIsChangePasswordModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Đổi mật khẩu</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700">Mật khẩu hiện tại</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleChangePassword}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
            >
              Lưu mật khẩu
            </button>
            <button
              onClick={() => setIsChangePasswordModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>
        {errors && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded shadow-lg z-50">
            {errors}
        </div>
        )}
        {success && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50">
            {success}
        </div>
        )}
    </div>
  );
};

export default ProfilePage;