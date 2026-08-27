import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

import mongoose from "mongoose";
import Mechanic from "../models/Mechanic.js";
import User from "../models/User.js";

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const user = await User.findOne({
      email: "mechanic2@test.com",
    });

    console.log("USER:");
    console.log(user);

    if (user) {
      const mechanic = await Mechanic.findOne({
        user: user._id,
      });

      console.log("\nMECHANIC PROFILE:");
      console.log(mechanic);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
    await mongoose.disconnect();
  }
};

check();
