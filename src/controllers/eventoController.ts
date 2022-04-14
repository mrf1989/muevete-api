import { Controller, GET, PUT, POST, DELETE, RouteParam, RequestBody, QueryParam } from "../../deps.ts";
import { EventoService } from "../services/services.ts";
import { Evento } from "../models/models.ts";

@Controller("/api")
export class EventoController {
    constructor(private readonly eventoService: EventoService) {}

    @GET("/eventos")
    public async getAllEventos(@QueryParam("objetivoKm") objetivoKm: string, @QueryParam("modalidad") modalidad: string,
        @QueryParam("fechaFin") fechaFin: string) {
        const filtros: Map<string, string> = new Map();
        if (objetivoKm) filtros.set("objetivoKm", objetivoKm);
        if (modalidad) filtros.set("modalidad", modalidad);
        if (fechaFin) filtros.set("fechaFin", fechaFin);
        return await this.eventoService.getAllEventos(filtros);
    }

    @GET("/eventos/:id")
    public async getEvento(@RouteParam("id") id: string) {
        return await this.eventoService.getEvento(id);
    }

    @PUT("/admin/eventos/:id")
    public async updateEvento<T extends Evento>(@RouteParam("id") id: string, @RequestBody() payload: T) {
        return await this.eventoService.updateEvento(id, payload);
    }

    @POST("/admin/eventos")
    public async createEvento(@RequestBody() payload: Evento) {
        await this.eventoService.createEvento(payload);
    }

    @DELETE("/admin/eventos/:id")
    public async deleteEvento(@RouteParam("id") id: string) {
        return await this.eventoService.deleteEvento(id);
    }
}