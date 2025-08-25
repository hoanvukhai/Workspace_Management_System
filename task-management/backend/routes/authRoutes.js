const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const workspaceController = require("../controllers/workspaceController");
const workspaceMemberController = require("../controllers/workspaceMemberController");
const taskController = require("../controllers/taskController");
const taskAssignmentController = require("../controllers/taskAssignmentController");
const noteController = require("../controllers/noteController");
const eventController = require("../controllers/eventController");
const transactionController = require("../controllers/transactionController");
const goalController = require("../controllers/goalController");
const authenticate = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify-email", authController.verifyEmail); // Endpoint xác minh email
router.post("/forgot-password", authController.forgotPassword); // Endpoint quên mật khẩu
router.get("/reset-password", authController.getResetPassword); // Thêm route GET
router.post("/reset-password", authController.resetPassword); // Endpoint reset mật khẩu

router.post("/workspaces", authenticate, workspaceController.createWorkspace);
router.get("/workspaces", authenticate, workspaceController.getUserWorkspaces);
router.put("/workspaces/:workspaceId", authenticate, workspaceController.updateWorkspace);
router.delete("/workspaces/:workspaceId", authenticate, workspaceController.deleteWorkspace);
router.get("/workspaces/:workspaceId", authenticate, workspaceController.getWorkspaceById);

router.post("/workspace-members/add", authenticate, workspaceMemberController.addMember);
router.get("/workspace-members/:workspace_id", authenticate, workspaceMemberController.getMembers);
router.delete("/workspace-members/remove", authenticate, workspaceMemberController.removeMember);
router.put("/workspace-members/role", authenticate, workspaceMemberController.updateMemberRole);


router.post("/tasks/add", authenticate, taskController.createTask);
router.get("/tasks/:workspace_id", authenticate, taskController.getTasksByWorkspaceId);
router.put("/tasks/:task_id", authenticate, taskController.updateTask);
router.delete("/tasks/:task_id", authenticate, taskController.deleteTask);

router.post("/task-assignments/add", authenticate, taskAssignmentController.assignTask); // Thêm gán
router.get("/task-assignments/:task_id", authenticate, taskAssignmentController.getTaskAssignments); // Lấy danh sách gán
router.delete("/task-assignments/:assignment_id", authenticate, taskAssignmentController.removeTaskAssignment); // Xóa gán

router.post("/notes", authenticate, noteController.createNote);
router.get("/notes/:workspace_id", authenticate, noteController.getNotes);
router.put("/notes/:noteId", authenticate, noteController.updateNote);
router.delete("/notes/:noteId", authenticate, noteController.deleteNote);

router.post("/events", authenticate, eventController.createEvent);
router.get("/events/:workspace_id", authenticate, eventController.getEvents);
router.put("/events/:eventId", authenticate, eventController.updateEvent);
router.delete("/events/:eventId", authenticate, eventController.deleteEvent);

router.post("/transactions", authenticate, transactionController.createTransaction);
router.get("/transactions/:workspace_id", authenticate, transactionController.getTransactions);
router.put("/transactions/:transactionId", authenticate, transactionController.updateTransaction);
router.delete("/transactions/:transactionId", authenticate, transactionController.deleteTransaction);

router.post("/goals", authenticate, goalController.createGoal);
router.get("/goals/:workspace_id", authenticate, goalController.getGoals);
router.put("/goals/:goalId", authenticate, goalController.updateGoal);
router.delete("/goals/:goalId", authenticate, goalController.deleteGoal);

router.get("/me", authenticate, authController.getUserProfile);
router.put("/me", authenticate, authController.updateUserProfile);

router.put("/change-password", authenticate, authController.changePassword);

router.get("/admin/users", authenticate, isAdmin, authController.getAllUsers);
router.put("/admin/users/:userId/role", authenticate, isAdmin, authController.updateUserRole);
router.post("/admin/users", authenticate, isAdmin, authController.createUser);
router.put("/admin/users/:userId", authenticate, isAdmin, authController.updateUser);
router.put("/admin/users/:userId/password", authenticate, isAdmin, authController.changeUserPassword);
router.delete("/admin/users/:userId", authenticate, isAdmin, authController.deleteUser);

module.exports = router;