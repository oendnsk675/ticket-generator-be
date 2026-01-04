import type { users } from "@prisma/client";
import { prisma } from "../database/db-config";
import type { exportReport, exportFile } from "../database/models/reportModel";
import { responseError } from "../utils/response-error";
import PDFDocument from "pdfkit";

export class reportService {
    static async getExportReport(user: users, report: exportReport): Promise<exportFile> {
        if (user.role !== "ADMIN" && user.role !== "OPERATOR") {
            throw new responseError(
                403,
                "FORBIDDEN",
                "You do not have permission to access this resource"
            );
        }

        const { format, type } = report;

        if (!["pdf", "csv"].includes(format)) {
            throw new responseError(
                400,
                "EXPORT_FAILED",
                "Invalid export format"
            );
        }

        if (!["scans", "tickets"].includes(type)) {
            throw new responseError(
                400,
                "EXPORT_FAILED",
                "Invalid export type"
            );
        }

        const data = type === "scans"
            ? await prisma.tickets.findMany({
                where: { is_scanned: true },
            })
            : await prisma.tickets.findMany();

        if (format === "csv") {
            return this.generateCSV(type, data);
        }

        return this.generatePDF(type, data);
    }

    // csv export
    private static generateCSV(type: string, data: any[]): exportFile {
        let csv = "ticket_id,batch_id,is_scanned,scanned_at,created_at\n";

        for (const row of data) {
            csv += `${row.id}, ${row.batch_id}, ${row.is_scanned}, ${row.scanned_at ? row.scanned_at.toISOString() : ""}, ${row.created_at.toISOString()}\n`;
        }

        return {
            filename: `${type}_report_${new Date().getFullYear()}.csv`,
            contentType: "text/csv",
            buffer: Buffer.from(csv, "utf-8"),
        };
    }

    // pdf export
    private static generatePDF(type: string, data: any[]): Promise<exportFile> {
        const doc = new PDFDocument({ margin: 30, size: "A4" });
        const chunks: Buffer[] = [];

        return new Promise((resolve, reject) => {
            doc.on("data", chunk => chunks.push(chunk));

            doc.on("end", () => {
                resolve({
                    filename: `${type}_report_${new Date().getFullYear()}.pdf`,
                    contentType: "application/pdf",
                    buffer: Buffer.concat(chunks),
                });
            });

            doc.on("error", err => reject(err));

            doc.fontSize(16).text(`${type.toUpperCase()} REPORT`, { align: "center" });
            doc.moveDown();

            doc.fontSize(10);

            data.forEach((row, index) => {
                doc.text(
                    `${index + 1}. ${row.id}\n` +
                    `Batch: ${row.batch_id}\n` +
                    `Scanned: ${row.is_scanned}\n` +
                    `Scanned At: ${row.scanned_at ? row.scanned_at.toISOString() : "N/A"}\n` +
                    `Created At: ${row.created_at.toISOString()}\n`,
                    { paragraphGap: 5 }
                );
            });

            doc.end();
        });
    }
}