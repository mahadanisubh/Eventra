import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendOTPEmail } from "./email.service.js";

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });
    res.status(201).json({ message: "User Created", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password don't match" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendOTPEmail(user.email, otp);

    res.status(200).json({
      message: "OTP sent to your email",
      userId: user._id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign(
      { _id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await User.findById(req.user._id).populate(
      "registeredEvents",
      "title date time location bannerImage status",
    );

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Your Profile",
      profile: {
        name: profile.name,
        email: profile.email,
        role: profile.role,
        registeredEvents: profile.registeredEvents,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
