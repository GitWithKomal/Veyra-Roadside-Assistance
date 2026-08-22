import User from "../models/User.js";
import Mechanic from "../models/Mechanic.js";

export const createMechanicProfile = async (req, res) => {
  try {
    const {
      businessName,
      description,
      experience,
      servicesOffered,
      pricing,
    } = req.body;

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
      message:
        "Mechanic profile created. Waiting for admin verification.",
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
      .populate("servicesOffered", "name basePrice estimatedDuration");

    res.status(200).json({
      success: true,
      count: mechanics.length,
      searchLocation: {
        latitude: lat,
        longitude: lng,
      },
      radius: `${radius} km`,
      mechanics,
    });
  } catch (error) {
    console.error("Nearby mechanics error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while finding nearby mechanics",
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

    const updatedMechanic = await Mechanic.findById(
      mechanic._id
    ).populate(
      "servicesOffered",
      "name description basePrice estimatedDuration"
    );

    res.status(200).json({
      success: true,
      message: "Mechanic services updated successfully",
      mechanic: updatedMechanic,
    });
  } catch (error) {
    console.error(
      "Update mechanic services error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while updating mechanic services",
    });
  }
};