import express from "express";
import {
  addAdmin,
  getAdminData,
  loginAdmin,
} from "../controllers/authController.js";
import { jwtAuthMiddleware } from "../middleware/jwtAuth.js";

const router = express.Router();

router.post("/add", addAdmin);
router.post("/login", loginAdmin);
router.get("/verify", jwtAuthMiddleware, getAdminData);

export default router;
