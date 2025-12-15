import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const jwtSecret = process.env.JWT_SECRET ? process.env.JWT_SECRET : "NanaEryhaJFNC128736SHAU@#$%!hd&%d";

export function generateToken(payload: object) {
    return jsonwebtoken.sign(payload, jwtSecret, {
        expiresIn: "1h"
    });
};