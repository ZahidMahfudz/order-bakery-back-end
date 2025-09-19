import express, { Request, Response } from "express";
import { config } from "./config/env";
import { conncetDB } from "./config/db";
import logger from "./utils/logger";
import { requestLogger } from "./middleware/loggerMiddleware";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";

const app = express();
const PORT = config.port
const NODE_ENV = config.env


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

//routing
app.use("/auth", authRoutes);

// Routing sederhana
app.get("/", requestLogger, (req: Request, res: Response) => {
    logger.info(`Request method : ${req.method}, url : '${req.url}'`);
    res.status(200).send({
        massage : "Hello Express + TypeScript + Nodemon 🚀",
    })
});

app.listen(PORT, async () => {
    logger.info(`✅ Server running at http://localhost:${PORT} with ENV ${NODE_ENV}`);
    await conncetDB();
});
