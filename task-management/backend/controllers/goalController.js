const { v4: uuidv4 } = require("uuid");
const goalModel = require("../models/goalModel");
const db = require("../config/db");

exports.createGoal = async (req, res) => {
  const { workspace_id, title, description, due_date, progress } = req.body;
  try {
    const [member] = await db.execute(
      "SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?",
      [workspace_id, req.user.id]
    );
    if (!member[0]) return res.status(403).json({ message: "Bạn không phải thành viên workspace." });
    if (member[0].role === "member") return res.status(403).json({ message: "Viewer không được thêm mục tiêu." });

    const userId = req.user.id;
    const goalId = uuidv4();
    await goalModel.createGoal(goalId, userId, workspace_id, title, description, due_date, progress);
    res.status(201).json({ message: "Mục tiêu đã được tạo.", id: goalId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
};

exports.getGoals = async (req, res) => {
  const { workspace_id } = req.params;
  try {
    const [workspace] = await db.execute("SELECT * FROM workspaces WHERE id = ?", [workspace_id]);
    if (!workspace[0]) return res.status(404).json({ message: "Workspace not found" });
    const isPublic = workspace[0].is_private === 0;

    if (!isPublic) {
      const [member] = await db.execute(
        "SELECT * FROM workspace_members WHERE workspace_id = ? AND user_id = ?",
        [workspace_id, req.user.id]
      );
      if (!member[0]) return res.status(403).json({ message: "Bạn không có quyền truy cập." });
    }

    const goals = await goalModel.getGoals(workspace_id);
    res.json(goals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
};

exports.updateGoal = async (req, res) => {
  const { goalId } = req.params;
  const { title, description, status, due_date, progress } = req.body;
  try {
    const [goal] = await db.execute(
      "SELECT * FROM goals WHERE id = ?",
      [goalId]
    );
    if (!goal[0]) return res.status(404).json({ message: "Mục tiêu không tồn tại." });

    const [member] = await db.execute(
      "SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?",
      [goal[0].workspace_id, req.user.id]
    );
    if (!member[0] || (member[0].role !== "owner" && member[0].role !== "senior")) {
      return res.status(403).json({ message: "Chỉ owner hoặc senior mới có thể sửa mục tiêu." });
    }

    await goalModel.updateGoal(goalId, title, description, status, due_date, progress);
    res.json({ message: "Mục tiêu đã được cập nhật." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
};

exports.deleteGoal = async (req, res) => {
  const { goalId } = req.params;
  try {
    const [goal] = await db.execute(
      "SELECT * FROM goals WHERE id = ?",
      [goalId]
    );
    if (!goal[0]) return res.status(404).json({ message: "Mục tiêu không tồn tại." });

    const [member] = await db.execute(
      "SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?",
      [goal[0].workspace_id, req.user.id]
    );
    if (!member[0] || (member[0].role !== "owner" && member[0].role !== "senior")) {
      return res.status(403).json({ message: "Chỉ owner hoặc senior mới có thể xóa mục tiêu." });
    }

    await goalModel.deleteGoal(goalId);
    res.json({ message: "Mục tiêu đã được xóa." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
};