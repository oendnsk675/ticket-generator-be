import { status_ticket, type users } from "@prisma/client";
import { prisma } from "../database/db-config";
import type { scanTicketRequest, ticketBatchDetail, ticketPagination, logsTicket, reportRange, reportChart, chartDataResponse } from "../database/models/ticket-model";
import type { generateBatchTicketRequest, ticketPaginationRequest } from "../database/models/ticket-model";
import type { generateBatchTicketResponse, ticketBatchDetailResponse, ticketPaginationResponse, scanTicketResponse, logsPaginationResponse, summaryDataResponse } from "../database/models/ticket-model";
import { toGenerateBatchTicketResponse, toGetTicketBatchDetail, toGenerateTicketPaginationResponse, toScanTicketResponse, toLogsScanTicketPagination, toSummaryDataResponse, toChartDataResponse } from "../database/models/ticket-model";
import { responseError } from "../utils/response-error";
import { generateBatchId, generateQrHash, generateTicketId } from "../utils/ticket-helper";
import { validation } from "../utils/validation";
import { ticketValidation } from "../utils/ticket-validation";
import { getDateRange } from "../utils/dateRange";

export class ticketService {
    static async generateBatchTicket(user: users, request: generateBatchTicketRequest): Promise<generateBatchTicketResponse> {
        if (user.role !== "ADMIN" && user.role !== "OPERATOR") {
            throw new responseError(
                403,
                "FORBIDDEN",
                "You do not have permission to access this resource"
            );
        }

        const ticketRequest = validation.validate<generateBatchTicketRequest>(
            ticketValidation.generateBatchTicket, request
        );

        if (ticketRequest.total_tickets < 1) {
            throw new responseError(
                400,
                "VALIDATION_ERROR",
                "Minimum total ticket is 1"
            );
        };

        const batchId = generateBatchId();

        await prisma.$transaction(async (tx) => {
            await tx.batches.create({
                data: {
                    id: batchId,
                    batch_name: request.batch_name,
                    created_by: user.id,
                    total_tickets: request.total_tickets
                }
            });

            const ticketsData = [];

            for (let i = 1; i <= request.total_tickets; i++) {
                const ticketId = generateTicketId(batchId, i);
                const { qr_hash } = generateQrHash();

                ticketsData.push({
                    id: ticketId,
                    batch_id: batchId,
                    qr_hash
                });
            }

            await tx.tickets.createMany({
                data: ticketsData
            });
        });
        
        return toGenerateBatchTicketResponse(batchId, ticketRequest.total_tickets);
    };

    static async getDetailTicketBatch(user: users, batchId: string): Promise<ticketBatchDetailResponse> {
        if (user.role !== "ADMIN" && user.role !== "OPERATOR") {
            throw new responseError(
                403,
                "FORBIDDEN",
                "You do not have permission to access this resource"
            );
        }

        if (!batchId) {
            throw new responseError(
                400,
                "VALIDATION_ERROR",
                "Invalid batch id"
            );
        }

        const batch = await prisma.batches.findUnique({
            where: {
                id: batchId
            },
            include: {
                _count: {
                    select: {
                        tickets: {
                            where: {
                                is_scanned: true
                            }
                        }
                    }
                }
            }
        })

        if (!batch) {
            throw new responseError(
                404,
                "NOT_FOUND",
                "Batch not found"
            );
        }

        const result: ticketBatchDetail = {
            id: batch.id,
            batch_name: batch.batch_name,
            created_at: batch.created_at,
            total_tickets: batch.total_tickets,
            scanned: batch._count.tickets
        }

        return toGetTicketBatchDetail(result);
    }

    static async paginationTicket(user: users, batchId: string, ticket: ticketPaginationRequest): Promise<ticketPaginationResponse> {
        if (user.role !== "ADMIN" && user.role !== "OPERATOR") {
            throw new responseError(
                403,
                "FORBIDDEN",
                "You do not have permission to access this resource"
            );
        }

        // jika batch id tidak ada => error
        if (!batchId) {
            throw new responseError(
                404,
                "NOT_FOUND",
                "Batch not found"
            );
        }

        // jika page atau limit tidak ada => default page 1 dan limit 20
        const page = Number(ticket.page) || 1;
        const limit = Number(ticket.limit) || 20;

        const skip = (page - 1) * limit;


        const totalTickets = await prisma.tickets.count({
            where: {
                batch_id: batchId
            }
        });

        const tickets = await prisma.tickets.findMany({
            where: {
                batch_id: batchId
            },
            skip,
            take: limit,
            select: {
                id: true,
                qr_hash: true,
                is_scanned: true,
                scanned_at: true
            },
            orderBy: {
                id: "asc"
            }
        });

        const totalPages = Math.ceil(totalTickets / limit);

        const result: ticketPagination[] = tickets.map(ticket => ({
            id: ticket.id,
            qr_hash: ticket.qr_hash,
            is_scanned: ticket.is_scanned,
            scanned_at: ticket.scanned_at
        }));

        return toGenerateTicketPaginationResponse(result, page, limit, totalTickets, totalPages);
    }

