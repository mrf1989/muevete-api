import { Controller, GET, PUT, POST, DELETE, RouteParam, RequestBody } from "../../deps.ts";
import { EventoService } from "../services/services.ts";
import { Evento } from "../models/models.ts";

@Controller("/api")
export class EventoController {
    constructor(private readonly eventoService: EventoService) {}

    @GET("/eventos")
    public async getAllEventos() {
        return await this.eventoService.getAllEventos();
    }

    @GET("/eventos/:id")
    public async getEvento(@RouteParam("id") id: string) {
        return await this.eventoService.getEvento(id);
    }

    @PUT("/eventos/:id")
    public async updateEvento<T extends Evento>(@RouteParam("id") id: string, @RequestBody() payload: T) {
        await this.eventoService.updateEvento(id, payload);
    }

    @POST("/eventos")
    public async createEvento(@RequestBody() payload: Evento) {
        await this.eventoService.createEvento(payload);
    }

    @DELETE("/eventos/:id")
    public async deleteevento(@RouteParam("id") id: string) {
        await this.eventoService.deleteEvento(id);
    }
}