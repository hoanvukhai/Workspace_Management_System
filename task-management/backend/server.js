const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const db = require("./config/db");
require("dotenv").config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
];

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Cho phép:
    // 1. Requests không có origin (ví dụ: mobile apps, curl)
    // 2. localhost:3000
    // 3. Bất kỳ Vercel deployment nào (*.vercel.app)
    if (!origin || 
        origin === "http://localhost:3000" ||
        origin.includes(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
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
