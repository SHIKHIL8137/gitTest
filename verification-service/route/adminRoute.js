import express from "express";
import { jwtAuthMiddleware } from "../../shared/auth/middleWares/jwtTokenVerify.js";
import {
  getClientRequest,
  getVerificationData,
  updateVerification,
} from "../controller/adminController.js";
const route = express.Router();

route.get("/getVerificationRequest", getVerificationData);
route.get("/getClientRequest", getClientRequest);
route.post("/updateVerification", updateVerification);

export default route;
