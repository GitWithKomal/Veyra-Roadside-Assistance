import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Mechanic from "../models/Mechanic.js";

const assignServices = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    const mechanic = await Mechanic.findOne({
      businessName: "Test Auto Care",
    });

    if (!mechanic) {
      console.log("Test Auto Care mechanic not found");
      return;
    }

    mechanic.servicesOffered = [
      "6a8716b3003edc4992a1e2aa", // Breakdown Repair
      "6a8717d9003edc4992a1e2ac", // Battery Jump-Start
      "6a871800003edc4992a1e2ad", // Flat Tire Repair
      "6a871821003edc4992a1e2ae", // Fuel Delivery
    ];

    mechanic.pricing = [
      {
        service: "6a8716b3003edc4992a1e2aa",
        price: 500,
      },
      {
        service: "6a8717d9003edc4992a1e2ac",
        price: 300,
      },
      {
        service: "6a871800003edc4992a1e2ad",
        price: 350,
      },
      {
        service: "6a871821003edc4992a1e2ae",
        price: 400,
      },
    ];

    mechanic.isVerified = true;
    mechanic.isAvailable = true;

    await mechanic.save();

    console.log("Test Auto Care updated successfully");
    console.log({
      mechanicId: mechanic._id,
      businessName: mechanic.businessName,
      servicesOffered: mechanic.servicesOffered,
      pricing: mechanic.pricing,
      isVerified: mechanic.isVerified,
      isAvailable: mechanic.isAvailable,
    });
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

assignServices();
