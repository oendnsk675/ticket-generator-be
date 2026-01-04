import express from "express";
import { ticketController } from "../controller/ticket-controller";
import {reportController} from "../controller/reportController";
import { authMiddleware } from "../middlewares/auth-middleware";
import { verifyRole } from "../middlewares/role-middleware";

export const ticketRoute = express.Router();

ticketRoute.post("/tickets/generate", authMiddleware, verifyRole("ADMIN", "OPERATOR"), ticketController.generateBatch);

ticketRoute.get(
    "/batches", 
    authMiddleware, 
    verifyRole("ADMIN", "OPERATOR"), 
    ticketController.pagination
);

ticketRoute.get(
    "/batches/:batchId/tickets", 
    authMiddleware, 
    verifyRole("ADMIN", "OPERATOR"), 
    ticketController.pagination
);

ticketRoute.post(
    "/scan/validate", 
    authMiddleware, 
    verifyRole("ADMIN", "OPERATOR"), 
    ticketController.scanTicket
);

ticketRoute.get(
    "/scan/logs", 
    authMiddleware, 
    verifyRole("ADMIN", "OPERATOR"), 
    ticketController.logsPagination
);

ticketRoute.get(
    "/reports/summary", 
    authMiddleware, 
    verifyRole("ADMIN", "OPERATOR"), 
    ticketController.getSummaryReport
);

ticketRoute.get(
    "/reports/chart",
    authMiddleware, 
    verifyRole("ADMIN", "OPERATOR"), 
    ticketController.getChartReport
);

ticketRoute.get(
    "/reports/export",
    authMiddleware, 
    verifyRole("ADMIN", "OPERATOR"), 
    reportController.exportReport
);