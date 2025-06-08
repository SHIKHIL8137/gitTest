import express from "express";
import {
  getClientsData,
  getClientVerificationDetails,
  getVerificationTableData,
  verifyOrRejectUser,
} from "../controllers/clientController.js";
const route = express.Router();

route.get("/clientData", getClientsData);
route.get("/verificationData", getVerificationTableData);
route.get("/clientVerificationData", getClientVerificationDetails);
route.post("/verifyOrRejectUser", verifyOrRejectUser);

export default route;
