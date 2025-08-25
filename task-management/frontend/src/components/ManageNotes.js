import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageNotes = ({ workspaceId, currentUserRole }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const token = localStorage.getItem("token");

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/notes/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    } catch (err) {
      console.error("Lỗi lấy ghi chú:", err);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/auth/notes",
        { workspace_id: workspaceId, content: newNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewNote("");
      fetchNotes();
    } catch (err) {
      console.error("Lỗi thêm ghi chú:", err);
    }
  };

  const handleUpdateNote = async (noteId, content) => {
    try {
      await axios.put(
        `http://localhost:5000/api/auth/notes/${noteId}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotes();
    } catch (err) {
      console.error("Lỗi cập nhật ghi chú:", err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Bạn có chắc muốn xóa ghi chú này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes();
    } catch (err) {
      console.error("Lỗi xóa ghi chú:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [workspaceId]);

  const currentUserId = JSON.parse(atob(token.split('.')[1])).id;

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Danh sách ghi chú</h3>

      {/* Form thêm ghi chú */}
      {currentUserRole !== "member" && (
        <form onSubmit={handleAddNote} className="mb-6">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Nhập ghi chú mới..."
            className="w-full p-3 border rounded resize-none"
            rows={3}
          />
          <button
            type="submit"
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Thêm
          </button>
        </form>
      )}

      {/* Danh sách ghi chú dạng card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => {
          const canEdit =
            currentUserRole === "owner" ||
            currentUserRole === "senior" ||
            note.user_id === currentUserId;

          return (
            <div
              key={note.id}
              className="bg-yellow-100 p-4 rounded shadow border border-yellow-300 hover:shadow-lg transition-transform hover:scale-[1.01]"
            >
              <p className="text-sm text-gray-800">
                Tạo bởi: <strong>{note.user_name}</strong> -{" "}
                {new Date(note.created_at).toLocaleDateString()}
              </p>
              {canEdit ? (
                <>
                  <textarea
                    defaultValue={note.content}
                    onBlur={(e) => handleUpdateNote(note.id, e.target.value)}
                    className="w-full mt-2 p-2 border rounded resize-none"
                    rows={4}
                  />
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Xóa
                  </button>
                </>
              ) : (
                <p className="mt-2 text-gray-900 whitespace-pre-wrap">{note.content}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageNotes;
