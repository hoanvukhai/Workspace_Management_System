const db = require("../config/db");

const createGoal = async (id, userId, workspaceId, title, description, due_date, progress) => {
  const safe = v => v === undefined ? null : v;
  const sql = "INSERT INTO goals (id, user_id, workspace_id, title, description, status, due_date, progress, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
  await db.execute(sql, [id, userId, workspaceId, safe(title), safe(description), "not_started", safe(due_date), safe(progress)]);
};

const getGoals = async (workspaceId) => {
  const [rows] = await db.execute(
    "SELECT g.id, g.title, g.description, g.status, g.due_date, g.progress, g.created_at, u.name AS user_name FROM goals g JOIN users u ON g.user_id = u.id WHERE g.workspace_id = ? ORDER BY g.due_date",
    [workspaceId]
  );
  return rows;
};

const updateGoal = async (goalId, title, description, status, due_date, progress) => {
  const safe = v => v === undefined ? null : v;
  const sql = "UPDATE goals SET title = ?, description = ?, status = ?, due_date = ?, progress = ?, updated_at = NOW() WHERE id = ?";
  await db.execute(sql, [safe(title), safe(description), safe(status), safe(due_date), safe(progress), goalId]);
};

const deleteGoal = async (goalId) => {
  await db.execute("DELETE FROM goals WHERE id = ?", [goalId]);
};

module.exports = { createGoal, getGoals, updateGoal, deleteGoal };