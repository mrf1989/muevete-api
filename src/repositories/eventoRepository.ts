import { Component, Bson, Database, Collection } from "../../deps.ts";
import { DBManagement } from "../database/mongodb.ts";
import { Evento } from "../models/evento.ts";

@Component()
export class EventoRepository {
    private db: Database | any;
    private eventos: Collection<Evento> | any;

    constructor(private readonly storage: DBManagement) {
        this.init();
    }

    private async init() {
        this.db = await this.storage.connect();
        this.eventos = this.storage.getCollection("eventos", this.db);
    }
    
    public async getAll(): Promise<Evento[]> {
        const eventos = await this.eventos.find().toArray();
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

    public async updateEvento(id: Bson.ObjectID, payload: Object) {
        const response = await this.eventos.updateOne({"_id": id}, {$set: payload});
    }

    public async deleteEvento(id: Bson.ObjectID) {
        const evento = await this.eventos.deleteOne({"_id": id});
    }
}