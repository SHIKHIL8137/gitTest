import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
