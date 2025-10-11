import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export function saveUser(req, res) {
  if (req.body.role == "admin") {
    if (req.user == null) {
      res.status(403).json({
        message: "please login as admin before creating an admin account",
      });
      return;
    }
    if (req.user.role != "admin") {
      res.status(403).json({
        message: "you are not authorized to create admn account",
      });
      return;
    }
  }
  const hashPassword = bcrypt.hashSync(req.body.password, 10);
  const user = new User({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: hashPassword,
    phone: req.body.phone || "not given",
    role: req.body.role || "customer",
  });

  user
    .save()
    .then(() => {
      res.json({
        meassage: "user save succesfully",
      });
    })
    .catch(() => {
      res.json({
        message: "error occured",
      });
    });
}
export function loginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
    email: email,
  }).then((user) => {
    if (user == null) {
      res.json({
        message: "user not found",
      });
    } else {
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      if (isPasswordCorrect) {
        // res.json({
        //     message:"laogin succesfull"
        // })
        const UserData = {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          isDisabled: user.isDisabled,
          isEmailVerified: user.isEmailVerified,
        };
        console.log(UserData);
        const token = jwt.sign(UserData, process.env.JWT_SECRET_KEY, {
          expiresIn: "48h",
        });

        res.json({
          message: "Login Succesfull",
          token: token,
          user: UserData,
        });
      } else {
        res.json({
          message: "invalid password",
        });
      }
    }
  });
}
