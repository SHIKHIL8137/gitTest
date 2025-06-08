import express from "express";
import { jwtAuthMiddleware } from "../../shared/auth/middleWares/jwtTokenVerify.js";
import { updateProjectUser } from "../controllers/projectServiceController.js";
const route = express.Router();

route.patch("/projectUpdatesUser", jwtAuthMiddleware, updateProjectUser);

export default route;
