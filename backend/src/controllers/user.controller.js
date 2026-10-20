import User from "../models/User.js";
import { userData } from "./auth.controller.js";
import { uploadImage, deleteImage } from "../services/cloudinary.service.js";

const emailPattern = /^\S+@\S+\.\S+$/;

// PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const name = String(req.body.name ?? "").trim();
    const email = String(req.body.email ?? "").trim().toLowerCase();

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    // another account must not already use this email
    const taken = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (taken) {
      return res
        .status(400)
        .json({ message: "That email is used by another account" });
    }

    req.user.name = name;
    req.user.email = email;
    await req.user.save();

    res.json({ user: userData(req.user) });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "That email is used by another account" });
    }
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/users/avatar (form-data with an "avatar" file)
export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please choose an image" });
    }

    // square 256px photo, centered on the most interesting part
    const result = await uploadImage(req.file.buffer, "tradevault/avatars", {
      transformation: [{ width: 256, height: 256, crop: "fill", gravity: "auto" }],
    });

    // new photo is safe, now delete the old one
    await deleteImage(req.user.avatarId);

    req.user.avatar = result.secure_url;
    req.user.avatarId = result.public_id;
    await req.user.save();

    res.json({ user: userData(req.user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/users/avatar
export const removeAvatar = async (req, res) => {
  try {
    await deleteImage(req.user.avatarId);

    req.user.avatar = "";
    req.user.avatarId = "";
    await req.user.save();

    res.json({ user: userData(req.user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/users/password
export const changePassword = async (req, res) => {
  try {
    const currentPassword = String(req.body.currentPassword ?? "");
    const newPassword = String(req.body.newPassword ?? "");

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please fill both password fields" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    // the password is hidden by default, so we ask for it
    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({ message: "New password must be different from the current one" });
    }

    user.password = newPassword; // the model hashes it before saving
    await user.save();

    res.json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};