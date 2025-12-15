import { responseError } from "../../utils/response-error";
import { prisma } from "../db-config";
import * as argon2 from "argon2";
import { toUserRegisterResponse } from "../models/user-model";

async function seedAdmin() {
    const checkUserAdmin = await prisma.users.findUnique({
        where: {
            email: "admin@gmail.com"
        }
    });

    if (checkUserAdmin) {
        throw new responseError(
            400,
            "VALIDATION_ERROR",
            "Email already exist"
        )
    };

    const password = await argon2.hash("Absolute23r0!!", {
        type: argon2.argon2id,
        hashLength: 64
    });

    const adminUser = await prisma.users.create({
        data: {
            name: "Admin",
            email: "admin@gmail.com",
            password: password,
            role: "ADMIN"
        }
    });

    return toUserRegisterResponse(adminUser);
}

seedAdmin()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });