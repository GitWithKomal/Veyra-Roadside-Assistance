import express from "express";
import {
  addVehicle,
  getMyVehicles,
} from "../controllers/vehicleController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addVehicle);

router.get("/my", protect, getMyVehicles);

export default router;