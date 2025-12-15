import type { Request } from "express";
import type { users } from "@prisma/client";

export interface userRequest extends Request {
    user?: users
};