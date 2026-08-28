import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    const newPassword = "Test@123";

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findOneAndUpdate(
      { email: "mechanic2@test.com" },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      console.log("❌ User not found");
      return;
    }

    console.log("✅ Password reset successfully!");
    console.log("Email:", user.email);
    console.log("New password:", newPassword);
  } catch (error) {
    console.error("❌ Password reset error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

resetPassword();