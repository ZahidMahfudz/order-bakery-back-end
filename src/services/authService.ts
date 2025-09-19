import { PrismaClient } from "@prisma/client";
import { ILoginUser, ILoginUserResponse, InterfaceUser, IRegisterUser, IRegisterUserResponse } from "../interfaces/user";
import bcrypt from "bcrypt";
import { generateIdRefreshToken, generateIdUser } from "../utils/idGenerator";
import logger from "../utils/logger";
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { hashToken, generateToken } from "../utils/hash";
import { generateAccessToken, verifyAccessToken, generateRefreshToken } from "../utils/jwt";
import { ref } from "process";

const prisma = new PrismaClient();

// 🔑 ambil secret & expiry dari .env
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
const ACCESS_TOKEN_EXPIRES_IN = (process.env.ACCESS_TOKEN_EXPIRY || "15m") as SignOptions["expiresIn"];
const REFRESH_TOKEN_EXPIRES_IN = (process.env.REFRESH_TOKEN_EXPIRY || "7d") as SignOptions["expiresIn"];

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

    logger.debug(`membuat payload untuk token`)
    const payload = { 
        id_user: user.id_user,
        name: user.name, 
        email: user.email, 
        role: user.role
    };
    logger.debug(`payload token: ${JSON.stringify(payload)}`)

    logger.debug(`melakukan generate access token & refresh token`)
    const accessToken = generateAccessToken({ payload });
    const refreshToken = generateRefreshToken({ payload });
    logger.debug(`access token: ${accessToken}`)
    logger.debug(`refresh token: ${refreshToken}`)

    logger.debug(`menyimpan refresh token ke database`)
    logger.debug(`menjalankan query prisma.refreshToken.create()`)
    await prisma.refreshToken.create({
        data: {
            id_refresh_token: generateIdRefreshToken(),
            tokenHash: refreshToken, // Simpan token asli untuk demo, sebaiknya hash sebelum simpan
            userId: user.id_user,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // Sesuaikan dengan format expiry
        }
    })
    logger.debug(`refresh token berhasil disimpan ke database`)

    // Token masih kosong sesuai permintaan
    logger.debug(`melakukan format data menjadi interface ILoginUserResponse`)
    const userData: ILoginUserResponse = {
        user: payload,
        AccessToken: accessToken,
        RefreshToken: refreshToken
    };

    logger.debug(`mengirimkan data user dengan token ke controller dengan format interface ILoginUserResponse`)
    return userData;
}