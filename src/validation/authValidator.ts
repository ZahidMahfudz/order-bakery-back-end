import validator from 'validator';
import { body } from 'express-validator';
import logger from '../utils/logger';

export const registerValidation = [
    body("name")
    .notEmpty()
    .withMessage("Nama wajib diisi")
    .isLength({ min: 3 })
    .withMessage("Nama minimal 3 karakter")
    .custom((value) => {logger.debug(`Validating name: ${value}`); return true;}),

    body("email")
    .notEmpty()
    .withMessage("Email wajib diisi")
    .isEmail()
    .withMessage("Email tidak valid")
    .custom((value) => {logger.debug(`Validating email: ${value}`);return true;}),

    body("password")
    .notEmpty()
    .withMessage("Password wajib diisi")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter")
    .custom((value) => {logger.debug(`Validating password length for value: ${value}`); return true;}),


];

export const loginValidation = [
    body("email")
    .notEmpty()
    .withMessage("Email wajib diisi")
    .isEmail()
    .withMessage("Email tidak valid")
    .custom((value) => {logger.debug(`Validating email: ${value}`);return true;}),
    
    body("password")
    .notEmpty()
    .withMessage("Password wajib diisi")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter")
    .custom((value) => {logger.debug(`Validating password length for value: ${value}`); return true;}),
]