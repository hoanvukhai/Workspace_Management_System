const db = require("../config/db");

const createEvent = async (id, userId, workspaceId, title, description, start_time, end_time, is_all_day, reminder_time) => {
  const sql = "INSERT INTO events (id, user_id, workspace_id, title, description, start_time, end_time, is_all_day, reminder_time, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
  await db.execute(sql, [id, userId, workspaceId, title, description, start_time, end_time, is_all_day, reminder_time]);
};

const getEvents = async (workspaceId) => {
  const [rows] = await db.execute(
    "SELECT e.id, e.title, e.description, e.start_time, e.end_time, e.is_all_day, e.reminder_time, e.created_at, u.name AS user_name FROM events e JOIN users u ON e.user_id = u.id WHERE e.workspace_id = ? ORDER BY e.start_time",
    [workspaceId]
  );
  return rows;
};

const updateEvent = async (eventId, title, description, start_time, end_time, is_all_day, reminder_time) => {
  // Chuyển undefined thành null
  const safe = v => v === undefined ? null : v;
  await db.execute(
    "UPDATE events SET title = ?, description = ?, start_time = ?, end_time = ?, is_all_day = ?, reminder_time = ? WHERE id = ?",
    [safe(title), safe(description), safe(start_time), safe(end_time), safe(is_all_day), safe(reminder_time), eventId]
  );
};

const deleteEvent = async (eventId) => {
  await db.execute("DELETE FROM events WHERE id = ?", [eventId]);
};

module.exports = { createEvent, getEvents, updateEvent, deleteEvent };