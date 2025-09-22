import express, { Request, Response } from "express";
import { config } from "./config/env";
import { conncetDB } from "./config/db";
import logger from "./utils/logger";
import { requestLogger } from "./middleware/loggerMiddleware";
import cookieParser from "cookie-parser";

//import routes
import seedingRoutes from "./routes/seedingRoutes";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();
const PORT = config.port
const NODE_ENV = config.env


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

//seeding data awal untuk admin dan manager
app.use("/seeding", seedingRoutes);

//routing
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes); // contoh route admin, sesuaikan dengan kebutuhan
app.use("/user", userRoutes);

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
