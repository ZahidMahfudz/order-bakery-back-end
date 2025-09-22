import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  logger.debug(`Authenticating token: ${token}`);
  if (!token) {
    return res.status(401).json({ message: "Access Token Is Missing!" });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as any;
    logger.debug(`Token verified successfully, payload: ${JSON.stringify(decoded)}`);

    // Kalau token ada wrapper `payload`, ambil dari situ
    const data = decoded.payload ?? decoded;

    const userPayload = {
      id_user: data.id_user,
      name: data.name,
      email: data.email,
      role: data.role,
    };

    (req as any).user = userPayload;
    logger.debug(`req.user after normalize: ${JSON.stringify(userPayload)}`);

    next();
  } catch (err: any) {
    logger.debug(`Token verification failed: ${err?.message}`);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }
    return res.status(403).json({ message: "Invalid Access Token" });
  }
}


export function authorizeRoles(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        logger.debug(`req.user : ${JSON.stringify(user)}}`)
        logger.debug(`Authorizing user with role: ${user?.role} against allowed roles: ${roles}`);
        if (!user) {
            logger.debug("No user found in request");
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!roles.includes(user.role)) {
            logger.debug(`User role ${user.role} is not authorized`);
            return res.status(403).json({ message: "Forbidden: You don't have enough permission" });
        }
        logger.debug(`autorize role ${user?.role} successfully`)
        next();
    }
}
        