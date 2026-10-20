import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { DEMO_EMAIL } from "../config/demo.js";

// creates the token. "Remember me" keeps the user logged in longer
const generateToken = (id, rememberMe = false) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: rememberMe ? "30d" : "1d",
  });
};

// what we send back to React (never the password)
export const userData = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
});

// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      user: userData(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // +password because the schema hides it by default
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      // same message for both cases, so nobody can guess which emails exist
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      user: userData(user),
      token: generateToken(user._id, rememberMe),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/me (private) returns the logged-in user
export const getMe = async (req, res) => {
  res.json({ user: userData(req.user) });
};

// POST /api/auth/demo logs in the shared demo account (no password needed)
export const demoLogin = async (req, res) => {
  try {
    const user = await User.findOne({ email: DEMO_EMAIL });

    if (!user) {
      return res
        .status(404)
        .json({ message: "The demo account is not set up yet" });
    }

    res.json({ user: userData(user), token: generateToken(user._id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
