import { Controller, GET, PUT, POST, DELETE, RouteParam, RequestBody } from "../../deps.ts";
import { UsuarioService } from "../services/usuarioService.ts";

@Controller()
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @GET("/usuarios")
    public async getAllUsuarios() {
        return await this.usuarioService.getAllUsuarios();
    }

    @GET("/usuarios/:id")
    public async getUsuario(@RouteParam("id") id: string) {
        return await this.usuarioService.getUsuario(id);
    }

    @PUT("/usuarios/:id")
    public async updateUsuario(@RouteParam("id") id: string, @RequestBody() payload: Object) {
        await this.usuarioService.updateUsuario(id, payload);
    }

    @POST("/usuarios")
    public async createUsuario(@RequestBody() payload: Object) {
        await this.usuarioService.createUsuario(payload);
    }

    @DELETE("/usuarios/:id")
    public async deleteUsuario(@RouteParam("id") id: string) {
        await this.usuarioService.deleteUsuario(id);
    }
}