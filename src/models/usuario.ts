import { Bson } from "../../deps.ts";
import { Rol } from "./rol.ts";

export interface Usuario {
    _id: Bson.ObjectID;
    username: string;
    password: string;
    rol: Rol;
    nombre: string;
    apellidos: string;
    fechaNacimiento: Date;
    email: string;
    telefono: string;
    ciudad: string;
}