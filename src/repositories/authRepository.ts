import { Component, Database, Collection, createHash } from "../../deps.ts";
import { DBManagement } from "../database/mongodb.ts";
import { Usuario, UserSession } from "../models/models.ts";

@Component()
export class AuthRepository {
    private db!: Database;
    private usuarios!: Collection<Usuario>;

    constructor(private readonly storage: DBManagement) {
        this.init();
    }

    private async init() {
        this.db = await this.storage.connect();
        this.usuarios = this.storage.getCollection("usuarios", this.db);
    }

    public async getSessionByUsername(username: string): Promise<Usuario> {
        const usuario = await this.usuarios.findOne({"username": username},
            {noCursorTimeout: false, projection: {"session": 1}});
        if (!usuario) throw new Error(`${username} no existe`);
        return usuario;
    }

    public async registrarSesion(username: string): Promise<UserSession> {
        const hash = createHash("sha512").update(username).toString();
        let rol;
        try {
            const usuario = await this.usuarios.findOne({"username": username}, { noCursorTimeout: false });
            rol = usuario?.rol;
            await this.usuarios.updateOne({"username": username}, {$set: {"session": {"hash": hash, "expiracion": new Date(Date.now() + 3600000)}}});
        } catch (err) {
            throw err;
        }
        return {"username": username, "hash": hash, "expiracion": new Date(Date.now() + 3600000), "rol": rol};
    }

    public async anularSesion(username: string) {
        try {
            await this.usuarios.updateOne({"username": username}, {$set: {"session": {"hash": null, "expiracion": null}}});
        } catch (err) {
            throw err;   
        }
    }
}