import { Router } from "express";
import { generateUser, loginUser, verifyEmail } from "../controllers/users.controllers.js";
import { upload } from "../middleware/multer.middleware.js";

let userRouter = Router();

userRouter.route("/api/create").post(
   await upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
  generateUser
);

userRouter.route("/api/verify").post(verifyEmail);
userRouter.route("/api/login").post(loginUser);

export default userRouter;
