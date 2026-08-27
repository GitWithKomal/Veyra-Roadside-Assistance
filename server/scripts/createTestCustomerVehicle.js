import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

import mongoose from "mongoose";
import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";

const createTestCustomerVehicle = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    const customer = await User.findOne({
      email: "customer@test.com",
      role: "user",
    });

    if (!customer) {
      console.log("Test Customer not found");
      await mongoose.disconnect();
      return;
    }

    console.log("Customer found:");
    console.log({
      id: customer._id,
      name: customer.name,
      email: customer.email,
      role: customer.role,
    });

    const existingVehicle = await Vehicle.findOne({
      owner: customer._id,
    });

    if (existingVehicle) {
      console.log("Customer already has a vehicle:");
      console.log(existingVehicle);
      await mongoose.disconnect();
      return;
    }

    const vehicle = await Vehicle.create({
      owner: customer._id,
      registrationNumber: "MH31TC1234",
      make: "Maruti",
      model: "Swift",
      year: 2022,
      vehicleType: "car",
      fuelType: "petrol",
      color: "White",
    });

    console.log("Test customer vehicle created successfully:");
    console.log(vehicle);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);

    if (mongoose.connection.readyState) {
      await mongoose.disconnect();
    }
  }
};

createTestCustomerVehicle();
