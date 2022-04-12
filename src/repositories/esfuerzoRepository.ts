import { Component, Bson, Database, Collection } from "../../deps.ts";
import { DBManagement } from "../database/mongodb.ts";
import { Esfuerzo } from "../models/models.ts";

@Component()
export class EsfuerzoRepository {
    private db!: Database;
    private esfuerzos!: Collection<Esfuerzo>;

    constructor(private readonly storage: DBManagement) {
        this.init();
    }

    private async init() {
        this.db = await this.storage.connect();
        this.esfuerzos = this.storage.getCollection("esfuerzos", this.db);
    }
    
    public async getAll(filter: Bson.Document): Promise<Esfuerzo[]> {
        const esfuerzos = await this.esfuerzos.find(filter).toArray();
        if (!esfuerzos) throw new Error("No se han encontrado esfuerzos");
        return esfuerzos;
    }

    public async getEsfuerzo(id: Bson.ObjectID): Promise<Esfuerzo> {
        const esfuerzo = await this.esfuerzos.findOne({"_id": id});
        if (!esfuerzo) throw new Error("Esfuerzo no encontrado");
        return esfuerzo;
    }

    public async createEsfuerzo(esfuerzo: Esfuerzo) {
        const res = await this.esfuerzos.insertOne(esfuerzo);
        if (!res) throw new Error("Error en la creación del esfuerzo");
    }

    public async getEsfuerzosTotales(dorsales: string[]) {
        let acum = 0;
        await this.esfuerzos.find({
            "dorsal_id": { $in: dorsales }
        }).map(esfuerzo => acum = acum + esfuerzo.numKm);
        return acum;
    }
}