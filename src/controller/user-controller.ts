import type { Request, Response, NextFunction } from "express";
import type { userLogin, userRegister, createUserByAdmin, userUpdateByAdmin, userUpdate } from "../database/models/user-model";
import { userService } from "../service/user-service";
import type { userRequest } from "../type/user-request";

export class userController {
    static async registerUser(req: Request, res: Response, next: NextFunction) {
        try {
            const request: userRegister = req.body as userRegister;
            const response = await userService.registerUser(request);

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async createUserByAdmin(req: userRequest, res: Response, next: NextFunction) {
        try {
            const response = await userService.createUserByAdmin(
                req.user!,   // user login (ADMIN)
                req.body     // payload create user
            );

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async loginUser(req: Request, res: Response, next: NextFunction) {
        try {
            const request: userLogin = req.body as userLogin;
            const response = await userService.loginUser(request);

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async userUpdate(req: userRequest, res: Response, next: NextFunction) {
        try {
            const request: userUpdate = req.body as userUpdate;
            const response = await userService.userUpdate(req.user!, request);

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async getUser(req: userRequest, res: Response, next: NextFunction) {
        try {
            const response = await userService.getUserLogin(req.user!);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async getUserId(req: userRequest, res: Response, next: NextFunction) {
        try {
            const response = await userService.getUserById(req);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async updateUserByAdmin(req: userRequest, res: Response, next: NextFunction) {
        try {
            const userId = Number(req.params.id)
            const payload = req.body as userUpdateByAdmin;

            const response = await userService.userUpdateByAdmin(req.user!, userId, payload);
            
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async logout(req: userRequest, res: Response, next: NextFunction) {
        try {
            const response = await userService.logout(req.user!);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async paginationUsers(req: userRequest, res: Response, next: NextFunction) {
        try {
            const request = {
                page: Number(req.query.page),
                limit: Number(req.query.limit)
            }

            const response = await userService.userPagination(req.user!, request);

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async deleteUser(req: userRequest, res: Response, next: NextFunction) {
        try {
            const response = await userService.deleteUser(req.user!, req);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
};