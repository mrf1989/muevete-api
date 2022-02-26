import { Bson } from "../../deps.ts";

export interface Esfuerzo {
    _id: Bson.ObjectID;
    numKm: number;
    fecha: Date;
    comentario: string;
    //modalidad enum
}