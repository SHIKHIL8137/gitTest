import express from "express";
import { projects } from "../controller/adminController.js";
const route = express();

route.get("/projects", projects);

export default route;
