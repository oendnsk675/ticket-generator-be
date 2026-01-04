import supertest from "supertest";
import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { app } from "../src/app";
import { logger } from "../src/utils/logging";
import { userTest, TEST_EMAIL } from "./helper/user-test";

describe("POST /auth/register", () => {
    afterEach(async () => {
        await userTest.delete();
    })

    it("should reject new user if request is invalid", async () => {
        const response = await supertest(app)
            .post("/auth/register")
            .send({
                name: "",
                email: "",
                password: ""
            })

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body).toBeDefined();
    });

    it("should register new user", async () => {
        const response = await supertest(app)
            .post("/auth/register")
            .send({
                name: "nana",
                email: TEST_EMAIL,
                password: "ErzaNaN@_77"
            })

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe("nana");
        expect(response.body.data.email).toBe(TEST_EMAIL);
    });
});

describe("POST /auth/login", () => {
    beforeEach(async () => {
        await userTest.create();
    });

    afterEach(async () => {
        await userTest.delete();
    });

    it("should be able to login", async () => {
        const response = await supertest(app)
            .post("/auth/login")
            .send({
                email: TEST_EMAIL,
                password: "ErzaNaN@_77"
            })

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.user.name).toBe("nana");
        expect(response.body.data.user.email).toBe(TEST_EMAIL);
        expect(response.body.data.token).toBeDefined();
    });

    it("should reject if email is wrong", async () => {
        const response = await supertest(app)
            .post("/auth/login")
            .send({
                email: "admin@admin.com",
                password: "ErzaNaN@_77"
            })

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });

    it("should reject if password is wrong", async () => {
        const response = await supertest(app)
            .post("/auth/login")
            .send({
                email: TEST_EMAIL,
                password: "ErzaNaN@_22"
            })

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });
});

describe("GET /auth/me", () => {
    let token: string;

    beforeEach(async () => {
        await userTest.delete();
        token = await userTest.create();
    });

    afterEach(async () => {
        await userTest.delete();
    });

    it("Should be able to get user", async () => {
        const response = await supertest(app)
            .get("/auth/me")
            .set("Authorization", `Bearer ${token}`);

        
        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe("nana");
        expect(response.body.data.email).toBe(TEST_EMAIL);
    });

    it("should reject get user if token is invalid", async () => {
        const response = await supertest(app)
            .get("/auth/me")
            .set("Authorization", `Bearer invalid-token`);

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
});
