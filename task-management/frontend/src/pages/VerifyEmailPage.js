import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setLoading(false);
      navigate("/login"); // Chuyển ngay nếu không có token
    } else {
      setLoading(true);
      axios
        .get(`http://localhost:5000/api/auth/verify-email?token=${token}`)
        .then((res) => {
          setLoading(false);
          if (res.status === 200) {
            navigate("/login"); // Chuyển ngay sang login nếu thành công
          } else {
            navigate("/login", { state: { error: res.data.message } }); // Chuyển với thông báo lỗi
          }
        })
        .catch((err) => {
          setLoading(false);
          navigate("/login", { state: { error: err.response?.data?.message || "Lỗi xác minh" } });
        });
    }
  }, [searchParams, navigate]);

  return (
    <>
      {loading && <LoadingSpinner />}
      {/* Không cần Modal nữa, vì chuyển hướng ngay */}
    </>
  );
}

export default VerifyEmailPage;