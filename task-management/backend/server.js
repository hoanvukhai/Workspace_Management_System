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

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
