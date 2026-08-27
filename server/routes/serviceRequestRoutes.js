import express from "express";

import {
  createServiceRequest,
  getMyServiceRequests,
  getMechanicServiceRequests,
  acceptServiceRequest,
  rejectServiceRequest,
  updateServiceRequestStatus,
} from "../controllers/serviceRequestController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  createServiceRequest
);

router.get(
  "/my",
  protect,
  getMyServiceRequests
);

router.get(
  "/mechanic",
  protect,
  getMechanicServiceRequests
);

router.patch(
  "/:id/accept",
  protect,
  acceptServiceRequest
);

router.patch(
  "/:id/reject",
  protect,
  rejectServiceRequest
);

router.patch(
  "/:id/status",
  protect,
  updateServiceRequestStatus
);

export default router;
