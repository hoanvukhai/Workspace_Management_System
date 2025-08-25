const { v4: uuidv4 } = require("uuid");
const taskModel = require("../models/taskModel");
const db = require("../config/db");

const createTask = async (req, res) => {
  const { workspaceId, title, description, status, deadline } = req.body;
  const id = uuidv4();
  try {
    const [workspace] = await db.execute("SELECT * FROM workspaces WHERE id = ?", [workspaceId]);
    if (!workspace[0]) return res.status(404).json({ message: "Workspace not found" });

    // Lấy role của user trong workspace
    const [member] = await db.execute(
      "SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?",
      [workspaceId, req.user.id]
    );
    if (!member[0]) return res.status(403).json({ message: "Access denied" });

    // Kiểm tra role trong workspace
    if (member[0].role !== "owner" && member[0].role !== "senior") {
      return res.status(403).json({ message: "Only owner or senior can create task" });
    }

    await taskModel.createTask(id, workspaceId, req.user.id, title, description, status, deadline);
    res.status(201).json({ message: "Task created", id });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTasksByWorkspaceId = async (req, res) => {
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

    const tasks = await taskModel.getTasksByWorkspaceId(workspace_id);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateTask = async (req, res) => {
  const { task_id } = req.params;
  const { title, description, status, deadline } = req.body;
  try {
    const task = await taskModel.findTaskById(task_id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    const [member] = await db.execute(
      "SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?",
      [task.workspace_id, req.user.id]
    );
    if (!member[0]) return res.status(403).json({ message: "Access denied" });

    // SỬA ĐIỀU KIỆN KIỂM TRA QUYỀN
    if (member[0].role !== "owner" && member[0].role !== "senior" && task.created_by !== req.user.id) {
      return res.status(403).json({ message: "Only owner, senior, or creator can update" });
    }

    await taskModel.updateTask(task_id, title, description, status, deadline);
    res.json({ message: "Task updated" });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteTask = async (req, res) => {
  const { task_id } = req.params;
  try {
    const task = await taskModel.findTaskById(task_id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    const [member] = await db.execute(
      "SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?",
      [task.workspace_id, req.user.id]
    );
    if (!member[0]) return res.status(403).json({ message: "Access denied" });
    if (member[0].role !== "owner" && member[0].role !== "senior") {
      return res.status(403).json({ message: "Only owner or senior can delete" });
    }

    await taskModel.deleteTask(task_id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createTask,
  getTasksByWorkspaceId,
  updateTask,
  deleteTask,
};