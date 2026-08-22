import express from "express";
import {
  getPendingMechanics,
  verifyMechanic,
} from "../controllers/adminController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/mechanics/pending",
  protect,
  authorizeRoles("admin"),
  getPendingMechanics
);

router.patch(
  "/mechanics/:mechanicId/verify",
  protect,
  authorizeRoles("admin"),
  verifyMechanic
);

export default router;