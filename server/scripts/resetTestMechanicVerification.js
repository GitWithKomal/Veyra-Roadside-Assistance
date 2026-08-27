import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

import mongoose from "mongoose";
import Mechanic from "../models/Mechanic.js";

const reset = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const mechanic = await Mechanic.findOneAndUpdate(
      { businessName: "Test Auto Care" },
      { isVerified: false },
      { new: true }
    );

    if (!mechanic) {
      console.log("Test mechanic profile not found");
      return;
    }

    console.log("Test mechanic verification reset:");
    console.log({
      id: mechanic._id,
      businessName: mechanic.businessName,
      isVerified: mechanic.isVerified,
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
    await mongoose.disconnect();
  }
};

reset();
