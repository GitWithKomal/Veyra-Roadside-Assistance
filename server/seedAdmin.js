import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "./models/User.js";

const seedAdmin = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const existingAdmin = await User.findOne({
      email: "admin@roadsideaaa.com",
    });

    if (existingAdmin) {
      const hashedPassword = await bcrypt.hash("Admin@12345", 10);

      existingAdmin.password = hashedPassword;
      existingAdmin.role = "admin";
      existingAdmin.isVerified = true;
      existingAdmin.isActive = true;

      await existingAdmin.save();

      await mongoose.disconnect();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@12345", 10);

    await User.create({
      name: "Roadside AAA Admin",
      email: "admin@roadsideaaa.com",
      phone: "9999999999",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      isActive: true,
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Admin creation failed:", error.message);

    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAdmin();
