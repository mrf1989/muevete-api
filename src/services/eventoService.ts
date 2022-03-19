import { Service, Bson } from "../../deps.ts";
import { EventoRepository } from "../repositories/eventoRepository.ts";
import { Evento } from "../models/evento.ts";

@Service()
export class EventoService {
    constructor(private readonly eventoRepository: EventoRepository) {}

    public async getAllEventos() {
        return await this.eventoRepository.getAll();
    }

    public async getEvento(id: string) {
        return await this.eventoRepository.getEvento(new Bson.ObjectId(id));
    }

    public async createEvento(payload: Evento) {
        const evento: Evento = payload as Evento;
        await this.eventoRepository.createEvento(evento);
    }
    
    public async updateEvento<T extends Object>(id: string, payload: T) {
        return await this.eventoRepository.updateEvento(new Bson.ObjectId(id), payload);
    }

    public async deleteEvento(id: string) {
        await this.eventoRepository.deleteEvento(new Bson.ObjectId(id));
    }
}