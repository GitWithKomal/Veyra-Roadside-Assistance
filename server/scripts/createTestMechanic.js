import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Mechanic from "../models/Mechanic.js";

const createTestMechanic = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    const email = "mechanic2@test.com";

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("Test mechanic user already exists:");
      console.log(existingUser);
      await mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash(
      "Mechanic@123",
      10
    );

    const user = await User.create({
      name: "Test Mechanic",
      email,
      phone: "9876543211",
      password: hashedPassword,
      role: "mechanic",
      isVerified: false,
      isActive: true,
    });

    const mechanic = await Mechanic.create({
      user: user._id,
      businessName: "Test Auto Care",
      description: "Test mechanic for admin verification",
      experience: 3,
      servicesOffered: [],
      pricing: [],
      location: {
        type: "Point",
        coordinates: [79.1315, 21.09],
      },
      isAvailable: true,
      isVerified: false,
      rating: 0,
      totalJobs: 0,
    });

    console.log("Test mechanic created successfully:");

    console.log({
      userId: user._id,
      mechanicId: mechanic._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      userVerified: user.isVerified,
      mechanicVerified: mechanic.isVerified,
    });

    console.log("Temporary password: Mechanic@123");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
    await mongoose.disconnect();
  }
};

createTestMechanic();