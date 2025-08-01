import User from "../Models/userSchema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("token:  ", token);
  if (!token) {
    return res.status(401).json({ message: "Invaild Token...!!" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRECT);
    req.user = decoded;
    console.log("Decoded: ",decoded);

    const user = await User.findById(req.user._id);
    console.log(user);
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
