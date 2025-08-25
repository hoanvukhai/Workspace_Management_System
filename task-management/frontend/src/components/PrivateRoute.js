import { Navigate } from "react-router-dom";
import axios from "axios";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // Lấy workspaceId từ URL
  const path = window.location.pathname;
  const workspaceId = path.match(/\/workspaces\/(.+)/)?.[1];

  if (!token && workspaceId) {
    // Kiểm tra xem workspace có phải public không
    axios
      .get(`http://localhost:5000/api/auth/workspaces/${workspaceId}`, {
        validateStatus: () => true, // Không throw lỗi cho status 403
      })
      .then((res) => {
        if (res.status === 200 && res.data.is_private === 0) {
          return children; // Cho phép truy cập nếu public
        }
        return <Navigate to="/login" />;
      })
      .catch(() => <Navigate to="/login" />);
  }

  return token ? children : <Navigate to="/login" />;
}

export default PrivateRoute;