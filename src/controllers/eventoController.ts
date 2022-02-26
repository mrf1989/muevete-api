import { Controller, GET, PUT, POST, DELETE, RouteParam, RequestBody } from "../../deps.ts";
import { EventoService } from "../services/eventoService.ts";

@Controller()
export class EventoController {
    constructor(private readonly eventoService: EventoService) {}

    @GET("/eventos")
    public async getAlleventos() {
        return await this.eventoService.getAllEventos();
    }

    @GET("/eventos/:id")
    public async getevento(@RouteParam("id") id: string) {
        return await this.eventoService.getEvento(id);
    }

    @PUT("/eventos/:id")
    public async updateevento(@RouteParam("id") id: string, @RequestBody() payload: Object) {
        await this.eventoService.updateEvento(id, payload);
    }

    @POST("/eventos")
    public async createevento(@RequestBody() payload: Object) {
        await this.eventoService.createEvento(payload);
    }

    @DELETE("/eventos/:id")
    public async deleteevento(@RouteParam("id") id: string) {
        await this.eventoService.deleteEvento(id);
    }
}