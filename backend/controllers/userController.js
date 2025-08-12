import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token, userId: user._id });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // checking user already exists or not
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      cartData: {}
    });

    const user = await newUser.save();
    console.log("User created:", { id: user._id, name: user.name, email: user.email });

    const token = createToken(user._id);

    res.json({ success: true, token, userId: user._id });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for getting user profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }
    
    const user = await userModel.findById(userId).select('-password -cartData');
    
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    
    // Ensure we have creation date
    const userProfile = {
      _id: user._id,
      name: user.name,
      email: user.email,
      status: user.status || 'active',
      createdAt: user.createdAt || user._id.getTimestamp(),
      updatedAt: user.updatedAt
    };
    
    res.json({ success: true, user: userProfile });
  } catch (error) {
    console.log("Error in getUserProfile:", error);
    res.json({ success: false, message: error.message });
  }
};

// Route for updating user profile
const updateUserProfile = async (req, res) => {
  try {
    const { userId, name, email } = req.body;
    
    // Check if email is already taken by another user
    const existingUser = await userModel.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.json({ success: false, message: "Email already in use" });
    }
    
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    ).select('-password');
    
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for changing password
const changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Current password is incorrect" });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await userModel.findByIdAndUpdate(userId, { password: hashedPassword });
    
    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Admin route to get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select('-password -cartData');
    res.json({ success: true, users });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Admin route to delete user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    await userModel.findByIdAndDelete(userId);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Admin route to update user status
const updateUserStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;
    await userModel.findByIdAndUpdate(userId, { status });
    res.json({ success: true, message: "User status updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, changePassword, getAllUsers, deleteUser, updateUserStatus };
