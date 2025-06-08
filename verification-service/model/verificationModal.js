import mongoose from "mongoose";

const verificationRequestSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "verified", "rejected", "incomplete"],
    default: "incomplete",
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  verificationDate: {
    type: Date,
    default: null,
  },
  message: {
    type: String,
    default: "",
  },
});

const VerificationRequest = mongoose.model(
  "VerificationRequest",
  verificationRequestSchema
);

export default VerificationRequest;
