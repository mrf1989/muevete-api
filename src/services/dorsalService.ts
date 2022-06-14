import { Bson, Service } from "../../deps.ts";
import {
  DorsalRepository,
  EsfuerzoRepository,
  EventoRepository,
} from "../repositories/repositories.ts";
import { EsfuerzoService, EventoService } from "./services.ts";
import { Dorsal, Evento } from "../models/models.ts";

const MAX_INSCRIPCIONES = 3;

@Service()
export class DorsalService {
  constructor(
    private readonly dorsalRepository: DorsalRepository,
    private readonly esfuerzoRepository: EsfuerzoRepository,
    private readonly eventoRepository: EventoRepository,
    private readonly eventoService: EventoService,
    private readonly esfuerzoService: EsfuerzoService,
  ) {}

  public async getAllDorsales(
    _filtros: Map<string, string>,
  ): Promise<Dorsal[]> {
    try {
      const filter: Bson.Document = {};
      return await this.dorsalRepository.getAll(filter);
    } catch (err) {
      throw err;
    }
  }

  public async getDorsal(id: string): Promise<Dorsal> {
    try {
      return await this.dorsalRepository.getDorsal(new Bson.ObjectId(id));
    } catch (err) {
      throw err;
    }
  }

  public async createDorsal(payload: Dorsal): Promise<Bson.Document> {
    const dorsal: Dorsal = payload as Dorsal;
    const usuarioParticipante = await this.existeDorsal(dorsal);
    const eventosId = (await this.getDorsalesPorUsuario(dorsal.usuario_id.toHexString()))
      .map((dorsal: Dorsal) => new Bson.ObjectId(dorsal.evento_id).toHexString());
    const eventosIncompletos = await this.getEventosIncompletos(eventosId);

    const inscripcionesMinimas = (eventosId.length < MAX_INSCRIPCIONES) &&
      (eventosIncompletos < MAX_INSCRIPCIONES);

    if (!usuarioParticipante && inscripcionesMinimas) {
      try {
        const num = (await this.dorsalRepository.getAll({
          "evento_id": dorsal.evento_id,
        }))
          .length + 1;
        dorsal.num = num;
        return await this.dorsalRepository.createDorsal(dorsal);
      } catch (err) {
        throw err;
      }
    } else {
      throw new Error(
        "El usuario no cumple lo requisitos para inscribirse " +
          "o ya disponía de un dorsal para el evento",
      );
    }
  }

  public async updateDorsal<T extends Dorsal>(
    id: string,
    payload: T,
  ): Promise<Dorsal> {
    try {
      const dorsalId = new Bson.ObjectId(id);
      return await this.dorsalRepository.updateDorsal(dorsalId, payload);
    } catch (err) {
      throw err;
    }
  }

  public async getDorsalesPorUsuario(id: string): Promise<Dorsal[]> {
    try {
      const usuarioId = new Bson.ObjectId(id);
      return await this.dorsalRepository.getAll({ "usuario_id": usuarioId });
    } catch (err) {
      throw err;
    }
  }

  public async getDorsalesPorEvento(id: string): Promise<Dorsal[]> {
    try {
      const eventoId = new Bson.ObjectId(id);
      return await this.dorsalRepository.getAll({ "evento_id": eventoId });
    } catch (err) {
      throw err;
    }
  }

  private async existeDorsal(dorsal: Dorsal): Promise<boolean> {
    return (await this.dorsalRepository
      .getAll({
        "usuario_id": dorsal.usuario_id,
        "evento_id": dorsal.evento_id,
      })).length > 0;
  }

  private async getEventosIncompletos(eventosId: string[]): Promise<number> {
    let eventosIncompletos = 0;

    const eventos = (await this.eventoRepository.getEventos(eventosId))
      .entries();

    while (eventosIncompletos < MAX_INSCRIPCIONES) {
      const evento: Evento = eventos.next().value;
      if (evento.fechaFin > new Date()) {
        const dorsalesId = (await this.getDorsalesPorEvento(evento._id!.toHexString()))
          .map((dorsal: Dorsal) => dorsal._id!.toHexString());
        const esfuerzosTotalesEnEvento = await this.esfuerzoRepository
          .getEsfuerzosTotales(dorsalesId);
        if (esfuerzosTotalesEnEvento < evento.objetivoKm) {
          eventosIncompletos++;
        }
      }
    }

    return eventosIncompletos;
  }
}
