import express from "express";
import { projects } from "../controllers/projectController.js";
const route = express.Router();

route.get("/projects", projects);

export default route;
