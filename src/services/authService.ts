import { Service } from "../../deps.ts";
import { UserSession } from "../models/models.ts";
import { AuthRepository, UsuarioRepository } from "../repositories/repositories.ts";
import { authUtils } from "../utils/utils.ts";

@Service()
export class AuthService {
    constructor(private readonly authRepository: AuthRepository,
        private readonly usuarioRepository: UsuarioRepository) {}

    public async isAuth(cookie: string): Promise<UserSession | undefined> {
        const cookies = cookie.split("##");
        const username = cookies[0].trim();
        const hash = cookies[2].trim();
        const expiracion = parseInt(cookies[3].trim());
        const usuario = await this.authRepository.getSessionByUsername(username);
        const usuarioHash = usuario.session!.hash;
    
        if (usuarioHash === hash) {
            if (expiracion <= Date.now()) {
                return await this.authRepository.registrarSesion(username);
            }
        } else {
            throw new Error("Acceso no autorizado");
        }
    }

    public async registrarSesion(username: string): Promise<UserSession> {
        const userSession = await this.authRepository.registrarSesion(username);
        return userSession;
    }

    public async logoutUsuario(username: string): Promise<void> {
        await this.authRepository.anularSesion(username);
    }

    public async loginUsuario(payload: { username: string, password: string }): Promise<boolean> {
        const error = new Error(`El usuario o la contraseña introducidos no son correctos`);
        const usuario = await this.usuarioRepository.getUsuarioByUsername(payload.username);

        if (usuario) {
            const autentica = authUtils.comparaPassword(payload.password, usuario.password);
            if (!autentica) throw error;
            return autentica;
        } else {
            throw error;
        }
    }
}