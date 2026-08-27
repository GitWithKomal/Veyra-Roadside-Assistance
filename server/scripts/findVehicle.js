import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

import mongoose from "mongoose";
import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";

const findVehicle = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    const vehicle = await Vehicle.findOne({
      registrationNumber: "MH31AB1234",
    }).populate("owner", "name email role");

    if (!vehicle) {
      console.log("Vehicle not found");
    } else {
      console.log("Vehicle found:");
      console.log(vehicle);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);

    if (mongoose.connection.readyState) {
      await mongoose.disconnect();
    }
  }
};

findVehicle();