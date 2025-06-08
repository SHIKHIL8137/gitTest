import { axiosInstance } from "../config/api.js";

export const fetchProjects = (page, prefix) => {
  return axiosInstance.get(
    `/project/adminService/projects?page=${page}&search=${prefix}`,
    { withCredentials: true }
  );
};
