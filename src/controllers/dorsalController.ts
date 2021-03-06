import {
  AllowOnly,
  AuthPrincipal,
  Bson,
  Controller,
  GET,
  Mandarine,
  POST,
  PUT,
  RequestBody,
  RouteParam,
} from "../../deps.ts";
import { DorsalService } from "../services/services.ts";
import { Dorsal } from "../models/models.ts";

@Controller("/api")
@AllowOnly("isAuthenticated()")
export class DorsalController {
  constructor(private readonly dorsalService: DorsalService) {}

  @POST("/dorsal")
  public async createDorsal(
    @RequestBody() payload: Dorsal,
    @AuthPrincipal() principal: Mandarine.Types.UserDetails,
  ) {
    const dorsal = payload as Dorsal;
    dorsal.usuario_id = new Bson.ObjectId(dorsal.usuario_id);
    dorsal.evento_id = new Bson.ObjectId(dorsal.evento_id);
    if (principal.uid == dorsal.usuario_id.toHexString()) {
      try {
        return await this.dorsalService.createDorsal(dorsal);
      } catch (err) {
        throw err;
      }
    } else {
      throw new Error("Usuario no autorizado");
    }
  }

  @PUT("/dorsal/:id")
  public async updateDorsal<T extends Dorsal>(
    @RouteParam("id") id: string,
    @RequestBody() payload: T,
    @AuthPrincipal() principal: Mandarine.Types.UserDetails,
  ) {
    const dorsal = await this.dorsalService.getDorsal(id);
    if (principal.uid == dorsal.usuario_id.toHexString()) {
      try {
        return await this.dorsalService.updateDorsal(id, payload);
      } catch (err) {
        throw err;
      }
    } else {
      throw new Error("Usuario no autorizado");
    }
  }

  @GET("/dorsales/usuario/:id")
  public async getDorsalesPorUsuario(
    @RouteParam("id") id: string,
  ): Promise<Dorsal[]> {
    try {
      return await this.dorsalService.getDorsalesPorUsuario(id);
    } catch (err) {
      throw err;
    }
  }

  @GET("/dorsales/evento/:id")
  public async getDorsalesPorEvento(
    @RouteParam("id") id: string,
  ): Promise<Dorsal[]> {
    try {
      return await this.dorsalService.getDorsalesPorEvento(id);
    } catch (err) {
      throw err;
    }
  }
}
