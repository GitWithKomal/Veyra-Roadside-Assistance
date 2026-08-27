import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

import mongoose from "mongoose";
import Mechanic from "../models/Mechanic.js";

const findMechanicProfile = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const mechanic = await Mechanic.findOne({
      businessName: "Komal Car Care",
    });

    console.log("Mechanic profile:");
    console.log(mechanic);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
    await mongoose.disconnect();
  }
};

findMechanicProfile();