    static async scanTicket(user: users, request: scanTicketRequest): Promise<scanTicketResponse> {
        if (user.role !== "ADMIN" && user.role !== "OPERATOR") {
            throw new responseError(
                403,
                "FORBIDDEN",
                "You do not have permission to access this resource"
            );
        }

        const { qr_hash } = validation.validate<scanTicketRequest>(ticketValidation.scanTicket, request);

        const ticket = await prisma.tickets.findFirst({
            where: { qr_hash },
            include: {
                batch: true
            }
        });

        // cek jika ticket tidak ditemukan
        if (!ticket) {
            throw new responseError(
                404,
                "NOT_FOUND",
                "Ticket not found"
            );
        }

        // cek jika ticket sudah digunakan
        if (ticket.is_scanned) {
            return toScanTicketResponse({
                id: ticket.id,
                batch_id: ticket.batch_id,
                status: "RESCAN",
                scanned_at: ticket.scanned_at
            })
        }

        const scannedAt = new Date();

        await prisma.$transaction(async (tx) => {
            await tx.tickets.update({
                where: { id: ticket.id },
                data: {
                    is_scanned: true,
                    scanned_at: scannedAt
                }
            });

            await tx.scan_logs.create({
                data: {
                    ticket_id: ticket.id,
                    operator_id: user.id,
                    status: "USED",
                    timestamp: scannedAt
                }
            });
        })

        return toScanTicketResponse({
            id: ticket.id,
            batch_id: ticket.batch_id,
            status: "SCANNED",
            scanned_at: scannedAt
        });
    }

    static async logsPagination(
        user: users, 
        request: {
            page?: number,
            limit?: number,
            batch_id?: string,
            operator_id?: number,
            status?: status_ticket
        }
    ): Promise<logsPaginationResponse> {
        if (user.role !== "ADMIN" && user.role !== "OPERATOR") {
            throw new responseError(
                403,
                "FORBIDDEN",
                "You do not have permission to access this resource"
            )
        };

        const page = request.page || 1;
        const limit = request.page || 20;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (request.batch_id) {
            where.ticket = {
                batch_id: request.batch_id
            };
        }

        if (request.operator_id) {
            where.operator_id = request.operator_id;
        };

        if (request.status) {
            where.status = request.status;
        };

        const totalLogs = await prisma.scan_logs.count({ where });

        const log = await prisma.scan_logs.findMany({
            where,
            skip,
            take: limit,
            include: {
                ticket: {
                    select: {batch_id: true}
                }
            },

            orderBy: {
                id: "desc"
            }
        });

        const totalPages = Math.ceil(totalLogs / limit);

        const result: logsTicket[] = log.map(log => ({
            ticket_id: log.ticket_id,
            batch_id: log.ticket.batch_id,
            operator_id: log.operator_id,
            status: log.status,
            timestamp: log.timestamp
        }));

        return toLogsScanTicketPagination(result, page, limit, totalLogs, totalPages);
    }

    static async summaryReport(user: users, range: reportRange): Promise<summaryDataResponse> {
        if (user.role !== "ADMIN" && user.role !== "OPERATOR") {
            throw new responseError(
                403,
                "FORBIDDEN",
                "You do not have permission to access this resource"
            );
        }

        const  { startDate, endDate } = getDateRange(range)

        const totalGenerated = await prisma.tickets.count({
            where: {
                created_at: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });

        const totalScanned = await prisma.tickets.count({
            where: { 
                is_scanned: true,
                scanned_at: {
                    gte: startDate,
                    lte: endDate
                } 
            }
        });

        return toSummaryDataResponse({
            total_generated: totalGenerated,
            total_scanned: totalScanned,
            range
        });
    }

    static async chartReport(user: users, chart: reportChart): Promise<chartDataResponse> {
        if (user.role !== "ADMIN" && user.role !== "OPERATOR") {
            throw new responseError(
                403,
                "FORBIDDEN",
                "You do not have permission to access this resource"
            );
        }

        const { startDate, endDate } = chart;

        if (!startDate || !endDate) {
            throw new responseError(
                400,
                "BAD_REQUEST",
                "Start date and end date are required"
            );
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        if (start > end) {
            throw new responseError(
                400,
                "BAD_REQUEST",
                "Start date must be before end date"
            );
        }

        const rows = await prisma.$queryRaw<{
            year: number;
            month: number;
            total_generated: number;
            total_scanned: number;
        }[]>`
            SELECT
                YEAR(created_at) AS year,
                MONTH(created_at) AS month,
                COUNT(id) AS total_generated,
                SUM(CASE WHEN is_scanned = 1 THEN 1 ELSE 0 END) AS total_scanned
            FROM tickets
            WHERE created_at BETWEEN ${start} AND ${end}
            GROUP BY YEAR(created_at), MONTH(created_at)
            ORDER BY YEAR(created_at), MONTH(created_at)
        `;

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const labels = rows.map(
            r => `${monthNames[Number(r.month) - 1]} ${r.year}`
        );
        const generated = rows.map(r => Number(r.total_generated));
        const scanned = rows.map(r => Number(r.total_scanned));

        return toChartDataResponse(labels, generated, scanned);
    }
};