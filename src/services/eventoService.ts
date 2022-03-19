import { Service, Bson } from "../../deps.ts";
import { EventoRepository } from "../repositories/repositories.ts";
import { Evento } from "../models/models.ts";

@Service()
export class EventoService {
    constructor(private readonly eventoRepository: EventoRepository) {}

    public async getAllEventos() {
        return await this.eventoRepository.getAll();
    }

    public async getEvento(id: string) {
        return await this.eventoRepository.getEvento(new Bson.ObjectId(id));
    }

    public async createEvento(payload: Evento): Promise<boolean> {
        const evento: Evento = payload as Evento;
        const duracionMinima = this.duracionMinima(evento.fechaInicio, evento.fechaFin);
        if (duracionMinima) {
            await this.eventoRepository.createEvento(evento);
            return true;
        } else {
            throw new Error("El evento debe durar un mínimo de 7 días");
        }
    }
    
    public async updateEvento<T extends Evento>(id: string, payload: T) {
        return await this.eventoRepository.updateEvento(new Bson.ObjectId(id), payload);
    }

    public async deleteEvento(id: string) {
        await this.eventoRepository.deleteEvento(new Bson.ObjectId(id));
    }

    public duracionMinima(dateA: Date, dateB: Date): boolean {
        const diferencia = dateB.getTime() - dateA.getTime();
        const dias = diferencia / 86400000;
        console.log(`${dias} días`);
        return dias >= 7;
    }
}