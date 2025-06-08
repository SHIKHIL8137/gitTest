import { axiosInstance } from "../config/apis.js";

export const projectAppliedUser = (formData, token) => {
  const headers = token
    ? {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    : {
        "Content-Type": "application/json",
      };
  return axiosInstance.patch(
    `/user/projectService/projectUpdatesUser`,
    formData,
    { headers, withCredentials: true }
  );
};
