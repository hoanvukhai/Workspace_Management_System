import React, { useState, useEffect } from "react";
import axios from "axios";
import ManageTasksForm from "./ManageTasksForm";
import ManageTaskAssignments from "./ManageTaskAssignments";
import Modal from "./Modal";

const ManageTasks = ({ workspaceId, currentUserRole }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, [workspaceId]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/tasks/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Lỗi lấy công việc:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Bạn có chắc muốn xóa công việc này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error("Lỗi xóa công việc:", err);
    }
  };

  return (
    <div>
      <div className="mb-4">
        {(currentUserRole === "owner" || currentUserRole === "senior") && (
          <button
            onClick={() => {
              setSelectedTask(null);
              setIsTaskModalOpen(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Thêm công việc
          </button>
        )}
      </div>
    <h2 className="text-xl font-semibold mt-6 mb-2">Danh sách công việc</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
  {tasks.map((task) => (
    <div
      key={task.id}
      className="bg-white rounded shadow p-4 border border-gray-200 hover:shadow-lg transition-transform hover:scale-[1.01]"
    >
      <h3 className="font-semibold text-lg text-blue-700 mb-2">{task.title}</h3>
      <p className="text-sm text-gray-700">{task.description}</p>
      <p className="text-sm mt-1">Trạng thái: <span className="font-medium">{task.status === "not_started" ? "Chưa bắt đầu" : task.status === "in_progress" ? "Đang thực hiện" : "Hoàn thành"}</span></p>
      <p className="text-sm">Hạn: {task.deadline ? new Date(task.deadline).toLocaleDateString() : "Không có"}</p>
      <p className="text-sm">Tạo bởi: {task.created_by_name}</p>
      <p className="text-sm">Người được gán: <span className="italic">{task.assigned_to || "Chưa gán"}</span></p>

      {(currentUserRole === "owner" || currentUserRole === "senior") && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedTask(task);
              setIsTaskModalOpen(true);
            }}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
          >
            Sửa
          </button>
          <button
            onClick={() => handleDeleteTask(task.id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
          >
            Xóa
          </button>
          <button
            onClick={() => {
              setSelectedTask(task);
              setIsAssignModalOpen(true);
            }}
            className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 text-sm"
          >
            Gán
          </button>
        </div>
      )}
    </div>
  ))}
</div>


      {/* Modal thêm/sửa công việc */}
      <Modal isOpen={isTaskModalOpen} onClose={() => {
        setIsTaskModalOpen(false);
        setSelectedTask(null);
      }}>
        <h2 className="text-xl font-semibold mb-2">{selectedTask ? "Chỉnh sửa công việc" : "Thêm công việc"}</h2>
        <ManageTasksForm
          workspaceId={workspaceId}
          task={selectedTask}
          onSave={() => {
            fetchTasks();
            setIsTaskModalOpen(false);
            setSelectedTask(null);
          }}
        />
      </Modal>

      {/* Modal gán công việc */}
      <Modal isOpen={isAssignModalOpen} onClose={() => {
        setIsAssignModalOpen(false);
        setSelectedTask(null);
      }}>
        <h2 className="text-xl font-semibold mb-2">Gán công việc</h2>
        <ManageTaskAssignments
          taskId={selectedTask?.id}
          workspaceId={workspaceId}
          onSave={() => {
            fetchTasks();
            setIsAssignModalOpen(false);
            setSelectedTask(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default ManageTasks;