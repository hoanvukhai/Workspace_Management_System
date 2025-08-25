const db = require("../config/db");

const findWorkspacesByUserId = async (userId) => {
  const [rows] = await db.query(
    `SELECT w.*, u.name AS created_by_name
     FROM workspaces w
     JOIN users u ON w.created_by = u.id
     WHERE w.id IN (
       SELECT workspace_id FROM workspace_members WHERE user_id = ?
     )`,
    [userId]
  );
  return rows;
};

const createWorkspace = async (id, createdBy, name, description, isPrivate) => {
  const sql = "INSERT INTO workspaces (id, created_by, name, description, is_private, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
  await db.execute(sql, [id, createdBy, name, description, isPrivate]);
};

const addWorkspaceMember = async (id, userId, workspaceId, role) => {
  const sql = "INSERT INTO workspace_members (id, user_id, workspace_id, role, joined_at) VALUES (?, ?, ?, ?, NOW())";
  await db.execute(sql, [id, userId, workspaceId, role]);
};

const findWorkspaceById = async (workspaceId) => {
  const [rows] = await db.execute("SELECT * FROM workspaces WHERE id = ?", [workspaceId]);
  return rows[0];
};

const updateWorkspace = async (workspaceId, name, description, isPrivate, themeColor, backgroundImage) => {
  // Kiểm tra và gán giá trị mặc định nếu rỗng
  name = name || null;
  description = description || null;
  isPrivate = isPrivate !== undefined ? isPrivate : null;
  themeColor = themeColor || null;
  backgroundImage = backgroundImage || null;

  const sql = `
    UPDATE workspaces
    SET name = ?, description = ?, is_private = ?, theme_color = ?, background_image = ?, updated_at = NOW()
    WHERE id = ?
  `;
  await db.execute(sql, [name, description, isPrivate, themeColor, backgroundImage, workspaceId]);
};

const deleteWorkspace = async (workspaceId) => {
  await db.execute("DELETE FROM workspace_members WHERE workspace_id = ?", [workspaceId]);
  await db.execute("DELETE FROM workspaces WHERE id = ?", [workspaceId]);
};

const checkWorkspaceAccess = async (workspaceId, userId) => {
  const [rows] = await db.execute(
    "SELECT * FROM workspace_members WHERE user_id = ? AND workspace_id = ?",
    [userId, workspaceId]
  );
  return rows.length > 0;
};

module.exports = {
  findWorkspacesByUserId,
  createWorkspace,
  addWorkspaceMember,
  findWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  checkWorkspaceAccess
};