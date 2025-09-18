import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient()

export async function conncetDB() {
    try {
        await prisma.$connect();
        logger.info("✅ Database connected");
    }catch (err) {
        logger.error("❌ Database connection error");
        process.exit(1);
    }
}

export default prisma;