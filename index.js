import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import jwt from "jsonwebtoken";
import productRouter from "./routes/productRouter.js";
import { verifyJWT } from "./middlewear/auth.js";
import orderRouter from "./routes/orderRouter.js";
import cors from "cors";
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch(() => {
    console.log("Connection failed");
  });

let app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(verifyJWT);

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
