const db = require("../config/db");

const addMember = async (memberId, userId, workspaceId, role = "member") => {
  const sql = "INSERT INTO workspace_members (id, user_id, workspace_id, role, joined_at) VALUES (?, ?, ?, ?, NOW())";
  await db.execute(sql, [memberId, userId, workspaceId, role]);
};

const getMembers = async (workspaceId) => {
  const [rows] = await db.execute(
    `SELECT u.id, u.name, u.email, wm.role 
     FROM workspace_members wm 
     JOIN users u ON wm.user_id = u.id 
     WHERE wm.workspace_id = ?`,
    [workspaceId]
  );
  return rows;
};

const findMemberByEmail = async (email) => {
  const [rows] = await db.execute("SELECT id FROM users WHERE email = ?", [email]);
  return rows[0];
};

const checkMemberExists = async (userId, workspaceId) => {
  const [rows] = await db.execute(
    "SELECT * FROM workspace_members WHERE user_id = ? AND workspace_id = ?",
    [userId, workspaceId]
  );
  return rows.length > 0;
};

const removeMember = async (userId, workspaceId) => {
  await db.execute(
    "DELETE FROM workspace_members WHERE user_id = ? AND workspace_id = ?",
    [userId, workspaceId]
  );
};

const updateMemberRole = async (userId, workspaceId, role) => {
  await db.execute(
    "UPDATE workspace_members SET role = ? WHERE user_id = ? AND workspace_id = ?",
    [role, userId, workspaceId]
  );
};

module.exports = {
  addMember,
  getMembers,
  findMemberByEmail,
  checkMemberExists,
  removeMember,
  updateMemberRole,
};