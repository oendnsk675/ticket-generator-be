import express from "express";
import { userController } from "../controller/user-controller";
import { limit } from "../middlewares/rate-limit";

export const authRoute = express.Router();

authRoute.post("/auth/register", userController.registerUser);
authRoute.post("/auth/login", limit, userController.loginUser);