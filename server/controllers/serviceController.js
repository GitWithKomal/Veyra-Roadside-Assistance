import Service from "../models/Service.js";

export const getServices = async (req, res) => {
  try {
    const services = await Service.find({
      isActive: true,
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Get services error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching services",
    });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, description, basePrice, estimatedDuration } = req.body;

    if (!name || !description || basePrice === undefined || !estimatedDuration) {
      return res.status(400).json({
        success: false,
        message: "Please provide all service details",
      });
    }

    const existingService = await Service.findOne({ name });

    if (existingService) {
      return res.status(409).json({
        success: false,
        message: "Service already exists",
      });
    }

    const service = await Service.create({
      name,
      description,
      basePrice,
      estimatedDuration,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Create service error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating service",
    });
  }
};