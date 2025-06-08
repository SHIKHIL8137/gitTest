import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import projectRoute from "./route/projectRoute.js";
import adminRoute from "./route/adminRoute.js";
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

app.use("/", projectRoute);
app.use("/adminService", adminRoute);

connectDB();

app.listen(port, () => {
  console.log(`server run at port ${port}`);
});
