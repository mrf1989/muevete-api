import { createHash } from "../../deps.ts";
import { UserSession } from "../models/models.ts";

export function hashPassword(password: string): string {
    return createHash("sha3-256").update(password).toString();
}

export function comparaPassword(entrante: string, original: string): boolean {
    let res = false;
    const entranteHash = hashPassword(entrante);
    if (entranteHash == original) {
        res = true;
    }
    return res;
}

export function updateCookies(payload: UserSession): string {
    return `userSession=${payload.username}##${payload.rol}##${payload.hash}##${payload.expiracion.getTime()}; Path=/api`;
}