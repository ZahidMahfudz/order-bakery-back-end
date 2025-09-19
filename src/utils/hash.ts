import crypto from 'crypto';

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateToken(size = 64){
    return crypto.randomBytes(size).toString('hex');
}