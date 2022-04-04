import { Component, Database, Collection } from "../../deps.ts";
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

    public async createArticulo(articulo: Articulo) {
        const res = await this.articulos.insertOne(articulo);
        if (!res) throw new Error("Error en la creación del artículo");
    }
}