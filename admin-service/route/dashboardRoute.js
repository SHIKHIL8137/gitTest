import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";
const route = express.Router();

route.get("/dasboardData", getDashboardData);

export default route;
