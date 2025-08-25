const db = require("../config/db");

const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Quyền truy cập bị từ chối. Chỉ admin mới được phép." });
  }
  next();
};

module.exports = isAdmin;