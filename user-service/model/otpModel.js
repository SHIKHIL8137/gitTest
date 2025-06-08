import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
    maxlength: 6,
  },
  expiration: {
    type: Date,
    required: true,
    maxlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600,
  },
});

otpSchema.index({ email: 1, createdAt: -1 });

export default mongoose.model("OTP", otpSchema);
