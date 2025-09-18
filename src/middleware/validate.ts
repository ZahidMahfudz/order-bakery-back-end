import {validationResult} from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(err => {
            logger.error(`Validasi Gagal : ${err.msg}`);
        });
       
        return res.status(400).json({ 
            message: 'Validasi Gagal',
            errors: errors.array().map(err => ({
                message: err.msg
            }))
        });
    }
    next();
}