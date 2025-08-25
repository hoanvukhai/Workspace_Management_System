const db = require("../config/db");

const createTask = async (id, workspaceId, userId, title, description, status, deadline) => {
  const sql = "INSERT INTO tasks (id, workspace_id, created_by, title, description, status, deadline, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";
  await db.execute(sql, [id, workspaceId, userId, title, description, status, deadline]);
};

const getTasksByWorkspaceId = async (workspaceId) => {
  const [rows] = await db.execute(
    `SELECT t.*, u.name AS created_by_name,
            (SELECT GROUP_CONCAT(CONCAT(u2.name, ' (', u2.email, ')') SEPARATOR ', ') 
             FROM task_assignments ta 
             JOIN users u2 ON ta.user_id = u2.id 
             WHERE ta.task_id = t.id) AS assigned_to
     FROM tasks t 
     JOIN users u ON t.created_by = u.id 
     WHERE t.workspace_id = ?`,
    [workspaceId]
  );
  return rows;
};

const findTaskById = async (taskId) => {
  const [rows] = await db.execute(
    "SELECT t.*, u.name AS created_by_name FROM tasks t JOIN users u ON t.created_by = u.id WHERE t.id = ?",
    [taskId]
  );
  return rows[0];
};

const updateTask = async (taskId, title, description, status, deadline) => {
  const sql = "UPDATE tasks SET title = ?, description = ?, status = ?, deadline = ?, updated_at = NOW() WHERE id = ?";
  await db.execute(sql, [title, description, status, deadline, taskId]);
};

const deleteTask = async (taskId) => {
  await db.execute("DELETE FROM task_assignments WHERE task_id = ?", [taskId]);
  await db.execute("DELETE FROM tasks WHERE id = ?", [taskId]);
};

module.exports = {
  createTask,
  getTasksByWorkspaceId,
  findTaskById,
  updateTask,
  deleteTask,
};