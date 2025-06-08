import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import profileVerificationRoute from "./route/profileVerification.js";
import adminServiceRoute from "./route/adminRoute.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: process.env.FRONDENDURL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", profileVerificationRoute);
app.use("/adminService", adminServiceRoute);

connectDB();

app.listen(port, () => {
  console.log(`server run at port ${port}`);
});
