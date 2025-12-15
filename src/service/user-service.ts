import type { 
    userRegister,
    createUserByAdmin,
    userLogin,
    userUpdate,
    userUpdateByAdmin,
} from "../database/models/user-model";

import type { 
     userPaginationRequest, 
     userRegisterResponse, 
     createUserByAdminResponse, 
     userLoginResponse, 
     userUpdateResponse, 
     getUserLoginResponse, 
     getUserByIdResponse, 
     userUpdateByAdminResponse, 
     userLogoutResponse, 
     userPaginationResponse ,
     deleteUserResponse
} from "../database/models/user-model";

import { 
        toUserRegisterResponse, 
        toUserLoginResponse, 
        toUserLoginResponseWithoutToken, 
        toUserByIdResponse, 
        toCreateUserByAdminResponse,
        toUserUpdateByAdminResponse,
        toUserUpdateResponse,
        toUserLogoutResponse,
        toUserPaginationResponse,
        toDeleteUserResponse
} from "../database/models/user-model";

import { prisma } from "../database/db-config";
import { userValidation } from "../utils/user-validation";
import { validation } from "../utils/validation";
import { responseError } from "../utils/response-error";
import * as argon2 from "argon2";
import type { users } from "@prisma/client";
import { generateToken } from "../utils/jwt";
import type { userRequest } from "../type/user-request";

export class userService {
    static async registerUser(request: userRegister): Promise<userRegisterResponse> {
        const registerRequest = validation.validate<userRegister>(userValidation.register, request);

        const userExist = await prisma.users.findUnique({
            where: {
                email: registerRequest.email
            }
        });

        if (userExist) {
            throw new responseError(
                400,
                "VALIDATION_ERROR",
                "Email sudah terdaftar"
            );
        };

        registerRequest.password = await argon2.hash(registerRequest.password, {
            type: argon2.argon2id,
            hashLength: 64
        });

        const user = await prisma.users.create({
            data: registerRequest
        });

        return toUserRegisterResponse(user);
    };

    static async createUserByAdmin(request: users, payload: createUserByAdmin): Promise<createUserByAdminResponse> {
        if (request.role !== "ADMIN") {
            throw new responseError(
                403,
                "FORBIDDEN",
                "You do not have permission to access this resource"
            );
        };

        const createUser = validation.validate<createUserByAdmin>(userValidation.createUserByAdmin, payload);

        const userExist = await prisma.users.findUnique({
            where: {
                email: createUser.email
            }
        });
        
        if (userExist) {
            throw new responseError(
                400,
                "VALIDATION_ERROR",
                "Email already exist"
            );
        };

        createUser.password = await argon2.hash(createUser.password, {
            type: argon2.argon2id,
            hashLength: 64
        });

        const user = await prisma.users.create({
            data: {
                name: createUser.name,
                email: createUser.email,
                password: createUser.password,
                role: createUser.role
            }
        });

        return toCreateUserByAdminResponse(user);
    };

    static async userUpdateByAdmin(admin: users, userId: number, payload: userUpdateByAdmin): Promise<userUpdateByAdminResponse> {
        if (admin.role !== "ADMIN") {
            throw new responseError(
                403,
                "FORBIDDEN",
                "You do not have permission to access this resource"
            );
        };

        const updateUser = validation.validate<userUpdateByAdmin>(userValidation.updateUserByAdmin, payload);

        const idUser = await prisma.users.findUnique({
            where: {
                id: userId
            }
        });

        if (!idUser) {
            throw new responseError(
                404,
                "NOT_FOUND",
                "User not found"
            );
        };

        if (updateUser.email !== idUser.email) {
            const emailExist = await prisma.users.findUnique({
                where: {
                    email: updateUser.email
                }
            });

            if (emailExist) {
                throw new responseError(
                    400,
                    "VALIDATION_ERROR",
                    "Email already exist"
                );
            }
        }

        const updateDataUser = await prisma.users.update({
            where: {
                id: userId
            },
            data: updateUser
        })

        return toUserUpdateByAdminResponse(updateDataUser);
    };

    static async loginUser(request: userLogin): Promise<userLoginResponse> {
        const loginRequest = validation.validate<userLogin>(userValidation.login, request);

        const user = await prisma.users.findUnique({
            where: {
                email: loginRequest.email
            }
        });

        if (!user) {
            throw new responseError(
                401,
                "INVALID_CREDENTIALS",
                "Email or Password wrong"
            );
        };

        const passwordIsValid = await argon2.verify(user.password, loginRequest.password);

        if (!passwordIsValid) {
            throw new responseError(
                401,
                "INVALID_CREDENTIALS",
                "Email or Password wrong"
            );
        };

        const token = generateToken({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });

        return toUserLoginResponse(user, token);
    };

    static async userUpdate(user: users, request: userUpdate): Promise<userUpdateResponse> {
        const userUpdate = validation.validate<userUpdate>(userValidation.update, request);

        const dataUpdate: Partial<users> = {};

        if (userUpdate.name) {
            dataUpdate.name = userUpdate.name;
        }

        if (userUpdate.password) {
            dataUpdate.password = await argon2.hash(userUpdate.password, {
                type: argon2.argon2id,
                hashLength: 64
            });
        }

        const result = await prisma.users.update({
            where: {
                email: user.email
            },
            data: dataUpdate
        });

        return toUserUpdateResponse(result);
    }

    static async getUserLogin(user: users): Promise<getUserLoginResponse> {
        return toUserLoginResponseWithoutToken(user);
    };

    static async getUserById(request: userRequest): Promise<getUserByIdResponse> {
        const requester = request.user;

        if (!requester) {
            throw new responseError(
                401,
                "UNAUTHORIZED",
                "Authentication required"
            );
        };

        const userId = Number(request.params.id);

        const userExist = await prisma.users.findUnique({
             where: { 
                id: userId
            }
        });

        if (!userExist) {
            throw new responseError(
                404,
                "NOT_FOUND",
                "User not found"
            );
        };

        if (requester.role === "OPERATOR" && userExist.role === "ADMIN") {
            throw new responseError(
                403,
                "FORBIDDEN",
                "Operator cannot access admin user data"
            );
        }

        return toUserByIdResponse(userExist);
    };

    static async logout(user: users): Promise<userLogoutResponse> {
        if (!user) {
            throw new responseError(
                401,
                "UNAUTHORIZED",
                "Authentication required"
            );
        };
        return toUserLogoutResponse();
    };

    static async userPagination(user: users, request: userPaginationRequest): Promise<userPaginationResponse> {
        if (user.role !== "ADMIN" && user.role !== "OPERATOR") {
            throw new responseError(
                403,
                "FORBIDDEN",
                "You do not have permission to access this resource"
            );
        }

        const page = Number(request.page) || 1;
        const limit = Number(request.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await prisma.users.count();

        const users = await prisma.users.findMany({
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            },
            orderBy: {
                id: "asc"
            }
        });

        const totalPages = Math.ceil(total / limit);

        return toUserPaginationResponse(users, page, limit, total, totalPages);
    }

    static async deleteUser(user: users, request: userRequest): Promise<deleteUserResponse> {
        if (user.role !== "ADMIN") {
            throw new responseError(
                403,
                "FORBIDDEN",
                "You do not have permission to access this resource"
            );
        }

        const userId = Number(request.params.id);

        if (user.id === userId) {
            throw new responseError(
                400,
                "FORBIDDEN",
                "You cannot delete yourself"
            );
        }

        const userExist = await prisma.users.findUnique({
            where: {
                id: userId
            }
        });

        if (!userExist) {
            throw new responseError(
                404,
                "NOT_FOUND",
                "User not found"
            );
        }

        const deletedUser = await prisma.users.delete({
            where: {
                id: userId
            }
        });

        return toDeleteUserResponse(deletedUser);
    }
};