import { Bson, Collection, Component, Database } from "../../deps.ts";
import { DBManagement } from "../database/mongodb.ts";
import { Newsletter } from "../models/models.ts";

@Component()
export class NewsletterRepository {
  private db!: Database;
  private newsletters!: Collection<Newsletter>;

  constructor(private readonly storage: DBManagement) {
    this.init();
  }

  private async init() {
    this.db = await this.storage.connect();
    this.newsletters = this.storage.getCollection("newsletters", this.db);
  }

  public async getAll(): Promise<Newsletter[]> {
    const newsletters = await this.newsletters.find({}, {
      noCursorTimeout: false,
    }).toArray();
    return newsletters;
  }

  public async getNewsletter(id: Bson.ObjectId): Promise<Newsletter> {
    const newsletter = await this.newsletters.findOne({ "_id": id }, {
      noCursorTimeout: false,
    });
    if (!newsletter) throw new Error("Newsletter no encontrada");
    return newsletter;
  }

  public async createNewsletter(
    newsletter: Newsletter,
  ): Promise<Bson.Document> {
    const res = await this.newsletters.insertOne(newsletter);
    if (!res) throw new Error("Error en la creación de la newsletter");
    return res;
  }

  public async updateNewsletter<T extends Newsletter>(
    id: Bson.ObjectId,
    payload: T,
  ): Promise<Newsletter> {
    try {
      const res = await this.newsletters.updateOne(
        { "_id": id },
        { $set: payload },
        { upsert: true },
      );
      if (res.modifiedCount != 1) {
        throw new Error("Error en la actualización de la newsletter");
      }
      return await this.getNewsletter(id);
    } catch (err) {
      throw err;
    }
  }
}
