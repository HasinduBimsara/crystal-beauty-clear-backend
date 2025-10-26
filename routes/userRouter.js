import express, { Router } from "express";
import {
  getCurrentUser,
  googleLogin,
  loginUser,
  saveUser,
} from "../controller/userController.js";
const userRouter = express.Router();

userRouter.post("/", saveUser);
userRouter.post("/login", loginUser);
userRouter.post("/google", googleLogin);
userRouter.post("/current", getCurrentUser);

export default userRouter;
