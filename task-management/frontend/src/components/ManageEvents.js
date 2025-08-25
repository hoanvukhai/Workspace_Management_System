import React, { useState, useEffect } from "react";
import axios from "axios";

function toMySQLDatetime(dt) {
  if (!dt) return null;
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dt)) return dt;
  const d = new Date(dt);
  if (isNaN(d.getTime())) return null;
  return d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0") + " " +
    String(d.getHours()).padStart(2, "0") + ":" +
    String(d.getMinutes()).padStart(2, "0") + ":" +
    String(d.getSeconds()).padStart(2, "0");
}

const ManageEvents = ({ workspaceId, currentUserRole }) => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    is_all_day: false,
    reminder_time: "",
  });
  const token = localStorage.getItem("token");

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/events/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error("Lỗi lấy sự kiện:", err);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/auth/events",
        {
          workspace_id: workspaceId,
          ...newEvent,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewEvent({ title: "", description: "", start_time: "", end_time: "", is_all_day: false, reminder_time: "" });
      fetchEvents();
    } catch (err) {
      console.error("Lỗi thêm sự kiện:", err);
    }
  };

  const handleUpdateEvent = async (eventId, updatedFields) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    const safe = v => v === undefined ? null : v;

    const updatedEvent = {
      title: safe(updatedFields.title ?? event.title),
      description: safe(updatedFields.description ?? event.description),
      start_time: toMySQLDatetime(safe(updatedFields.start_time ?? event.start_time)),
      end_time: toMySQLDatetime(safe(updatedFields.end_time ?? event.end_time)),
      is_all_day: safe(updatedFields.is_all_day ?? event.is_all_day),
      reminder_time: toMySQLDatetime(safe(updatedFields.reminder_time ?? event.reminder_time)),
    };

    try {
      await axios.put(
        `http://localhost:5000/api/auth/events/${eventId}`,
        updatedEvent,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEvents();
    } catch (err) {
      console.error("Lỗi cập nhật sự kiện:", err);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Bạn có chắc muốn xóa sự kiện này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
    } catch (err) {
      console.error("Lỗi xóa sự kiện:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [workspaceId]);

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Danh sách sự kiện</h3>

      {/* Form thêm sự kiện */}
      {(currentUserRole === "owner" || currentUserRole === "senior") && (
        <form onSubmit={handleAddEvent} className="mb-6 space-y-2">
          <input
            type="text"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            placeholder="Tiêu đề sự kiện"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            placeholder="Mô tả"
            className="w-full p-2 border rounded"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="datetime-local"
              value={newEvent.start_time}
              onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              type="datetime-local"
              value={newEvent.end_time}
              onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })}
              className="p-2 border rounded"
            />
          </div>
          <label className="block">
            <input
              type="checkbox"
              checked={newEvent.is_all_day}
              onChange={(e) => setNewEvent({ ...newEvent, is_all_day: e.target.checked })}
              className="mr-2"
            />
            Sự kiện kéo dài cả ngày
          </label>
          <input
            type="datetime-local"
            value={newEvent.reminder_time}
            onChange={(e) => setNewEvent({ ...newEvent, reminder_time: e.target.value })}
            placeholder="Thời gian nhắc"
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Thêm sự kiện
          </button>
        </form>
      )}

      {/* Danh sách sự kiện dạng card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-indigo-100 p-4 rounded shadow border border-indigo-300 hover:shadow-lg transition-transform hover:scale-[1.01]"
          >
            <h4 className="text-lg font-semibold mb-1">{event.title}</h4>
            <p className="text-sm text-gray-700 mb-1">
              Tạo bởi: <strong>{event.user_name}</strong>
            </p>
            <p className="text-sm text-gray-700">
              Bắt đầu: {new Date(event.start_time).toLocaleString()}
            </p>
            {event.end_time && (
              <p className="text-sm text-gray-700">
                Kết thúc: {new Date(event.end_time).toLocaleString()}
              </p>
            )}
            {event.is_all_day && (
              <p className="text-sm text-blue-700 font-medium">Sự kiện cả ngày</p>
            )}
            {event.reminder_time && (
              <p className="text-sm text-gray-500">
                Nhắc nhở: {new Date(event.reminder_time).toLocaleString()}
              </p>
            )}
            <hr className="my-2" />
            <p className="text-sm whitespace-pre-wrap">{event.description}</p>

            {(currentUserRole === "owner" || currentUserRole === "senior") && (
              <>
                <textarea
                  defaultValue={event.description}
                  onBlur={(e) => handleUpdateEvent(event.id, { description: e.target.value })}
                  className="w-full p-2 border rounded mt-2 resize-none"
                  rows={3}
                />
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Xóa
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageEvents;
