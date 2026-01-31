const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const db = require("./config/db");
require("dotenv").config();

const app = express();

// CORS configuration: phản hồi origin động (cho phép frontend phản hồi trực tiếp) để tránh lỗi CORS
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Backend is running" });
});

app.use("/api/auth", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

const PORT = process.env.PORT || 5000;
// Khởi tạo admin tự động (nếu env vars được cung cấp)
const initAdmin = require('./utils/initAdmin');

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await initAdmin();
  } catch (err) {
    console.error('Error during initAdmin:', err?.message || err);
  }
});
