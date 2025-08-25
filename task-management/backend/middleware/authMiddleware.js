const jwt = require("jsonwebtoken");
const db = require("../config/db");

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  // Lấy workspaceId từ params (hỗ trợ cả workspaceId và workspace_id)
  const workspaceId = req.params.workspaceId || req.params.workspace_id;

  if (workspaceId) {
    try {
      const [workspace] = await db.execute("SELECT is_private FROM workspaces WHERE id = ?", [workspaceId]);
      if (workspace.length > 0 && workspace[0].is_private === 0) {
        // Workspace công khai, không yêu cầu token cho GET request
        if (!token && req.method === "GET") {
          req.user = { id: null, role: null }; // Giả lập user không đăng nhập
          return next();
        }
      }
    } catch (error) {
      return res.status(500).json({ message: "Lỗi server" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Không có token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Kiểm tra role từ bảng users (vai trò hệ thống, bao gồm admin)
    const [user] = await db.execute("SELECT role FROM users WHERE id = ?", [req.user.id]);
    req.user.role = user[0]?.role || "user"; // Mặc định là user nếu không có role

    if (workspaceId) {
      const [role] = await db.execute(
        "SELECT role FROM workspace_members WHERE user_id = ? AND workspace_id = ?",
        [req.user.id, workspaceId]
      );
      req.user.role = role[0]?.role || null;
    }

    next();
  } catch (error) {
    res.status(403).json({ message: "Token không hợp lệ" });
  }
};

module.exports = authenticate;
