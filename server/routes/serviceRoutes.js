import express from "express";
import {
  getServices,
  createService,
} from "../controllers/serviceController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, getServices);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createService
);

export default router;