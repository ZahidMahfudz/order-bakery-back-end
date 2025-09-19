import { v4 as uuidv4 } from "uuid";

export function generateIdUser(): string {
    return `usr-${uuidv4()}`;
}

export function generateIdRefreshToken(): string {
    return `rft-${uuidv4()}`;
}