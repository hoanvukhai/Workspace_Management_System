const { v4: uuidv4 } = require("uuid");
const taskAssignmentModel = require("../models/taskAssignmentModel");
const db = require("../config/db");

exports.assignTask = async (req, res) => {
  const { task_id, user_id } = req.body;
  try {
    const [task] = await db.execute("SELECT * FROM tasks WHERE id = ?", [task_id]);
    if (!task[0]) return res.status(404).json({ message: "Công việc không tồn tại." });

    // Lấy role của user hiện tại trong workspace
    const [member] = await db.execute(
      "SELECT role FROM workspace_members WHERE user_id = ? AND workspace_id = ?",
      [req.user.id, task[0].workspace_id]
    );
    if (!member[0]) return res.status(403).json({ message: "Bạn không phải thành viên workspace." });

    if (member[0].role !== "owner" && member[0].role !== "senior") {
      return res.status(403).json({ message: "Chỉ owner hoặc senior mới có thể gán công việc." });
    }

    // Kiểm tra user được gán có thuộc workspace không
    const [assignee] = await db.execute(
      "SELECT * FROM workspace_members WHERE user_id = ? AND workspace_id = ?",
      [user_id, task[0].workspace_id]
    );
    if (!assignee[0]) return res.status(400).json({ message: "Người dùng không thuộc workspace." });

    const [existing] = await db.execute(
      "SELECT * FROM task_assignments WHERE task_id = ? AND user_id = ?",
      [task_id, user_id]
    );
    if (existing.length > 0) return res.status(400).json({ message: "Đã gán cho người dùng này." });

    const assignmentId = uuidv4();
    await taskAssignmentModel.assignTaskToUser(assignmentId, user_id, task_id);
    res.status(200).json({ message: "Gán công việc thành công!", assignmentId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
};

exports.getTaskAssignments = async (req, res) => {
  const { task_id } = req.params;
  try {
    const [task] = await db.execute("SELECT workspace_id FROM tasks WHERE id = ?", [task_id]);
    if (!task[0]) return res.status(404).json({ message: "Công việc không tồn tại." });

    const [member] = await db.execute(
      "SELECT * FROM workspace_members WHERE workspace_id = ? AND user_id = ?",
      [task[0].workspace_id, req.user.id]
    );
    if (!member[0]) return res.status(403).json({ message: "Bạn không có quyền truy cập." });

    const assignments = await taskAssignmentModel.getTaskAssignments(task_id);
    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
};

exports.removeTaskAssignment = async (req, res) => {
  const { assignment_id } = req.params;
  try {
    const [assignment] = await db.execute(
      "SELECT t.workspace_id FROM task_assignments ta JOIN tasks t ON ta.task_id = t.id WHERE ta.id = ?",
      [assignment_id]
    );
    if (!assignment[0]) return res.status(404).json({ message: "Gán không tồn tại." });

    // Lấy role của user hiện tại trong workspace
    const [member] = await db.execute(
      "SELECT role FROM workspace_members WHERE user_id = ? AND workspace_id = ?",
      [req.user.id, assignment[0].workspace_id]
    );
    if (!member[0]) return res.status(403).json({ message: "Bạn không phải thành viên workspace." });

    if (member[0].role !== "owner" && member[0].role !== "senior") {
      return res.status(403).json({ message: "Chỉ owner hoặc senior mới có thể xóa gán." });
    }

    await taskAssignmentModel.removeTaskAssignment(assignment_id);
    res.status(200).json({ message: "Xóa gán thành công." });
  } catch (err) {
    console.error("Lỗi khi xóa gán:", err);
    res.status(500).json({ message: "Lỗi server khi xóa gán." });
  }
};