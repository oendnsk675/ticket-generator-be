import crypto from "crypto";
import { v7 as uuid7 } from "uuid";

export function generateBatchId(): string {
    const now = new Date();

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mi = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");

    return `BATCH_${yyyy}${mm}${dd}_${hh}${mi}${ss}`;
};

export function generateTicketId(batchId: string, sequence: number): string {
    return `TICKET_${batchId}_${String(sequence).padStart(6, "0")}`;
};

export function generateQrHash(): { qr_hash: string } {
    const id = uuid7();
    const hash = crypto.createHash("sha256").update(id).digest("hex");
    return { qr_hash: hash };
};