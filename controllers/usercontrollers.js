const jwt = require("jsonwebtoken");
const User = require("../modal/usermodal");
const asyncHandler = require("express-async-handler");
const generateToken = require("../modal/config/generateToken");

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all fields");
  }
  const userExists = await User.findOne({ email, isDeleted: false });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists or deleted user");
  }
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
});

// Authenticate user
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    if (user.isDeleted) {
      res.status(401);
      throw new Error("Account has been deleted");
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// Delete user (soft delete)
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (user) {
    user.isDeleted = true;
    await user.save();
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

module.exports = { registerUser, authUser, deleteUser };
