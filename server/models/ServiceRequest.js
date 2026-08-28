import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    mechanic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mechanic",
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: false,
    },

    pickupLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "on_the_way",
        "arrived",
        "in_progress",
        "completed",
        "cancelled",
        "rejected",
      ],
      default: "pending",
    },

    estimatedPrice: {
  type: Number,
  min: 0,
},

notes: {
  type: String,
  trim: true,
  maxlength: 500,
},

rating: {
  type: Number,
  min: 1,
  max: 5,
},

review: {
  type: String,
  trim: true,
  maxlength: 500,
},
  },

  {
    timestamps: true,
  },
);

serviceRequestSchema.index({
  pickupLocation: "2dsphere",
});

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);

export default ServiceRequest;
