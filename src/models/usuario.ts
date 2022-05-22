import { Bson, Mandarine } from "../../deps.ts";
import { Rol } from "./models.ts";

export interface Usuario extends Mandarine.Security.Auth.UserDetails {
    _id?: Bson.ObjectID;
    username: string;
    password: string;
    rol: Rol | string;
    nombre: string;
    apellidos: string;
    fechaNacimiento: Date;
    email: string;
    telefono?: string;
    ciudad?: string;
    session?: {
        hash: string,
        expiracion?: Date,
    }
}

export interface UserSession {
    username: string;
    hash: string;
    expiracion: Date;
    rol: string | undefined;
}