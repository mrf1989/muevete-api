import { Bson } from "../../deps.ts";

export interface Newsletter {
  _id?: Bson.ObjectID;
  titulo: string;
  cuerpo?: string;
  fecha?: Date;
  fechaEnvio?: Date;
  enlaces: {
    titulo: string;
    enlace: string;
    tipo: string;
  }[];
}
