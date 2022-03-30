import { Service, Bson } from "../../deps.ts";
import { UsuarioRepository } from "../repositories/repositories.ts";
import { Usuario } from "../models/models.ts";
import { authUtils } from "../utils/utils.ts";

@Service()
export class UsuarioService {
    constructor(private readonly usuarioRepository: UsuarioRepository) {}

    public async getAllUsuarios() {
        return await this.usuarioRepository.getAll();
    }

    public async getUsuario(id: string) {
        try {
            return await this.usuarioRepository.getUsuario(new Bson.ObjectId(id));
        } catch (err) {
            throw err;
        }
    }

    public async createUsuario(payload: Usuario): Promise<boolean> {
        const nuevoUsuario = payload;
        nuevoUsuario.password = authUtils.hashPassword(nuevoUsuario.password);
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
    
    public async updateUsuario<T extends Usuario>(id: string, payload: T): Promise<boolean> {
        try {
            const usuario = await this.getUsuario(id);
            await this.usuarioRepository.updateUsuario(usuario._id as Bson.ObjectID, payload);
            return true;
        } catch (err) {
            throw err;
        }
    }

    public async deleteUsuario(id: string) {
        await this.usuarioRepository.deleteUsuario(new Bson.ObjectId(id));
    }

    private async existeUsuario(username: string): Promise<boolean> {
        try {
            await this.usuarioRepository.getUsuarioByUsername(username);
            return true;
        } catch (_err) {
            return false;
        }
    }
}