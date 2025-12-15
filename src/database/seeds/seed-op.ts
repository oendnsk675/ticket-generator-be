import { responseError } from "@src/utils/response-error";
import { prisma } from "../db-config";
import * as argon2 from "argon2";
import { toUserRegisterResponse } from "../models/user-model";

async function seedOp() {
    const checkUserOp = await prisma.users.findUnique({
        where: {
            email: "op@gmail.com"
        }
    });

    if (checkUserOp) {
        throw new responseError(
            400,
            "VALIDATION_ERROR",
            "User already exist"
        )
    };

    const password = await argon2.hash("Soverign@123", {
        type: argon2.argon2id,
        hashLength: 64
    });

    const userOp = await prisma.users.create({
        data: {
            name: "Operator",
            email: "Op@gmail.com",
            password: password,
            role: "OPERATOR"
        }
    });

    return toUserRegisterResponse(userOp);
};

seedOp()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });