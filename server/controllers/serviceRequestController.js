import ServiceRequest from "../models/ServiceRequest.js";
import Mechanic from "../models/Mechanic.js";
import Service from "../models/Service.js";

export const createServiceRequest = async (req, res) => {
  try {
    const {
      mechanicId,
      serviceId,
      vehicleId,
      latitude,
      longitude,
      notes,
    } = req.body;

    if (
      !mechanicId ||
      !serviceId ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Mechanic, service, latitude and longitude are required",
      });
    }

    const mechanic = await Mechanic.findOne({
      _id: mechanicId,
      isVerified: true,
      isAvailable: true,
    });

    if (!mechanic) {
      return res.status(404).json({
        success: false,
        message: "Mechanic is unavailable or not verified",
      });
    }

    const service = await Service.findOne({
      _id: serviceId,
      isActive: true,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found or inactive",
      });
    }

    const request = await ServiceRequest.create({
      customer: req.user._id,
      mechanic: mechanic._id,
      service: service._id,
      vehicle: vehicleId || undefined,
      pickupLocation: {
        type: "Point",
        coordinates: [
          Number(longitude),
          Number(latitude),
        ],
      },
      estimatedPrice: service.basePrice,
      notes,
    });

    const populatedRequest =
      await ServiceRequest.findById(request._id)
        .populate("customer", "name phone")
        .populate("mechanic")
        .populate("service", "name basePrice estimatedDuration");

    res.status(201).json({
      success: true,
      message: "Service request created successfully",
      request: populatedRequest,
    });
  } catch (error) {
    console.error("Create service request error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating service request",
    });
  }
};

export const getMyServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      customer: req.user._id,
    })
      .populate("mechanic")
      .populate(
        "service",
        "name basePrice estimatedDuration"
      )
      .populate("vehicle")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get customer requests error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching requests",
    });
  }
};

export const getMechanicServiceRequests = async (req, res) => {
  try {
    const mechanic = await Mechanic.findOne({
      user: req.user._id,
    });

    if (!mechanic) {
      return res.status(404).json({
        success: false,
        message: "Mechanic profile not found",
      });
    }

    const requests = await ServiceRequest.find({
      mechanic: mechanic._id,
    })
      .populate("customer", "name phone")
      .populate(
        "service",
        "name basePrice estimatedDuration"
      )
      .populate("vehicle")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get mechanic requests error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching mechanic requests",
    });
  }
};
export const acceptServiceRequest = async (req, res) => {
  try {
    const mechanic = await Mechanic.findOne({
      user: req.user._id,
    });

    if (!mechanic) {
      return res.status(404).json({
        success: false,
        message: "Mechanic profile not found",
      });
    }

    const request = await ServiceRequest.findOne({
      _id: req.params.id,
      mechanic: mechanic._id,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Request cannot be accepted because it is already ${request.status}`,
      });
    }

    request.status = "accepted";

    await request.save();

    const populatedRequest = await ServiceRequest.findById(request._id)
      .populate("customer", "name phone")
      .populate("mechanic")
      .populate("service", "name basePrice estimatedDuration")
      .populate("vehicle");

    res.status(200).json({
      success: true,
      message: "Service request accepted",
      request: populatedRequest,
    });
  } catch (error) {
    console.error("Accept service request error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while accepting service request",
    });
  }
};


export const rejectServiceRequest = async (req, res) => {
  try {
    const mechanic = await Mechanic.findOne({
      user: req.user._id,
    });

    if (!mechanic) {
      return res.status(404).json({
        success: false,
        message: "Mechanic profile not found",
      });
    }

    const request = await ServiceRequest.findOne({
      _id: req.params.id,
      mechanic: mechanic._id,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Request cannot be rejected because it is already ${request.status}`,
      });
    }

    request.status = "rejected";

    await request.save();

    const populatedRequest = await ServiceRequest.findById(request._id)
      .populate("customer", "name phone")
      .populate("mechanic")
      .populate("service", "name basePrice estimatedDuration")
      .populate("vehicle");

    res.status(200).json({
      success: true,
      message: "Service request rejected",
      request: populatedRequest,
    });
  } catch (error) {
    console.error("Reject service request error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while rejecting service request",
    });
  }
};
export const updateServiceRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "on_the_way",
      "arrived",
      "in_progress",
      "completed",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service request status",
      });
    }

    const mechanic = await Mechanic.findOne({
      user: req.user._id,
    });

    if (!mechanic) {
      return res.status(404).json({
        success: false,
        message: "Mechanic profile not found",
      });
    }

    const request = await ServiceRequest.findOne({
      _id: req.params.id,
      mechanic: mechanic._id,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    const validTransitions = {
      accepted: ["on_the_way"],
      on_the_way: ["arrived"],
      arrived: ["in_progress"],
      in_progress: ["completed"],
    };

    const nextStatuses = validTransitions[request.status] || [];

    if (!nextStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${request.status} to ${status}`,
      });
    }

    request.status = status;

    await request.save();

    const populatedRequest = await ServiceRequest.findById(
      request._id
    )
      .populate("customer", "name phone")
      .populate("mechanic")
      .populate(
        "service",
        "name basePrice estimatedDuration"
      )
      .populate("vehicle");

    res.status(200).json({
      success: true,
      message: `Service request status updated to ${status}`,
      request: populatedRequest,
    });
  } catch (error) {
    console.error(
      "Update service request status error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error while updating service request",
    });
  }
};