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

    public async createUsuario(usuario: Usuario): Promise<boolean> {
        const nuevoUsuario = usuario;
        nuevoUsuario.password = this.hashPassword(nuevoUsuario.password);
        const username = nuevoUsuario.username;
        const usuarioExiste = await this.usuarioRepository.getUsuarioByUsername(username);
        if (!usuarioExiste) {
            try {
                await this.usuarioRepository.createUsuario(usuario);
                return true;
            } catch (err) {
                throw err;
            }
        } else {
            throw new Error(`El username ${username} no está disponible`);
        }
    }
    
    public async updateUsuario(id: string, payload: Object) {
        return await this.usuarioRepository.updateUsuario(new Bson.ObjectId(id), payload);
    }

    public async deleteUsuario(id: string) {
        await this.usuarioRepository.deleteUsuario(new Bson.ObjectId(id));
    }

    private hashPassword(password: string): string {
        return createHash("sha3-256").update(password).toString();
    }
}