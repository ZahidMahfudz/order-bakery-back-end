import { PrismaClient } from "@prisma/client";
import { ILoginUser, ILoginUserResponse, InterfaceUser, IRegisterUser, IRegisterUserResponse } from "../interfaces/user";
import bcrypt from "bcrypt";
import { generateIdUser } from "../utils/idGenerator";
import logger from "../utils/logger";
import { promises } from "node:dns";

const prisma = new PrismaClient();

export async function register(userData: IRegisterUser): Promise<IRegisterUserResponse> {
    logger.debug(`Memeriksa apakah email ${userData.email} sudah terdaftar`);
    const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
    });
    if (existingUser) {
        throw {
            statusCode: 400,
            message: "Email sudah terdaftar",
        };
        logger.debug(`❌ Registration failed: Email ${userData.email} sudah terdaftar`);
    }

    logger.debug(`melakukan hash password untuk user: ${userData.email}`);
    const hashedPassword = await bcrypt.hash(userData.password, 10); // Assume password is already hashed for simplicity

    logger.debug(`Membuat ID user baru untuk user: ${userData.email}`);
    const newIdUser = generateIdUser();

    logger.debug(`Menyimpan user baru ke database: ${userData.email}`);
    const newUser = await prisma.user.create({
        data: {
            id_user: newIdUser,
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: "CUSTOMER",
        },
    });

    logger.debug(`User baru berhasil disimpan dengan ID: ${newUser.id_user}`);

    logger.debug(`Membuat response untuk user: ${newUser.email}`);
    const newUserResponse : IRegisterUserResponse = {
        user : {
            id_user: newUser.id_user,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        },
        password: newUser.password,
    }

    return newUserResponse;
}

export async function login(loginData: ILoginUser): Promise<ILoginUserResponse> {

    logger.debug(`melakukan query prisma.user.findUnique({where: { email: ${loginData.email} },})`)
    const user = await prisma.user.findUnique({
        where: { email: loginData.email },
    });
    
    logger.debug(`melakukan pengecekan data user '${loginData.email}' dari database`)
    if (!user) {
        throw {
            statusCode: 401,
            message: "Email tidak ditemukan",
        };
        logger.debug(`Data user dengan email '${loginData.email}' tidak ditemukan`)
    }
    logger.debug(`user berhasil ditemukan`)

    logger.debug(`melakukan compare password`)
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
        throw {
            statusCode: 401,
            message: "Password salah",
        };
        logger.debug(`compare password tidak cocok`)
    }
    logger.debug(`compare pasword cocok`)

    // Token masih kosong sesuai permintaan
    logger.debug(`melakukan format data menjadi interface ILoginUserResponse`)
    const userData: ILoginUserResponse = {
        user: {
            id_user: user.id_user,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token: "",
    };

    logger.debug(`mengirimkan data user dengan token ke controller dengan format interface ILoginUserResponse`)
    return userData;
}