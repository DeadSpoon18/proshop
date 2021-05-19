import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// @desc Auth user $ get token
// @route POST /api/users/login
// @access Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  let verifiedPassword = await bcrypt.compare(password, user.password);
  if (!verifiedPassword) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
    expiresIn: "30d",
  });

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token,
  });
});

// @desc Get user profile
// @route /api/users/profile
// @access Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const profileUser = await User.findById(req.user._id);
  if (!profileUser) {
    res.status(401);
    throw new Error("User not found");
  }
  res.json({
    _id: profileUser._id,
    name: profileUser.name,
    email: profileUser.email,
    isAdmin: profileUser.isAdmin,
  });
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const profileUser = await User.findById(req.user._id);
  const { name, email, password } = req.body;
  if (!profileUser) {
    res.status(401);
    throw new Error("User not found");
  }
  profileUser.name = name || profileUser.name;
  profileUser.email = email || profileUser.email;
  const salt = await bcrypt.genSalt(10);
  if (password) {
    const hashedPassword = await bcrypt.hash(password, salt);
    profileUser.password = hashedPassword;
  }
  const token = jwt.sign({ id: profileUser._id }, process.env.JWT_TOKEN, {
    expiresIn: "30d",
  });
  const updatedUser = await profileUser.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
    token,
  });
});

// @desc Create new user
// @route POST /api/users
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_TOKEN, {
    expiresIn: "30d",
  });
  if (newUser) {
    res.status(201);
    res.json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Get all users
// @route GET /api/users
// @access Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const user = await User.find({});
  res.json(user);
});

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Get user by id
// @route GET /api/users/:id
// @access Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Update user
// @route PUT /api/users/:id
// @access Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  const { name, email, password, isAdmin } = req.body;
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.isAdmin = isAdmin || user.isAdmin;

  const salt = await bcrypt.genSalt(10);
  if (password) {
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
  }

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
});
