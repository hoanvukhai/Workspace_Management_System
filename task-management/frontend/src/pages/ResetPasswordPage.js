import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError("Không tìm thấy token. Vui lòng kiểm tra lại liên kết.");
    } else {
      setLoading(true);
      axios
        .get(`http://localhost:5000/api/auth/reset-password?token=${token}`)
        .then((res) => {
          setLoading(false);
          if (res.status === 200) {
            setMessage(res.data.message);
          } else {
            setError(res.data.message || "Lỗi không xác định");
          }
        })
        .catch((err) => {
          setLoading(false);
          setError(err.response?.data?.message || "Lỗi khi kiểm tra token.");
        });
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu không khớp.");
      return;
    }
    setLoading(true);
    try {
      const token = searchParams.get("token");
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        newPassword,
      });
      setMessage("Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi đặt lại mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        {loading && <LoadingSpinner />}
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Lỗi</h2>
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Quay lại Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {loading && <LoadingSpinner />}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Đặt lại Mật khẩu</h2>
        {message && <p className="text-green-500 text-sm mb-3">{message}</p>}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Đặt lại Mật khẩu
        </button>
      </form>
    </div>
  );
}

export default ResetPasswordPage;