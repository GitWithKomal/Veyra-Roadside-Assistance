import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = "admin@roadsideaaa.com";
    const password = "Admin@123";

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists:");
      console.log({
        name: existingAdmin.name,
        email: existingAdmin.email,
        role: existingAdmin.role,
      });

      await mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: "Roadside AAA Admin",
      email,
      phone: "9999999999",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      isActive: true,
    });

    console.log("Admin created successfully:");
    console.log({
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });

    console.log("Temporary password:", password);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Create admin error:", error.message);
    await mongoose.disconnect();
  }
};

createAdmin();