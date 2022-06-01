import { Controller, POST, PUT, RequestBody, RouteParam } from "../../deps.ts";
import { DorsalService } from "../services/services.ts";
import { Dorsal } from "../models/models.ts";

@Controller("/api")
export class DorsalController {
  constructor(private readonly dorsalService: DorsalService) {}

  @POST("/dorsal")
  public async createDorsal(@RequestBody() payload: Dorsal) {
    try {
      await this.dorsalService.createDorsal(payload);
    } catch (err) {
      throw err;
    }
  }

  @PUT("/dorsal/:id")
  public async updateDorsal<T extends Dorsal>(
    @RouteParam("id") id: string,
    @RequestBody() payload: T,
  ) {
    return await this.dorsalService.updateDorsal(id, payload);
  }
}
