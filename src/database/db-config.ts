import "dotenv/config";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from "../../generated/prisma/client";
import { logger } from "../utils/logging";

const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
})

export const prisma = new PrismaClient({ adapter,
    log: [
        {
            emit: "event",
            level: "query"
        },
        {
            emit: "event",
            level: "info"
        },
        {
            emit: "event",
            level: "error"
        },
        {
            emit: "event",
            level: "warn"
        },
    ]
});

prisma.$on("query", (e) => {
    logger.info(e);
});

prisma.$on("error", (e) => {
    logger.error(e);
});

prisma.$on("warn", (e) => {
    logger.warn(e);
});

prisma.$on("info", (e) => {
    logger.info(e);
});