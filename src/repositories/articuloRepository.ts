import { Component, Database, Collection, Bson } from "../../deps.ts";
import { DBManagement } from "../database/mongodb.ts";
import { Articulo } from "../models/models.ts";

@Component()
export class ArticuloRepository {
    private db!: Database;
    private articulos!: Collection<Articulo>;

    constructor(private readonly storage: DBManagement) {
        this.init();
    }

    private async init() {
        this.db = await this.storage.connect();
        this.articulos = this.storage.getCollection("articulos", this.db);
    }

    public async getArticulo(id: Bson.ObjectID): Promise<Articulo> {
        const articulo = await this.articulos.findOne({"_id": id});
        if (!articulo) throw new Error("Artículo no encontrado");
        return articulo;
    }

    public async createArticulo(articulo: Articulo) {
        const res = await this.articulos.insertOne(articulo);
        if (!res) throw new Error("Error en la creación del artículo");
    }

    public async updateArticulo<T extends Articulo>(id: Bson.ObjectID, payload: T) {
        await this.articulos.updateOne({"_id": id}, {$set: payload});
    }

    public async deleteArticulo(id: Bson.ObjectID) {
        await this.articulos.deleteOne({"_id": id});
    }
}