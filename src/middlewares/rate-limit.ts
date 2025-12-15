import rateLimit from "express-rate-limit";

export const limit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 3,
    message: {
        message: "Silahkan menunggu 5 menit sebelum mencoba lagi"
    }
});