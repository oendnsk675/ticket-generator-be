import {  prisma } from "../../src/database/db-config";
import { responseError } from "../../src/utils/response-error";

export class ticketTest {
    static async delete() {
        // Hapus dari tabel paling bawah
        await prisma.scan_logs.deleteMany({});
        await prisma.tickets.deleteMany({});
        await prisma.batches.deleteMany({});
    };

    // static async get() {
    //     const tickets = await prisma.tickets.findMany({
    //         include: {
    //             batch: true
    //         }
    //     });

    //     if (!tickets) {
    //         throw new responseError(404, "NOT_FOUND", "Ticket not found");
    //     }

    //     return tickets;
    // }
};