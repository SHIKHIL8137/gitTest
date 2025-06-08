import { transporter } from "../config/nodeMailer.js";
import { generateOTP, generateUserId } from "../util/reuseFunctions.js";
import { generateToken } from "../../shared/auth/config/jwt.js";
import OTP from "../model/otpModel.js";
import Freelancer from "../model/user/freelancerModel.js";
import Client from "../model/user/clientMode.js";
import { compare, hash } from "bcrypt";
import moment from "moment";
import { isValidEmail } from "../util/validation.js";
import { validateProfileUpdate } from "../util/validateForm.js";

export const otpgenerate = async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!role)
      return res
        .status(400)
        .json({ status: false, message: "Role missing!!!" });

    if (!email)
      return res
        .status(400)
        .json({ status: false, message: "Email missing!!!" });

    let emailExist;
    if (role === "freelancer") {
      emailExist = await Freelancer.findOne({ email });
    } else if (role === "client") {
      emailExist = await Client.findOne({ email });
    } else {
      return res.status(400).json({ status: false, message: "Invalid role!" });
    }

    if (emailExist) {
      return res
        .status(409)
        .json({ status: false, message: "Email already exist" });
    }

    let otp = generateOTP();

    const mailOptions = {
      from: "devconnect916@gmail.com",
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${otp}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Code</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #4285F4;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .header h1 {
              color: white;
              margin: 0;
              font-size: 24px;
            }
            .content {
              background-color: #ffffff;
              padding: 30px;
              border: 1px solid #e0e0e0;
              border-top: none;
              border-radius: 0 0 5px 5px;
            }
            .code-container {
              background-color: #f5f5f5;
              border: 1px dashed #d0d0d0;
              border-radius: 4px;
              padding: 15px;
              margin: 25px 0;
              text-align: center;
            }
            .verification-code {
              font-size: 32px;
              font-weight: bold;
              color: #4285F4;
              letter-spacing: 5px;
            }
            .expiry {
              margin-top: 20px;
              font-size: 14px;
              color: #777777;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #999999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verification Code</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Please use the following verification code to complete your request:</p>
              
              <div class="code-container">
                <div class="verification-code">${otp}</div>
              </div>
              
              <p>If you didn't request this code, please ignore this email.</p>
              <p>The verification code will expire in 10 minutes.</p>
              
              <div class="expiry">
                <p>This is an automated message, please do not reply to this email.</p>
              </div>
              
              <div class="footer">
                <p>&copy; 2025 DevConnect. All rights reserved.</p>
                <p>Irinnjalakuda, Thrissur, india</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({
          status: false,
          message: "An error occures sending the mail",
        });
      }
      console.log("Email sent", info.response);
    });

    const existUserOTP = await OTP.findOne({ email: email });
    if (existUserOTP) {
      await OTP.deleteMany({ email: email });
    }
    const expiration = moment().add(10, "minutes").toDate();
    const newOtp = new OTP({
      email,
      otp,
      expiration,
    });
    await newOtp.save();
    res
      .status(200)
      .json({ status: true, message: "OTP sented given Mail", otp, email });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export const checkUserName = async (req, res) => {
  try {
    const { userName: prefix } = req.body;

    if (!prefix) {
      return res
        .status(400)
        .json({ status: false, message: "Username missing!" });
    }

    const freelancerExists = await Freelancer.findOne({
      userName: { $regex: `^${prefix}`, $options: "i" },
    });

    const clientExists = await Client.findOne({
      userName: { $regex: `^${prefix}`, $options: "i" },
    });

    if (freelancerExists || clientExists) {
      return res
        .status(400)
        .json({ status: false, message: "Username already taken" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Username available" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

export const otpValidation = async (req, res) => {
  try {
    const { otp, email } = req.body;
    console.log(otp, email);

    if (otp.trim() === "")
      return res.status(400).json({ status: false, message: "OTP missing" });

    if (!email.trim())
      return res.status(400).json({ status: false, message: "email required" });

    const findOTP = await OTP.findOne({ email });
    if (!findOTP)
      return res.status(400).json({ status: false, message: "OTP Expired" });

    if (otp !== findOTP.otp)
      return res.status(400).json({ status: false, message: "OTP Not Match" });

    res.status(200).json({ status: true, message: "OTP validated", otp });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

export const validateUser = async (req, res) => {
  try {
    const { otp, userName, email, password, role } = req.body;

    if (
      !otp?.trim() ||
      !userName?.trim() ||
      !email?.trim() ||
      !password?.trim() ||
      !role?.trim()
    ) {
      return res
        .status(400)
        .json({ status: false, message: "Fields are missing" });
    }

    const userExistsInFreelancer = await Freelancer.findOne({
      $or: [{ userName }, { email }],
    });

    const userExistsInClient = await Client.findOne({
      $or: [{ userName }, { email }],
    });

    if (userExistsInFreelancer || userExistsInClient) {
      return res.status(409).json({
        status: false,
        message: "Username or email already taken. Try again.",
      });
    }
    const otpDB = await OTP.findOne({ email: email });
    if (!otpDB.otp || otpDB.otp !== otp) {
      return res
        .status(400)
        .json({ status: false, message: "OTP expired or incorrect" });
    }

    const hashedPassword = await hash(password, 10);
    const userId = generateUserId();

    const newUserData = {
      userId,
      userName,
      email,
      password: hashedPassword,
      role,
    };

    if (role === "freelancer") {
      const newFreelancer = new Freelancer(newUserData);
      await newFreelancer.save();
    } else if (role === "client") {
      const newClient = new Client(newUserData);
      await newClient.save();
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Invalid role provided" });
    }

    await OTP.findOneAndDelete({ email });
    return res
      .status(201)
      .json({ status: true, message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

export const loginValidate = async (req, res) => {
  try {
    const { userData, password } = req.body;
    console.log(req.body);
    if (!userData || !password) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });
    }

    const query = isValidEmail(userData.trim())
      ? { email: userData.trim() }
      : { userName: userData.trim() };

    let userExist = await Freelancer.findOne(query);
    if (!userExist) userExist = await Client.findOne(query);

    if (!userExist)
      return res.status(404).json({ status: false, message: "User not Found" });

    if (userExist.block)
      return res
        .status(404)
        .json({ status: false, message: "User blocked by admin" });
    if (!userExist.password && userExist.googleId) {
      return res.status(400).json({
        status: false,
        message:
          "This account uses Google Sign-In. Please log in using Google.",
      });
    }

    if (!userExist.password) {
      return res
        .status(400)
        .json({ status: false, message: "Password not set for this user" });
    }

    const passwordMatch = await compare(password, userExist.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Password mismatch" });
    }

    const token = generateToken({
      userName: userExist.userName,
      userId: userExist._id,
      role: userExist.role,
      email: userExist.email,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
    });
    userExist.lastLogin = new Date();
    await userExist.save();
    res.status(200).json({ status: true, message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const getUserData = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const Model = role === "freelancer" ? Freelancer : Client;
    const user = await Model.findById(userId).select("-password");

    if (!user) return res.status(401).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    console.log("data", req.body);
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    if (!userId) {
      return res.status(401).json({
        status: false,
        message: "Authentication required",
      });
    }

    const Model = userRole === "freelancer" ? Freelancer : Client;

    const user = await Model.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const { errors, isValid, validData } = validateProfileUpdate(
      req.body,
      userRole
    );
    if (!isValid) {
      console.log(errors);
      return res.status(400).json({ status: false, errors });
    }

    const fieldMap = {
      userName: "userName",
      phoneNumber: "phoneNumber",
      position: "position",
      skills: "skills",
      gitHub: "gitHub",
      linkedIn: "linkedIn",
      email: "email",
      about: "about",
      twitter: "twitter",
      web: "web",
      address: "address",
      pricePerHour: "pricePerHour",
      companyName: "companyName",
      experienceLevel: "experienceLevel",
    };

    const mappedData = {};
    for (const [key, value] of Object.entries(validData)) {
      const schemaField = fieldMap[key] || key;
      mappedData[schemaField] = value;
    }
    console.log(mappedData);

    const allowedFields = {
      freelancer: [
        "userName",
        "position",
        "email",
        "skills",
        "phoneNumber",
        "about",
        "pricePerHour",
        "gitHub",
        "linkedIn",
        "twitter",
        "web",
        "address",
        "experienceLevel",
      ],
      client: [
        "userName",
        "companyName",
        "email",
        "phoneNumber",
        "about",
        "address",
        "linkedIn",
        "twitter",
        "web",
      ],
    };

    if (!allowedFields[userRole]) {
      return res.status(403).json({
        status: false,
        message: "Invalid user role",
      });
    }

    const filteredData = {};
    for (const key of allowedFields[userRole]) {
      if (mappedData[key] !== undefined) {
        filteredData[key] = mappedData[key];
      }
    }

    console.log(filteredData);
    await Model.findByIdAndUpdate(
      userId,
      { $set: filteredData },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      status: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating profile",
      error: error.message,
    });
  }
};

export const updateResume = async (req, res) => {
  try {
    const { userId } = req.user;
    const resumePath = req.file?.path;
    if (!resumePath) {
      return res.status(400).json({ message: "No resume uploaded" });
    }
    const updatedFreelancer = await Freelancer.findByIdAndUpdate(
      userId,
      { resume: resumePath },
      { new: true }
    );
    if (!updatedFreelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }
    res.status(200).json({
      message: "Resume updated",
      status: true,
    });
  } catch (error) {
    console.error("Resume update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateFreelancerProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;
    if (!userId || role !== "freelancer") {
      return res.status(401).json({
        status: false,
        message: "Unauthorized or invalid role",
      });
    }

    const allowedFields = ["skills", "position", "about", "pricePerHour"];
    const updateData = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: false,
        message: "No valid fields provided to update",
      });
    }

    await Freelancer.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      status: true,
      message: "Freelancer profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating freelancer profile:", error);
    return res.status(500).json({
      status: false,
      message: "Server error while updating profile",
      error: error.message,
    });
  }
};

export const updateProfileImage = async (req, res) => {
  try {
    const type = req.query.type;
    const userId = req.user.userId;
    const userRole = req.user?.role;
    const profileImageUrl = req.file.path;
    if (!req.file)
      return res
        .status(400)
        .json({ status: false, message: "No file uploaded" });

    if (!userId)
      return res.status(401).json({ status: false, message: "User not found" });

    const Model = userRole === "freelancer" ? Freelancer : Client;

    if (type === "cover") {
      await Model.findByIdAndUpdate(
        userId,
        { profileCoverImg: profileImageUrl },
        { new: true, upsert: true }
      );
    } else if (type === "profile") {
      await Model.findByIdAndUpdate(
        userId,
        { profileImage: profileImageUrl },
        { new: true, upsert: true }
      );
    } else {
      return res
        .status(404)
        .json({ status: false, messgae: "image Type missing" });
    }

    res
      .status(200)
      .json({ status: true, message: "Profile image uploaded successfully" });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ status: false, message: "email missing!!!" });

    const freelancer = await Freelancer.findOne({ email: email });

    const client = await Client.findOne({ email: email });

    if (!freelancer && !client) {
      return res
        .status(409)
        .json({ status: false, message: "User does not exist" });
    }

    let userModel;
    let user;

    if (freelancer) {
      userModel = Freelancer;
      user = freelancer;
    } else if (client) {
      userModel = Client;
      user = client;
    }

    let otp = generateOTP();

    const mailOptions = {
      from: "devconnect916@gmail.com",
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${otp}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Code</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #4285F4;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .header h1 {
              color: white;
              margin: 0;
              font-size: 24px;
            }
            .content {
              background-color: #ffffff;
              padding: 30px;
              border: 1px solid #e0e0e0;
              border-top: none;
              border-radius: 0 0 5px 5px;
            }
            .code-container {
              background-color: #f5f5f5;
              border: 1px dashed #d0d0d0;
              border-radius: 4px;
              padding: 15px;
              margin: 25px 0;
              text-align: center;
            }
            .verification-code {
              font-size: 32px;
              font-weight: bold;
              color: #4285F4;
              letter-spacing: 5px;
            }
            .expiry {
              margin-top: 20px;
              font-size: 14px;
              color: #777777;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #999999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verification Code</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Please use the following verification code to complete your request:</p>
              
              <div class="code-container">
                <div class="verification-code">${otp}</div>
              </div>
              
              <p>If you didn't request this code, please ignore this email.</p>
              <p>The verification code will expire in 10 minutes.</p>
              
              <div class="expiry">
                <p>This is an automated message, please do not reply to this email.</p>
              </div>
              
              <div class="footer">
                <p>&copy; 2025 DevConnect. All rights reserved.</p>
                <p>Irinnjalakuda, Thrissur, india</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({
          status: false,
          message: "An error occures sending the mail",
        });
      }
      console.log("Email sent", info.response);
    });

    const existUserOTP = await OTP.findOne({ email: email });
    if (existUserOTP) {
      await OTP.deleteMany({ email: email });
    }
    const expiration = moment().add(10, "minutes").toDate();
    const newOtp = new OTP({
      email,
      otp,
      expiration,
    });
    await newOtp.save();
    res
      .status(200)
      .json({ status: true, message: "OTP sented given Mail", otp, email });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export const changePassword = async (req, res) => {
  try {
    const { otp, email, password } = req.body;
    if (!otp?.trim() || !email?.trim() || !password?.trim()) {
      return res
        .status(400)
        .json({ status: false, message: "Fields are missing" });
    }
    const freelancer = await Freelancer.findOne({ email });
    const client = await Client.findOne({ email });

    let userModel;
    if (freelancer) {
      userModel = Freelancer;
    } else if (client) {
      userModel = Client;
    } else {
      return res
        .status(404)
        .json({ status: false, message: "Email does not exist. Try again." });
    }

    const otpDB = await OTP.findOne({ email });

    if (!otpDB || !otpDB.otp || otpDB.otp !== otp) {
      return res
        .status(400)
        .json({ status: false, message: "OTP expired or incorrect" });
    }

    const hashedPassword = await hash(password, 10);
    await userModel.findOneAndUpdate({ email }, { password: hashedPassword });
    await OTP.findOneAndDelete({ email });
    return res
      .status(200)
      .json({ status: true, message: "Password Changed successFully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const { userId } = req.user;

    const updatedFreelancer = await Freelancer.findByIdAndUpdate(
      userId,
      { resume: "" },
      { new: true }
    );

    if (!updatedFreelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    return res.status(200).json({
      message: "Resume field cleared successfully",
      status: true,
    });
  } catch (error) {
    console.error("Error clearing resume field:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
