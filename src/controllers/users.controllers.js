import { uploadOnCloudinary } from "../middleware/upload.cloudinary.js";
import { User } from "../models/users.models.js";
import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/nodemailer.js";

export const generateUser = async (req, res) => {
  let { username, fullname, email, password, isVerifiedEmail } = req.body;

  try {
    //find if the user already registered in the database
    let user = await User.findOne({ email: email });
    if (user) {
      let err = new Error("user already registered.");
      throw err;
    }
    //hash password
    let hashPassword = await bcrypt.hash(password, 10);

    let avatarFilePath = req.files?.avatar[0].path;
    let coverImageFilePath = req.files?.avatar[0].path;
    const avatar = await uploadOnCloudinary(avatarFilePath);
    const coverImage = await uploadOnCloudinary(coverImageFilePath);
    console.log(avatar);
    console.log(coverImage);
    fs.unlinkSync(avatarFilePath, coverImageFilePath);

    const registeredUser = await User.create({
      username,
      fullname,
      email,
      password: hashPassword,
      coverImage: coverImage?.url,
      avatar: avatar?.url,
      isVerifiedEmail: false,
    });
    const payload = {
      _id: registeredUser._id,
      fullname: registeredUser.fullname,
      email: registeredUser.email,
    };
    console.log(payload);

    const expiryInfo = {
      expiresIn: "1d",
    };
    const token = await jwt.sign(payload, process.env.SECRET_KEY, expiryInfo);

    await sendMail({
      from: '"from Basant Joshi CEO" <basantjoshi6363@gmail.com>',
      to: `${registeredUser.email}`, // Assuming registeredUser.email is a string
      subject: "Verify Your Email",
      html: `<p>Check the token to verify your email.</p><br>
        htpp://localhost:8000/verifyEmail/${token}
      `,
    });
    res.status(201).json({
      success: true,
      message: "user created",
    });
  } catch (error) {
    res.status(402).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    let tokenStr = req.headers.authorization;
    let token = tokenStr.split(" ")[1];

    //check it is valid token or not
    let checkToken = await jwt.verify(token, process.env.SECRET_KEY);
    if (!checkToken) {
      let err = new Error("invalid user credentials");
      throw err;
    }

    let user_id = checkToken._id;
    const user = await User.findById(user_id);
    user.isVerifiedEmail = true;
    res.status(200).json({
      sucess: true,
      message: "email verified successfully.",
    });
  } catch (error) {
    res.status(402).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  let { email, password } = req.body;
  try {
    //email password
    //check email exist or not in my database
    let user = await User.findOne({ email: email });
    if (!user) {
      let err = new Error("invalid user credentials");
      throw err;
    }
    //check password correct or not
    let checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      let err = new Error("invalid user credentials");
      throw err;
    }
    res.status(200).json({
      success: true,
      message: "logged in successfully.",
    });
  } catch (error) {
    res.status(402).json({
      success: false,
      message: error.message,
    });
  }
};
