const db = require("../config/db");

const createNote = async (id, userId, workspaceId, content) => {
  const sql = "INSERT INTO notes (id, user_id, workspace_id, content, created_at) VALUES (?, ?, ?, ?, NOW())";
  await db.execute(sql, [id, userId, workspaceId, content]);
};

const getNotes = async (workspaceId) => {
  const [rows] = await db.execute(
    "SELECT n.id, n.content, n.created_at, u.name AS user_name FROM notes n JOIN users u ON n.user_id = u.id WHERE n.workspace_id = ?",
    [workspaceId]
  );
  return rows;
};

const updateNote = async (noteId, content) => {
  const sql = "UPDATE notes SET content = ?, updated_at = NOW() WHERE id = ?";
  await db.execute(sql, [content, noteId]);
};

const deleteNote = async (noteId) => {
  await db.execute("DELETE FROM notes WHERE id = ?", [noteId]);
};

module.exports = { createNote, getNotes, updateNote, deleteNote };