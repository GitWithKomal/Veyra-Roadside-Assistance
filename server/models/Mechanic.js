import mongoose from "mongoose";

const mechanicSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    servicesOffered: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],

    pricing: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalJobs: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

mechanicSchema.index({ location: "2dsphere" });

const Mechanic = mongoose.model("Mechanic", mechanicSchema);

export default Mechanic;