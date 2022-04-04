import { Service, Bson } from "../../deps.ts";
import { EventoRepository } from "../repositories/repositories.ts";
import { Evento } from "../models/models.ts";

const ERROR_DURACION_EVENTO = new Error("El evento debe durar un mínimo de 7 días");

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
        evento.fechaCreacion = new Date(Date.now());
        evento.fechaInicio = new Date(evento.fechaInicio);
        evento.fechaFin = new Date(evento.fechaFin);
        const duracionMinima = this.duracionMinima(evento.fechaInicio, evento.fechaFin);
        if (duracionMinima) {
            await this.eventoRepository.createEvento(evento);
            return true;
        } else {
            throw ERROR_DURACION_EVENTO;
        }
    }
    
    public async updateEvento<T extends Evento>(id: string, payload: T) {
        const eventoId = new Bson.ObjectId(id);
        const evento = await this.eventoRepository.getEvento(eventoId);
        if (payload.fechaInicio) evento.fechaInicio = new Date(payload.fechaInicio);
        if (payload.fechaFin) evento.fechaFin = new Date(payload.fechaFin);
        const duracionMinima = this.duracionMinima(evento.fechaInicio, evento.fechaFin);
        if (duracionMinima) {
            const res = await this.eventoRepository.updateEvento(eventoId, payload);
            if (!res) throw new Error("El evento no se ha podido actualizar");
            return res;
        } else {
            throw ERROR_DURACION_EVENTO;
        }
    }

    public async deleteEvento(id: string) {
        const res = await this.eventoRepository.deleteEvento(new Bson.ObjectId(id));
        if (!res) throw new Error("El evento no ha podido ser eliminado");
        return res;
    }

    public duracionMinima(dateA: Date, dateB: Date): boolean {
        const diferencia = dateB.getTime() - dateA.getTime();
        const dias = diferencia / 86400000;
        return dias >= 7;
    }
}