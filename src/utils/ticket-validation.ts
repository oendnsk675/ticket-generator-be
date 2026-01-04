import { z, ZodType } from "zod";

export class ticketValidation {
    static readonly generateBatchTicket: ZodType = z.object({
        batch_name: z.string().min(4).max(255),
        total_tickets: z.coerce.number().max(100000)
    });

    static readonly scanTicket: ZodType = z.object({
        qr_hash: z.string().min(10, "QR Hash tidak valid").max(255, "QR Hash terlalu panjang")
    });
};