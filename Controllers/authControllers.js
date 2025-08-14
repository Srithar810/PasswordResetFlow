import User from "../Models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendEmail from "../Utils/mailer.js";

dotenv.config();

//Register a  new User
export const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });
    await newUser.save();
    res.status(200).json({
      message: "New User Registered Sucessfully....!!!",
      data: newUser,
    });
  } catch (error) {
    res.staus(500).json({ message: error.message });
  }
};

//login a Exciting User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(404).json({ message: " Invaild Password..!" });
    }

    //jwt inital
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRECT, {
      expiresIn: "1h",
    });
    //save in token
    user.token = token;
    await user.save();
    console.log(user);
    res
      .status(200)
      .json({ message: "User Login Sucessfully....!", token: token });
    // res.send(user)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get User
export const getUser = async (req, res) => {
  try {
    const user = await User.find();
    console.log("User Data :" + user);
    res.status(200).json({ message: "Admin User: ", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: " User Not Found...!!" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRECT, {
      expiresIn: "1h",
    });
    // console.log("Email User:", process.env.PASS_MAIL);
    // console.log("Email Pass:", process.env.PASS_KEY ? "***" : "MISSING");
    await sendEmail(
      user.email,
      "Reset Password Link",
      `Hi, \n\nYou requested a password reset.
            \nPlease click the link below to reset your password:
            \n\n http://localhost:5173/resetPassword/${user._id}/${token}
            \n\nIf you didn't request this, you can ignore this email.`
    );
    res.status(200).json({ message: "Email Send Sucessfully...!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//reset Password

export const resetPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;
    console.log(req.params);
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRECT);
    if (!decoded) {
      return res.status(401).json({ message: "Invaild Token...!" });
    }

    //hash the new password
    const hashPassword = await bcrypt.hash(password, 10);

    //update the password in our db
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: hashPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User Not Found...!!!" });
    }
    res.status(200).json({ message: "Password Updated Sucessfully...!!!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
