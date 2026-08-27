import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = await User.findOneAndUpdate(
      { email: "admin@roadsideaaa.com" },
      {
        password: hashedPassword,
        role: "admin",
        isActive: true,
        isVerified: true,
      },
      { new: true }
    ).select("name email role isActive isVerified");

    if (!admin) {
      console.log("Admin not found");
      await mongoose.disconnect();
      return;
    }

    console.log("Admin password reset successfully:");
    console.log(admin);
    console.log("Temporary password: Admin@123");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Reset admin password error:", error.message);
    await mongoose.disconnect();
  }
};

resetAdminPassword();