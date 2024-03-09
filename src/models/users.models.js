import mongoose from "mongoose";

let userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
    },
    fullname: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      index: true,
    },
    coverImage: {
      type: String,
      required: true,
      index: true,
    },
    avatar: {
      type: String,
      required: true,
      index: true,
    },
    isVerifiedEmail: {
      type: Boolean,
      required : true
    },
  },
  { timestamps: true }
);

export let User = new mongoose.model("User", userSchema);
