import { Service } from "../../deps.ts";
import { ArticuloRepository } from "../repositories/repositories.ts";
import { Articulo } from "../models/models.ts";

@Service()
export class ArticuloService {
    constructor(private readonly articuloRepository: ArticuloRepository) {}

    public async createArticulo(payload: Articulo): Promise<boolean> {
        try {
            await this.articuloRepository.createArticulo(payload);
            return true;
        } catch (err) {
            throw err;
        }
    }
}