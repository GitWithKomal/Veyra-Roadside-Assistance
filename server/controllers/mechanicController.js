import User from "../models/User.js";
import Mechanic from "../models/Mechanic.js";
import getDistanceAndETA from "../services/mapplsService.js";
import {
  getDrivingRoute,
} from "../services/mapplsService.js";
export const getMechanicRoute = async (req, res) => {
  try {
    const {
      customerLatitude,
      customerLongitude,
      mechanicId,
    } = req.query;

    if (
      customerLatitude === undefined ||
      customerLongitude === undefined ||
      !mechanicId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Customer location and mechanic ID are required",
      });
    }

    const customerLat = Number(customerLatitude);
    const customerLng = Number(customerLongitude);

    if (
      Number.isNaN(customerLat) ||
      Number.isNaN(customerLng)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer coordinates",
      });
    }

    const mechanic = await Mechanic.findOne({
      _id: mechanicId,
      isVerified: true,
    });

    if (!mechanic) {
      return res.status(404).json({
        success: false,
        message: "Mechanic not found",
      });
    }

    if (
      !mechanic.location ||
      !mechanic.location.coordinates ||
      mechanic.location.coordinates.length !== 2
    ) {
      return res.status(400).json({
        success: false,
        message: "Mechanic location is not available",
      });
    }

    const [
      mechanicLongitude,
      mechanicLatitude,
    ] = mechanic.location.coordinates;

    const route = await getDrivingRoute(
      customerLat,
      customerLng,
      mechanicLatitude,
      mechanicLongitude,
    );

    res.status(200).json({
      success: true,
      route,
    });
  } catch (error) {
    console.error(
      "Get mechanic route error:",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while calculating route",
    });
  }
};

export const createMechanicProfile = async (req, res) => {
  try {
    const { businessName, description, experience, servicesOffered, pricing } =
      req.body;

    if (!businessName || experience === undefined) {
      return res.status(400).json({
        success: false,
        message: "Business name and experience are required",
      });
    }

    const existingMechanic = await Mechanic.findOne({
      user: req.user._id,
    });

    if (existingMechanic) {
      return res.status(409).json({
        success: false,
        message: "Mechanic profile already exists",
      });
    }

    const mechanic = await Mechanic.create({
      user: req.user._id,
      businessName,
      description,
      experience,
      servicesOffered: servicesOffered || [],
      pricing: pricing || [],
    });

    await User.findByIdAndUpdate(req.user._id, {
      role: "mechanic",
    });

    res.status(201).json({
      success: true,
      message: "Mechanic profile created. Waiting for admin verification.",
      mechanic,
    });
  } catch (error) {
    console.error("Create mechanic profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating mechanic profile",
    });
  }
};

export const getMyMechanicProfile = async (req, res) => {
  try {
    const mechanic = await Mechanic.findOne({
      user: req.user._id,
    }).populate("servicesOffered");

    if (!mechanic) {
      return res.status(404).json({
        success: false,
        message: "Mechanic profile not found",
      });
    }

    res.status(200).json({
      success: true,
      mechanic,
    });
  } catch (error) {
    console.error("Get mechanic profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching mechanic profile",
    });
  }
};

export const getNearbyMechanics = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);
    const radiusInMeters = Number(radius) * 1000;

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude",
      });
    }

   
    const mechanics = await Mechanic.find({
      isVerified: true,
      isAvailable: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: radiusInMeters,
        },
      },
    })
      .populate("user", "name phone profileImage")
      .populate(
        "servicesOffered",
        "name basePrice estimatedDuration",
      );

   
    const distanceData = await getDistanceAndETA(
      lat,
      lng,
      mechanics,
    );

   
    const mechanicsWithDistance = mechanics.map(
      (mechanic) => {
        const distanceInfo = distanceData.find(
          (item) =>
            String(item.mechanicId) ===
            String(mechanic._id),
        );

        return {
          ...mechanic.toObject(),

          distanceKm:
            distanceInfo?.distanceKm ?? null,

          estimatedArrivalMinutes:
            distanceInfo?.durationMinutes ?? null,
        };
      },
    );

    res.status(200).json({
      success: true,
      count: mechanicsWithDistance.length,
      searchLocation: {
        latitude: lat,
        longitude: lng,
      },
      radius: `${radius} km`,
      mechanics: mechanicsWithDistance,
    });
  } catch (error) {
    console.error(
      "Nearby mechanics error:",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while finding nearby mechanics",
    });
  }
};
export const updateMechanicLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
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

    mechanic.location = {
      type: "Point",
      coordinates: [Number(longitude), Number(latitude)],
    };

    await mechanic.save();

    res.status(200).json({
      success: true,
      message: "Mechanic location updated",
      location: mechanic.location,
    });
  } catch (error) {
    console.error("Update mechanic location error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating mechanic location",
    });
  }
};

export const updateMechanicServices = async (req, res) => {
  try {
    const { services } = req.body;

    if (!Array.isArray(services)) {
      return res.status(400).json({
        success: false,
        message: "Services must be provided as an array",
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

    mechanic.servicesOffered = services;

    await mechanic.save();

    const updatedMechanic = await Mechanic.findById(mechanic._id).populate(
      "servicesOffered",
      "name description basePrice estimatedDuration",
    );

    res.status(200).json({
      success: true,
      message: "Mechanic services updated successfully",
      mechanic: updatedMechanic,
    });
  } catch (error) {
    console.error("Update mechanic services error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating mechanic services",
    });
  }
};
