import express from "express";
import {
  addProject,
  applyToProject,
  deleteAttachment,
  editProject,
  freelancerHome,
  getProjectOfUser,
  projectDataFetch,
  projectDetails,
  projectsDataHome,
} from "../controller/projectController.js";
import fileUpload from "../../shared/auth/config/fileUpload.js";
import { jwtAuthMiddleware } from "../../shared/auth/middleWares/jwtTokenVerify.js";
const route = express();

route.post(
  "/addProject",
  jwtAuthMiddleware,
  fileUpload.array("attachments", 5),
  addProject
);
route.get("/getProjectOfUser", jwtAuthMiddleware, getProjectOfUser);
route.get("/projectDetails", jwtAuthMiddleware, projectDetails);
route.get("/freelancerHome", freelancerHome);
route.post("/apply", jwtAuthMiddleware, applyToProject);
route.get("/projectDataFetch", jwtAuthMiddleware, projectDataFetch);
route.patch(
  "/editProject",
  jwtAuthMiddleware,
  fileUpload.array("attachments", 5),
  editProject
);
route.delete("/deleteAttachment", jwtAuthMiddleware, deleteAttachment);
route.get('/projectsDataHome',projectsDataHome);
export default route;
