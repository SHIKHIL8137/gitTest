import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import passport from "./config/passport.js";
import { connectDB } from "./config/db.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import adminServiceRoute from "./routes/adminRoute.js";
import verificationServiceRoute from "./routes/verificationRoute.js";
import commonRoute from "./routes/commonRoute.js";
import projectRoute from "./routes/projectRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.FRONDENDURL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "hello123",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 60000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRoute);
app.use("/adminService", adminServiceRoute);
app.use("/verificationService", verificationServiceRoute);
app.use("/commonData",commonRoute);
app.use("/projectService", projectRoute);

connectDB();

app.listen(port, () => {
  console.log(`User service running at port ${port}`);
});
