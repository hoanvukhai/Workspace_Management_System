const { v4: uuidv4 } = require("uuid");
const eventModel = require("../models/eventModel");
const db = require("../config/db");

exports.createEvent = async (req, res) => {
  const { workspace_id, title, description, start_time, end_time, is_all_day, reminder_time } = req.body;
  try {
    const [member] = await db.execute(
      "SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?",
      [workspace_id, req.user.id]
    );
    if (!member[0]) return res.status(403).json({ message: "Bạn không phải thành viên workspace." });
    if (member[0].role === "member") return res.status(403).json({ message: "Viewer không được thêm sự kiện." });

    const userId = req.user.id;
    const eventId = uuidv4();
    await eventModel.createEvent(eventId, userId, workspace_id, title, description, start_time, end_time, is_all_day, reminder_time);
    res.status(201).json({ message: "Sự kiện đã được tạo.", id: eventId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
};

exports.getEvents = async (req, res) => {
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

    const events = await eventModel.getEvents(workspace_id);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
};

exports.updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const { title, description, start_time, end_time, is_all_day, reminder_time } = req.body;
  try {
    const [event] = await db.execute(
      "SELECT * FROM events WHERE id = ?",
      [eventId]
    );
    if (!event[0]) return res.status(404).json({ message: "Sự kiện không tồn tại." });

    const [member] = await db.execute(
      "SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?",
      [event[0].workspace_id, req.user.id]
    );
    if (!member[0] || (member[0].role !== "owner" && member[0].role !== "senior")) {
      return res.status(403).json({ message: "Chỉ owner hoặc senior mới có thể sửa sự kiện." });
    }

    await eventModel.updateEvent(eventId, title, description, start_time, end_time, is_all_day, reminder_time);
    res.json({ message: "Sự kiện đã được cập nhật." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
};

exports.deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    const [event] = await db.execute(
      "SELECT * FROM events WHERE id = ?",
      [eventId]
    );
    if (!event[0]) return res.status(404).json({ message: "Sự kiện không tồn tại." });

    const [member] = await db.execute(
      "SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?",
      [event[0].workspace_id, req.user.id]
    );
    if (!member[0] || (member[0].role !== "owner" && member[0].role !== "senior")) {
      return res.status(403).json({ message: "Chỉ owner hoặc senior mới có thể xóa sự kiện." });
    }

    await eventModel.deleteEvent(eventId);
    res.json({ message: "Sự kiện đã được xóa." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
};