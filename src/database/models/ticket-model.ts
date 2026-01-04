import { status_ticket } from "@prisma/client";

export type generateBatchTicketRequest = {
    batch_name: string;
    total_tickets: number;
};

export type getTicketBatchRequest = {
    batch_id: string;
};

export type ticketBatchDetail = {
    id: string;
    batch_name: string;
    created_at: Date;
    total_tickets: number;
    scanned: number;
};

export type ticketPagination = {
    id: string;
    qr_hash: string;
    is_scanned: boolean;
    scanned_at: Date | null;
};

export type ticketPaginationRequest = {
    page?: number;
    limit?: number;
};

export type scanTicketRequest = {
    qr_hash: string;
};

export type statusScanTicket = "SCANNED" | "RESCAN";

export type reportRange = "daily" | "weekly" | "monthly";

export const allowedReportRanges: reportRange[] = [
    "daily",
    "weekly",
    "monthly"
];

export type scanTicketData = {
    id: string;
    batch_id: string;
    status: statusScanTicket;
    scanned_at: Date | null;
};

export type logsTicket = {
    ticket_id: string;
    batch_id: string;
    operator_id: number;
    status: status_ticket;
    timestamp: Date | null;
};

export type summaryData = {
    total_generated: number;
    total_scanned: number;
    range: reportRange;
};

export type reportChart = {
    startDate: string;
    endDate: string;
};

export type logsTicketPagination = {
    page?: number;
    limit? : number;
};

export type generateBatchTicketResponse = {
    message: string;
    data: {
        batch_id: string;
        total_tickets: number;
    }
};

export type ticketBatchDetailResponse = {
    message: string;
    data: ticketBatchDetail[];
};

export type ticketDetailResponse = {
    message: string;
    data: ticketPagination[];
};

export type ticketPaginationResponse = {
    message: string;
    data: ticketPagination[];
    meta: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    }
};

export type scanTicketResponse = {
    message: string;
    data: scanTicketData
};

export type logsPaginationResponse = {
    message: string;
    data: logsTicket[];
    meta: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    }
};

export type summaryDataResponse = {
    message: string;
    data: summaryData;
};

export type chartDataResponse = {
    message: string;
    data: {
        labels: string[];
        generated: number[];
        scanned: number[];
    }
};

export function toGenerateBatchTicketResponse(batchId: string, total: number): generateBatchTicketResponse {
    return {
        message: "Generate batch ticket successfully",
        data: {
            batch_id: batchId,
            total_tickets: total
        }
    }
};

export function toGetTicketBatchDetail(batch: ticketBatchDetail): ticketBatchDetailResponse {
    return {
        message: "OK",
        data: [batch]
    }
};

export function toGenerateTicketPaginationResponse(
    tickets: ticketPagination[], 
    page: number, 
    limit: number, 
    total: number, 
    total_pages: number
): ticketPaginationResponse {
    return {
        message: "OK",
        data: tickets,
        meta: {
            page,
            limit,
            total,
            total_pages
        }
    }
};

export function toScanTicketResponse(ticket: scanTicketData): scanTicketResponse {
    return {
        message: "Successfully",
        data: {
            id: ticket.id,
            batch_id: ticket.batch_id,
            status: ticket.status,
            scanned_at: ticket.scanned_at
        }
    }
};

export function toLogsScanTicketPagination(
    logs: logsTicket[],
    page: number,
    limit: number,
    total: number,
    total_pages: number
): logsPaginationResponse {
    return {
        message: "OK",
        data: logs,
        meta: {
            page,
            limit,
            total,
            total_pages
        }
    };
}

export function toSummaryDataResponse(summary: summaryData): summaryDataResponse {
    return {
        message: "OK",
        data: {
            total_generated: summary.total_generated,
            total_scanned: summary.total_scanned,
            range: summary.range
        }
    };
}

export function toChartDataResponse(
    labels: string[], 
    generated: number[], 
    scanned: number[]
): chartDataResponse {
    return {
        message: "OK",
        data: {
            labels,
            generated,
            scanned
        }
    };
}