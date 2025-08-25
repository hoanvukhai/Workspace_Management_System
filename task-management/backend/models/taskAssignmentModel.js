const db = require("../config/db");

const getTaskAssignments = async (taskId) => {
  const [rows] = await db.execute(
    "SELECT ta.*, u.name, u.email FROM task_assignments ta JOIN users u ON ta.user_id = u.id WHERE ta.task_id = ?",
    [taskId]
  );
  return rows;
};

const assignTaskToUser = async (id, userId, taskId) => {
  const sql = "INSERT INTO task_assignments (id, user_id, task_id, assigned_at) VALUES (?, ?, ?, NOW())";
  await db.execute(sql, [id, userId, taskId]);
};

const removeTaskAssignment = async (assignmentId) => {
  await db.execute("DELETE FROM task_assignments WHERE id = ?", [assignmentId]);
};

const checkAssignmentExists = async (taskId, userId) => {
  const [rows] = await db.execute(
    "SELECT * FROM task_assignments WHERE task_id = ? AND user_id = ?",
    [taskId, userId]
  );
  return rows.length > 0;
};

module.exports = {
  getTaskAssignments,
  assignTaskToUser,
  removeTaskAssignment,
  checkAssignmentExists,
};