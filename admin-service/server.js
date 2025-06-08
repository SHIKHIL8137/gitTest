import express from "express";
import dotenv from "dotenv";
import authRoute from "./route/authRoute.js";
import dashbordRoute from "./route/dashboardRoute.js";
import freelancerRoute from "./route/freelancerRoute.js";
import clientRoute from "./route/clientRoute.js";
import cors from "cors";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import commonRoute from "./route/commonRoute.js";
import projectRoute from "./route/projectRoute.js";
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", authRoute);
app.use("/dashboard", dashbordRoute);
app.use("/freelancer", freelancerRoute);
app.use("/client", clientRoute);
app.use("/common", commonRoute);
app.use("/project", projectRoute);

connectDB();
app.listen(port, () => {
  console.log(`User service running at port ${port}`);
});
