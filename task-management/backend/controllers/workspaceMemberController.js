const { v4: uuidv4 } = require("uuid");
const workspaceMemberModel = require("../models/workspaceMemberModel");
const db = require("../config/db");

exports.addMember = async (req, res) => {
  const { email, workspace_id, role = "member" } = req.body; // Mặc định là 'member'
  try {
    const [workspace] = await db.execute("SELECT created_by FROM workspaces WHERE id = ?", [workspace_id]);
    if (!workspace[0] || workspace[0].created_by !== req.user.id) {
      return res.status(403).json({ message: "Chỉ chủ sở hữu mới có thể thêm thành viên." });
    }

    const user = await workspaceMemberModel.findMemberByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Người dùng chưa đăng ký." });
    }
    const user_id = user.id;

    const exists = await workspaceMemberModel.checkMemberExists(user_id, workspace_id);
    if (exists) {
      return res.status(400).json({ message: "Đã là thành viên trong workspace." });
    }

    const memberId = uuidv4();
    await workspaceMemberModel.addMember(memberId, user_id, workspace_id, role);

    res.status(200).json({ message: "Thêm thành viên thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
};

exports.getMembers = async (req, res) => {
  const { workspace_id } = req.params;
  try {
    const [workspace] = await db.execute("SELECT * FROM workspaces WHERE id = ?", [workspace_id]);
    if (!workspace[0]) return res.status(404).json({ message: "Workspace not found" });
    const isPublic = workspace[0].is_private === 0;

    // Nếu workspace private, kiểm tra user là thành viên
    if (!isPublic) {
      const [member] = await db.execute(
        "SELECT * FROM workspace_members WHERE workspace_id = ? AND user_id = ?",
        [workspace_id, req.user.id]
      );
      if (!member[0]) return res.status(403).json({ message: "Access denied" });
    }

    const members = await workspaceMemberModel.getMembers(workspace_id);
    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
};

exports.removeMember = async (req, res) => {
  const { user_id, workspace_id } = req.body;

  try {
    const [workspace] = await db.execute(
      "SELECT created_by FROM workspaces WHERE id = ?",
      [workspace_id]
    );

    if (!workspace[0]) {
      return res.status(404).json({ message: "Workspace không tồn tại." });
    }

    if (workspace[0].created_by !== req.user.id) {
      return res.status(403).json({ message: "Chỉ chủ sở hữu mới có thể xóa thành viên." });
    }

    const exists = await workspaceMemberModel.checkMemberExists(user_id, workspace_id);
    if (!exists) {
      return res.status(404).json({ message: "Thành viên không tồn tại trong workspace." });
    }

    await workspaceMemberModel.removeMember(user_id, workspace_id);

    res.status(200).json({ message: "Xóa thành viên thành công." });
  } catch (err) {
    console.error("Lỗi khi xóa thành viên:", err);
    res.status(500).json({ message: "Lỗi server khi xóa thành viên." });
  }
};

exports.updateMemberRole = async (req, res) => {
  const { user_id, workspace_id, role } = req.body;
  try {
    // Chỉ owner mới được đổi vai trò
    const [workspace] = await db.execute(
      "SELECT created_by FROM workspaces WHERE id = ?",
      [workspace_id]
    );
    if (!workspace[0]) {
      return res.status(404).json({ message: "Workspace không tồn tại." });
    }
    if (workspace[0].created_by !== req.user.id) {
      return res.status(403).json({ message: "Chỉ chủ sở hữu mới có thể đổi vai trò." });
    }
    if (role !== "member" && role !== "senior") {
      return res.status(400).json({ message: "Vai trò không hợp lệ." });
    }
    await workspaceMemberModel.updateMemberRole(user_id, workspace_id, role);
    res.status(200).json({ message: "Cập nhật vai trò thành công." });
  } catch (err) {
    console.error("Lỗi khi cập nhật vai trò:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật vai trò." });
  }
};


