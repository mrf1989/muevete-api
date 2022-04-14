import { Service, Bson } from "../../deps.ts";
import { DorsalRepository } from "../repositories/repositories.ts";
import { EventoService } from "./services.ts";
import { Dorsal } from "../models/models.ts";

@Service()
export class DorsalService {
    constructor(private readonly dorsalRepository: DorsalRepository,
        private readonly eventoService: EventoService) {}

    public async getAllDorsales(_filtros: Map<string, string>) {
        const filter: Bson.Document = {};
        return await this.dorsalRepository.getAll(filter);
    }

    public async getDorsal(id: string) {
        return await this.dorsalRepository.getDorsal(new Bson.ObjectId(id));
    }

    public async createDorsal(payload: Dorsal): Promise<boolean> {
        const dorsal: Dorsal = payload as Dorsal;
        try {
            await this.eventoService.getEvento(String(dorsal.evento_id));
        } catch (err) {
            throw err;
        }
        const usuarioParticipante = (await this.dorsalRepository
            .getAll({"usuario_id": dorsal.usuario_id, "evento_id": dorsal.evento_id})).length;
        if (!usuarioParticipante) {
            const num = (await this.dorsalRepository.getAll({"evento_id": dorsal.evento_id})).length + 1;
            dorsal.num = num;
            await this.dorsalRepository.createDorsal(dorsal);
            return true;
        } else {
            throw new Error("El usuario ya tiene un dorsal para el evento");
        }
    }
    
    public async updateDorsal<T extends Dorsal>(id: string, payload: T) {
        const dorsalId = new Bson.ObjectId(id);
        const res = await this.dorsalRepository.updateDorsal(dorsalId, payload);
        if (!res) throw new Error("El dorsal no se ha podido actualizar");
        return res;
    }
}