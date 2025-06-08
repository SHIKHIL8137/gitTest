import express from "express";
import {
  dashboardDetails,
  getFreelancersData,
  getClientsData,
  updateBlockStatus,
  getClientDatas,
  getClient,
} from "../controllers/adminServiceController.js";
const router = express.Router();

router.get("/adminDashDetails", dashboardDetails);
router.get("/freelancerDetails", getFreelancersData);
router.get("/clientDetails", getClientsData);
router.patch("/updataBlockStatus", updateBlockStatus);
router.post("/getClientData", getClientDatas);
router.get("/getClient", getClient);

export default router;
