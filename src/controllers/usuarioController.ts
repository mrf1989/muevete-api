import { Controller, GET, PUT, POST, DELETE, RouteParam, RequestBody,
    ResponseParam, RequestParam  } from "../../deps.ts";
import { UsuarioService, AuthService } from "../services/services.ts";
import { Usuario } from "../models/models.ts";
import { authUtils } from "../utils/utils.ts";

@Controller("/api")
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService,
        private readonly authService: AuthService) {}

    @GET("/admin/usuarios")
    public async getAllUsuarios(@RequestParam() request: Request, @ResponseParam() response: Response) {
        try {
            const userSession = await this.authService.isAuth(request.headers.get("cookie")!);
            if (userSession) response.headers.set("Set-Cookie", authUtils.updateCookies(userSession));
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

    @DELETE("/admin/usuarios/:id")
    public async deleteUsuario(@RouteParam("id") id: string) {
        await this.usuarioService.deleteUsuario(id);
    }
    
    @POST("/usuarios/login")
    public async loginUsuario(@RequestBody() payload: { username: string, password: string },
        @ResponseParam() response: Response) {
        try {
            const logged = await this.authService.loginUsuario(payload);
            if (logged) {
                const session = await this.authService.registrarSesion(payload.username);
                response.headers.set("Set-Cookie",
                    `userSession=${payload.username}##${session.rol}##${session.hash}##${session.expiracion.getTime()}; Path=/api`);
            }
        } catch (err) {
            throw err;
        }
    }

    @POST("/usuarios/logout")
    public async logoutUsuario(@ResponseParam() response: Response,
        @RequestBody() payload: { username: string }) {
        try {
            await this.authService.logoutUsuario(payload.username);
            response.headers.set("Set-Cookie", `userSession=deleted; Path=/api`);
        } catch (err) {
            throw err;
        }
    }
}