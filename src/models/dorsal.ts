import { Bson } from "../../deps.ts";

export interface Dorsal {
    _id: Bson.ObjectID;
    num: number;
    lema: string;
}