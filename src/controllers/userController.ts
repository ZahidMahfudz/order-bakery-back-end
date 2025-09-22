import { Request, Response } from "express";
import { IDataUser, ILoginUser } from "../interfaces/user";
import { InterfaceError } from "../interfaces/error";
import logger from "../utils/logger";
import prisma from "../config/db";

export async function getUserProfile(req:Request, res:Response){
    try {
        const userReq = (req as any).user; // sudah di-attach dari middleware authenticate
        logger.debug(`user dari req : ${JSON.stringify(userReq)}`)
        const id_user = req.params.id;
        logger.debug(`id_user diperoleh : ${id_user}`)

        if(userReq.id_user !== id_user){
            logger.warn(`user ${userReq.email} mencoba mengakses data user lain dengan id_user ${id_user}`)
            return res.status(403).json({message:"Akses ditolak: Anda tidak memiliki izin untuk mengakses data ini."})
        }

        const user = await prisma.user.findUnique({where:{id_user:id_user}})


        return res.status(200).json(
            {
                massage : "Berhasil Mengambil Data User",
                profile : {
                    id_user : user?.id_user,
                    name : user?.name,
                    email : user?.email,

                }
            }
        )
    } catch (err : unknown) {
        const error = err as InterfaceError;

        return res.status(error.statusCode || 500).json({ 
            message:error.message,
            details: error.details
        });
    }
}