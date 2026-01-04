import supertest from "supertest";
import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { app } from "../src/app";
import { logger } from "../src/utils/logging";
import { ticketTest } from "./helper/ticket-test";
import { userTest } from "./helper/user-test";

describe("POST /tickets/generate", () => {
    let token: string;

    beforeEach(async () => {
        token = await userTest.create();
    });

    afterEach(async () => {
        await ticketTest.delete();
        await userTest.delete();
    });

    it("should reject new batch ticket if request is invalid", async () => {
        const response = await supertest(app)
            .post("/tickets/generate")
            .set("Authorization", `Bearer ${token}`)
            .send({
                batch_name: "",
                total_tickets: 0
            });
        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body).toBeDefined();
    });

    it("should generate batch ticket successfully", async () => {
        const response = await supertest(app)
            .post("/tickets/generate")
            .set("Authorization", `Bearer ${token}`)
            .send({
                batch_name: "Event Festival",
                total_tickets: 50
            });

        expect(response.status).toBe(200);
        expect(response.body.data.batch_id).toContain("BATCH_");
        expect(response.body.data.total_tickets).toBe(50);
    }, 15000);
});