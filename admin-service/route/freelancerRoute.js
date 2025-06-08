import express from "express";
import { getFreelancersData } from "../controllers/freelancerController.js";
const route = express.Router();

route.get("/freelacerData", getFreelancersData);

export default route;
