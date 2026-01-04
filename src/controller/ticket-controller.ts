import type { userRequest } from "../type/user-request";
import type { Response, NextFunction } from "express";
import { ticketService } from "../service/ticket-service";
import { responseError } from "../utils/response-error";
import { allowedReportRanges, type reportChart, type reportRange, type scanTicketRequest } from "../database/models/ticket-model";
import type { status_ticket } from "@prisma/client";

export class ticketController {
    static async generateBatch(req: userRequest, res: Response, next: NextFunction) {
        try {
            const response = await ticketService.generateBatchTicket(req.user!, req.body);
            res.status(200).json(response);
        } catch (error) {
            next(error)
        };
    }

    static async getTicketBatchDetail(req: userRequest, res: Response, next: NextFunction) {
        try {
            const batchId = req.params.batchId;
            
            const response = await ticketService.getDetailTicketBatch(req.user!, batchId);
            res.status(200).json(response);
        } catch (error) {
            next(error)
        };
    }

    static async pagination(req: userRequest, res: Response, next: NextFunction) {
        try {
            const batchId = req.params.batchId;
            const page = Number(req.query.page);
            const limit = Number(req.query.limit);
            
            // jika page atau limit ada => pagination ticket
            if (page || limit) {
                const response = await ticketService.paginationTicket(
                    req.user!, 
                    batchId, 
                    { 
                        page: page, 
                        limit: limit
                    }
                );
                return res.status(200).json(response)
            }

            // jika tidak ada => detail ticket batch
            const response = await ticketService.getDetailTicketBatch(
                req.user!, 
                batchId
            );
            res.status(200).json(response);
        } catch (error) {
            next(error)
        };
    }

    static async scanTicket(req: userRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return new responseError(
                    401,
                    "UNAUTHORIZED",
                    "Authentication required"
                )
            };

            const request: scanTicketRequest = {
                qr_hash: req.body.qr_hash
            };

            const response = await ticketService.scanTicket(req.user, request);
            res.status(200).json(response);
        } catch (error) {
            next(error)
        };
    }

    static async logsPagination(req: userRequest, res: Response, next: NextFunction) {
        try {
            const response = await ticketService.logsPagination(req.user!, {
                page: Number(req.query.page),
                limit: Number(req.query.limit),
                batch_id: req.query.batch_id as string,
                operator_id: req.query.operator_id ? Number(req.query.operator_id) : undefined,
                status: req.query.status as status_ticket
            });

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async getSummaryReport(req: userRequest, res: Response, next: NextFunction) {
        try {
            const range = req.query.range as string;

            if (!range || !allowedReportRanges.includes(range as reportRange)) {
                throw new responseError(
                    400,
                    "BAD_REQUEST",
                    "Range does not valid"
                );
            }

            const result = await ticketService.summaryReport(req.user!, range as reportRange);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async getChartReport(req: userRequest, res: Response, next: NextFunction) {
        try {
            const startDate = req.query.startDate as string;
            const endDate = req.query.endDate as string;

            if (!startDate || !endDate) {
                throw new responseError(
                    400,
                    "BAD_REQUEST",
                    "Start date and end date are required"
                );
            }

            const chart: reportChart = {
                startDate,
                endDate
            };

            const result = await ticketService.chartReport(req.user!, chart);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
};