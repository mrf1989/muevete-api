import { Bson, Collection, Component, Database } from "../../deps.ts";
import { DBManagement } from "../database/mongodb.ts";
import { Esfuerzo } from "../models/models.ts";

@Component()
export class EsfuerzoRepository {
  private db!: Database;
  private esfuerzos!: Collection<Esfuerzo>;

  constructor(private readonly storage: DBManagement) {
    this.init();
  }

  private async init() {
    this.db = await this.storage.connect();
    this.esfuerzos = this.storage.getCollection("esfuerzos", this.db);
  }

  public async getAll(filter: Bson.Document): Promise<Esfuerzo[]> {
    const esfuerzos = await this.esfuerzos.find(filter, {
      noCursorTimeout: false,
    }).toArray();
    if (!esfuerzos.length) throw new Error("No se han encontrado esfuerzos");
    return esfuerzos;
  }

  public async getEsfuerzo(id: Bson.ObjectID): Promise<Esfuerzo> {
    const esfuerzo = await this.esfuerzos.findOne({ "_id": id }, {
      noCursorTimeout: false,
    });
    if (!esfuerzo) throw new Error("Esfuerzo no encontrado");
    return esfuerzo;
  }

  public async createEsfuerzo(esfuerzo: Esfuerzo): Promise<Bson.Document> {
    const res = await this.esfuerzos.insertOne(esfuerzo);
    if (!res) throw new Error("Error en la creación del esfuerzo");
    return res;
  }

  public async getEsfuerzosTotales(dorsales: string[]) {
    const esfuerzos = await this.getEsfuerzosPorDorsales(dorsales);
    let acum = 0;
    esfuerzos.forEach((esfuerzo) => acum = acum + esfuerzo.numKm);
    return acum;
  }

  public async getEsfuerzosPorDorsales(
    dorsales: string[],
  ): Promise<Esfuerzo[]> {
    const dorsalesId = dorsales.map((id) => new Bson.ObjectId(id));
    const esfuerzos = await this.esfuerzos.find({
      "dorsal_id": { $in: dorsalesId },
    }, { noCursorTimeout: false }).toArray();
    return esfuerzos;
  }

  public async getEsfuerzosPorUsuario(id: Bson.ObjectId): Promise<Esfuerzo[]> {
    return await this.esfuerzos.find({
      "usuario_id": id,
    }, { noCursorTimeout: false }).toArray();
  }
}
