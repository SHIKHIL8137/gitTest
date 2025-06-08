import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  freelancerId: {
    type: String,
    required: true,
  },
  freelancerName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["applied", "rejected", "hired"],
    default: "applied",
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    features: {
      type: String,
      default: "",
    },

    preferences: {
      type: String,
      default: "",
    },

    timeline: {
      type: Number,
      required: true,
    },

    budget: {
      type: Number,
      required: true,
    },

    referralLink: {
      type: String,
      default: "",
    },

    attachments: {
      type: [String],
      default: [],
    },

    appliedUsers: {
      type: [applicationSchema],
      default: [],
    },

    completionStatus: {
      type: String,
      enum: ["open", "committed", "completed", "cancelled"],
      default: "open",
    },
    clientId: {
      type: String,
    },
    freelancerId: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
