import { responseError } from "@src/utils/response-error";
import { prisma } from "../db-config"
import * as argon2 from "argon2";
import { toUserRegisterResponse } from "../models/user-model";

async function seedUser() {
    const checkUser = await prisma.users.findUnique({
        where: {
            email: "example@gmail.com"
        }
    });

    if (checkUser) {
        throw new responseError(
            400,
            "VALIDATION_ERROR",
            "Email already exist"
        );
    }

    const password = await argon2.hash("Coba1234#", {
        type: argon2.argon2id,
        hashLength: 64
    });

    const user = await prisma.users.create({
        data: {
            name: "momo",
            email: "example@gmail.com",
            password: password,
            role: "USER"
        },
    });
    
    return toUserRegisterResponse(user);
}

seedUser()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });