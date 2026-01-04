import type { users } from "@prisma/client";
import { prisma } from "../../src/database/db-config";
import * as argon2 from "argon2";
import { generateToken } from "../../src/utils/jwt";


export const TEST_EMAIL = "test-example@gmail.com"
export class userTest {
    static async delete() {

        await prisma.users.deleteMany({
            where: {
                email: TEST_EMAIL
            }
        });
    };

    static async create() {
        const newUser = await prisma.users.create({
            data: {
                name: "nana",
                email: "test-example@gmail.com",
                password: await argon2.hash("ErzaNaN@_77", {
                    type: argon2.argon2id,
                    hashLength: 64
                }),
                role: "ADMIN",
            }
        });
        
        const token = generateToken({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        });

        return token;
    };

    static async get(): Promise<users> {
        const user = await prisma.users.findUnique({
            where: {
                email: "example@gmail.com"
            }
        });

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    };
};