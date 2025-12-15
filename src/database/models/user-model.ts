import type { users } from "@prisma/client";
import type { role } from "@prisma/client";

export type userRegister = {
    name: string;
    email: string;
    password: string;
};

export type createUserByAdmin = {
    name: string;
    email: string;
    password: string;
    role: role;
};

export type userLogin = {
    email: string;
    password: string;
};

export type userUpdate = {
    name?: string;
    password?: string;
};

export type userUpdateByAdmin = {
    name: string;
    email: string;
    role: role;
};

export type userPagination = {
    id: number;
    name: string;
    email: string;
    role: role;
};

export type userPaginationRequest = {
  page?: number;
  limit?: number;
};

export type userRegisterResponse = {
    message: string;
    data: {
        id: number;
        name: string;
        email: string;
        role: string;
    }
};

export type createUserByAdminResponse = {
    message: string;
    data: {
        id: number;
        name: string;
        email: string;
        role: string;
    }
};

export type userLoginResponse = {
    message: string;
    data: {
        token?: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        }
    }
};

export type userUpdateResponse = {
    message: string;
    data: {
        id: number;
        name: string;
        email: string;
        role: string;
    }
};

export type getUserLoginResponse = {
    message: string;
    data: {
        id: number;
        name: string;
        email: string;
        role: string;
    }
};

export type getUserByIdResponse = {
    message: string;
    data: {
        id: number;
        name: string;
        email: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }
};

export type userUpdateByAdminResponse = {
    message: string;
    data: {
        id: number;
        name: string;
        email: string;
        role: string;
    }
};

export type userLogoutResponse = {
    message: string;
};

export type userPaginationResponse = {
    message: string;
    data: userPagination[];
    meta: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    }
};

export type deleteUserResponse = {
    message: string;
    data: {
        delete_id: number;
    }
};


export function toUserRegisterResponse(user: users): userRegisterResponse {
    return {
        message: "Create user successfully",
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    }
};

export function toCreateUserByAdminResponse(user: users): createUserByAdminResponse {
    return {
        message: "Create user successfully",
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    }
};

export function toUserLoginResponse(user: users, token: string): userLoginResponse {
    return {
        message: "Login successfully",
        data: {
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
    }
};

export function toUserLoginResponseWithoutToken(user: users): getUserLoginResponse {
    return {
        message: "OK",
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    }
};

export function toUserByIdResponse(user: users): getUserByIdResponse {
    return {
        message: "Success get user by id",
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.created_at,
            updatedAt: user.updated_at
        }
    }
};

export function toUserUpdateByAdminResponse(user: users): userUpdateByAdminResponse {
    return {
        message: "Update user successfully",
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    }
};

export function toUserUpdateResponse(user: users): userUpdateResponse {
    return {
        message: "Update user successfully",
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    }
};

export function toUserLogoutResponse(): userLogoutResponse {
    return {
        message: "Logout successfully"
    }
};

export function toUserPaginationResponse(
  users: userPagination[],
  page: number,
  limit: number,
  total: number,
  total_pages: number
): userPaginationResponse {
  return {
    message: "OK",
    data: users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    })),
    meta: {
      page,
      limit,
      total,
      total_pages
    }
  };
};

export function toDeleteUserResponse(user: users): deleteUserResponse {
    return {
        message: "Delete user successfully",
        data: {
            delete_id: user.id
        }
    }
};
