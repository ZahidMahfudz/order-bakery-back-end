import { Request, Response } from "express";
import { IDataUser, ILoginUser } from "../interfaces/user";
import { InterfaceError } from "../interfaces/error";

export async function getAdminProfile(req:Request, res:Response){
    try {
        const user = (req as any).user; // sudah di-attach dari middleware authenticate

    return res.status(200).json({
      message: "Berhasil mengakses profil admin",
      profile: {
        id_user: user.id_user,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    } catch (err : unknown) {
        const error = err as InterfaceError;

        return res.status(error.statusCode || 500).json({ 
            message:error.message,
            details: error.details
        });
    }
}