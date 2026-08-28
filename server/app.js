import express from "express";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import mechanicRoutes from "./routes/mechanicRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import serviceRequestRoutes from "./routes/serviceRequestRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Veyra API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/mechanics", mechanicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/service-requests", serviceRequestRoutes);

export default app;
