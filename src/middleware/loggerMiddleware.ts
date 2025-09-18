import logger from "../utils/logger";
import { Request, Response, NextFunction } from "express";

export const requestLogger = (req:Request, res:Response, next:NextFunction) => {
    logger.info(`Request method : ${req.method}, url : '${req.url}'`);
    logger.debug(`Request Headers: ${JSON.stringify(req.headers)}`);
    if (req.method !== "GET") {
        logger.debug(`Request Body: ${JSON.stringify(req.body)}`);
    }
    next();
}