// import {getProfile, logOut, register, login, fetchLeaderBoard} from "../controllers/userController.js";
import {register} from "../controllers/userController.js";
import express from "express";
// import { isAuthenticated } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register", register);
// userRouter.post("/login", login);
// userRouter.get("/me", isAuthenticated, getProfile);
// userRouter.get("/logout", isAuthenticated, logOut);
// userRouter.get("/leaderboard", fetchLeaderBoard);


export default userRouter;

