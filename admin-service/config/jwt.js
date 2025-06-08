import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN || "1h";

export const generateToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token) => {
  return jwt.verify(token, secret);
};
