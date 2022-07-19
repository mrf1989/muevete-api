import { Bson, Service } from "../../deps.ts";
import {
  DorsalRepository,
  EsfuerzoRepository,
  EventoRepository,
} from "../repositories/repositories.ts";
import { Dorsal, Evento } from "../models/models.ts";

const MAX_INSCRIPCIONES = 3;

@Service()
export class DorsalService {
  constructor(
    private readonly dorsalRepository: DorsalRepository,
    private readonly esfuerzoRepository: EsfuerzoRepository,
    private readonly eventoRepository: EventoRepository,
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
    const eventosId =
      (await this.getDorsalesPorUsuario(dorsal.usuario_id.toHexString()))
        .map((dorsal: Dorsal) =>
          new Bson.ObjectId(dorsal.evento_id).toHexString()
        );
    const eventosIncompletos = await this.getEventosIncompletos(eventosId);
    const inscripcionesMinimas = eventosIncompletos < MAX_INSCRIPCIONES;

    if (!usuarioParticipante && inscripcionesMinimas) {
      try {
        dorsal.num = await this.getNuevoNumeroDorsal(dorsal.evento_id);
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
    try {
      return (await this.dorsalRepository
        .getAll({
          "usuario_id": dorsal.usuario_id,
          "evento_id": dorsal.evento_id,
        })).length > 0;
    } catch (_err) {
      return false;
    }
  }

  private async getEventosIncompletos(eventosId: string[]): Promise<number> {
    let eventosIncompletos = 0;
    const eventos = (await this.eventoRepository.getEventos(eventosId))
      .entries();

    while (eventosIncompletos < MAX_INSCRIPCIONES) {
      const evento = eventos.next().value;
      if (!evento) return eventosIncompletos;
      if (this.esEventoActivo(evento[1])) {
        const dorsalesId =
          (await this.getDorsalesPorEvento(evento[1]._id!.toHexString()))
            .map((dorsal: Dorsal) => dorsal._id!.toHexString());
        const esfuerzosTotalesEnEvento = await this.esfuerzoRepository
          .getEsfuerzosTotales(dorsalesId);
        if (esfuerzosTotalesEnEvento < evento[1].objetivoKm) {
          eventosIncompletos++;
        }
      }
    }

    return eventosIncompletos;
  }

  private async getNuevoNumeroDorsal(eventoId: Bson.ObjectId): Promise<number> {
    try {
      return (await this.dorsalRepository.getAll({
        "evento_id": eventoId,
      }))
        .length + 1;
    } catch (_err) {
      return 1;
    }
  }

  private esEventoActivo(evento: Evento): boolean {
    const fechaActual = new Date();
    const fechaInicio = new Date(evento.fechaInicio);
    const fechaFin = new Date(evento.fechaFin);

    return (fechaInicio < fechaActual) && (fechaFin > fechaActual);
  }
}
