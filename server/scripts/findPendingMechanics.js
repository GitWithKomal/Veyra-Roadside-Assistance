import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

import mongoose from "mongoose";
import Mechanic from "../models/Mechanic.js";

const findPendingMechanics = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    const mechanics = await Mechanic.find({
      isVerified: false,
    }).populate("user", "name email phone role");

    console.log("Pending mechanics:");
    console.dir(mechanics, { depth: null });

    console.log("Count:", mechanics.length);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
    await mongoose.disconnect();
  }
};

findPendingMechanics();