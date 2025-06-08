import { axiosInstance } from "../config/api.js";

export const validateUserId = (formData) => {
  return axiosInstance.post("/user/verificationService/getUser", formData, {
    withCredentials: true,
  });
};
