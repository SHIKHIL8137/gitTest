import bcrypt from "bcryptjs";
import { Admin } from "../model/adminModal.js";
import { generateToken } from "../config/jwt.js";

export const addAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, isSuperAdmin } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "Name, email, and password are required.",
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        status: false,
        message: "Admin with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      phone,
      isSuperAdmin: isSuperAdmin || false,
    });

    await newAdmin.save();

    res.status(201).json({
      status: true,
      message: "Admin created successfully.",
      adminId: newAdmin._id,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ status: false, message: "Internal server error." });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Email and password are required." });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password." });
    }

    const token = generateToken({
      adminId: admin._id,
      email: admin.email,
    });

    res.cookie("Admintoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
    });
    console.log(token, admin);
    res.status(200).json({ status: true, message: "Login successful." });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ status: true, message: "Internal server error." });
  }
};

export const getAdminData = async (req, res) => {
  try {
    const { adminId } = req.user;
    console.log(adminId);
    const user = await Admin.findById(adminId).select("-password");

    if (!user) return res.status(401).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
