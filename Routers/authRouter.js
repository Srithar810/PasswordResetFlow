import express from "express";
import {registerUser,loginUser, getUser, forgotPassword, resetPassword} from "../Controllers/authControllers.js";
import { authMiddleware } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/getUser',authMiddleware,getUser)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password/:id/:token',resetPassword)




export default router;