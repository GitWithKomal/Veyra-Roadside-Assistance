import ServiceRequest from "../models/ServiceRequest.js";
import Mechanic from "../models/Mechanic.js";
import Service from "../models/Service.js";
import sendNotification from "../services/notificationService.js";

export const createServiceRequest = async (req, res) => {
  try {
    const { mechanicId, serviceId, vehicleId, latitude, longitude, notes } =
      req.body;

    if (
      !mechanicId ||
      !serviceId ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Mechanic, service, latitude and longitude are required",
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
        coordinates: [Number(longitude), Number(latitude)],
      },
      estimatedPrice: service.basePrice,
      notes,
    });

    const populatedRequest = await ServiceRequest.findById(request._id)
      .populate("customer", "name phone")
      .populate("mechanic")
      .populate("service", "name basePrice estimatedDuration")
      .populate("vehicle");

    const io = req.app.get("io");

    if (io) {
      io.to(`user:${mechanic.user}`).emit(
        "newServiceRequest",
        populatedRequest,
      );

      console.log(
        `New service request sent to mechanic room: user:${mechanic.user}`,
      );
    }

    if (io) {
      sendNotification({
        io,
        userId: mechanic.user,
        title: "New Service Request",
        message: "A customer has requested roadside assistance.",
        type: "request",
        data: {
          requestId: request._id,
        },
      });
    }

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
      .populate("service", "name basePrice estimatedDuration")
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
      .populate("service", "name basePrice estimatedDuration")
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

    mechanic.isAvailable = false;

    await request.save();
    await mechanic.save();

    const populatedRequest = await ServiceRequest.findById(request._id)
      .populate("customer", "name phone")
      .populate("mechanic")
      .populate("service", "name basePrice estimatedDuration")
      .populate("vehicle");

    const io = req.app.get("io");

    if (io) {
      io.to(`user:${request.customer}`).emit(
        "serviceRequestUpdated",
        populatedRequest,
      );

      if (io) {
        sendNotification({
          io,
          userId: request.customer,
          title: "Request Accepted",
          message:
            "Your mechanic has accepted your roadside assistance request.",
          type: "success",
          data: {
            requestId: request._id,
            status: "accepted",
          },
        });
      }

      sendNotification({
        io,
        userId: request.customer,
        title: "Mechanic accepted your request",
        message: "Your mechanic has accepted the roadside assistance request.",
        type: "success",
        data: {
          requestId: request._id,
          status: "accepted",
        },
      });
    }

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

    const io = req.app.get("io");

    if (io) {
      io.to(`user:${request.customer}`).emit(
        "serviceRequestUpdated",
        populatedRequest,
      );
    }

    if (io) {
      sendNotification({
        io,
        userId: request.customer,
        title: "Request Declined",
        message: "Unfortunately, the mechanic could not accept your request.",
        type: "error",
        data: {
          requestId: request._id,
          status: "rejected",
        },
      });
    }

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

    if (status === "completed") {
      mechanic.isAvailable = true;
    }

    await request.save();
    await mechanic.save();

    const populatedRequest = await ServiceRequest.findById(request._id)
      .populate("customer", "name phone")
      .populate("mechanic")
      .populate("service", "name basePrice estimatedDuration")
      .populate("vehicle");

    const io = req.app.get("io");

    if (io) {
      io.to(`user:${request.customer}`).emit(
        "serviceRequestUpdated",
        populatedRequest,
      );
    }

    if (io) {
      const notifications = {
        on_the_way: {
          title: "Mechanic Is On The Way",
          message: "Your mechanic is travelling to your location.",
          type: "info",
        },

        arrived: {
          title: "Mechanic Has Arrived",
          message: "Your mechanic has reached your location.",
          type: "success",
        },

        in_progress: {
          title: "Service Started",
          message: "Your mechanic is now working on your vehicle.",
          type: "info",
        },

        completed: {
          title: "Service Completed",
          message: "Your roadside assistance service has been completed.",
          type: "success",
        },
      };

      const notification = notifications[status];

      if (notification) {
        sendNotification({
          io,
          userId: request.customer,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          data: {
            requestId: request._id,
            status,
          },
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Service request status updated to ${status}`,
      request: populatedRequest,
    });
  } catch (error) {
    console.error("Update service request status error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating service request",
    });
  }
};
export const rateMechanic = async (req, res) => {
  try {
    const { rating, review } = req.body;

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a whole number between 1 and 5",
      });
    }

    const request = await ServiceRequest.findOne({
      _id: req.params.id,
      customer: req.user._id,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    if (request.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "You can rate the mechanic only after service is completed",
      });
    }

    if (request.rating) {
      return res.status(400).json({
        success: false,
        message: "You have already rated this service",
      });
    }

    request.rating = numericRating;
    request.review = review?.trim() || "";

    await request.save();

    const mechanicId = request.mechanic;

    const ratedRequests = await ServiceRequest.find({
      mechanic: mechanicId,
      status: "completed",
      rating: { $exists: true, $ne: null },
    }).select("rating");

    const totalRatings = ratedRequests.length;

    const totalRating = ratedRequests.reduce(
      (sum, item) => sum + item.rating,
      0,
    );

    const averageRating =
      totalRatings > 0 ? Number((totalRating / totalRatings).toFixed(1)) : 0;

    const mechanic = await Mechanic.findByIdAndUpdate(
      mechanicId,
      {
        rating: averageRating,
      },
      {
        new: true,
      },
    );

    if (!mechanic) {
      return res.status(404).json({
        success: false,
        message: "Mechanic profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Thank you! Your rating has been submitted.",
      rating: numericRating,
      mechanicRating: mechanic.rating,
      request,
    });
  } catch (error) {
    console.error("Rate mechanic error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while rating mechanic",
    });
  }
};
