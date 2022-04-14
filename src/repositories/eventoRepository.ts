import { Component, Bson, Database, Collection } from "../../deps.ts";
import { DBManagement } from "../database/mongodb.ts";
import { Evento } from "../models/models.ts";

@Component()
export class EventoRepository {
    private db!: Database;
    private eventos!: Collection<Evento>;

    constructor(private readonly storage: DBManagement) {
        this.init();
    }

    private async init() {
        this.db = await this.storage.connect();
        this.eventos = this.storage.getCollection("eventos", this.db);
    }
    
    public async getAll(filtro: Bson.Document): Promise<Evento[]> {
        const eventos = await this.eventos.find(filtro).toArray();
        if (!eventos) throw new Error("No se encuentran eventos");
        return eventos;
    }

    public async getEvento(id: Bson.ObjectID): Promise<Evento> {
        const evento = await this.eventos.findOne({"_id": id});
        if (!evento) throw new Error("Evento no encontrado");
        return evento;
    }

    public async createEvento(evento: Evento) {
        const res = await this.eventos.insertOne(evento);
        if (!res) throw new Error("Error en la creación del evento");
    }

    public async updateEvento<T extends Evento>(id: Bson.ObjectID, payload: T): Promise<boolean> {
        try {
            await this.eventos.updateOne({"_id": id}, {$set: payload});
            return true;
        } catch (err) {
            throw err;
        }
    }

    public async deleteEvento(id: Bson.ObjectID) {
        try {
            return await this.eventos.deleteOne({"_id": id});
        } catch (err) {
            throw err;
        }
    }

    public async getEventos(ids: string[]) {
        const eventosId = ids.map(id => new Bson.ObjectID(id));
        const eventos = await this.eventos.find({
            "_id:": { $in: eventosId }
        }).toArray();
        return eventos;
    }
}