import { Controller, GET, PUT, POST, DELETE, RouteParam, RequestBody } from "../../deps.ts";
import { UsuarioService } from "../services/usuarioService.ts";
import { Usuario } from "../models/models.ts";

@Controller("/api")
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
    public async updateUsuario<T extends Usuario>(@RouteParam("id") id: string, @RequestBody() payload: T) {
        try {
            await this.usuarioService.updateUsuario(id, payload);
        } catch (err) {
            throw err;
        }
    }

    @POST("/usuarios")
    public async createUsuario(@RequestBody() payload: Usuario) {
        const usuario = payload as Usuario;
        await this.usuarioService.createUsuario(usuario);
    }

    @DELETE("/usuarios/:id")
    public async deleteUsuario(@RouteParam("id") id: string) {
        await this.usuarioService.deleteUsuario(id);
    }

    @POST("/usuarios/login")
    public async loginUsuario(@RequestBody() payload: { username: string, password: string }) {
        await this.usuarioService.loginUsuario(payload);
    }
}