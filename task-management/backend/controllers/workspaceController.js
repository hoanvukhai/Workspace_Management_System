const { v4: uuidv4 } = require("uuid");
const workspaceModel = require("../models/workspaceModel");
const db = require("../config/db");

const createWorkspace = async (req, res) => {
  const { name, description, is_private } = req.body;
  const workspaceId = uuidv4();
  try {
    await workspaceModel.createWorkspace(workspaceId, req.user.id, name, description, is_private);
    // Thêm người tạo vào workspace_members với vai trò owner và trạng thái accepted
    await workspaceModel.addWorkspaceMember(uuidv4(), req.user.id, workspaceId, "owner", "accepted");
    res.status(201).json({ message: "Workspace created", id: workspaceId });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserWorkspaces = async (req, res) => {
  try {
    const workspaces = await workspaceModel.findWorkspacesByUserId(req.user.id);
    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateWorkspace = async (req, res) => {
  const { workspaceId } = req.params;
  const { name, description, is_private, theme_color, background_image } = req.body;
  try {
    const workspace = await workspaceModel.findWorkspaceById(workspaceId);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });
    if (req.user.role !== "owner") return res.status(403).json({ message: "Only owner can update" });

    await workspaceModel.updateWorkspace(workspaceId, name, description, is_private, theme_color, background_image);
    res.json({ message: "Workspace updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteWorkspace = async (req, res) => {
  const { workspaceId } = req.params;
  try {
    const workspace = await workspaceModel.findWorkspaceById(workspaceId);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });
    if (req.user.role !== "owner") return res.status(403).json({ message: "Only owner can delete" });

    await workspaceModel.deleteWorkspace(workspaceId);
    res.json({ message: "Workspace deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getWorkspaceById = async (req, res) => {
  const { workspaceId } = req.params;
  try {
    const [workspace] = await db.execute(
      `SELECT w.*, u.name AS created_by_name
       FROM workspaces w
       JOIN users u ON w.created_by = u.id
       WHERE w.id = ?`,
      [workspaceId]
    );
    if (!workspace[0]) return res.status(404).json({ message: "Workspace not found" });

    const isPublic = workspace[0].is_private === 0;
if (isPublic) {
      // Công khai, trả về dữ liệu cơ bản
      res.json({
        id: workspace[0].id,
        name: workspace[0].name,
        description: workspace[0].description,
        is_private: workspace[0].is_private,
        created_by_name: workspace[0].created_by_name,
        created_at: workspace[0].created_at,
        theme_color: workspace[0].theme_color, 
        background_image: workspace[0].background_image, 
      });
    } else {
      // Riêng tư, kiểm tra quyền truy cập
      if (!req.user || !req.user.id) return res.status(403).json({ message: "Access denied" });
      const hasAccess = await workspaceModel.checkWorkspaceAccess(workspaceId, req.user.id);
      if (!hasAccess) return res.status(403).json({ message: "Access denied" });
      res.json(workspace[0]);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createWorkspace,
  getUserWorkspaces,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceById,
};