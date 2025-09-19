import { Request, Response } from "express";
import { InterfaceUser, IRegisterUser, ILoginUser, ILoginUserResponse } from "../interfaces/user";
import logger from "../utils/logger";
import { InterfaceError } from "../interfaces/error";
import * as authService from "../services/authService";
import { generateAccessToken, verifyRefreshToken } from "../utils/jwt";

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
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ error: "Refresh token tidak ada" });

        const payload = verifyRefreshToken(refreshToken) as any;

        const newAccessToken = generateAccessToken({
        id_user: payload.id_user,
        email: payload.email,
        role: payload.role,
        });

        res.json({ accessToken: newAccessToken });
    } catch (err: unknown) {
        const error = err as InterfaceError;

        logger.error(`❌ Refresh Token gagal`);

        res.status(error.statusCode || 401).json({
            massage : error.message || "Refresh Token Failed",
            details : error.details ||null
        })
    }
}