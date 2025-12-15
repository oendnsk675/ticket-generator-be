import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { responseError } from "../utils/response-error";

export const errorMiddleware = async (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ZodError) {
        res.status(400).json({
            errors: `Validation Error ${JSON.stringify(error)}`
        });
    } else if (error instanceof responseError) {
        res.status(error.status).json({
            error: error.error,
            message: error.message,
            stackTrace: error.stackTrace
        });
    } else {
        res.status(500).json({
            errors: error.message
        });
    }
};