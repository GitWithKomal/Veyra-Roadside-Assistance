import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

import mongoose from "mongoose";
import ServiceRequest from "../models/ServiceRequest.js";
import User from "../models/User.js";
import Mechanic from "../models/Mechanic.js";
import Service from "../models/Service.js";
import Vehicle from "../models/Vehicle.js";

const checkRequests = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const requests = await ServiceRequest.find({})
      .populate("customer", "name email phone")
      .populate("mechanic", "businessName user")
      .populate("service", "name basePrice")
      .populate("vehicle");

    console.log("\nSERVICE REQUESTS:");
    requests.forEach((r) => console.log({ id: r._id.toString(), mechanic: r.mechanic?.businessName, mechanicId: r.mechanic?._id?.toString(), customer: r.customer?.name, vehicle: r.vehicle ? `${r.vehicle.make} ${r.vehicle.model}` : "NO VEHICLE", status: r.status }));

    console.log("\nCount:", requests.length);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
    await mongoose.disconnect();
  }
};

checkRequests();
