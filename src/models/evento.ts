import { Bson } from "../../deps.ts";
import { Modalidad } from "./modalidad.ts";

export interface Evento {
    _id?: Bson.ObjectID;
    nombre: string;
    descripcion: string;
    objetivoKm: number;
    fechaCreacion?: Date;
    fechaInicio: Date;
    fechaFin: Date;
    modalidad: Modalidad | Array<string>;
}