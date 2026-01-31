import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import API_URL from "../config/api";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "", // Thêm confirmPassword
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true); // Bắt đầu loading

    // Debug: kiểm tra giá trị input
    console.log("Form data:", {
      name: form.name,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      passwordLength: form.password.length,
      confirmPasswordLength: form.confirmPassword.length,
      areEqual: form.password === form.confirmPassword,
    });

    // Kiểm tra password và confirmPassword khớp
    if (form.password !== form.confirmPassword) {
      console.error("❌ Password không khớp:");
      console.error("Password:", JSON.stringify(form.password));
      console.error("ConfirmPassword:", JSON.stringify(form.confirmPassword));
      setError("Mật khẩu và mật khẩu nhập lại không khớp");
      setLoading(false);
      return;
    }

    // Kiểm tra password không trống
    if (!form.password || form.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      setLoading(false);
      return;
    }

    try {
      // Chỉ gửi name, email, password (không gửi confirmPassword)
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password
      });
      if (res.data) {
        setMessage("Đăng ký thành công. Vui lòng kiểm tra email để xác minh.");
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Lỗi đăng ký");
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/profile");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {loading && <LoadingSpinner />} {/* Hiển thị loading khi xử lý */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Đăng ký</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-3">{message}</p>}

        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Nhập lại mật khẩu"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Đăng ký
        </button>

        <p className="text-sm mt-4 text-center">
          Đã có tài khoản?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </span>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;