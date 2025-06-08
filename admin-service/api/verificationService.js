import { axiosInstance } from "../config/api.js";

export const verificationRequestData = (skip, limit) => {
  return axiosInstance.get(
    `/verification/adminService/getVerificationRequest?skip=${skip}&limit=${limit}`,
    { withCredentials: true }
  );
};

export const fetchVerificationRequest = (id) => {
  return axiosInstance.get(
    `/verification/adminService/getClientRequest?id=${id}`,
    { withCredentials: true }
  );
};

export const updateVerification = (fromData) => {
  return axiosInstance.post(
    `/verification/adminService/updateVerification`,
    fromData,
    { withCredentials: true }
  );
};
