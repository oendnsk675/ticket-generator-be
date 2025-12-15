import express from "express";
import { userController } from "../controller/user-controller";
import { authMiddleware } from "../middlewares/auth-middleware";
import { verifyRole } from "../middlewares/role-middleware";

export const userRoute = express.Router();

userRoute.get("/auth/me", authMiddleware, userController.getUser);
userRoute.put("/auth/update", authMiddleware, userController.userUpdate);
userRoute.post("/auth/logout", authMiddleware, userController.logout);

// admin dan operator dapat melihat user
userRoute.get(
    "/users/:id", 
    authMiddleware, 
    verifyRole("ADMIN", "OPERATOR"), 
    userController.getUserId
);

// admin dapat membuat user
userRoute.post(
    "/users", 
    authMiddleware, 
    verifyRole("ADMIN"), 
    userController.createUserByAdmin
);

// admin dapat mengupdate user
userRoute.put(
    "/users/:id", 
    authMiddleware, 
    verifyRole("ADMIN"), 
    userController.updateUserByAdmin
);

userRoute.get(
    "/users",
    authMiddleware,
    verifyRole("ADMIN", "OPERATOR"),
    userController.paginationUsers
);

userRoute.delete(
    "/users/:id",
    authMiddleware,
    verifyRole("ADMIN"),
    userController.deleteUser
);
