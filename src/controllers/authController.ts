import { Request, Response } from "express";
import { InterfaceUser, IRegisterUser, ILoginUser, ILoginUserResponse } from "../interfaces/user";
import logger from "../utils/logger";
import { InterfaceError } from "../interfaces/error";
import * as authService from "../services/authService";
import { generateAccessToken, verifyRefreshToken, verifyAccessToken } from "../utils/jwt";

import prisma from "../config/db";

export async function register(req:Request, res:Response) {
        try {
            const userData:IRegisterUser = req.body;
            const newUserResponse = await authService.register(userData);

            return res.status(201).json({
                massage : "User registered successfully",
                user:newUserResponse.user
            });
            logger.info(`user with "${newUserResponse.user.name}" and email "${newUserResponse.user.email}" has been registered successfully`);
        } catch (err:unknown) {
            const error = err as InterfaceError;

            logger.error(`❌ Registration failed: ${error.message}`)
            return res.status(error.statusCode || 500).json({ 
                message:error.message,
                details: error.details
            });
        }
}

export async function login(req:Request, res:Response){

    const loginData:ILoginUser = req.body;

    try {
        logger.debug(`memasuki function login pada authController.ts dengan email user "${loginData?.email}"`);
        const userData:ILoginUserResponse = await authService.login(loginData);

        logger.debug(`mengirim refresh token ke cookie dengan httpOnly true`);
        res.cookie("refreshToken", userData.RefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set secure flag in production
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })

        logger.debug(`mengirim response sukses login ke client`);
        res.json({
            massage : "Login Successfully",
            userData
        });
        logger.info(`user ${userData.user.email} berhasil melakukan login`)

    } catch (err: unknown) {
        const error = err as InterfaceError;

        logger.error(`❌ Login gagal untuk user "${loginData?.email}" - ${error.message}`);

        res.status(error.statusCode || 401).json({
            massage : error.message || "Login Failed",
            details : error.details ||null
        })
    }
}

export async function refreshToken(req:Request, res:Response){
    logger.debug("Memasuki function refreshToken pada authController.ts");
    try {
        const refreshToken = req.cookies?.refreshToken;
        logger.debug(`Mengecek keberadaan refreshToken di cookies: ${!!refreshToken}`);
        if (!refreshToken) {
            logger.warn("Refresh token tidak ditemukan di cookies");
            return res.status(401).json({ error: "Refresh token tidak ada" });
        }

        logger.debug("Memverifikasi refresh token");
        const payload = verifyRefreshToken(refreshToken) as any;
        logger.debug(`Payload hasil verifikasi refresh token: ${JSON.stringify(payload)}`);

        logger.debug("Mengenerate access token baru");
        const newAccessToken = generateAccessToken(payload);

        logger.info(`Access token baru berhasil dibuat untuk user "${payload.email}"`);
        res.json({ accessToken: newAccessToken });
    } catch (err: unknown) {
        const error = err as InterfaceError;

        logger.error(`❌ Refresh Token gagal: ${error.message}`);

        res.status(error.statusCode || 401).json({
            massage : error.message || "Refresh Token Failed",
            details : error.details ||null
        });
    }
}

export async function logout(req: Request, res: Response) {
  try {
    logger.info(`Request method: ${req.method}, url: '${req.originalUrl}'`);

    // Ambil accessToken dari header Authorization
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    logger.debug(`Access token dari header: ${token}`);

    let userId: string | null = null;
    if (token) {
      try {
        const payload: any = verifyAccessToken(token);
        userId = payload?.id_user || payload?.payload?.id_user || null;
        logger.debug(`Payload token berhasil diverifikasi: ${JSON.stringify(payload)}`);
      } catch (err: any) {
        logger.warn(`AccessToken tidak valid atau expired: ${err.message}`);
      }
    }

    if (!userId) {
      logger.warn("Token tidak valid atau user tidak dikenali");
      return res.status(400).json({ message: "Token tidak valid atau user tidak dikenali" });
    }

    // Hapus refreshToken dari DB
    await prisma.refreshToken.deleteMany({
      where: { userId: userId },
    });
    logger.info(`Refresh token untuk userId=${userId} berhasil dihapus dari DB`);

    // Hapus cookie refreshToken
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    logger.debug("Cookie refreshToken berhasil dihapus");

    // Opsional: blacklist accessToken supaya benar-benar tidak bisa dipakai lagi
    // if (token && payload?.exp) {
    //   await prisma.blacklistToken.create({
    //     data: {
    //       token,
    //       expiredAt: new Date(payload.exp * 1000),
    //     },
    //   });
    //   logger.info(`Access token userId=${userId} dimasukkan ke blacklist sampai expired`);
    // }

    logger.info(`Logout berhasil untuk userId=${userId}`);
    return res.status(200).json({
      message: "Logout berhasil, accessToken akan kadaluarsa otomatis dan refreshToken dihapus",
    });
  } catch (error: any) {
    logger.error(`❌ Terjadi kesalahan saat logout: ${error.message}`);
    return res.status(500).json({
      message: "Terjadi kesalahan saat logout",
      error: error.message,
    });
  }
}