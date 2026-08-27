import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

import mongoose from "mongoose";
import User from "../models/User.js";

const findMechanic = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const mechanic = await User.findOne({
      phone: "9876543211",
    }).select("name email phone role isActive isVerified");

    console.log("Mechanic user:");
    console.log(mechanic);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
    await mongoose.disconnect();
  }
};

findMechanic();
