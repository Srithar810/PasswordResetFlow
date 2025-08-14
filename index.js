import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Database/dbConfig.js";
import authRouter from "./Routers/authRouter.js";

dotenv.config();

const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Backend....!!!");
});

app.use("/api/auth", authRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log("Server Started and Running Sucessfully...!!!");
});
