import type { userRequest } from "../type/user-request";
import type { Response, NextFunction } from "express";
import { reportService } from "../service/reportService";
import { responseError } from "../utils/response-error";

export class reportController {
    static async exportReport(req: userRequest, res: Response, next: NextFunction) {
        try {
            const { format, type } = req.query as any;

            if (!format || !type) {
                throw new responseError(
                    400,
                    "BAD REQUEST",
                    "Missing required query parameters: format and type"
                );
            }

            const result = await reportService.getExportReport(req.user!, { format, type });

            res.setHeader("Content-Type", result.contentType);
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${result.filename}"`
            );

            res.send(result.buffer);
        } catch (error) {
            next(error)
        };
    }
}