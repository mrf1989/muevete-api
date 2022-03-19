import { Component, Bson, Database, Collection } from "../../deps.ts";
import { DBManagement } from "../database/mongodb.ts";
import { Usuario } from "../models/models.ts";

@Component()
export class UsuarioRepository {
    private db!: Database;
    private usuarios!: Collection<Usuario>;

    constructor(private readonly storage: DBManagement) {
        this.init();
    }

    private async init() {
        this.db = await this.storage.connect();
        this.usuarios = this.storage.getCollection("usuarios", this.db);
    }
    
    public async getAll(): Promise<Usuario[]> {
        const usuarios = await this.usuarios.find().toArray();
        if (!usuarios) throw new Error("No se encuentran usuarios");
        return usuarios;
    }

    public async getUsuario(id: Bson.ObjectID): Promise<Usuario> {
        const usuario = await this.usuarios.findOne({"_id": id});
        if (!usuario) throw new Error("Usuario no encontrado");
        return usuario;
    }

    public async getUsuarioByUsername(username: string): Promise<Usuario | number> {
        const usuario = await this.usuarios.findOne({"username": username});
        if (!usuario) return 0;
        return usuario;
    }

    public async createUsuario(usuario: Usuario) {
        const res = await this.usuarios.insertOne(usuario);
        if (!res) throw new Error("Error en la creación del usuario");
    }

    public async updateUsuario<T extends Usuario>(id: Bson.ObjectID, payload: T) {
        await this.usuarios.updateOne({"_id": id}, {$set: payload});
    }

    public async deleteUsuario(id: Bson.ObjectID) {
        await this.usuarios.deleteOne({"_id": id});
    }
}