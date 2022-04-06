import { Component, Bson, Database, Collection } from "../../deps.ts";
import { DBManagement } from "../database/mongodb.ts";
import { Dorsal } from "../models/models.ts";

const ERROR_NOT_FOUND = new Error("No se encuentran dorsales");

@Component()
export class DorsalRepository {
    private db!: Database;
    private dorsales!: Collection<Dorsal>;

    constructor(private readonly storage: DBManagement) {
        this.init();
    }

    private async init() {
        this.db = await this.storage.connect();
        this.dorsales = this.storage.getCollection("dorsales", this.db);
    }
    
    public async getAll(filter: Bson.Document): Promise<Dorsal[]> {
        const dorsales = await this.dorsales.find(filter).toArray();
        if (!dorsales) throw ERROR_NOT_FOUND;
        return dorsales;
    }

    public async getDorsal(id: Bson.ObjectID): Promise<Dorsal> {
        const dorsal = await this.dorsales.findOne({"_id": id});
        if (!dorsal) throw new Error("Dorsal no encontrado");
        return dorsal;
    }

    public async createDorsal(dorsal: Dorsal) {
        const res = await this.dorsales.insertOne(dorsal);
        if (!res) throw new Error("Error en la creación del dorsal");
    }

    public async updateDorsal<T extends Dorsal>(id: Bson.ObjectID, payload: T): Promise<boolean> {
        try {
            await this.dorsales.updateOne({"_id": id}, {$set: payload});
            return true;
        } catch (err) {
            throw err;
        }
    }

    public async deleteDorsal(id: Bson.ObjectID) {
        try {
            return await this.dorsales.deleteOne({"_id": id});
        } catch (err) {
            throw err;
        }
    }
}