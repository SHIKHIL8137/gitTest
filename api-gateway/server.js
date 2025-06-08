import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {
  adminProxy,
  projectProxy,
  userProxy,
  varificationProxy,
} from "./routes/proxyRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONDENDURL,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.use("/user", userProxy);
app.use("/admin", adminProxy);
app.use("/verification", varificationProxy);
app.use("/project", projectProxy);

app.listen(port, () => {
  console.log(`Gateway server running at port ${port}`);
});
