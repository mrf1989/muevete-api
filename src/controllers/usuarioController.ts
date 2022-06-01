import {
  AllowOnly,
  AuthPrincipal,
  Controller,
  DELETE,
  GET,
  Mandarine,
  POST,
  PUT,
  RequestBody,
  RouteParam,
} from "../../deps.ts";
import { UsuarioService } from "../services/services.ts";
import { Usuario } from "../models/models.ts";

@Controller("/api")
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
  ) {}

  @GET("/admin/usuarios")
  @AllowOnly("hasRole('ADMIN')")
  public async getAllUsuarios() {
    try {
      return await this.usuarioService.getAllUsuarios();
    } catch (err) {
      throw err;
    }
  }

  @GET("/usuarios/:id")
  public async getUsuario(@RouteParam("id") id: string) {
    return await this.usuarioService.getUsuario(id);
  }

  @PUT("/usuarios/:id")
  public async updateUsuario<T extends Usuario>(
    @RouteParam("id") id: string,
    @RequestBody() payload: T,
  ) {
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

  @DELETE("/admin/usuarios/:id")
  @AllowOnly("hasRole('ADMIN')")
  public async deleteUsuario(@RouteParam("id") id: string) {
    await this.usuarioService.deleteUsuario(id);
  }

  @GET("/login-success")
  public loginUsuarioSuccess(
    @AuthPrincipal() usuario: Mandarine.Types.UserDetails,
  ) {
    console.log(usuario.uid);
  }
}
