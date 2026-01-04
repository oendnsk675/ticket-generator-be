import type { reportRange } from "../database/models/ticket-model";
import { responseError } from "./response-error";

export function getDateRange(range: reportRange): { startDate: Date; endDate: Date } {
    const now = new Date();
    let startDate: Date;
    let endDate = new Date();

    endDate.setHours(23, 59, 59, 999);

    switch (range) {
        case "daily":
            startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
            break;

        case "weekly": 
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 6);
            startDate.setHours(0, 0, 0, 0);
            break;

        case "monthly":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            startDate.setHours(0, 0, 0, 0);
            break;

        default:
            throw new responseError(
                400,
                "INVALID REPORT RANGE",
                "Invalid report range provided"
            );
    }

    return { startDate, endDate };
}