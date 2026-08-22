import Mechanic from "../models/Mechanic.js";

export const getPendingMechanics = async (req, res) => {
  try {
    const mechanics = await Mechanic.find({
      isVerified: false,
    })
      .populate("user", "-password")
      .populate("servicesOffered");

    res.status(200).json({
      success: true,
      count: mechanics.length,
      mechanics,
    });
  } catch (error) {
    console.error("Get pending mechanics error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching pending mechanics",
    });
  }
};

export const verifyMechanic = async (req, res) => {
  try {
    const { mechanicId } = req.params;

    const mechanic = await Mechanic.findById(mechanicId);

    if (!mechanic) {
      return res.status(404).json({
        success: false,
        message: "Mechanic not found",
      });
    }

    mechanic.isVerified = true;

    await mechanic.save();

    res.status(200).json({
      success: true,
      message: "Mechanic verified successfully",
      mechanic,
    });
  } catch (error) {
    console.error("Verify mechanic error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while verifying mechanic",
    });
  }
};