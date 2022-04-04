import { Controller, POST, RequestBody, Bson, PUT, RouteParam, RequestParam, ResponseParam } from "../../deps.ts";
import { ArticuloService, AuthService } from "../services/services.ts";
import { Articulo } from "../models/models.ts";
import { authUtils } from "../utils/utils.ts";

@Controller("/api")
export class ArticuloController {
    constructor(private readonly articuloService: ArticuloService,
        private readonly authService: AuthService) {}

    @POST("/admin/articulos")
    public async createArticulo(@RequestBody() payload: Articulo, @RequestParam() request: Request,
        @ResponseParam() response: Response) {
        try {
            this.getAuthorization(request, response);
            const articulo = payload as Articulo;
            articulo.usuario_id = new Bson.ObjectId(articulo.usuario_id);
            await this.articuloService.createArticulo(articulo);
        } catch (err) {
            throw err;
        }
    }

    @PUT("/admin/articulos/:id")
    public async updateArticulo<T extends Articulo>(@RouteParam("id") id: string, @RequestBody() payload: T,
        @RequestParam() request: Request, @ResponseParam() response: Response) {
        try {
            this.getAuthorization(request, response);
            await this.articuloService.updateArticulo(id, payload);
        } catch (err) {
            throw err;
        }
    }

    private async getAuthorization(@RequestParam() request: Request, @ResponseParam() response: Response) {
        const userSession = await this.authService.isAuth(request.headers.get("cookie")!);
        if (userSession) response.headers.set("Set-Cookie", authUtils.updateCookies(userSession));
    }
}
