import express from "express";
import { blockUser } from "../controllers/commonController.js";
const route = express.Router();

route.patch("/blockUser", blockUser);

export default route;
