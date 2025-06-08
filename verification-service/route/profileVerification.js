import express from "express";
import {
  getUserVerifyData,
  verificationRequest,
} from "../controller/profileVerficationController.js";
import { jwtAuthMiddleware } from "../../shared/auth/middleWares/jwtTokenVerify.js";
const route = express.Router();

route.post("/request", jwtAuthMiddleware, verificationRequest);
route.get("/getClientData", jwtAuthMiddleware, getUserVerifyData);

export default route;
