import express from "express";
import {
  createMechanicProfile,
  getMyMechanicProfile,
  updateMechanicLocation,
  getNearbyMechanics,
  updateMechanicServices,
  getMechanicRoute,
} from "../controllers/mechanicController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/profile", protect, createMechanicProfile);

router.get("/profile", protect, getMyMechanicProfile);

router.patch("/location", protect, updateMechanicLocation);

router.get("/nearby", protect, getNearbyMechanics);

router.patch(
  "/services",
  protect,
  updateMechanicServices
);

router.get("/route", protect, getMechanicRoute);

export default router;