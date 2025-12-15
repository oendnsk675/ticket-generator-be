import express from "express";
import { authRoute } from "./routes/auth-route";
import { userRoute } from "./routes/user-route";
import { errorMiddleware } from "./middlewares/error-middleware";

export const app = express();

app.use(express.json());

app.use(authRoute);
app.use(userRoute);
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Hello World!");
});