import { Bson, Service } from "../../deps.ts";
import {
  DorsalRepository,
  EsfuerzoRepository,
  EventoRepository,
} from "../repositories/repositories.ts";
import { Esfuerzo } from "../models/models.ts";

@Service()
export class EsfuerzoService {
  constructor(
    private readonly esfuerzoRepository: EsfuerzoRepository,
    private readonly dorsalRepository: DorsalRepository,
    private readonly eventoRepository: EventoRepository,
  ) {}

  public async getAllEsfuerzos(
    _filtros: Map<string, string>,
  ): Promise<Esfuerzo[]> {
    try {
      const filter: Bson.Document = {};
      return await this.esfuerzoRepository.getAll(filter);
    } catch (err) {
      throw err;
    }
  }

  public async getEsfuerzo(id: string): Promise<Esfuerzo> {
    try {
      return await this.esfuerzoRepository.getEsfuerzo(new Bson.ObjectId(id));
    } catch (err) {
      throw err;
    }
  }

  public async createEsfuerzo(payload: Esfuerzo): Promise<Bson.Document> {
    const esfuerzo: Esfuerzo = payload as Esfuerzo;
    const dorsal = await this.dorsalRepository.getDorsal(esfuerzo.dorsal_id);
    const eventoId = dorsal.evento_id;
    const evento = await this.eventoRepository.getEvento(eventoId);
    const dorsales =
      (await this.dorsalRepository.getAll({ "evento_id": { $eq: eventoId } }))
        .map((dorsal) => (dorsal._id!.toHexString()));
    const esfuerzosTotalesEnEvento = await this.esfuerzoRepository
      .getEsfuerzosTotales(dorsales);

    if (evento.objetivoKm >= esfuerzosTotalesEnEvento + esfuerzo.numKm) {
      if (evento.modalidad.includes(esfuerzo.modalidad)) {
        try {
          esfuerzo.fecha = new Date();
          return await this.esfuerzoRepository.createEsfuerzo(esfuerzo);
        } catch (err) {
          throw err;
        }
      } else {
        throw new Error(
          "No pueden realizarse esfuerzos en una modalidad no permitida en el evento",
        );
      }
    } else {
      throw new Error(
        "No pueden realizarse más esfuerzos para un evento completado",
      );
    }
  }

  public async getEsfuerzosPorDorsal(id: string): Promise<Esfuerzo[]> {
    try {
      const dorsalId = new Bson.ObjectId(id);
      return await this.esfuerzoRepository.getAll({ "dorsal_id": dorsalId });
    } catch (err) {
      throw err;
    }
  }

  public async getEsfuerzosPorEvento(id: string): Promise<Esfuerzo[]> {
    try {
      const eventoId = new Bson.ObjectId(id);
      const dorsales =
        (await this.dorsalRepository.getAll({ "evento_id": { $eq: eventoId } }))
          .map((dorsal) => (dorsal._id!.toHexString()));
      return await this.esfuerzoRepository.getEsfuerzosPorDorsales(dorsales);
    } catch (err) {
      throw err;
    }
  }

  public async getEsfuerzosPorUsuario(id: string): Promise<Esfuerzo[]> {
    try {
      const usuarioId = new Bson.ObjectId(id);
      return await this.esfuerzoRepository.getEsfuerzosPorUsuario(usuarioId);
    } catch (err) {
      throw err;
    }
  }
}
