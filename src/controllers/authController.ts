import { Request, Response } from "express";
import { InterfaceUser, IRegisterUser, ILoginUser, ILoginUserResponse } from "../interfaces/user";
import logger from "../utils/logger";
import { InterfaceError } from "../interfaces/error";
import * as authService from "../services/authService";

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
        const userData:ILoginUserResponse = await authService.login(loginData);

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