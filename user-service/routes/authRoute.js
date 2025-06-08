import express from "express";
import {
  checkUserName,
  loginValidate,
  otpgenerate,
  otpValidation,
  validateUser,
  getUserData,
  updateUser,
  updateProfileImage,
  forgetPassword,
  changePassword,
  updateFreelancerProfile,
  updateResume,
  deleteResume,
} from "../controllers/authController.js";
import { generateToken } from "../../shared/auth/config/jwt.js";
import passport from "passport";
import { jwtAuthMiddleware } from "../../shared/auth/middleWares/jwtTokenVerify.js";
import upload from "../../shared/auth/config/multer.js";
import fileUpload from "../../shared/auth/config/fileUpload.js";

const route = express.Router();

route.post("/otp", otpgenerate);
route.post("/checkUserName", checkUserName);
route.post("/validateOTP", otpValidation);
route.post("/validateUser", validateUser);
route.post("/loginValidate", loginValidate);
route.get("/auth/google", (req, res, next) => {
  const role = req.query.role || "client";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: role,
  })(req, res, next);
});

route.get("/auth/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (req.blockedUser) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/logIn?error=user_blocked`
      );
    }
    console.log(err, user);
    if (err || !user) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/signUp?error=auth_failed`
      );
    }

    const token = generateToken({
      userName: user.userName,
      userId: user._id,
      role: user.role,
      email: user.email,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000,
    });

    const role = user.redirectRole || "client";
    return res.redirect(
      `${process.env.FRONTEND_URL}/google-auth-redirect?role=${role}`
    );
  })(req, res, next);
});

route.get("/verify", jwtAuthMiddleware, getUserData);
route.patch("/update", jwtAuthMiddleware, updateUser);
route.post(
  "/upload-profileImg",
  jwtAuthMiddleware,
  upload.single("croppedImage"),
  updateProfileImage
);
route.post("/forgetPassword", forgetPassword);
route.patch("/validateUserChangPswd", changePassword);
route.patch("/updateFreelancer", jwtAuthMiddleware, updateFreelancerProfile);
route.patch(
  "/updateResume",
  jwtAuthMiddleware,
  fileUpload.single("resume"),
  updateResume
);
route.delete("/deleteResume", jwtAuthMiddleware, deleteResume);

export default route;
