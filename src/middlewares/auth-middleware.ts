import type { Response, NextFunction } from "express";
import type { userRequest } from "../type/user-request";
import jsonwebtoken from "jsonwebtoken";
import type { users } from "@prisma/client";
import { responseError } from "../utils/response-error";


export const authMiddleware = async (req: userRequest, res: Response,  next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        throw new responseError(
            401, 
            "TOKEN_MISSING",
            "Unauthorized"
        );
    };

    const bearer = token.split(" ")[1];

    try {
        const decoded = jsonwebtoken.verify(bearer, process.env.JWT_SECRET as string);

        req.user = decoded as users;

        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token Expired"
            });
        }

        return res.status(401).json({
            errors: "Token Invalid"
        });
    }
};