export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const generateUserId = () => {
  const prefix = "USER";
  const randomString = Math.random().toString(36).slice(2, 8).toUpperCase();
  return prefix + randomString;
};
