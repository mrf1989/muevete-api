import { Service, Bson } from "../../deps.ts";
import { UsuarioRepository } from "../repositories/usuarioRepository.ts";
import { Usuario } from "../models/usuario.ts";

@Service()
export class UsuarioService {
    constructor(private readonly usuarioRepository: UsuarioRepository) {}

    public async getAllUsuarios() {
        return await this.usuarioRepository.getAll();
    }

    public async getUsuario(id: string) {
        return await this.usuarioRepository.getUsuario(new Bson.ObjectId(id));
    }

    public async createUsuario(payload: Object) {
        const usuario: Usuario = payload as Usuario;
        await this.usuarioRepository.createUsuario(usuario);
    }
    
    public async updateUsuario(id: string, payload: Object) {
        return await this.usuarioRepository.updateUsuario(new Bson.ObjectId(id), payload);
    }

    public async deleteUsuario(id: string) {
        await this.usuarioRepository.deleteUsuario(new Bson.ObjectId(id));
    }
}