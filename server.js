require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();
connectDB();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

// Routes
app.use("/api/auth", authRoutes);
app.use("/admin", adminRoutes);

app.listen(process.env.PORT, () => console.log(`✅ Server running on port ${process.env.PORT}`));
