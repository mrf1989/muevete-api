import {
  AllowOnly,
  AuthPrincipal,
  Controller,
  GET,
  Mandarine,
  POST,
  RequestBody,
  RouteParam,
} from "../../deps.ts";
import { EsfuerzoService } from "../services/services.ts";
import { Esfuerzo } from "../models/models.ts";

@Controller("/api")
@AllowOnly("isAuthenticated()")
export class EsfuerzoController {
  constructor(private readonly esfuerzoService: EsfuerzoService) {}

  @POST("/esfuerzo")
  public async addEsfuerzo(
    @RequestBody() payload: Esfuerzo,
    @AuthPrincipal() principal: Mandarine.Types.UserDetails,
  ) {
    if (principal.uid == payload.usuario_id.toHexString()) {
      const id = await this.esfuerzoService.createEsfuerzo(payload);
      return JSON.stringify({
        _id: id,
        dorsal_id: payload.dorsal_id.toHexString(),
        usuario_id: payload.usuario_id.toHexString(),
        esfuerzo: payload.numKm,
      });
    } else {
      throw new Error("Usuario no autorizado");
    }
  }

  @GET("/esfuerzos/:id")
  public async getEsfuerzosPorDorsal(@RouteParam("id") id: string): Promise<Esfuerzo[]> {
    try {
      return await this.esfuerzoService.getEsfuerzosPorDorsal(id);
    } catch (err) {
      throw err;
    }
  }
}
