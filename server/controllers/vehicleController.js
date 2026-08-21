import Vehicle from "../models/Vehicle.js";

export const addVehicle = async (req, res) => {
  try {
    const {
      registrationNumber,
      make,
      model,
      year,
      vehicleType,
      fuelType,
      color,
    } = req.body;

    if (
      !registrationNumber ||
      !make ||
      !model ||
      !year ||
      !vehicleType ||
      !fuelType
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required vehicle details",
      });
    }

    const existingVehicle = await Vehicle.findOne({
      registrationNumber: registrationNumber.toUpperCase(),
    });

    if (existingVehicle) {
      return res.status(409).json({
        success: false,
        message: "Vehicle with this registration number already exists",
      });
    }

    const vehicle = await Vehicle.create({
      owner: req.user._id,
      registrationNumber,
      make,
      model,
      year,
      vehicleType,
      fuelType,
      color,
    });

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      vehicle,
    });
  } catch (error) {
    console.error("Add vehicle error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while adding vehicle",
    });
  }
};

export const getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    console.error("Get vehicles error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching vehicles",
    });
  }
};