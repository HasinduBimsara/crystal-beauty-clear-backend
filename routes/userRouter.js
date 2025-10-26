import express, { Router } from "express";
import {
  googleLogin,
  loginUser,
  saveUser,
} from "../controller/userController.js";
const userRouter = express.Router();

userRouter.post("/", saveUser);
userRouter.post("/login", loginUser);
userRouter.post("/google", googleLogin);

export default userRouter;
