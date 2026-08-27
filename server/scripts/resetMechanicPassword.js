import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const hashedPassword = await bcrypt.hash(
      "Mechanic@123",
      10
    );

    const user = await User.findOneAndUpdate(
      { email: "komal@test.com" },
      { password: hashedPassword },
      { new: true }
    ).select("name email phone role");

    if (!user) {
      console.log("Mechanic user not found");
      return;
    }

    console.log("Password reset successfully:");
    console.log(user);
    console.log("Temporary password: Mechanic@123");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
    await mongoose.disconnect();
  }
};

resetPassword();