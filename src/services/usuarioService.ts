import { Service, Bson, createHash } from "../../deps.ts";
import { UsuarioRepository } from "../repositories/usuarioRepository.ts";
import { Usuario } from "../models/models.ts";

@Service()
export class UsuarioService {
    constructor(private readonly usuarioRepository: UsuarioRepository) {}

    public async getAllUsuarios() {
        return await this.usuarioRepository.getAll();
    }

    public async getUsuario(id: string) {
        return await this.usuarioRepository.getUsuario(new Bson.ObjectId(id));
    }

    public async createUsuario(payload: Usuario): Promise<boolean> {
        const nuevoUsuario = payload;
        nuevoUsuario.password = this.hashPassword(nuevoUsuario.password);
        const username = nuevoUsuario.username;
        const usuario = await this.existeUsuario(username);       

        if (!usuario) {
            try {
                await this.usuarioRepository.createUsuario(payload);
                return true;
            } catch (err) {
                throw err;
            }
        } else {
            throw new Error(`El username ${username} no está disponible`);
        }
    }
    
    public async updateUsuario<T extends Usuario>(id: string, payload: T) {
        return await this.usuarioRepository.updateUsuario(new Bson.ObjectId(id), payload);
    }

    public async deleteUsuario(id: string) {
        await this.usuarioRepository.deleteUsuario(new Bson.ObjectId(id));
    }

    public async loginUsuario(payload: { username: string, password: string }): Promise<boolean> {
        const error = new Error(`El usuario o la contraseña introducidos no son correctos`);
        const usuario = await this.usuarioRepository.getUsuarioByUsername(payload.username);

        if (usuario) {
            const autentica = this.comparaPassword(payload.password, usuario.password);
            if (!autentica) throw error;
            return true;
        } else {
            throw error;
        }
    }

    private async existeUsuario(username: string): Promise<boolean> {
        try {
            await this.usuarioRepository.getUsuarioByUsername(username);
            return true;
        } catch (err) {
            return false;
        }
    }

    private hashPassword(password: string): string {
        return createHash("sha3-256").update(password).toString();
    }

    private comparaPassword(entrante: string, original: string): boolean {
        let res = false;
        const entranteHash = this.hashPassword(entrante);
        if (entranteHash == original) {
            res = true;
        }
        return res;
    }
}