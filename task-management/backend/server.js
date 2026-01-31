const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const db = require("./config/db");
require("dotenv").config();

const app = express();

// CORS configuration: cho phép localhost, FRONTEND_URL (nếu có) và tất cả các deployment trên *.vercel.app
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const frontend = process.env.FRONTEND_URL || "http://localhost:3000";
    // Nếu origin khớp FRONTEND_URL hoặc là một deployment vercel, cho phép
    if (origin.startsWith(frontend) || /\.vercel\.app$/.test(origin) || origin.startsWith("http://localhost")) {
      return callback(null, true);
    }
    // Không ném lỗi ở đây để tránh trả về response không có header CORS
    return callback(null, false);
  },
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
