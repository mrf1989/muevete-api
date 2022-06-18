import {
  AllowOnly,
  AuthPrincipal,
  Bson,
  Controller,
  GET,
  Mandarine,
  POST,
  RequestBody,
  ResponseParam,
  RouteParam,
} from "../../deps.ts";
import { EsfuerzoService } from "../services/services.ts";
import { Esfuerzo } from "../models/models.ts";

@Controller("/api")
export class EsfuerzoController {
  constructor(private readonly esfuerzoService: EsfuerzoService) {}

  @POST("/esfuerzo")
  @AllowOnly("isAuthenticated()")
  public async addEsfuerzo(
    @RequestBody() payload: Esfuerzo,
    @AuthPrincipal() principal: Mandarine.Types.UserDetails,
    @ResponseParam() response: Response,
  ) {
    payload.usuario_id = new Bson.ObjectId(payload.usuario_id);
    payload.dorsal_id = new Bson.ObjectId(payload.dorsal_id);
    if (principal.uid == payload.usuario_id.toHexString()) {
      const id = await this.esfuerzoService.createEsfuerzo(payload);
      response.headers.set("content-type", "application/json");
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
  public async getEsfuerzosPorDorsal(
    @RouteParam("id") id: string,
  ): Promise<Esfuerzo[]> {
    try {
      return await this.esfuerzoService.getEsfuerzosPorDorsal(id);
    } catch (err) {
      throw err;
    }
  }

  @GET("/esfuerzos/evento/:id")
  public async getEsfuerzosPorEvento(@RouteParam("id") id: string): Promise<Esfuerzo[]> {
    try {
      return await this.esfuerzoService.getEsfuerzosPorEvento(id);
    } catch (err) {
      throw err;
    }
  }
}
