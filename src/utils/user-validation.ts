import { z, ZodType } from "zod";

export class userValidation {
    static readonly register: ZodType = z.object({
        name: z.string().trim().min(4).max(100),
        email: z.string().trim().email().max(100),
        password: z.string()
            .trim()
            .min(8, { message: "Password minimal 8 karakter" })
            .max(255, { message: "Password maksimal 255 karakter" })
            .regex(/[a-z]/, { message: "Password harus mengandung minimal 1 huruf kecil (a-z)" })
            .regex(/[A-Z]/, { message: "Password harus mengandung minimal 1 huruf besar (A-Z)" })
            .regex(/\d/, { message: "Password harus mengandung minimal 1 angka (0-9)" })
            .regex(/[@$!%*?&]/, { message: "Password harus mengandung minimal 1 simbol (@$!%*?&)" })
    });

    static readonly login: ZodType = z.object({
        email: z.string().trim().email().max(100),
        password: z.string().trim().min(8).max(255)
    });

    static readonly update: ZodType = z.object({
        name: z.string().trim().min(4).max(100).optional(),
        password: z.string()
            .trim()
            .min(8, { message: "Password minimal 8 karakter" })
            .max(255, { message: "Password maksimal 255 karakter" })
            .regex(/[a-z]/, { message: "Password harus mengandung minimal 1 huruf kecil (a-z)" })
            .regex(/[A-Z]/, { message: "Password harus mengandung minimal 1 huruf besar (A-Z)" })
            .regex(/\d/, { message: "Password harus mengandung minimal 1 angka (0-9)" })
            .regex(/[@$!%*?&]/, { message: "Password harus mengandung minimal 1 simbol (@$!%*?&)" })
            .optional(),
    });

    static readonly createUserByAdmin: ZodType = z.object({
        name: z.string().trim().min(4).max(100),
        email: z.string().trim().email().max(100),
        password: z.string()
            .trim()
            .min(8, { message: "Password minimal 8 karakter" })
            .max(255, { message: "Password maksimal 255 karakter" })
            .regex(/[a-z]/, { message: "Password harus mengandung minimal 1 huruf kecil (a-z)" })
            .regex(/[A-Z]/, { message: "Password harus mengandung minimal 1 huruf besar (A-Z)" })
            .regex(/\d/, { message: "Password harus mengandung minimal 1 angka (0-9)" })
            .regex(/[@$!%*?&]/, { message: "Password harus mengandung minimal 1 simbol (@$!%*?&)" }),
        role: z.enum(["USER", "ADMIN", "OPERATOR"]),
    });

    static readonly updateUserByAdmin: ZodType = z.object({
        name: z.string().trim().min(4).max(100),
        email: z.string().trim().email().max(100),
        role: z.enum(["USER", "ADMIN", "OPERATOR"]),
    });

};