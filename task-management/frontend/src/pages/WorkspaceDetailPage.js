import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ManageMembers from "../components/ManageMembers";
import ManageTasks from "../components/ManageTasks";
import ManageNotes from "../components/ManageNotes";
import ManageEvents from "../components/ManageEvents";
import ManageTransactions from "../components/ManageTransactions";
import ManageGoals from "../components/ManageGoals";
import DashboardWidgets from "../components/DashboardWidgets";

// Import ảnh từ thư mục img (giả sử nằm trong src/img/)
import lakeImg from "../img/Lake.jpg";
import sunsetForestImg from "../img/SunsetForest.jpg";
import moraineLakeImg from "../img/MoraineLake.jpg";
import meadowMountainImg from "../img/MeadowMountain.jpg";
import enchantedForest from "../img/EnchantedForest.jpg";
import StarlightValley from "../img/StarlightValley.jpg";
import WinterSnow from "../img/WinterSnow.jpg";
import SunsetOcean from "../img/SunsetOcean.jpg";

function formatVND(amount) {
  return Number(amount).toLocaleString("vi-VN");
}

const WorkspaceDetailPage = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [memberCount, setMemberCount] = useState(0);
  const [widgetData, setWidgetData] = useState([]);
  const [theme, setTheme] = useState({ color: "", image: "" }); // State tạm thời cho UI
  const [savedTheme, setSavedTheme] = useState({ color: "", image: "" }); // State lưu từ backend
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsPrivate, setEditIsPrivate] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Thêm trạng thái lưu
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState("");

  const themes = {
    "Không có gì": { color: "", image: "" },
    "Rừng Ban Mai": { color: "#228B22", image: enchantedForest },
    "Thung Lũng Sao": { color: "#ADD8E6", image: StarlightValley },
    "Đường Tuyết Phủ": { color: "#FFFFFF", image: WinterSnow },
    "Hoàng Hôn Biển": { color: "#FF6347", image: SunsetOcean },
  };

const fetchWorkspace = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/workspaces/${workspaceId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
      });
      setWorkspace(res.data);
      setEditName(res.data.name || "");
      setEditDescription(res.data.description || "");
      setEditIsPrivate(res.data.is_private === 1);
      const initialTheme = {
        color: res.data.theme_color || "",
        image: res.data.background_image || "",
      };
      setTheme(initialTheme);
      setSavedTheme(initialTheme);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi tải không gian. Bạn có thể không có quyền truy cập.");
      setLoading(false);
      if (err.response?.status === 403) navigate("/home");
    }
  };

const fetchCurrentUserRole = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/workspace-members/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const currentUserId = JSON.parse(atob(token.split(".")[1])).id;
      const me = res.data.find((m) => m.id === currentUserId);
      setCurrentUserRole(me?.role || "");
    } catch (err) {
      setCurrentUserRole("");
    }
  };

