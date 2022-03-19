import { Bson } from "../../deps.ts";
import { Rol } from "./models.ts";

export interface Usuario {
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
}