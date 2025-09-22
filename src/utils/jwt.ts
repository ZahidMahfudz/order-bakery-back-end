import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const ACCESS_TOKEN_EXPIRES_IN = (process.env.ACCESS_TOKEN_EXPIRY || '3m') as jwt.SignOptions['expiresIn'];
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
const REFRESH_TOKEN_EXPIRES_IN = (process.env.REFRESH_TOKEN_EXPIRY || '7d') as jwt.SignOptions['expiresIn'];

export function generateAccessToken(payload: object) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET as Secret, { expiresIn: ACCESS_TOKEN_EXPIRES_IN } as SignOptions);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET as Secret);
}

export function generateRefreshToken(payload: object): string {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET as Secret, { expiresIn: REFRESH_TOKEN_EXPIRES_IN } as SignOptions);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
}