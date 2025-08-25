import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(location.state?.error || ""); // Lấy lỗi từ state
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        alert("Đăng nhập thành công!");
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Lỗi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email: forgotEmail });
      alert("Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.");
      setShowForgot(false);
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi gửi email");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/profile");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {loading && <LoadingSpinner />}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Đăng nhập</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {!showForgot ? (
          <form onSubmit={handleSubmit}>
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
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Đăng nhập
            </button>

            <p className="text-sm mt-2 text-center">
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => setShowForgot(true)}
              >
                Quên mật khẩu?
              </span>
            </p>
            <p className="text-sm mt-4 text-center">
              Chưa có tài khoản?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate("/register")}
              >
                Đăng ký
              </span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleForgotSubmit}>
            <p className="text-center mb-4">Nhập email để nhận liên kết đặt lại mật khẩu</p>
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full p-2 mb-3 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Gửi email
            </button>
            <p className="text-sm mt-2 text-center">
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => setShowForgot(false)}
              >
                Quay lại
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;