import { Service, Bson } from "../../deps.ts";
import { EsfuerzoRepository, DorsalRepository, EventoRepository } from "../repositories/repositories.ts";
import { Esfuerzo } from "../models/models.ts";

@Service()
export class EsfuerzoService {
    constructor(private readonly esfuerzoRepository: EsfuerzoRepository,
        private readonly dorsalRepository: DorsalRepository, private readonly eventoRepository: EventoRepository) {}

    public async getAllEsfuerzos(_filtros: Map<string, string>): Promise<Esfuerzo[]> {
        const filter: Bson.Document = {};
        return await this.esfuerzoRepository.getAll(filter);
    }

    public async getEsfuerzo(id: string): Promise<Esfuerzo> {
        return await this.esfuerzoRepository.getEsfuerzo(new Bson.ObjectId(id));
    }

    public async createEsfuerzo(payload: Esfuerzo): Promise<boolean> {
        const esfuerzo: Esfuerzo = payload as Esfuerzo;
        const dorsal = await this.dorsalRepository.getDorsal(esfuerzo.dorsal_id.id);
        const eventoId = dorsal.evento_id;
        const evento = await this.eventoRepository.getEvento(eventoId);
        const dorsales =  (await this.dorsalRepository.getAll({ "evento_id": { $eq: eventoId } }))
            .map(dorsal => (dorsal._id!.toHexString()));
        const esfuerzosTotalesEnEvento = await this.esfuerzoRepository.getEsfuerzosTotales(dorsales);
        
        if (evento.objetivoKm >= esfuerzosTotalesEnEvento + esfuerzo.numKm) {
            if (evento.modalidad.includes(esfuerzo.modalidad)) {
                try {
                    await this.esfuerzoRepository.createEsfuerzo(esfuerzo);
                    return true;
                } catch (err) {
                    throw err;
                }
            } else {
                throw new Error("No pueden realizarse esfuerzos en una modalidad no permitida en el evento");
            }
        } else {
            throw new Error("No pueden realizarse más esfuerzos para un evento completado");
        }
    }
}