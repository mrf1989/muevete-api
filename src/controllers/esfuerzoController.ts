import { Controller, POST, RequestBody } from "../../deps.ts";
import { EsfuerzoService } from "../services/services.ts";
import { Esfuerzo } from "../models/models.ts";

@Controller("/api")
export class EsfuerzoController {
    constructor(private readonly esfuerzoService: EsfuerzoService) {}

    @POST("/esfuerzo")
    public async addEsfuerzo(@RequestBody() payload: Esfuerzo) {
        await this.esfuerzoService.createEsfuerzo(payload);
    }
}