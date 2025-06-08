import mongoose from "mongoose";

const freelancerSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    googleId: { type: String },
    position: { type: String },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      required: true,
      default: "freelancer",
    },
    phoneNumber: { type: Number },
    twitter: { type: String },
    linkedIn: { type: String },
    address: { type: String },
    web: { type: String },
    profileImage: { type: String },
    profileCoverImg: { type: String },
    skills: {
      type: [String],
      default: [],
    },
    about: { type: String },
    gitHub: { type: String },
    pricePerHour: { type: Number },
    projects: {
      type: [String],
      default: [],
    },
    reviews: {
      type: [String],
      default: [],
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "intermediate", "expert"],
    },
    resume: {
      type: String,
      default: "",
    },
    block: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Freelancer", freelancerSchema);
