const { v4: uuidv4 } = require("uuid");
const noteModel = require("../models/noteModel");
const db = require("../config/db");
const authenticate = require("../middleware/authMiddleware");

exports.createNote = async (req, res) => {
  const { workspace_id, content } = req.body;
  try {
    // Kiểm tra user là thành viên và lấy role
    const [member] = await db.execute(
      "SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?",
      [workspace_id, req.user.id]
    );
    if (!member[0]) return res.status(403).json({ message: "Bạn không phải thành viên workspace." });
    if (member[0].role === "member") return res.status(403).json({ message: "Viewer không được thêm ghi chú." });

    const userId = req.user.id;
    const noteId = uuidv4();
    await noteModel.createNote(noteId, userId, workspace_id, content);
    res.status(201).json({ message: "Ghi chú đã được tạo.", id: noteId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
};

exports.getNotes = async (req, res) => {
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

    const notes = await noteModel.getNotes(workspace_id);
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
};

exports.updateNote = async (req, res) => {
  const { noteId } = req.params;
  const { content } = req.body;
  try {
    const [note] = await db.execute(
      "SELECT * FROM notes WHERE id = ?",
      [noteId]
    );
    if (!note[0]) return res.status(404).json({ message: "Ghi chú không tồn tại." });

    const [member] = await db.execute(
      "SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?",
      [note[0].workspace_id, req.user.id]
    );
    if (!member[0] || (member[0].role !== "owner" && member[0].role !== "senior" && note[0].user_id !== req.user.id)) {
      return res.status(403).json({ message: "Chỉ owner, senior hoặc người tạo mới có thể sửa." });
    }

    await noteModel.updateNote(noteId, content);
    res.json({ message: "Ghi chú đã được cập nhật." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
};

exports.deleteNote = async (req, res) => {
  const { noteId } = req.params;
  try {
    const [note] = await db.execute(
      "SELECT * FROM notes WHERE id = ?",
      [noteId]
    );
    if (!note[0]) return res.status(404).json({ message: "Ghi chú không tồn tại." });

    const [member] = await db.execute(
      "SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?",
      [note[0].workspace_id, req.user.id]
    );
    if (!member[0] || (member[0].role !== "owner" && member[0].role !== "senior" && note[0].user_id !== req.user.id)) {
      return res.status(403).json({ message: "Chỉ owner, senior hoặc người tạo mới có thể xóa." });
    }

    await noteModel.deleteNote(noteId);
    res.json({ message: "Ghi chú đã được xóa." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server." });
  }
};