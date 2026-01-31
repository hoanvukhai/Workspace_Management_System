const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const db = require("./config/db");
require("dotenv").config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "workspace-management-system-ebon.vercel.app",
  "https://workspace-management-system-ebon.vercel.app",
  "workspace-management-system-4kb4d2tuo-hoanvukhais-projects.vercel.app",
  "https://workspace-management-system-4kb4d2tuo-hoanvukhais-projects.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
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
