// deno-lint-ignore-file

import { Bson } from "../../deps.ts";
import { Modalidad } from "./models.ts";

export interface Esfuerzo {
    _id?: Bson.ObjectID;
    numKm: number;
    fecha?: Date;
    comentario?: string;
    modalidad: Modalidad | string;
    usuario_id: Bson.ObjectID;
    dorsal_id: Bson.ObjectID;
}