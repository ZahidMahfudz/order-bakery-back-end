import e, { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv"
import { requestLogger } from "../middleware/loggerMiddleware";

dotenv.config();

const router = Router();
const prisma = new PrismaClient();


router.post("/seedingUserAdmin", requestLogger,async (req:Request, res:Response) => {
    try {
        const { secret } = req.params;
        if (secret !== process.env.SEED_ACCESS) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const existingAdmin = await prisma.user.findUnique({
            where: { email: "admin@adminBakery.com" }
        })
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin user already exists" });
        }

        const hashedPassword = await bcrypt.hash("Admin123!", 10);

        const newAdmin = await prisma.user.create({
            data: {
                id_user: "USR-ADMIN-0001",
                name: "Admin Bakery",
                email: "admin@adminBakery.com",
                password: hashedPassword,
                role: "ADMIN",
            },
        });

        res.status(201).json({ message: "Admin user created", user: { id_user: newAdmin.id_user, name: newAdmin.name, email: newAdmin.email, role: newAdmin.role } });

    } catch (err : unknown) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

export default router;