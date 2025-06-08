import express from "express";
import {
  clientHomeData,
  freelancerProfile,
  freelancersDataHome,
} from "../controllers/commonRoute.js";
import { jwtAuthMiddleware } from "../../shared/auth/middleWares/jwtTokenVerify.js";
const route = express();

route.get("/clinetHome", clientHomeData);
route.get("/freelancerProfile", jwtAuthMiddleware, freelancerProfile);
route.get('/freelancersDataHome',freelancersDataHome);

export default route;