const fetchMembers = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/workspace-members/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMemberCount(res.data.length);
      return res.data;
    } catch (err) {
      setMemberCount(0);
      return [];
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/tasks/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return [];
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/notes/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return [];
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/events/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return [];
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/transactions/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return [];
    }
  };

  const fetchGoals = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/goals/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return [];
    }
  };

  const prepareWidgetData = async () => {
    const [members, tasks, notes, events, transactions, goals] = await Promise.all([
      fetchMembers(),
      fetchTasks(),
      fetchNotes(),
      fetchEvents(),
      fetchTransactions(),
      fetchGoals(),
    ]);

    const sortedMembers = members
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3)
      .map((m) => `${m.name} (${m.role === "owner" ? "owner" : m.role === "senior" ? "editor" : "viewer"})`);
    const sortedTasks = tasks
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3)
      .map((t) => `${t.title} (${t.status === "pending" ? "chưa" : t.status === "in_progress" ? "đang" : "đã"})`);
    const sortedNotes = notes
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3)
      .map((n) => `${n.user_name} - ${new Date(n.created_at).toLocaleDateString()}`);
    const sortedEvents = events
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3)
      .map((e) => {
        const start = new Date(e.start_time).toLocaleDateString();
        const end = new Date(e.end_time).toLocaleDateString();
        const now = new Date();
        const status =
          now < new Date(e.start_time)
            ? "Chưa diễn ra"
            : now > new Date(e.end_time)
            ? "Đã diễn ra"
            : "Đang diễn ra";
        return `${e.title} (${status})`;
      });
    const sortedTransactions = transactions
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3)
      .map((t) => `${t.category || t.description || "Chưa có danh mục"} (${t.type === "income" ? "Thu" : "Chi"})`);
    const sortedGoals = goals
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3)
      .map((g) => `${g.title} (${g.progress || 0}%)`);

    const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0);
    const profit = income - expense;
    const overdueGoals = goals.filter(
      (g) => new Date(g.deadline || 0) < new Date() && (g.progress || 0) < 100
    ).length;

    setWidgetData([
      {
        key: "members",
        title: "Thành viên",
        icon: "👥",
        bgColor: "bg-cyan-200",
        total: `${members.length} thành viên`,
        recent: sortedMembers,
        extraInfo: `1 chủ, ${members.filter((m) => m.role === "senior").length} biên tập, ${
          members.filter((m) => m.role === "member").length
        } thành viên`,
      },
      {
        key: "tasks",
        title: "Việc cần làm",
        icon: "🔔",
        bgColor: "bg-blue-200",
        total: `Tổng: ${tasks.length} công việc`,
        recent: sortedTasks,
        extraInfo: `${tasks.filter((t) => t.status === "pending").length} chưa làm, ${
          tasks.filter((t) => t.status === "in_progress").length
        } đang làm, ${tasks.filter((t) => t.status === "completed").length} đã làm`,
      },
      {
        key: "notes",
        title: "Ghi chú",
        icon: "📝",
        bgColor: "bg-yellow-200",
        total: `Tổng: ${notes.length} ghi chú`,
        recent: sortedNotes,
        extraInfo: `${
          notes.filter(
            (n) => new Date(n.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length
        } ghi chú từ tuần này`,
      },
      {
        key: "events",
        title: "Sự kiện",
        icon: "📅",
        bgColor: "bg-purple-200",
        total: `Tổng: ${events.length} sự kiện`,
        recent: sortedEvents,
        extraInfo: `${
          events.filter((e) => new Date() < new Date(e.start_time)).length
        } chưa diễn ra, ${
          events.filter(
            (e) => new Date(e.start_time) <= new Date() && new Date() <= new Date(e.end_time)
          ).length
        } đang diễn ra, ${events.filter((e) => new Date() > new Date(e.end_time)).length} đã diễn ra`,
      },
      {
        key: "transactions",
        title: "Giao dịch",
        icon: "💰",
        bgColor: "bg-green-200",
        total: `Tổng: ${transactions.length} giao dịch`,
        recent: sortedTransactions,
        extraInfo: `${formatVND(income)} – ${formatVND(expense)} = ${formatVND(profit)}`,
      },
      {
        key: "goals",
        title: "Mục tiêu",
        icon: "🎯",
        bgColor: "bg-orange-200",
        total: `Tổng: ${goals.length} mục tiêu`,
        recent: sortedGoals,
        extraInfo: `Đã đạt ${Math.round(
          goals.reduce((sum, g) => sum + (g.progress || 0), 0) / (goals.length || 1)
        )}% – ${overdueGoals} mục tiêu quá hạn`,
      },
    ]);
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      await axios.put(
        `http://localhost:5000/api/auth/workspaces/${workspaceId}`,
        {
          name: editName,
          description: editDescription,
          is_private: editIsPrivate ? 1 : 0, // Chuyển boolean thành 0/1
          theme_color: theme.color,
          background_image: theme.image,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWorkspace({
        ...workspace,
        name: editName,
        description: editDescription,
        is_private: editIsPrivate ? 1 : 0,
        theme_color: theme.color,
        background_image: theme.image,
      });
      setSavedTheme({ ...theme }); // Cập nhật theme đã lưu
      setIsEditModalOpen(false);
      setSuccess("Cập nhật thông tin thành công!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setErrors(err.response?.data?.message || "Lỗi khi cập nhật thông tin.");
      setTimeout(() => setSuccess(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
    if (token) {
    fetchCurrentUserRole();
    fetchMembers();
    }
    prepareWidgetData();
  }, [workspaceId]);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!workspace) return <p>Không tìm thấy không gian</p>;

  return (
    <div
      className="min-h-screen p-4"
      style={{
        backgroundImage: savedTheme.image ? `url(${savedTheme.image})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundColor: savedTheme.image ? "transparent" : "#F5F5F5",
      }}
    >
      <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Cột trái: Thông tin workspace */}
        <div className="bg-white bg-opacity-90 shadow-lg rounded-lg p-6 lg:col-span-1 relative z-10 hover:scale-[1.02] transition">
          <h1 className="text-2xl font-bold" style={{ color: savedTheme.color || "#000000" }}>
            Không gian: {workspace.name}
          </h1>
          <div className="space-y-2 text-gray-700 mt-4">
            <p>
              <strong className="text-gray-600">Mô tả:</strong> {workspace.description || "Không có"}
            </p>
            <p>
              <strong className="text-gray-600">Trạng thái:</strong>
              <span
                className={`ml-1 inline-block px-2 py-0.5 rounded text-sm font-medium ${
                  workspace.is_private === 1 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                }`}
              >
                {workspace.is_private === 1 ? "Riêng tư" : "Công khai"}
              </span>
            </p>
            <p>
              <strong className="text-gray-600">Ngày tạo:</strong>{" "}
              {workspace.created_at ? new Date(workspace.created_at).toLocaleDateString() : "Chưa xác định"}
            </p>
            <p>
              <strong className="text-gray-600">Tạo bởi</strong> {workspace.created_by_name}
            </p>
          </div>

          <div className="flex mt-6 space-x-3">
            <button
              onClick={() => navigate("/home")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
            >
              Quay lại
            </button>
            {(token && (currentUserRole === "owner" || currentUserRole === "senior")) && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
              >
                Sửa thông tin
              </button>
            )}
          </div>
        </div>

        {(token || (!token && !workspace.is_private)) && (
          <div className="w-full lg:col-span-2">

            <DashboardWidgets
              onSelect={(section) => setSelectedSection(section)}
              widgetData={widgetData}
            />
          </div>
        )}
      </div>

      {/* Hiển thị section được chọn */}
      {selectedSection && (
        <div className="mt-8">
          {(token || (!token && !workspace.is_private)) && (
            <>
          {selectedSection === "members" && (
            <>
              <h2
                className="text-xl font-semibold mb-2"
                style={{ color: savedTheme.color || "#000000" }}
              >
                Thành viên trong workspace
              </h2>
              <ManageMembers workspaceId={workspaceId} currentUserRole={currentUserRole} />
            </>
          )}
          {selectedSection === "tasks" && (
            <>
              <h2
                className="text-xl font-semibold mb-2"
                style={{ color: savedTheme.color || "#000000" }}
              >
                Quản lý công việc
              </h2>
              <ManageTasks workspaceId={workspaceId} currentUserRole={currentUserRole} />
            </>
          )}
          {selectedSection === "notes" && (
            <>
              <h2
                className="text-xl font-semibold mb-2"
                style={{ color: savedTheme.color || "#000000" }}
              >
                Quản lý ghi chú
              </h2>
              <ManageNotes workspaceId={workspaceId} currentUserRole={currentUserRole} />
            </>
          )}
          {selectedSection === "events" && (
            <>
              <h2
                className="text-xl font-semibold mb-2"
                style={{ color: savedTheme.color || "#000000" }}
              >
                Quản lý sự kiện
              </h2>
              <ManageEvents workspaceId={workspaceId} currentUserRole={currentUserRole} />
            </>
          )}
          {selectedSection === "transactions" && (
            <>
              <h2
                className="text-xl font-semibold mb-2"
                style={{ color: savedTheme.color || "#000000" }}
              >
                Quản lý giao dịch
              </h2>
              <ManageTransactions workspaceId={workspaceId} currentUserRole={currentUserRole} />
            </>
          )}
          {selectedSection === "goals" && (
            <>
              <h2
                className="text-xl font-semibold mb-2"
                style={{ color: savedTheme.color || "#000000" }}
              >
                Quản lý mục tiêu
              </h2>
              <ManageGoals workspaceId={workspaceId} currentUserRole={currentUserRole} />
            </>
          )}
          </>
          )}
          <button
            onClick={() => setSelectedSection("")}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Quay lại
          </button>
        </div>
      )}

      {/* Modal chỉnh sửa thông tin workspace */}
      {(token && (currentUserRole === "owner" || currentUserRole === "senior")) && (
        <div
          className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center ${
            isEditModalOpen ? "" : "hidden"
          }`}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: theme.color || "#000000" }}
            >
              Sửa thông tin không gian
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Tên</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Mô tả</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Trạng thái</label>
                <select
                  value={editIsPrivate}
                  onChange={(e) => setEditIsPrivate(e.target.value === "true")}
                  className="w-full p-2 border rounded"
                >
                  <option value={false}>Công khai</option>
                  <option value={true}>Riêng tư</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Giao diện</label>
                <select
                  value={Object.keys(themes).find(
                    (key) => themes[key].color === theme.color && themes[key].image === theme.image
                  ) || "Không có gì"}
                  onChange={(e) => setTheme(themes[e.target.value])}
                  className="w-full p-2 border rounded"
                >
                  {Object.keys(themes).map((themeName) => (
                    <option key={themeName} value={themeName}>
                      {themeName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleSaveEdit}
                  className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition ${
                    isSaving ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSaving}
                >
                  {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        {errors && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded shadow-lg z-50">
            {errors}
        </div>
        )}
        {success && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50">
            {success}
        </div>
        )}
    </div>
  );
};

export default WorkspaceDetailPage;