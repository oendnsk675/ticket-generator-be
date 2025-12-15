import type { userRequest } from "../type/user-request";
import type { Response, NextFunction } from "express";
import { responseError } from "../utils/response-error";

const roleLevel: Record<string, number> = {
    USER: 1,
    OPERATOR: 2,
    ADMIN: 3
};

export function verifyRole( ...allowedRoles: string[] ) {
    return(req: userRequest, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            throw new responseError(
                401,
                "Authentication required",
                "UNAUTHORIZED"
            );
        };

        const userRoleLevel = roleLevel[user.role];

        const level = Math.min(...allowedRoles.map(role => roleLevel[role]));

        if (userRoleLevel < level) {
            throw new responseError(
                403,
                "You do not have permission to access this resource",
                "FORBIDDEN"
            );
        };

        next();
    };
};