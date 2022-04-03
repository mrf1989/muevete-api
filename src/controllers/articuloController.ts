import { Controller, POST, RequestBody, Bson } from "../../deps.ts";
import { ArticuloService } from "../services/services.ts";
import { Articulo } from "../models/models.ts";

@Controller("/api")
export class ArticuloController {
    constructor(private readonly articuloService: ArticuloService) {}

    @POST("/admin/articulos")
    public async createArticulo(@RequestBody() payload: Articulo) {
        const articulo = payload as Articulo;
        articulo.usuario_id = new Bson.ObjectId(articulo.usuario_id);
        await this.articuloService.createArticulo(articulo);
    }
}
