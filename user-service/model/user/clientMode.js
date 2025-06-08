import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    googleId: { type: String },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    lastLogin: {
      type: Date,
    },
    password: { type: String },
    role: {
      type: String,
      required: true,
      default: "client",
    },
    phoneNumber: { type: Number },
    twitter: { type: String },
    linkedIn: { type: String },
    address: { type: String },
    web: { type: String },
    profileImage: { type: String },
    profileCoverImg: { type: String },
    projects: {
      type: [String],
      default: [],
    },
    companyName: { type: String },
    block: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
